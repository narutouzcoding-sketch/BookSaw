from django.urls import path

from .views import GoogleCallbackView, GoogleStartView

urlpatterns = [
    path("google/start", GoogleStartView.as_view()),
    path("google/callback", GoogleCallbackView.as_view()),
]