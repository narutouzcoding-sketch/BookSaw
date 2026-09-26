import logging
import os
import smtplib
import requests
from django.conf import settings
from django.core.mail import EmailMessage, get_connection
from django.core.mail.backends.smtp import EmailBackend

logger = logging.getLogger(__name__)


def send_platform_email(recipient_email: str, subject: str, message_text: str) -> tuple[bool, str]:
    """
    Sends email to recipient via:
    1. Resend API (HTTPS port 443) - if RESEND_API_KEY is configured
    2. Brevo API (HTTPS port 443) - if BREVO_API_KEY is configured
    3. Django configured SMTP (port 587 TLS or port 465 SSL)
    Returns (success: bool, info_or_error: str)
    """
    recipient_email = recipient_email.strip().lower()
    host_user = getattr(settings, 'EMAIL_HOST_USER', os.getenv('EMAIL_HOST_USER', '')).strip()
    host_password = getattr(settings, 'EMAIL_HOST_PASSWORD', os.getenv('EMAIL_HOST_PASSWORD', '')).replace(' ', '').strip()

    # Determine sender address (Gmail strictly requires sender == authenticated user)
    if host_user and '@' in host_user:
        from_email = f"Booksaw <{host_user}>"
    else:
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'Booksaw <noreply@booksaw.uz>')

    # 1. Resend API (HTTPS, no port blocking)
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

    # 2. Brevo API (HTTPS, no port blocking)
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

    # 3. SMTP attempt (port 587 STARTTLS)
    if host_user and host_password:
        # Try port 587 with TLS
        try:
            conn587 = EmailBackend(
                host=getattr(settings, 'EMAIL_HOST', 'smtp.gmail.com'),
                port=587,
                username=host_user,
                password=host_password,
                use_tls=True,
                use_ssl=False,
                timeout=8,
            )
            msg = EmailMessage(
                subject=subject,
                body=message_text,
                from_email=from_email,
                to=[recipient_email],
                connection=conn587,
            )
            if msg.send(fail_silently=False) > 0:
                logger.info("Email sent via SMTP port 587 to %s", recipient_email)
                return True, "SMTP (587 TLS) orqali yuborildi"
        except Exception as err587:
            logger.warning("SMTP port 587 failed: %s. Trying port 465 SSL...", err587)
            # Try port 465 with SSL
            try:
                conn465 = EmailBackend(
                    host=getattr(settings, 'EMAIL_HOST', 'smtp.gmail.com'),
                    port=465,
                    username=host_user,
                    password=host_password,
                    use_tls=False,
                    use_ssl=True,
                    timeout=8,
                )
                msg465 = EmailMessage(
                    subject=subject,
                    body=message_text,
                    from_email=from_email,
                    to=[recipient_email],
                    connection=conn465,
                )
                if msg465.send(fail_silently=False) > 0:
                    logger.info("Email sent via SMTP port 465 to %s", recipient_email)
                    return True, "SMTP (465 SSL) orqali yuborildi"
            except Exception as err465:
                logger.error("SMTP port 465 also failed: %s", err465)
                return False, f"SMTP xatosi: 587: {err587} | 465: {err465}"

    # 4. Fallback to default Django mailer (e.g. console in tests or default connection)
    try:
        from django.core.mail import send_mail
        send_mail(
            subject=subject,
            message=message_text,
            from_email=from_email,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
        return True, "Django default mailer orqali yuborildi"
    except Exception as e:
        logger.warning("Django default send_mail failed: %s", e)
        return False, str(e)
