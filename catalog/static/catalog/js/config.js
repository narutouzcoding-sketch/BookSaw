/**
 * Booksaw frontend config
 * Backend ulaganda faqat shu faylni o'zgartiring.
 *
 * 1. API_BASE ni Django URL ga qo'ying, masalan: "/api"
 * 2. USE_MOCK ni false qiling
 * 3. api.js dagi endpointlar o'sha prefix ostida chaqiladi
 */
window.APP_CONFIG = {
  API_BASE: "http://127.0.0.1:8000/api/v1",
  USE_MOCK: false,
  CURRENCY: "so'm",
  FREE_SHIPPING_FROM: 200000,
  CART_MAX_QTY: 10,
  SITE_NAME: "Booksaw",
  SUPPORT_PHONE: "+998 (71) 200-00-00",
  SUPPORT_EMAIL: "info@bookscatalog.uz",
  // Public backend routes & OAuth settings
  AUTH_GOOGLE_START: "/api/auth/google/start",
  AUTH_TELEGRAM_START: "/api/auth/telegram/start",
  // Telegram sozlamalari. Bot token va chat ID FAQAT backendning .env faylida turadi.
  // Hech qachon maxfiy kalitlarni brauzerga yubormang.
  TELEGRAM_BOT_USERNAME: "BooksawUzBot",
  TELEGRAM_OTP_SEND: "/api/auth/telegram/send-otp",
  TELEGRAM_OTP_VERIFY: "/api/auth/telegram/verify-otp",
  // Google Cloud Console Client ID
  GOOGLE_CLIENT_ID: "1070282903830-8ineagga21j7c7im6mgieuq5ikud911b.apps.googleusercontent.com"
};
