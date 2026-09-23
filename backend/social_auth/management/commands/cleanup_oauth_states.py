from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from social_auth.models import OAuthState, TelegramLoginState, TelegramOTP


class Command(BaseCommand):
    help = "Eski va muddati o'tgan OAuthState hamda Telegram login holatlarini tozalash"

    def add_arguments(self, parser):
        parser.add_argument(
            '--hours',
            type=int,
            default=1,
            help="Necha soatdan eski holatlarni o'chirish (standart: 1 soat)",
        )

    def handle(self, *args, **options):
        hours = options.get('hours', 1)
        threshold = timezone.now() - timedelta(hours=hours)

        deleted_oauth, _ = OAuthState.objects.filter(created_at__lt=threshold).delete()
        deleted_tg, _ = TelegramLoginState.objects.filter(created_at__lt=threshold).delete()
        deleted_otp, _ = TelegramOTP.objects.filter(created_at__lt=threshold).delete()

        total = deleted_oauth + deleted_tg + deleted_otp
        self.stdout.write(
            self.style.SUCCESS(
                f"Tozalandi: {deleted_oauth} ta OAuthState, "
                f"{deleted_tg} ta TelegramLoginState, {deleted_otp} ta TelegramOTP. Jami: {total} ta."
            )
        )
