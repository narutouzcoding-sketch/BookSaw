import pytest
from django.urls import reverse
from rest_framework import status

from accounts.models import User
from books.models import Author, Book, Cart, CartItem, Category, WishlistItem


@pytest.fixture
def sample_books(db):
    author = Author.objects.create(name='Test Author')
    category = Category.objects.create(name='Test Cat', slug='test-cat')
    b1 = Book.objects.create(
        title='Book 1',
        author=author,
        category=category,
        price=50000,
        old_price=60000,
        in_stock=True,
    )
    b2 = Book.objects.create(
        title='Book 2',
        author=author,
        category=category,
        price=80000,
        in_stock=True,
    )
    return b1, b2


@pytest.mark.django_db
class TestAuthRegister:
    def test_register_success(self, api_client):
        url = '/api/v1/auth/register/'
        payload = {
            'email': 'newuser@example.com',
            'password': 'SecurePassword123!',
            'first_name': 'NewUser',
        }
        response = api_client.post(url, payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['email'] == 'newuser@example.com'
        assert response.data['first_name'] == 'NewUser'
        assert 'password' not in response.data

        # Check session cookie is set
        assert 'sessionid' in response.cookies
        # Check user exists in DB
        assert User.objects.filter(email='newuser@example.com').exists()

    def test_register_weak_password_fails(self, api_client):
        url = '/api/v1/auth/register/'
        payload = {
            'email': 'weak@example.com',
            'password': '123',  # too short
        }
        response = api_client.post(url, payload, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data

    def test_register_duplicate_email_fails(self, api_client, user):
        url = '/api/v1/auth/register/'
        payload = {
            'email': user.email,
            'password': 'SecurePassword123!',
        }
        response = api_client.post(url, payload, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data


@pytest.mark.django_db
class TestAuthLoginLogout:
    def test_login_success(self, api_client, user):
        url = '/api/v1/auth/login/'
        payload = {
            'email': user.email,
            'password': 'TestPass123!',
        }
        response = api_client.post(url, payload, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == user.email
        assert 'sessionid' in response.cookies

    def test_login_wrong_password_fails(self, api_client, user):
        url = '/api/v1/auth/login/'
        payload = {
            'email': user.email,
            'password': 'WrongPassword123!',
        }
        response = api_client.post(url, payload, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'detail' in response.data

    def test_login_nonexistent_email_fails(self, api_client):
        url = '/api/v1/auth/login/'
        payload = {
            'email': 'nobody@example.com',
            'password': 'SomePassword123!',
        }
        response = api_client.post(url, payload, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_logout(self, auth_client):
        url = '/api/v1/auth/logout/'
        response = auth_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Logged out.'

        # After logout, me should be 403/401
        me_response = auth_client.get('/api/v1/auth/me/')
        assert me_response.status_code in (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN)


@pytest.mark.django_db
class TestAuthMeAndCsrf:
    def test_me_authenticated(self, auth_client, user):
        response = auth_client.get('/api/v1/auth/me/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == user.id
        assert response.data['email'] == user.email
        assert response.data['username'] == user.username
        assert 'password' not in response.data

    def test_me_unauthenticated_fails(self, api_client):
        response = api_client.get('/api/v1/auth/me/')
        assert response.status_code in (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN)

    def test_csrf_endpoint(self, api_client):
        response = api_client.get('/api/v1/auth/csrf/')
        assert response.status_code == status.HTTP_200_OK
        assert 'csrfToken' in response.data
        assert 'csrftoken' in response.cookies


@pytest.mark.django_db
class TestCartAndWishlistMerge:
    def test_cart_merge_on_login(self, api_client, user, sample_books):
        b1, b2 = sample_books

        # 1. Anonymous user adds b1 to cart
        add_res = api_client.post('/api/v1/cart/', {'book_id': b1.id, 'quantity': 2}, format='json')
        assert add_res.status_code == status.HTTP_201_CREATED
        anon_session = api_client.session.session_key
        assert anon_session is not None

        # 2. Login as user
        login_res = api_client.post('/api/v1/auth/login/', {'email': user.email, 'password': 'TestPass123!'}, format='json')
        assert login_res.status_code == status.HTTP_200_OK

        # 3. User's cart should now contain b1 with quantity 2
        user_cart = Cart.objects.get(user=user)
        item = user_cart.items.get(book=b1)
        assert item.quantity == 2

        # 4. Anonymous cart must be deleted
        assert not Cart.objects.filter(session_key=anon_session, user__isnull=True).exists()

    def test_cart_merge_duplicate_item_sums_quantity(self, api_client, user, sample_books):
        b1, _ = sample_books

        # User already has b1 with qty 3 in their cart
        user_cart = Cart.objects.create(user=user)
        CartItem.objects.create(cart=user_cart, book=b1, quantity=3)

        # Anonymous visitor adds b1 with qty 4 in session
        api_client.post('/api/v1/cart/', {'book_id': b1.id, 'quantity': 4}, format='json')

        # Login
        login_res = api_client.post('/api/v1/auth/login/', {'email': user.email, 'password': 'TestPass123!'}, format='json')
        assert login_res.status_code == status.HTTP_200_OK

        # Item quantity must be 3 + 4 = 7
        user_cart.refresh_from_db()
        item = user_cart.items.get(book=b1)
        assert item.quantity == 7

    def test_cart_merge_duplicate_item_caps_at_10(self, api_client, user, sample_books):
        b1, _ = sample_books

        # User already has b1 with qty 8
        user_cart = Cart.objects.create(user=user)
        CartItem.objects.create(cart=user_cart, book=b1, quantity=8)

        # Anonymous visitor adds b1 with qty 5
        api_client.post('/api/v1/cart/', {'book_id': b1.id, 'quantity': 5}, format='json')

        # Login
        api_client.post('/api/v1/auth/login/', {'email': user.email, 'password': 'TestPass123!'}, format='json')

        # Sum is 8 + 5 = 13, capped at 10
        user_cart.refresh_from_db()
        item = user_cart.items.get(book=b1)
        assert item.quantity == 10

    def test_wishlist_merge_on_login(self, api_client, user, sample_books):
        b1, b2 = sample_books

        # User already has b1 in wishlist
        WishlistItem.objects.create(user=user, book=b1)

        # Anonymous visitor adds b1 and b2 to wishlist
        api_client.post('/api/v1/wishlist/', {'book_id': b1.id}, format='json')
        api_client.post('/api/v1/wishlist/', {'book_id': b2.id}, format='json')

        # Login
        login_res = api_client.post('/api/v1/auth/login/', {'email': user.email, 'password': 'TestPass123!'}, format='json')
        assert login_res.status_code == status.HTTP_200_OK

        # User wishlist should contain both b1 and b2 without duplicates
        user_wishlist_books = set(WishlistItem.objects.filter(user=user).values_list('book_id', flat=True))
        assert user_wishlist_books == {b1.id, b2.id}
        assert WishlistItem.objects.filter(user=user).count() == 2


@pytest.mark.django_db
class TestEmailVerification:
    def test_send_email_code_success(self, api_client):
        res = api_client.post('/api/v1/auth/email/send-code/', {'email': 'verifytest@example.com'}, format='json')
        assert res.status_code == status.HTTP_200_OK
        assert res.data['ok'] is True
        from accounts.models import EmailVerificationCode
        v = EmailVerificationCode.objects.filter(email='verifytest@example.com').first()
        assert v is not None
        assert len(v.code) == 6

    def test_send_email_code_existing_email_fails(self, api_client, user):
        res = api_client.post('/api/v1/auth/email/send-code/', {'email': user.email}, format='json')
        assert res.status_code == status.HTTP_400_BAD_REQUEST
        assert 'mavjud' in res.data['detail']

    def test_verify_email_code_success(self, api_client):
        from accounts.models import EmailVerificationCode
        EmailVerificationCode.objects.create(email='codetest@example.com', code='654321')
        res = api_client.post('/api/v1/auth/email/verify-code/', {'email': 'codetest@example.com', 'code': '654321'}, format='json')
        assert res.status_code == status.HTTP_200_OK
        assert res.data['ok'] is True
        assert EmailVerificationCode.objects.get(email='codetest@example.com').is_verified is True

    def test_verify_email_code_invalid_fails(self, api_client):
        from accounts.models import EmailVerificationCode
        EmailVerificationCode.objects.create(email='codetest2@example.com', code='654321')
        res = api_client.post('/api/v1/auth/email/verify-code/', {'email': 'codetest2@example.com', 'code': '000000'}, format='json')
        assert res.status_code == status.HTTP_400_BAD_REQUEST
        assert 'noto\'g\'ri' in res.data['detail']


@pytest.mark.django_db
class TestPasswordReset:
    def test_password_reset_request_success(self, api_client, user):
        res = api_client.post('/api/v1/auth/password/reset-request/', {'email': user.email}, format='json')
        assert res.status_code == status.HTTP_200_OK
        assert res.data['ok'] is True
        from accounts.models import EmailVerificationCode
        v = EmailVerificationCode.objects.filter(email=user.email).first()
        assert v is not None

    def test_password_reset_request_not_found(self, api_client):
        res = api_client.post('/api/v1/auth/password/reset-request/', {'email': 'unknown@example.com'}, format='json')
        assert res.status_code == status.HTTP_404_NOT_FOUND

    def test_password_reset_confirm_success(self, api_client, user):
        from accounts.models import EmailVerificationCode
        EmailVerificationCode.objects.create(email=user.email, code='123456')
        res = api_client.post('/api/v1/auth/password/reset-confirm/', {
            'email': user.email,
            'code': '123456',
            'new_password': 'BrandNewPassword123!'
        }, format='json')
        assert res.status_code == status.HTTP_200_OK
        assert res.data['ok'] is True

        user.refresh_from_db()
        assert user.check_password('BrandNewPassword123!')

    def test_password_reset_confirm_wrong_code(self, api_client, user):
        from accounts.models import EmailVerificationCode
        EmailVerificationCode.objects.create(email=user.email, code='888888')
        res = api_client.post('/api/v1/auth/password/reset-confirm/', {
            'email': user.email,
            'code': '999999',
            'new_password': 'BrandNewPassword123!'
        }, format='json')
        assert res.status_code == status.HTTP_400_BAD_REQUEST


