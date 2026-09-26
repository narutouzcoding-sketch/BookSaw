from django.urls import path
from .views import (
    CsrfView, LoginView, LogoutView, MeView, RegisterView,
    SendEmailCodeView, VerifyEmailCodeView,
    PasswordResetRequestView, PasswordResetConfirmView,
)

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
    path('email/send-code/', SendEmailCodeView.as_view(), name='auth-email-send-code'),
    path('email/send-code', SendEmailCodeView.as_view()),
    path('email/verify-code/', VerifyEmailCodeView.as_view(), name='auth-email-verify-code'),
    path('email/verify-code', VerifyEmailCodeView.as_view()),
    path('password/reset-request/', PasswordResetRequestView.as_view(), name='auth-password-reset-request'),
    path('password/reset-request', PasswordResetRequestView.as_view()),
    path('password/reset-confirm/', PasswordResetConfirmView.as_view(), name='auth-password-reset-confirm'),
    path('password/reset-confirm', PasswordResetConfirmView.as_view()),
]