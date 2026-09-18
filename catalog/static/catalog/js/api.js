/**
 * Booksaw API qatlami
 *
 * Hozir: mock (data.js + localStorage)
 * Backend: APP_CONFIG.API_BASE = "/api" va USE_MOCK = false
 *
 * REST shartnoma (JSON, cookie/session yoki Authorization: Bearer):
 *   GET    /products?q=&cat=&sort=&sale=&page=&page_size=
 *   GET    /products/:id
 *   GET    /categories
 *   GET    /stores/:id
 *   POST   /auth/login            {email, password}
 *   POST   /auth/register         {name, email, phone, password}
 *   POST   /auth/logout
 *   POST   /auth/forgot           {email}
 *   GET    /auth/me
 *   PATCH  /auth/me               {name, email, phone, avatar}
 *   GET    /cart
 *   POST   /cart                  {productId, qty, variant}
 *   PATCH  /cart/:productId       {qty}
 *   DELETE /cart/:productId
 *   GET    /wishlist
 *   POST   /wishlist              {productId}
 *   DELETE /wishlist/:productId
 *   GET    /addresses
 *   POST   /addresses             {name, phone, city, address}
 *   DELETE /addresses/:id
 *   POST   /promo/validate        {code, subtotal}
 *   POST   /checkout              {address, deliveryId, paymentId, promo}
 *   GET    /orders
 *   GET    /orders/:id
 *   POST   /orders/:id/cancel
 *   POST   /orders/:id/repeat
 *   GET    /products/:id/reviews
 *   POST   /products/:id/reviews  {rating, text}
 *   GET    /products/:id/questions
 *   POST   /products/:id/questions {text}
 *   POST   /newsletter            {email}
 *
 * Xatolik formati: { "detail": "xabar", "code": "OUT_OF_STOCK" }
 */
const Api = {
  isMock() {
    return !window.APP_CONFIG || !APP_CONFIG.API_BASE || APP_CONFIG.USE_MOCK !== false;
  },
  async request(path, opts = {}) {
    const base = (APP_CONFIG && APP_CONFIG.API_BASE) || "";
    const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
    const res = await fetch(base + path, { credentials: "include", ...opts, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.detail || "So'rov bajarilmadi");
      err.status = res.status;
      err.payload = data;
      throw err;
    }
    return data;
  },
  qs(params) {
    const q = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") q.set(k, v);
    });
    const s = q.toString();
    return s ? "?" + s : "";
  },

  async getProducts(params = {}) {
    if (!this.isMock()) return this.request("/products" + this.qs(params));
    let items = Search.search(params.q || "");
    if (params.cat) items = items.filter(p => p.categoryId === +params.cat);
    if (params.sale) items = items.filter(p => p.discount > 0);
    return { items, total: items.length };
  },
  async getProduct(id) {
    if (!this.isMock()) return this.request("/products/" + id);
    return PRODUCTS.find(p => p.id === +id) || null;
  },
  async getCategories() {
    if (!this.isMock()) return this.request("/categories");
    return CATEGORIES;
  },
  async login(email, password) {
    if (!this.isMock()) return this.request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    return Store.login(email, password);
  },
  async register(payload) {
    if (!this.isMock()) return this.request("/auth/register", { method: "POST", body: JSON.stringify(payload) });
    return Store.register(payload.name, payload.email, payload.phone, payload.password);
  },
  async checkout(orderData) {
    if (!this.isMock()) return this.request("/checkout", { method: "POST", body: JSON.stringify(orderData) });
    return Store.createOrder(orderData);
  },
  async newsletter(email) {
    if (!this.isMock()) return this.request("/newsletter", { method: "POST", body: JSON.stringify({ email }) });
    const list = JSON.parse(localStorage.getItem("marketplace_newsletter") || "[]");
    if (!list.includes(email)) list.push(email);
    localStorage.setItem("marketplace_newsletter", JSON.stringify(list));
    return { ok: true };
  },
  async sendTelegramOtp(phone) {
    if (this.isMock()) return { ok: true, mock: true };
    return this.request(APP_CONFIG.TELEGRAM_OTP_SEND, {
      method: "POST", body: JSON.stringify({ phone })
    });
  },
  async verifyTelegramOtp(phone, code) {
    if (this.isMock()) return { ok: false };
    return this.request(APP_CONFIG.TELEGRAM_OTP_VERIFY, {
      method: "POST", body: JSON.stringify({ phone, code })
    });
  },
  socialAuthStart(provider) {
    const route = provider === 'google' ? APP_CONFIG.AUTH_GOOGLE_START : APP_CONFIG.AUTH_TELEGRAM_START;
    if (this.isMock()) throw new Error("Ijtimoiy kirish server sozlangandan keyin ishlaydi.");
    return route;
  }
};

window.Api = Api;
