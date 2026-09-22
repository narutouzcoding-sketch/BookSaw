import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    from accounts.models import User
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='TestPass123!',
        first_name='Test',
    )


@pytest.fixture
def user2(db):
    from accounts.models import User
    return User.objects.create_user(
        username='testuser2',
        email='test2@example.com',
        password='TestPass123!',
        first_name='Test2',
    )


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_login(user)
    return api_client
