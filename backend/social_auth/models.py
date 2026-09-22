import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone


class OAuthState(models.Model):
    state = models.CharField(max_length=64, unique=True, db_index=True)
    code_verifier = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)

    def is_valid(self):
        age = timezone.now() - self.created_at
        return not self.used and age.total_seconds() < 600  # 10 daqiqa


class TelegramLoginState(models.Model):
    state = models.CharField(max_length=64, unique=True, db_index=True)
    chat_id = models.BigIntegerField(null=True, blank=True)
    confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        age = timezone.now() - self.created_at
        return age.total_seconds() < 300  # 5 daqiqa


class TelegramOTP(models.Model):
    phone = models.CharField(max_length=20, db_index=True)
    code_hash = models.CharField(max_length=128)
    attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        age = timezone.now() - self.created_at
        return age.total_seconds() < 300 and self.attempts < 5