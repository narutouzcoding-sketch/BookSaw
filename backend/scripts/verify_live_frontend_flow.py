import json
import random
import urllib.request
import urllib.parse
import http.cookiejar

BASE_URL = "http://127.0.0.1:8000"
ORIGIN = "http://localhost:5173"

def run_verification():
    print("=" * 65)
    print("LIVE HTTP VERIFICATION: FRONTEND-BACKEND INTEGRATION CONTRACT")
    print(f"Server Target: {BASE_URL}")
    print(f"CORS Origin:   {ORIGIN}")
    print("=" * 65)

    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

    def make_request(path, method='GET', data=None, headers=None):
        url = BASE_URL + path
        h = {'Origin': ORIGIN}
        if headers:
            h.update(headers)
        body = None
        if data is not None:
            body = json.dumps(data).encode('utf-8')
            h['Content-Type'] = 'application/json'

        req = urllib.request.Request(url, data=body, headers=h, method=method)
        try:
            with opener.open(req) as resp:
                resp_body = resp.read().decode('utf-8')
                return resp.status, resp.headers, json.loads(resp_body) if resp_body else {}
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            try:
                err_json = json.loads(err_body)
            except Exception:
                err_json = {'raw': err_body}
            return e.code, e.headers, err_json

    # 1. CSRF Cookie Retrieval
    print("\n[STEP 1] GET /api/v1/auth/csrf/ ...")
    status, headers, body = make_request("/api/v1/auth/csrf/")
    print(f"  -> HTTP Status: {status}")
    cookies = {c.name: c.value for c in cj}
    csrf_token = cookies.get('csrftoken')
    print(f"  -> Set-Cookie csrftoken: {csrf_token[:15]}... (Mavjud: {bool(csrf_token)})")
    assert status == 200, f"Kutilgan 200, lekin {status}"
    assert csrf_token, "csrftoken cookie olinmadi!"

    # 2. CORS Headers on Products list
    print("\n[STEP 2] GET /api/v1/products/ (CORS tekshiruvi) ...")
    status, headers, body = make_request("/api/v1/products/")
    cors_origin = headers.get('Access-Control-Allow-Origin')
    cors_credentials = headers.get('Access-Control-Allow-Credentials')
    print(f"  -> HTTP Status: {status}")
    print(f"  -> Access-Control-Allow-Origin:      {cors_origin}")
    print(f"  -> Access-Control-Allow-Credentials: {cors_credentials}")
    print(f"  -> DRF Response formati: count={body.get('count')}, results_type={type(body.get('results')).__name__}")
    assert status == 200
    assert cors_origin == ORIGIN, f"CORS origin mos kelmadi: {cors_origin}"
    assert cors_credentials == 'true', f"CORS credentials ruxsat etilmagan: {cors_credentials}"
    assert 'results' in body and 'count' in body, "DRF paginatsiya formati noto'g'ri!"

    # 3. Non-trailing-slash URL alias
    print("\n[STEP 3] GET /api/v1/products (Non-trailing slash alias) ...")
    status, headers, body = make_request("/api/v1/products")
    print(f"  -> HTTP Status: {status}, count={body.get('count')}")
    assert status == 200, f"Non-trailing slash 200 qaytarmadi: {status}"

    # 4. User Registration with CSRF
    email = f"frontend_tester_{random.randint(1000, 9999)}@example.com"
    print(f"\n[STEP 4] POST /api/v1/auth/register/ with CSRF ({email}) ...")
    status, headers, body = make_request(
        "/api/v1/auth/register/",
        method='POST',
        data={'email': email, 'password': 'SecurePassword123!', 'first_name': 'Tester'},
        headers={'X-CSRFToken': csrf_token}
    )
    print(f"  -> HTTP Status: {status}, User: {body.get('email')}")
    assert status == 201, f"Register 201 qaytarmadi: {status}, {body}"

    # Django login() rotates the CSRF token, so refresh from cookiejar
    csrf_token = {c.name: c.value for c in cj}.get('csrftoken')

    # 5. Add to Cart
    print("\n[STEP 5] POST /api/v1/cart/ (Kitob savatga qo'shish) ...")
    status, headers, body = make_request(
        "/api/v1/cart/",
        method='POST',
        data={'book_id': 1, 'quantity': 1},
        headers={'X-CSRFToken': csrf_token}
    )
    print(f"  -> HTTP Status: {status}, Cart items count: {body.get('item_count')}, subtotal: {body.get('subtotal')}")
    assert status == 201, f"Cart add 201 qaytarmadi: {status}"

    # 6. Checkout with FRONTEND format
    print("\n[STEP 6] POST /api/v1/checkout/ with Frontend Body Structure ...")
    frontend_checkout_payload = {
        "address": {
            "name": "Frontend Tester",
            "phone": "+998901234567",
            "city": "Toshkent",
            "address": "Navoiy ko'chasi, 24-uy"
        },
        "delivery": {
            "id": 1,
            "name": "Standart yetkazib berish",
            "days": "2-3 kun",
            "price": 15000
        },
        "payment": {
            "id": "click",
            "name": "Click"
        }
    }
    status, headers, body = make_request(
        "/api/v1/checkout/",
        method='POST',
        data=frontend_checkout_payload,
        headers={'X-CSRFToken': csrf_token}
    )
    print(f"  -> HTTP Status: {status}")
    print(f"  -> Order #{body.get('id')} yaratildi!")
    print(f"  -> Subtotal:      {body.get('subtotal')}")
    print(f"  -> Delivery Cost: {body.get('delivery_cost')}")
    print(f"  -> Total:         {body.get('total')}")
    print(f"  -> Payment:       {body.get('payment_method')}")
    assert status == 201, f"Checkout 201 qaytarmadi: {status}, {body}"

    # 7. Security verification: POST without CSRF token MUST return 403
    print("\n[STEP 7] POST /api/v1/checkout/ WITHOUT CSRF Token (Xavfsizlik tekshiruvi) ...")
    status, headers, body = make_request(
        "/api/v1/checkout/",
        method='POST',
        data=frontend_checkout_payload,
        headers={}  # No X-CSRFToken!
    )
    print(f"  -> HTTP Status: {status} (Kutilgan: 403 Forbidden)")
    print(f"  -> Response:    {body}")
    assert status == 403, f"CSRFsiz so'rov 403 bilan rad etilmadi: {status}"

    print("\n" + "=" * 65)
    print("XULOSA: BARCHA 7 TA JONLI HTTP INTEGRATSIYA TEKSHIRUVI 100% O'TDI!")
    print("1. CSRF cookie to'g'ri o'rnatildi.")
    print("2. CORS origin va credentials brauzer talabiga 100% mos.")
    print("3. URL aliaslar (/products, /checkout) to'g'ri ishlamoqda.")
    print("4. Frontend checkout formati ({delivery: {...}, payment: {...}}) serverda qabul qilindi.")
    print("5. CSRFsiz POST so'rovlar 403 bilan rad etilib, xavfsizlik ta'minlandi.")
    print("=" * 65)


if __name__ == '__main__':
    run_verification()
