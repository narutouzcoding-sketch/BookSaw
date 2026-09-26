from datetime import timedelta
from unittest.mock import patch
import pytest
from django.core.management import call_command
from django.utils import timezone
from rest_framework import status

from accounts.models import User
from social_auth.models import OAuthState


@pytest.mark.django_db
class TestGoogleOAuthFlow:
    def test_google_start_redirects_and_creates_state(self, api_client):
        res = api_client.get('/api/auth/google/start/')
        assert res.status_code == status.HTTP_302_FOUND
        assert 'accounts.google.com' in res.url
        assert OAuthState.objects.count() == 1
        state_obj = OAuthState.objects.first()
        assert not state_obj.used
        assert state_obj.is_valid()

    def test_google_callback_missing_params_fails(self, api_client):
        res = api_client.get('/api/auth/google/callback/')
        assert res.status_code == status.HTTP_400_BAD_REQUEST
        assert 'code yoki state yo\'q' in res.data['detail']

    def test_google_callback_invalid_state_fails(self, api_client):
        res = api_client.get('/api/auth/google/callback/?code=fake_code&state=nonexistent_state')
        assert res.status_code == status.HTTP_400_BAD_REQUEST
        assert 'Noto\'g\'ri state' in res.data['detail']

    def test_google_callback_used_state_fails(self, api_client):
        state_obj = OAuthState.objects.create(state='used_state', code_verifier='verifier', used=True)
        res = api_client.get('/api/auth/google/callback/?code=fake_code&state=used_state')
        assert res.status_code == status.HTTP_400_BAD_REQUEST
        assert 'State muddati tugagan yoki ishlatilgan' in res.data['detail']

    @patch('social_auth.views.google_service.exchange_code_for_tokens')
    @patch('social_auth.views.google_service.verify_id_token')
    def test_google_callback_unverified_email_fails(self, mock_verify, mock_exchange, api_client):
        state_obj = OAuthState.objects.create(state='valid_state_1', code_verifier='verifier_1')
        mock_exchange.return_value = {'id_token': 'fake_id_token'}
        mock_verify.return_value = {
            'email': 'unverified@example.com',
            'email_verified': False,
            'given_name': 'Test',
            'family_name': 'User',
        }

        res = api_client.get('/api/auth/google/callback/?code=good_code&state=valid_state_1')
        assert res.status_code == status.HTTP_400_BAD_REQUEST
        assert 'Google email manzilingiz tasdiqlanmagan' in res.data['detail']

        state_obj.refresh_from_db()
        assert state_obj.used is True

    @patch('social_auth.views.google_service.exchange_code_for_tokens')
    @patch('social_auth.views.google_service.verify_id_token')
    def test_google_callback_new_user_created_unusable_password(self, mock_verify, mock_exchange, api_client):
        state_obj = OAuthState.objects.create(state='valid_state_2', code_verifier='verifier_2')
        mock_exchange.return_value = {'id_token': 'fake_id_token'}
        mock_verify.return_value = {
            'email': 'oauth_new@example.com',
            'email_verified': True,
            'given_name': 'OAuth',
            'family_name': 'Tester',
        }

        res = api_client.get('/api/auth/google/callback/?code=good_code&state=valid_state_2')
        assert res.status_code == status.HTTP_302_FOUND

        user = User.objects.get(email='oauth_new@example.com')
        assert user.first_name == 'OAuth'
        assert user.last_name == 'Tester'
        assert not user.has_usable_password()

        state_obj.refresh_from_db()
        assert state_obj.used is True

    @patch('social_auth.views.google_service.exchange_code_for_tokens')
    @patch('social_auth.views.google_service.verify_id_token')
    def test_google_callback_existing_password_user_blocked_409(self, mock_verify, mock_exchange, api_client, caplog):
        """Parolli mavjud hisob Google OAuth orqali kirganda 409 bilan to'xtatilishi kerak."""
        user = User.objects.create_user(
            username='existing_user',
            email='existing@example.com',
            password='ExistingPassword123!',
            first_name='Existing',
        )
        assert user.has_usable_password()

        state_obj = OAuthState.objects.create(state='valid_state_3', code_verifier='verifier_3')
        mock_exchange.return_value = {'id_token': 'fake_id_token'}
        mock_verify.return_value = {
            'email': 'existing@example.com',
            'email_verified': True,
            'given_name': 'Existing',
            'family_name': 'User',
        }

        with caplog.at_level('WARNING'):
            res = api_client.get('/api/auth/google/callback/?code=good_code&state=valid_state_3')
            assert res.status_code == status.HTTP_409_CONFLICT
            assert 'unverified-password hisobga ulanish urinishi' in caplog.text

        # Login bo'lmagan — parol o'zgarmagan
        user.refresh_from_db()
        assert user.has_usable_password()

    @patch('social_auth.views.google_service.exchange_code_for_tokens')
    @patch('social_auth.views.google_service.verify_id_token')
    def test_google_callback_old_session_key_none_does_not_error(self, mock_verify, mock_exchange, api_client):
        state_obj = OAuthState.objects.create(state='valid_state_4', code_verifier='verifier_4')
        mock_exchange.return_value = {'id_token': 'fake_id_token'}
        mock_verify.return_value = {
            'email': 'session_test@example.com',
            'email_verified': True,
            'given_name': 'Session',
            'family_name': 'None',
        }

        # Request where session.session_key is None initially
        res = api_client.get('/api/auth/google/callback/?code=good_code&state=valid_state_4')
        assert res.status_code == status.HTTP_302_FOUND
        assert User.objects.filter(email='session_test@example.com').exists()


@pytest.mark.django_db
class TestOAuthCleanupCommand:
    def test_cleanup_oauth_states_command(self):
        # Create expired and fresh states
        old_time = timezone.now() - timedelta(hours=2)
        s1 = OAuthState.objects.create(state='old_1', code_verifier='v1')
        OAuthState.objects.filter(pk=s1.pk).update(created_at=old_time)

        s2 = OAuthState.objects.create(state='fresh_1', code_verifier='v2')

        call_command('cleanup_oauth_states', hours=1)

        assert not OAuthState.objects.filter(state='old_1').exists()
        assert OAuthState.objects.filter(state='fresh_1').exists()


@pytest.mark.django_db
class TestTelegramOTP:
    def test_send_telegram_otp_success(self, api_client):
        res = api_client.post('/api/auth/telegram/send-otp/', {'phone': '+998901234567'}, format='json')
        assert res.status_code == status.HTTP_200_OK
        assert res.data['ok'] is True
        from social_auth.models import TelegramOTP
        assert TelegramOTP.objects.filter(phone='998901234567').exists()

    def test_verify_telegram_otp_success(self, api_client):
        from social_auth.models import TelegramOTP
        TelegramOTP.objects.create(phone='998901234567', code_hash='888999')
        res = api_client.post('/api/auth/telegram/verify-otp/', {'phone': '+998901234567', 'code': '888999'}, format='json')
        assert res.status_code == status.HTTP_200_OK
        assert res.data['ok'] is True
        assert 'user' in res.data
        assert 'sessionid' in res.cookies

    def test_verify_telegram_otp_invalid_fails(self, api_client):
        from social_auth.models import TelegramOTP
        TelegramOTP.objects.create(phone='998901234567', code_hash='888999')
        res = api_client.post('/api/auth/telegram/verify-otp/', {'phone': '+998901234567', 'code': '000000'}, format='json')
        assert res.status_code == status.HTTP_400_BAD_REQUEST

