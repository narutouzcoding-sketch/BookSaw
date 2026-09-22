from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import permissions, serializers as drf_serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, inline_serializer

from books.models import Cart, CartItem, WishlistItem
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer


def _merge_cart(session_key, user):
    """
    Merge anonymous (session-based) cart into user's cart.
    Duplicate book → quantities summed (capped at 10).
    """
    if not session_key:
        return
    try:
        anon_cart = Cart.objects.prefetch_related('items').get(
            session_key=session_key, user__isnull=True
        )
    except Cart.DoesNotExist:
        return

    user_cart, _ = Cart.objects.get_or_create(user=user)

    for anon_item in anon_cart.items.all():
        existing = user_cart.items.filter(book=anon_item.book).first()
        if existing:
            existing.quantity = min(10, existing.quantity + anon_item.quantity)
            existing.save()
        else:
            anon_item.cart = user_cart
            anon_item.save()

    anon_cart.delete()


def _merge_wishlist(session_key, user):
    """
    Merge anonymous (session-based) wishlist into user's wishlist.
    Duplicates silently skipped.
    """
    if not session_key:
        return
    anon_items = WishlistItem.objects.filter(
        session_key=session_key, user__isnull=True
    )
    user_book_ids = set(
        WishlistItem.objects.filter(user=user).values_list('book_id', flat=True)
    )
    for item in anon_items:
        if item.book_id not in user_book_ids:
            item.user = user
            item.session_key = ''
            item.save()
        else:
            item.delete()


@method_decorator(csrf_protect, name='dispatch')
class RegisterView(APIView):
    """POST /api/v1/auth/register/"""
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=RegisterSerializer, responses={201: UserSerializer})
    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        old_session_key = request.session.session_key
        user = ser.save()
        login(request, user)
        _merge_cart(old_session_key, user)
        _merge_wishlist(old_session_key, user)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    """POST /api/v1/auth/login/"""
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=LoginSerializer, responses={200: UserSerializer})
    def post(self, request):
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        email = ser.validated_data['email']
        password = ser.validated_data['password']

        # Django authenticates by username by default;
        # look up username from email first.
        from .models import User
        try:
            user_obj = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'Email yoki parol noto\'g\'ri.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=user_obj.username, password=password)
        if user is None:
            return Response(
                {'detail': 'Email yoki parol noto\'g\'ri.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        old_session_key = request.session.session_key
        login(request, user)
        _merge_cart(old_session_key, user)
        _merge_wishlist(old_session_key, user)
        return Response(UserSerializer(user).data)


class LogoutView(APIView):
    """POST /api/v1/auth/logout/"""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        request=None,
        responses={200: inline_serializer('LogoutResponse', fields={'detail': drf_serializers.CharField()})}
    )
    def post(self, request):
        logout(request)
        return Response({'detail': 'Logged out.'})


class MeView(APIView):
    """GET /api/v1/auth/me/"""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: UserSerializer})
    def get(self, request):
        return Response(UserSerializer(request.user).data)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CsrfView(APIView):
    """GET /api/v1/auth/csrf/ - sets CSRF cookie for frontend."""
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        responses={200: inline_serializer('CsrfResponse', fields={'csrfToken': drf_serializers.CharField()})}
    )
    def get(self, request):
        return Response({'csrfToken': get_token(request)})