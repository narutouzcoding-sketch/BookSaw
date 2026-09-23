from django.urls import path
from .views import CsrfView, LoginView, LogoutView, MeView, RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('register', RegisterView.as_view()),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('login', LoginView.as_view()),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('logout', LogoutView.as_view()),
    path('me/', MeView.as_view(), name='auth-me'),
    path('me', MeView.as_view()),
    path('csrf/', CsrfView.as_view(), name='auth-csrf'),
    path('csrf', CsrfView.as_view()),
]