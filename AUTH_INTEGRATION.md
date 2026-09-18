# Google va Telegram autentifikatsiyasi

Frontend faqat boshlovchi URL'larga o'tadi. Sirlar `.env` faylida qoladi; bot tokeni, Google client secret yoki Telegram `hash` hech qachon browser JavaScriptiga qo'yilmaydi.

Backend quyidagi oqimni amalga oshirishi kerak:

1. `GET /api/auth/google/start` kriptografik `state`, PKCE `code_verifier` yaratadi, ularni HttpOnly sessionga saqlaydi va Google authorization endpointiga redirect qiladi.
2. `GET /api/auth/google/callback` `state`ni tekshiradi, authorization code'ni serverda tokenlarga almashtiradi, ID token issuer/audience/nonce/expiry'sini tekshiradi va foydalanuvchi sessionini yaratadi.
3. Telegram OTP oqimi uchun `POST /api/auth/telegram/send-otp` (`{phone}`) kodi yaratib, uni bot orqali yuboradi; `POST /api/auth/telegram/verify-otp` (`{phone, code}`) esa kodni, muddatini va urinishlar sonini serverda tekshiradi. Javob kamida `{ok: true}` qaytaradi. Kod, bot token yoki chat ID hech qachon brauzerga qaytmasin.
4. Muqobil Telegram Login oqimida `GET /api/auth/telegram/start` bir martalik, muddati qisqa `state` yaratadi va foydalanuvchini `https://t.me/<TELEGRAM_BOT_USERNAME>?start=login_<state>` ga yo'naltiradi. Bot `/start login_<state>` olganda chat ID ni state bilan bog'laydi, server esa polling/webhook orqali tasdiqlaydi.
5. Buyurtma xabari faqat serverdan `https://api.telegram.org/bot<TOKEN>/sendMessage` ga yuboriladi. `TELEGRAM_CHAT_ID` admin/buyurtma qabul qiluvchi chat bo'ladi.

Google Console'da aynan `GOOGLE_REDIRECT_URI`ni Authorized redirect URI qilib qo'shing. Production'da HTTPS, Secure/HttpOnly/SameSite cookie, CSRF himoyasi, rate limit va Telegram webhook secret ishlating.
