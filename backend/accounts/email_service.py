import logging
import os
import requests
from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_platform_email(recipient_email: str, subject: str, message_text: str) -> tuple[bool, str]:
    """
    Sends email to recipient via:
    1. Resend API (HTTPS port 443) - if RESEND_API_KEY is configured
    2. Brevo API (HTTPS port 443) - if BREVO_API_KEY is configured
    3. Django configured mailer (via MAILERS['default'])
    Returns (success: bool, info_or_error: str)
    """
    recipient_email = recipient_email.strip().lower()
    host_user = os.getenv('EMAIL_HOST_USER', '').strip()

    # Determine sender address (Gmail strictly requires sender == authenticated user)
    if host_user and '@' in host_user:
        from_email = f"Booksaw <{host_user}>"
    else:
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'Booksaw <noreply@booksaw.uz>')

    # 1. Resend API (HTTPS port 443, never blocked)
    resend_key = os.getenv('RESEND_API_KEY', '').strip()
    if resend_key:
        try:
            r = requests.post(
                'https://api.resend.com/emails',
                headers={'Authorization': f'Bearer {resend_key}', 'Content-Type': 'application/json'},
                json={
                    'from': from_email if 'booksaw.uz' in from_email or not host_user else 'Booksaw <onboarding@resend.dev>',
                    'to': [recipient_email],
                    'subject': subject,
                    'text': message_text,
                },
                timeout=8,
            )
            if r.status_code in (200, 201):
                logger.info("Email sent via Resend API to %s", recipient_email)
                return True, "Resend API orqali yuborildi"
            else:
                logger.warning("Resend API failed: %s %s", r.status_code, r.text)
        except Exception as e:
            logger.warning("Resend API exception: %s", e)

    # 2. Brevo API (HTTPS port 443, never blocked)
    brevo_key = os.getenv('BREVO_API_KEY', '').strip()
    if brevo_key:
        try:
            r = requests.post(
                'https://api.brevo.com/v3/smtp/email',
                headers={'api-key': brevo_key, 'Content-Type': 'application/json'},
                json={
                    'sender': {'name': 'Booksaw', 'email': host_user or 'noreply@booksaw.uz'},
                    'to': [{'email': recipient_email}],
                    'subject': subject,
                    'textContent': message_text,
                },
                timeout=8,
            )
            if r.status_code in (200, 201):
                logger.info("Email sent via Brevo API to %s", recipient_email)
                return True, "Brevo API orqali yuborildi"
            else:
                logger.warning("Brevo API failed: %s %s", r.status_code, r.text)
        except Exception as e:
            logger.warning("Brevo API exception: %s", e)

    # 3. Standard Django Mailer (uses MAILERS['default'])
    try:
        sent_count = send_mail(
            subject=subject,
            message=message_text,
            from_email=from_email,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
        if sent_count > 0:
            logger.info("Email sent successfully via Django MAILERS to %s", recipient_email)
            return True, "Django MAILERS orqali muvaffaqiyatli yuborildi"
        else:
            return False, "Email yuborilmadi (sent_count = 0)"
    except Exception as e:
        logger.warning("Django send_mail failed: %s", e)
        return False, str(e)
