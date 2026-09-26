from django.urls import path

from .views import (
    GoogleCallbackView, GoogleStartView,
    TelegramSendOTPView, TelegramVerifyOTPView,
)

urlpatterns = [
    path("google/start/", GoogleStartView.as_view(), name="google-start"),
    path("google/start", GoogleStartView.as_view()),
    path("google/callback/", GoogleCallbackView.as_view(), name="google-callback"),
    path("google/callback", GoogleCallbackView.as_view()),
    path("telegram/send-otp/", TelegramSendOTPView.as_view(), name="telegram-send-otp"),
    path("telegram/send-otp", TelegramSendOTPView.as_view()),
    path("telegram/verify-otp/", TelegramVerifyOTPView.as_view(), name="telegram-verify-otp"),
    path("telegram/verify-otp", TelegramVerifyOTPView.as_view()),
]