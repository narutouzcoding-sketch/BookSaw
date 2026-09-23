import logging

from django.contrib.auth import get_user_model, login
from django.shortcuts import redirect
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import OAuthState
from .services import google as google_service

User = get_user_model()
logger = logging.getLogger(__name__)


class OAuthStartThrottle(AnonRateThrottle):
    """OAuthState jadvalini spam bilan to'ldirishning oldini olish uchun."""
    scope = "oauth_start"
    rate = "10/min"


class OAuthCallbackThrottle(AnonRateThrottle):
    scope = "oauth_callback"
    rate = "20/min"


class GoogleStartView(APIView):
    permission_classes = []
    throttle_classes = [OAuthStartThrottle]

    def get(self, request):
        state = google_service.generate_state()
        verifier, challenge = google_service.generate_pkce_pair()

        OAuthState.objects.create(state=state, code_verifier=verifier)

        auth_url = google_service.build_auth_url(state, challenge)
        return redirect(auth_url)


class GoogleCallbackView(APIView):
    permission_classes = []
    throttle_classes = [OAuthCallbackThrottle]

    def get(self, request):
        code = request.GET.get("code")
        state = request.GET.get("state")

        if not code or not state:
            return Response({"detail": "code yoki state yo'q"}, status=400)

        try:
            state_obj = OAuthState.objects.get(state=state)
        except OAuthState.DoesNotExist:
            return Response({"detail": "Noto'g'ri state"}, status=400)

        if not state_obj.is_valid():
            return Response({"detail": "State muddati tugagan yoki ishlatilgan"}, status=400)

        state_obj.used = True
        state_obj.save(update_fields=["used"])

        try:
            tokens = google_service.exchange_code_for_tokens(code, state_obj.code_verifier)
            claims = google_service.verify_id_token(tokens["id_token"])
        except Exception:
            logger.exception("Google OAuth token almashish/tekshirish muvaffaqiyatsiz tugadi")
            return Response({"detail": "Google bilan tasdiqlash muvaffaqiyatsiz"}, status=400)

        email = claims.get("email")
        if not email:
            return Response({"detail": "Email topilmadi"}, status=400)

        if not claims.get("email_verified"):
            logger.warning("Google OAuth: tasdiqlanmagan email bilan urinish: %s", email)
            return Response(
                {"detail": "Google email manzilingiz tasdiqlanmagan"}, status=400
            )

        try:
            user = User.objects.get(email=email)
            created = False
        except User.DoesNotExist:
            user = User.objects.create(
                email=email,
                username=email.split("@")[0],
                first_name=claims.get("given_name", ""),
                last_name=claims.get("family_name", ""),
            )
            user.set_unusable_password()
            user.save(update_fields=["password"])
            created = True

        if not created and user.has_usable_password():
            logger.info(
                "Google OAuth: parolli mavjud hisobga Google orqali kirildi: %s", email
            )

        old_session_key = request.session.session_key
        login(request, user)

        from accounts.views import _merge_cart, _merge_wishlist
        if old_session_key:
            _merge_cart(old_session_key, user)
            _merge_wishlist(old_session_key, user)

        redirect_url = f"{settings.FRONTEND_URL}/"
        return redirect(redirect_url)