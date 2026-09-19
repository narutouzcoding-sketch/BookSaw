/**
 * catalog/static/catalog/js/api.js
 * Booksaw API Layer (DRF Client + High-Fidelity Mock Adapter)
 *
 * Backend arxitekturasi: Django + Django REST Framework (DRF)
 * Shartnoma qoidalari:
 * 1. JSON kalitlari snake_case (frontendda normalize orqali camelCase ga o'tkaziladi).
 * 2. Pul qiymatlari DRF DecimalField standarti bo'yicha string ("125000.00").
 * 3. Ro'yxat so'rovlari DRF standarti bo'yicha: { count, next, previous, results }.
 * 4. Xatoliklar DRF standarti bo'yicha: { detail: "..." } yoki { field: ["..."] }.
 * 5. Sanalar ISO 8601 standarti bo'yicha.
 * 6. Sun'iy kechikish (150-300ms) va ?mockError=500|401|network xatolik simulyatsiyasi.
 */

(function (global) {
  'use strict';

  // Yordamchi: CamelCase -> SnakeCase
  function toSnake(obj) {
    if (!obj || typeof obj !== 'object' || obj instanceof Date) return obj;
    if (Array.isArray(obj)) return obj.map(toSnake);
    const res = {};
    for (const key of Object.keys(obj)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      res[snakeKey] = toSnake(obj[key]);
    }
    return res;
  }

  // Yordamchi: Decimal string formatiga keltirish ("125000.00")
  function toDecimalString(val) {
    if (val == null || val === '') return '0.00';
    const num = typeof val === 'string' ? parseFloat(val) : Number(val);
    if (isNaN(num)) return '0.00';
    return num.toFixed(2);
  }

  const Api = {
    mockDelay: 150,
    _cache: {
      products: null,
      categories: null,
      productsMap: new Map()
    },

    isMock() {
      return (
        typeof window === 'undefined' ||
        !window.APP_CONFIG ||
        !window.APP_CONFIG.API_BASE ||
        window.APP_CONFIG.USE_MOCK !== false
      );
    },

    /**
     * Sun'iy kechikish va ?mockError=500|401|network simulyatsiyasi
     */
    async simulateDelay(opts = {}) {
      // 1. Error simulation check
      if (typeof window !== 'undefined' && window.location) {
        const params = new URLSearchParams(window.location.search);
        const mockError = params.get('mockError');
        if (mockError) {
          if (mockError === '500') {
            const err = new Error('Serverda ichki xatolik yuz berdi');
            err.status = 500;
            err.payload = { detail: 'Serverda ichki xatolik yuz berdi (500)' };
            throw err;
          }
          if (mockError === '401') {
            const err = new Error("Avtorizatsiyadan o'tilmagan");
            err.status = 401;
            err.payload = { detail: "Ushbu amalni bajarish uchun tizimga kiring (401)" };
            throw err;
          }
          if (mockError === 'network') {
            throw new TypeError('Failed to fetch (tarmoq xatosi)');
          }
        }
      }

      // 2. Latency delay (agar test muhiti bo'lmasa)
      const delay = (opts && opts.noDelay) || (typeof window !== 'undefined' && window.__TEST_MODE__) ? 0 : this.mockDelay;
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    },

    /**
     * Normalizatorlar: DRF snake_case va Decimal qiymatlarni mijoz modeli bilan moslashtirish
     */
    normalizeProduct(raw) {
      if (!raw) return null;
      const id = raw.id != null ? (typeof raw.id === 'number' ? raw.id : parseInt(raw.id, 10)) : 0;
      const name = raw.name || raw.title || '';
      const author = raw.author || raw.author_name || '';
      const categoryId = raw.category_id !== undefined ? raw.category_id : raw.categoryId;
      const categoryName = raw.category_name || raw.categoryName || '';
      const priceStr = toDecimalString(raw.price);
      const oldPriceStr = raw.old_price != null || raw.oldPrice != null ? toDecimalString(raw.old_price || raw.oldPrice) : null;
      const discount = raw.discount != null ? Number(raw.discount) : 0;
      const rating = raw.rating != null ? Number(raw.rating) : 5;
      const reviewCount = raw.review_count !== undefined ? Number(raw.review_count) : Number(raw.reviewCount || 0);
      const inStock = raw.in_stock !== undefined ? Boolean(raw.in_stock) : raw.inStock !== false;

      return {
        id,
        name,
        title: name,
        author,
        authorName: author,
        categoryId: Number(categoryId),
        categoryName,
        price: priceStr,
        oldPrice: oldPriceStr,
        discount,
        rating,
        reviewCount,
        inStock,
        badge: raw.badge || '',
        image: raw.image || '',
        image2: raw.image2 || raw.image || '',
        description: raw.description || '',
        features: Array.isArray(raw.features)
          ? raw.features.map(f => ({
              key: f.key || f.label || '',
              label: f.label || f.key || '',
              value: f.value != null ? String(f.value) : ''
            }))
          : []
      };
    },

    normalizeCategory(raw) {
      if (!raw) return null;
      return {
        id: Number(raw.id),
        name: raw.name || raw.title || '',
        slug: raw.slug || '',
        image: raw.image || '',
        count: Number(raw.count !== undefined ? raw.count : (raw.products_count || 0))
      };
    },

    normalizeReview(raw) {
      if (!raw) return null;
      return {
        id: raw.id != null ? raw.id : Date.now(),
        productId: Number(raw.product_id !== undefined ? raw.product_id : raw.productId),
        userName: raw.user_name || raw.userName || raw.author || 'Kitobxon',
        author: raw.author || raw.user_name || raw.userName || 'Kitobxon',
        rating: Number(raw.rating || 5),
        text: raw.text || raw.comment || '',
        comment: raw.comment || raw.text || '',
        date: raw.created_at || raw.date || new Date().toISOString(),
        helpful: Number(raw.helpful || 0)
      };
    },

    normalizeQna(raw) {
      if (!raw) return null;
      return {
        id: raw.id != null ? raw.id : Date.now(),
        productId: Number(raw.product_id !== undefined ? raw.product_id : raw.productId),
        userName: raw.user_name || raw.userName || 'Foydalanuvchi',
        date: raw.created_at || raw.date || new Date().toISOString(),
        text: raw.text || raw.question || '',
        question: raw.question || raw.text || '',
        answer: raw.answer || null
      };
    },

    /**
     * Umumiy HTTP so'rov bajaruvchi
     */
    async request(path, opts = {}) {
      const base = (window.APP_CONFIG && window.APP_CONFIG.API_BASE) || '';
      const headers = {
        'Content-Type': 'application/json',
        ...(opts.headers || {})
      };
      const res = await fetch(base + path, { credentials: 'include', ...opts, headers });
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
        if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
      });
      const s = q.toString();
      return s ? '?' + s : '';
    },

    // =========================================================================
    // O'QISH QATLAMI (READ LAYER - B1)
    // =========================================================================

    /**
     * Mahsulotlar ro'yxatini olish (DRF: GET /api/v1/products/)
     * Natija: { count, next, previous, results }
     */
    async getProducts(params = {}, opts = {}) {
      await this.simulateDelay(opts);

      if (!this.isMock()) {
        const data = await this.request('/products' + this.qs(params), opts);
        const results = (data.results || data.items || []).map(p => this.normalizeProduct(p));
        return {
          count: data.count !== undefined ? data.count : results.length,
          next: data.next || null,
          previous: data.previous || null,
          results
        };
      }

      // Mock Adapter
      const rawProducts = (typeof window !== 'undefined' && window.PRODUCTS) || [];
      let filtered = [...rawProducts];

      // 1. Qidiruv filtri
      if (params.q) {
        const q = String(params.q).toLowerCase().trim();
        filtered = filtered.filter(p =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.author || '').toLowerCase().includes(q) ||
          (p.categoryName || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
        );
      }

      // 2. Kategoriya filtri
      if (params.cat != null && params.cat !== '') {
        const catId = Number(params.cat);
        filtered = filtered.filter(p => p.categoryId === catId);
      } else if (Array.isArray(params.categories) && params.categories.length) {
        const cats = params.categories.map(Number);
        filtered = filtered.filter(p => cats.includes(p.categoryId));
      }

      // 3. Chegirma filtri
      if (params.sale) {
        filtered = filtered.filter(p => p.discount > 0);
      }

      // 4. Narx oraliq filtri
      if (params.minPrice != null && !isNaN(params.minPrice)) {
        filtered = filtered.filter(p => Number(p.price) >= Number(params.minPrice));
      }
      if (params.maxPrice != null && !isNaN(params.maxPrice)) {
        filtered = filtered.filter(p => Number(p.price) <= Number(params.maxPrice));
      }

      // 5. Faqat mavjudlari filtri
      if (params.inStock) {
        filtered = filtered.filter(p => p.inStock !== false);
      }

      // 6. Saralash
      if (params.sort) {
        switch (params.sort) {
          case 'price-asc':
            filtered.sort((a, b) => Number(a.price) - Number(b.price));
            break;
          case 'price-desc':
            filtered.sort((a, b) => Number(b.price) - Number(a.price));
            break;
          case 'rating':
            filtered.sort((a, b) => Number(b.rating) - Number(a.rating));
            break;
          case 'newest':
            filtered.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0));
            break;
          case 'popular':
          default:
            filtered.sort((a, b) => (Number(b.reviewCount) || 0) - (Number(a.reviewCount) || 0));
            break;
        }
      }

      const totalCount = filtered.length;
      let paginated = filtered;
      if (params.page && params.pageSize) {
        const page = Math.max(1, Number(params.page));
        const pageSize = Math.max(1, Number(params.pageSize));
        paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
      }

      // DRF JSON formatida snake_case mock yaratish
      const drfResults = paginated.map(p => this.normalizeProduct({
        id: p.id,
        name: p.name,
        title: p.name,
        author: p.author,
        author_name: p.author,
        category_id: p.categoryId,
        category_name: p.categoryName,
        price: toDecimalString(p.price),
        old_price: p.oldPrice ? toDecimalString(p.oldPrice) : null,
        discount: p.discount || 0,
        rating: p.rating || 5,
        review_count: p.reviewCount || 0,
        in_stock: p.inStock !== false,
        badge: p.badge || '',
        image: p.image || '',
        image2: p.image2 || p.image || '',
        description: p.description || '',
        features: p.features || []
      }));

      // Keshni to'ldirish
      drfResults.forEach(p => this._cache.productsMap.set(p.id, p));

      return {
        count: totalCount,
        next: null,
        previous: null,
        results: drfResults
      };
    },

    /**
     * Bitta mahsulot tafsilotini olish (DRF: GET /api/v1/products/:id/)
     */
    async getProduct(id, opts = {}) {
      await this.simulateDelay(opts);
      const numId = Number(id);

      if (!this.isMock()) {
        const data = await this.request(`/products/${numId}`, opts);
        const normalized = this.normalizeProduct(data);
        if (normalized) this._cache.productsMap.set(normalized.id, normalized);
        return normalized;
      }

      // Mock Adapter
      const rawProducts = (typeof window !== 'undefined' && window.PRODUCTS) || [];
      const found = rawProducts.find(p => p.id === numId);
      if (!found) return null;

      const normalized = this.normalizeProduct({
        id: found.id,
        name: found.name,
        author: found.author,
        category_id: found.categoryId,
        category_name: found.categoryName,
        price: toDecimalString(found.price),
        old_price: found.oldPrice ? toDecimalString(found.oldPrice) : null,
        discount: found.discount || 0,
        rating: found.rating || 5,
        review_count: found.reviewCount || 0,
        in_stock: found.inStock !== false,
        badge: found.badge || '',
        image: found.image || '',
        image2: found.image2 || found.image || '',
        description: found.description || '',
        features: found.features || []
      });

      this._cache.productsMap.set(normalized.id, normalized);
      return normalized;
    },

    /**
     * Kategoriyalar ro'yxatini olish (DRF: GET /api/v1/categories/)
     * Natija: { count, next, previous, results }
     */
    async getCategories(opts = {}) {
      await this.simulateDelay(opts);

      if (!this.isMock()) {
        const data = await this.request('/categories', opts);
        const results = (data.results || data || []).map(c => this.normalizeCategory(c));
        return {
          count: data.count !== undefined ? data.count : results.length,
          next: data.next || null,
          previous: data.previous || null,
          results
        };
      }

      // Mock Adapter
      const rawCategories = (typeof window !== 'undefined' && window.CATEGORIES) || [];
      const results = rawCategories.map(c => this.normalizeCategory({
        id: c.id,
        name: c.name,
        slug: c.slug || '',
        image: c.image || '',
        products_count: c.count || 0
      }));

      return {
        count: results.length,
        next: null,
        previous: null,
        results
      };
    },

    /**
     * Qidiruv takliflari (Live Search)
     */
    async searchProducts(query, opts = {}) {
      const res = await this.getProducts({ q: query }, opts);
      return res.results;
    },

    /**
     * Mahsulot sharhlarini olish (DRF: GET /api/v1/products/:id/reviews/)
     */
    async getProductReviews(productId, opts = {}) {
      await this.simulateDelay(opts);
      const numId = Number(productId);

      if (!this.isMock()) {
        const data = await this.request(`/products/${numId}/reviews`, opts);
        const results = (data.results || data || []).map(r => this.normalizeReview(r));
        return {
          count: data.count !== undefined ? data.count : results.length,
          results
        };
      }

      // Mock Adapter: data.js REVIEWS + localStorage
      const seededReviews = ((typeof window !== 'undefined' && window.REVIEWS) || {})[numId] || [];
      let localReviews = [];
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(`reviews_${numId}`);
          localReviews = raw ? JSON.parse(raw) : [];
        }
      } catch {
        localReviews = [];
      }

      const merged = [...localReviews, ...seededReviews].map(r => this.normalizeReview(r));
      return {
        count: merged.length,
        results: merged
      };
    },

    /**
     * Yangi sharh qoldirish (DRF: POST /api/v1/products/:id/reviews/)
     */
    async addProductReview(productId, reviewData, opts = {}) {
      await this.simulateDelay(opts);
      const numId = Number(productId);

      if (!this.isMock()) {
        const data = await this.request(`/products/${numId}/reviews`, {
          method: 'POST',
          body: JSON.stringify(toSnake(reviewData)),
          ...opts
        });
        return this.normalizeReview(data);
      }

      // Mock Adapter: localStorage ga yozish
      let localReviews = [];
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(`reviews_${numId}`);
          localReviews = raw ? JSON.parse(raw) : [];
        }
      } catch {
        localReviews = [];
      }

      const newReview = this.normalizeReview({
        id: Date.now(),
        product_id: numId,
        user_name: reviewData.author || reviewData.userName || 'Kitobxon',
        rating: Number(reviewData.rating || 5),
        comment: reviewData.comment || reviewData.text || '',
        created_at: new Date().toISOString(),
        helpful: 0
      });

      localReviews.unshift(newReview);
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(`reviews_${numId}`, JSON.stringify(localReviews));
        }
      } catch {}

      return newReview;
    },

    /**
     * Mahsulot savol-javoblari (DRF: GET /api/v1/products/:id/questions/)
     */
    async getProductQna(productId, opts = {}) {
      await this.simulateDelay(opts);
      const numId = Number(productId);

      if (!this.isMock()) {
        const data = await this.request(`/products/${numId}/questions`, opts);
        const results = (data.results || data || []).map(q => this.normalizeQna(q));
        return {
          count: data.count !== undefined ? data.count : results.length,
          results
        };
      }

      // Mock Adapter
      const seededQna = ((typeof window !== 'undefined' && window.QNA) || {})[numId] || [];
      let localQna = [];
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(`qna_${numId}`);
          localQna = raw ? JSON.parse(raw) : [];
        }
      } catch {
        localQna = [];
      }

      const merged = [...localQna, ...seededQna].map(q => this.normalizeQna(q));
      return {
        count: merged.length,
        results: merged
      };
    },

    /**
     * Savol yo'llash (DRF: POST /api/v1/products/:id/questions/)
     */
    async addProductQuestion(productId, qnaData, opts = {}) {
      await this.simulateDelay(opts);
      const numId = Number(productId);

      if (!this.isMock()) {
        const data = await this.request(`/products/${numId}/questions`, {
          method: 'POST',
          body: JSON.stringify(toSnake(qnaData)),
          ...opts
        });
        return this.normalizeQna(data);
      }

      // Mock Adapter
      let localQna = [];
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(`qna_${numId}`);
          localQna = raw ? JSON.parse(raw) : [];
        }
      } catch {
        localQna = [];
      }

      const newQna = this.normalizeQna({
        id: Date.now(),
        product_id: numId,
        user_name: qnaData.userName || 'Foydalanuvchi',
        text: qnaData.text || qnaData.question || '',
        created_at: new Date().toISOString(),
        answer: null
      });

      localQna.unshift(newQna);
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(`qna_${numId}`, JSON.stringify(localQna));
        }
      } catch {}

      return newQna;
    },

    /**
     * Sinxron keshdan mahsulot topish (UI sinxron renderlar uchun xavfsiz fallback)
     */
    getCachedProduct(id) {
      const numId = Number(id);
      if (this._cache.productsMap.has(numId)) {
        return this._cache.productsMap.get(numId);
      }
      const raw = (typeof window !== 'undefined' && window.PRODUCTS) || [];
      const found = raw.find(p => p.id === numId);
      if (found) {
        const norm = this.normalizeProduct(found);
        this._cache.productsMap.set(numId, norm);
        return norm;
      }
      return null;
    },

    // =========================================================================
    // MAVJUD QO'LLAB-QUVVATLANUVCHI METODLAR (B2/B3/B4 da kengaytiriladi)
    // =========================================================================
    async login(email, password) {
      if (!this.isMock()) return this.request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      return global.Store ? global.Store.login(email, password) : null;
    },
    async register(payload) {
      if (!this.isMock()) return this.request("/auth/register", { method: "POST", body: JSON.stringify(payload) });
      return global.Store ? global.Store.register(payload.name, payload.email, payload.phone, payload.password) : null;
    },
    async checkout(orderData) {
      if (!this.isMock()) return this.request("/checkout", { method: "POST", body: JSON.stringify(orderData) });
      return global.Store ? global.Store.createOrder(orderData) : null;
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
      return this.request((window.APP_CONFIG && APP_CONFIG.TELEGRAM_OTP_SEND) || '', {
        method: "POST", body: JSON.stringify({ phone })
      });
    },
    async verifyTelegramOtp(phone, code) {
      if (this.isMock()) return { ok: false };
      return this.request((window.APP_CONFIG && APP_CONFIG.TELEGRAM_OTP_VERIFY) || '', {
        method: "POST", body: JSON.stringify({ phone, code })
      });
    },
    socialAuthStart(provider) {
      const route = provider === 'google' ? (window.APP_CONFIG && APP_CONFIG.AUTH_GOOGLE_START) : (window.APP_CONFIG && APP_CONFIG.AUTH_TELEGRAM_START);
      if (this.isMock()) throw new Error("Ijtimoiy kirish server sozlangandan keyin ishlaydi.");
      return route;
    }
  };

  // Keshni dastlabki mahsulotlar bilan oldindan qizdirish (agar PRODUCTS mavjud bo'lsa)
  if (typeof window !== 'undefined' && window.PRODUCTS && Array.isArray(window.PRODUCTS)) {
    window.PRODUCTS.forEach(p => Api._cache.productsMap.set(p.id, Api.normalizeProduct(p)));
  }

  // Global va modul export
  if (typeof window !== 'undefined') {
    window.Api = Api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Api };
  }
})(typeof window !== 'undefined' ? window : globalThis);
