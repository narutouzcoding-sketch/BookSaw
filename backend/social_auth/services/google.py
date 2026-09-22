import base64
import hashlib
import os
import secrets

import requests
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token"


def generate_pkce_pair():
    """Tasodifiy code_verifier va undan code_challenge yasaydi."""
    verifier = base64.urlsafe_b64encode(os.urandom(40)).rstrip(b"=").decode("ascii")
    digest = hashlib.sha256(verifier.encode("ascii")).digest()
    challenge = base64.urlsafe_b64encode(digest).rstrip(b"=").decode("ascii")
    return verifier, challenge


def generate_state():
    return secrets.token_urlsafe(32)


from urllib.parse import urlencode

def build_auth_url(state, code_challenge):
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "code_challenge": code_challenge,
        "code_challenge_method": "S256",
        "access_type": "online",
        "prompt": "select_account",
    }
    return f"{AUTH_ENDPOINT}?{urlencode(params)}"


def exchange_code_for_tokens(code, code_verifier):
    """Authorization code'ni access/id tokenlarga almashtiradi."""
    data = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "code": code,
        "code_verifier": code_verifier,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    response = requests.post(TOKEN_ENDPOINT, data=data, timeout=10)
    response.raise_for_status()
    return response.json()


def verify_id_token(raw_id_token):
    """ID tokenning issuer, audience, expiry, imzosini tekshiradi."""
    request = google_requests.Request()
    claims = id_token.verify_oauth2_token(
        raw_id_token, request, audience=settings.GOOGLE_CLIENT_ID
    )
    if claims.get("iss") not in ("accounts.google.com", "https://accounts.google.com"):
        raise ValueError("Noto'g'ri issuer")
    return claims