/**
 * modules/commerce.js
 * Mahsulot detallari sahifasi, savatcha sahifasi (CartPage)
 * va buyurtma berish (Checkout) biznes-mantig'i.
 */
import { escapeHtml, sanitizeUrl } from './escape.js';
import { ICONS, Store } from './core.js';
import {
  UI,
  runBinEatAnimation,
  createBinButtonHtml,
  renderStars,
  mapDeliveryIcon,
  mapPaymentIcon,
  requireAuth
} from './ui.js';
import { renderProductCard } from './products.js';

const getProducts = () => (typeof window !== 'undefined' && window.PRODUCTS) || (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []);
const getDeliveryOptions = () => (typeof window !== 'undefined' && window.DELIVERY_OPTIONS) || (typeof DELIVERY_OPTIONS !== 'undefined' ? DELIVERY_OPTIONS : []);
const getPaymentMethods = () => (typeof window !== 'undefined' && window.PAYMENT_METHODS) || (typeof PAYMENT_METHODS !== 'undefined' ? PAYMENT_METHODS : []);
const getPromoCodes = () => (typeof window !== 'undefined' && window.PROMO_CODES) || (typeof PROMO_CODES !== 'undefined' ? PROMO_CODES : []);
const getReviews = () => (typeof window !== 'undefined' && window.REVIEWS) || (typeof REVIEWS !== 'undefined' ? REVIEWS : {});
const getQna = () => (typeof window !== 'undefined' && window.QNA) || (typeof QNA !== 'undefined' ? QNA : {});

function openLightbox(src, alt) {
  if (typeof document === 'undefined') return;
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.innerHTML = `<button type="button" class="lightbox__close" aria-label="Yopish">${ICONS.x}</button><img alt="">`;
    document.body.appendChild(lb);
    lb.addEventListener('click', e => {
      if (e.target === lb || e.target.closest('.lightbox__close')) lb.classList.remove('is-on');
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('is-on'); });
  }
  const img = lb.querySelector('img');
  if (img) {
    img.src = src;
    img.alt = alt || '';
  }
  lb.classList.add('is-on');
}

/* ========================================================================
   PRODUCT DETAIL
   ======================================================================== */
const ProductDetail = {
  product: null,

  init() {
    const id = parseInt(new URLSearchParams(location.search).get('id'), 10);
    this.product = getProducts().find(p => p.id === id);
    if (!this.product) {
      const el = document.getElementById('productDetail');
      if (el) el.innerHTML = `<div class="empty-state"><div class="empty-state__icon">${ICONS.book}</div><h3 class="empty-state__title">Mahsulot topilmadi</h3><a href="book_list.html" class="btn btn-primary">Bosh sahifaga</a></div>`;
      return;
    }
    Store.addRecent(this.product.id);
    this.renderInfo();
    this.initGallery();
    this.initTabs();
    this.renderSimilar();
    this.renderStickyBar();
    document.title = this.product.name + ' — Booksaw';
  },

  renderInfo() {
    const p = this.product;
    // Breadcrumb
    const bc = document.getElementById('breadcrumbCategory');
    const bp = document.getElementById('breadcrumbProduct');
    if (bc) {
      bc.innerHTML = `<a href="book_list.html?cat=${p.categoryId}">${escapeHtml(p.categoryName)}</a>`;
    }
    if (bp) bp.textContent = p.name;
    // Main image
    const mainImg = document.getElementById('mainImage');
    if (mainImg) {
      mainImg.src = p.image;
      mainImg.alt = p.name;
      mainImg.style.viewTransitionName = 'book-' + p.id;
    }
    // Thumbnails
    const thumbsC = document.getElementById('thumbsContainer');
    if (thumbsC) {
      const imgs = [...new Set([p.image, p.image2].filter(Boolean))];
      thumbsC.innerHTML = imgs.map((img, i) =>
        `<div class="gallery__thumb${i === 0 ? ' active' : ''}" data-img="${sanitizeUrl(img)}"><img src="${sanitizeUrl(img)}" alt=""></div>`
      ).join('');
      thumbsC.addEventListener('click', e => {
        const thumb = e.target.closest('.gallery__thumb');
        if (!thumb || !mainImg) return;
        mainImg.src = thumb.dataset.img;
        thumbsC.querySelectorAll('.gallery__thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    }
    // Product info panel
    const infoEl = document.getElementById('productInfo');
    if (!infoEl) return;
    const covers = p.variants && p.variants.covers ? p.variants.covers : [];
    const variantsHtml = covers.length > 1 ? `
      <div class="variant-selector">
        <div class="variant-selector__title">Muqova turi:</div>
        <div class="variant-options">${covers.map((v, i) => `<button type="button" class="variant-option${i === 0 ? ' selected' : ''}" data-variant="${escapeHtml(v)}">${escapeHtml(v)}</button>`).join('')}</div>
      </div>` : covers.length === 1 ? `<p class="product-info__cover-type">Muqova: ${escapeHtml(covers[0])}</p>` : '';

    infoEl.innerHTML = `
      <div class="product-info__category" style="color:var(--gray-400);font-size:13px;text-transform:uppercase">${escapeHtml(p.categoryName)}</div>
      <h1 class="product-info__title">${escapeHtml(p.name)}</h1>
      <p style="color:var(--gray-500);margin:4px 0 12px">${escapeHtml(p.author)}</p>
      <div class="product-info__rating" style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
        <span style="color:var(--accent);font-size:18px;display:flex;">${renderStars(p.rating)}</span>
        <span style="color:var(--gray-400)">${p.rating}</span>
        <span style="color:var(--gray-500)">${p.reviewCount ? '· ' + p.reviewCount + ' ta sharh' : '· Sharh yo‘q'}</span>
      </div>
      <div class="product-info__price" style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
        <span class="product-info__price-current">${UI.formatPrice(p.price)}</span>
        ${p.oldPrice && p.oldPrice > p.price ? `<span style="font-size:20px;text-decoration:line-through;color:var(--gray-400)">${UI.formatPrice(p.oldPrice)}</span>` : ''}
        ${p.discount ? `<span class="badge badge-sale" style="font-size:14px">-${p.discount}%</span>` : ''}
      </div>
      ${variantsHtml}
      <div style="display:flex;align-items:center;gap:12px;margin:20px 0">
        <span style="font-weight:600">Miqdor:</span>
        <div class="quantity-selector">
          <button class="qty-minus" id="qtyMinus">${ICONS.minus}</button>
          <input type="number" value="1" min="1" max="10" id="qtyInput" readonly>
          <button class="qty-plus" id="qtyPlus">${ICONS.plus}</button>
        </div>
      </div>
      <div class="product-actions" style="display:flex;gap:16px;margin:24px 0">
        <button class="btn btn-primary btn-lg" id="addToCartDetail"${!p.inStock ? ' disabled' : ''}>${ICONS.cart} Savatga qo'shish</button>
        <button class="btn btn-secondary btn-lg" id="buyNowDetail"${!p.inStock ? ' disabled' : ''}>${ICONS.zap} Hoziroq sotib olish</button>
      </div>
      ${!p.inStock ? `<p style="color:var(--danger);font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:8px;">${ICONS.x} Hozircha omborda mavjud emas</p>` : `<p style="color:var(--secondary);font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:8px;">${ICONS.check} Omborda mavjud</p>`}
      <div class="delivery-info" style="background:var(--gray-50);padding:20px;border-radius:var(--radius-md)">
        <h4 style="margin-bottom:8px;display:flex;align-items:center;gap:8px;">${ICONS.truck} Yetkazib berish</h4>
        <p style="color:var(--gray-500);font-size:14px">Standart: 3–5 kun · Ekspress: 1–2 kun</p>
        <p style="color:var(--gray-500);font-size:14px">Yetkazib berish narxi: ${UI.formatPrice(15000)} dan (pikap bepul)</p>
      </div>
      <div class="product-meta-row">
        <button type="button" class="link-btn" id="shareProduct">${ICONS.arrowRight} Ulashish</button>
        <button type="button" class="link-btn${Store.isInWishlist(p.id) ? ' active' : ''}" id="wishDetail">${Store.isInWishlist(p.id) ? ICONS.heartFilled : ICONS.heart} Sevimlilarga</button>
        <a class="link-btn" href="store.html?id=${encodeURIComponent(p.storeId || 1)}">${ICONS.store} Sotuvchi</a>
      </div>`;

    // Variant selection
    infoEl.querySelectorAll('.variant-option').forEach(btn => {
      btn.onclick = () => {
        infoEl.querySelectorAll('.variant-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      };
    });
    // Quantity
    const qtyInput = document.getElementById('qtyInput');
    document.getElementById('qtyMinus')?.addEventListener('click', () => { let v = +qtyInput.value; if (v > 1) qtyInput.value = v - 1; });
    document.getElementById('qtyPlus')?.addEventListener('click', () => { let v = +qtyInput.value; if (v < 10) qtyInput.value = v + 1; });
    // Add to cart
    document.getElementById('addToCartDetail')?.addEventListener('click', () => {
      if (!requireAuth("Kitobni savatga qo'shish uchun avval hisobingizga kiring!")) return;
      const qty = parseInt(qtyInput?.value, 10) || 1;
      const variant = infoEl.querySelector('.variant-option.selected')?.dataset.variant || null;
      Store.addToCart(p.id, qty, variant);
      UI.showToast("Savatga qo'shildi!");
      if (typeof window !== 'undefined' && window.Animations?.flyToCart) {
        window.Animations.flyToCart(document.getElementById('mainImage') || document.getElementById('addToCartDetail'));
      }
    });
    // Buy now
    document.getElementById('buyNowDetail')?.addEventListener('click', () => {
      if (!requireAuth("Xarid qilish uchun avval hisobingizga kiring!")) return;
      const qty = parseInt(qtyInput?.value, 10) || 1;
      Store.addToCart(p.id, qty);
      location.href = 'checkout.html';
    });
    document.getElementById('wishDetail')?.addEventListener('click', () => {
      if (!requireAuth("Sevimlilarga qo'shish uchun avval hisobingizga kiring!")) return;
      const res = Store.toggleWishlist(p.id);
      UI.showToast(res.added ? "Sevimlilarga qo'shildi" : "Sevimlilardan o'chirildi");
      const btn = document.getElementById('wishDetail');
      if (btn) {
        btn.classList.toggle('active', res.added);
        btn.innerHTML = `${res.added ? ICONS.heartFilled : ICONS.heart} Sevimlilarga`;
      }
    });
    document.getElementById('shareProduct')?.addEventListener('click', async () => {
      const url = location.href;
      try {
        if (navigator.share) await navigator.share({ title: p.name, url });
        else {
          await navigator.clipboard.writeText(url);
          UI.showToast('Havola nusxa olindi');
        }
      } catch { /* user cancelled */ }
    });
  },

  renderStickyBar() {
    const p = this.product;
    if (!p || document.getElementById('stickyAtc')) return;
    const bar = document.createElement('div');
    bar.id = 'stickyAtc';
    bar.className = 'sticky-atc';
    bar.innerHTML = `<div class="sticky-atc__inner">
      <img src="${sanitizeUrl(p.image)}" alt="">
      <div><strong>${escapeHtml(p.name)}</strong><span>${UI.formatPrice(p.price)}</span></div>
      <button type="button" class="btn btn-primary btn-sm" id="stickyAdd"${p.inStock ? '' : ' disabled'}>Savatga</button>
    </div>`;
    document.body.appendChild(bar);
    document.getElementById('stickyAdd')?.addEventListener('click', () => {
      if (!requireAuth("Kitobni savatga qo'shish uchun avval hisobingizga kiring!")) return;
      const qty = parseInt(document.getElementById('qtyInput')?.value, 10) || 1;
      Store.addToCart(p.id, qty);
      UI.showToast("Savatga qo'shildi!");
    });
    const onScroll = () => {
      const actions = document.querySelector('.product-actions');
      if (!actions) return;
      bar.classList.toggle('is-on', actions.getBoundingClientRect().bottom < 72);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  },

  initGallery() {
    const mainImg = document.getElementById('mainImage');
    const lens = document.getElementById('zoomLens');
    if (!mainImg || !lens) return;
    const container = mainImg.parentElement;
    if (!container) return;
    container.addEventListener('mousemove', e => {
      const rect = container.getBoundingClientRect();
      let x = e.clientX - rect.left - 75;
      let y = e.clientY - rect.top - 75;
      x = Math.max(0, Math.min(rect.width - 150, x));
      y = Math.max(0, Math.min(rect.height - 150, y));
      lens.style.display = 'block';
      lens.style.left = x + 'px'; lens.style.top = y + 'px';
      lens.style.backgroundImage = `url(${mainImg.src})`;
      lens.style.backgroundSize = `${rect.width * 2.5}px ${rect.height * 2.5}px`;
      lens.style.backgroundPosition = `-${x * 2.5}px -${y * 2.5}px`;
    });
    container.addEventListener('mouseleave', () => { lens.style.display = 'none'; });
    container.addEventListener('click', () => openLightbox(mainImg.src, this.product.name));
    container.style.cursor = 'zoom-in';
  },

  initTabs() {
    const tabs = document.querySelectorAll('.tabs__nav-item');
    const panels = document.querySelectorAll('.tabs__panel');
    if (!this._tabsBound) {
      this._tabsBound = true;
      tabs.forEach(tab => {
        tab.onclick = () => {
          tabs.forEach(t => t.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          tab.classList.add('active');
          const panel = document.getElementById('tab-' + tab.dataset.tab);
          if (panel) panel.classList.add('active');
        };
      });
    }
    const p = this.product;
    const descPanel = document.getElementById('tab-description');
    if (descPanel) descPanel.innerHTML = `<div style="max-width:800px;line-height:1.8">${escapeHtml(p.description)}</div>`;
    const featPanel = document.getElementById('tab-features');
    if (featPanel && p.features) {
      featPanel.innerHTML = `<table style="width:100%;max-width:600px;border-collapse:collapse">${p.features.map(f =>
        `<tr style="border-bottom:1px solid var(--gray-100)"><td style="padding:12px 16px;font-weight:600;color:var(--gray-600);width:40%">${escapeHtml(f.label)}</td><td style="padding:12px 16px">${escapeHtml(f.value)}</td></tr>`
      ).join('')}</table>`;
    }
    const revPanel = document.getElementById('tab-reviews');
    if (revPanel) {
      const allReviews = getReviews();
      const reviews = allReviews[p.id] ? allReviews[p.id] : [];
      const local = Store.getLocalReviews(p.id);
      const all = [...local, ...reviews];
      const distAll = [5,4,3,2,1].map(star => {
        const count = all.filter(r => r.rating === star).length;
        const pct = all.length ? Math.round(count / all.length * 100) : 0;
        return `<div class="reviews__bar" style="display:flex;align-items:center;gap:12px"><span style="width:60px;font-size:14px;display:flex;align-items:center;gap:4px">${star} ${ICONS.star}</span><div style="flex:1;height:10px;background:var(--gray-200);border-radius:99px;overflow:hidden"><div style="height:100%;width:${pct}%;background:var(--accent);border-radius:99px"></div></div><span style="width:40px;font-size:13px;color:var(--gray-400)">${count}</span></div>`;
      }).join('');
      const cards = all.map(r => `
        <div class="review-card" style="padding:20px 0;border-bottom:1px solid var(--gray-100)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <strong>${escapeHtml(r.userName)}</strong><span style="color:var(--gray-400);font-size:13px">${UI.formatDate(r.date)}</span>
          </div>
          <div style="color:var(--accent);margin-bottom:8px;display:flex;">${renderStars(r.rating)}</div>
          <p style="color:var(--gray-600);line-height:1.7">${escapeHtml(r.text)}</p>
          <button type="button" class="review-helpful" data-count="${r.helpful || 0}">${ICONS.thumbsUp} <span>${r.helpful || 0}</span> foydali</button>
        </div>`).join('');
      const avg = all.length ? (all.reduce((s, r) => s + r.rating, 0) / all.length).toFixed(1) : '—';
      revPanel.innerHTML = `
        <div class="reviews-head">
          <div style="text-align:center"><div style="font-size:56px;font-weight:800;color:var(--primary)">${avg}</div><div style="color:var(--accent);font-size:20px;display:flex;justify-content:center;">${renderStars(+avg || 0)}</div><p style="color:var(--gray-500);margin-top:4px">${all.length} ta sharh</p></div>
          <div style="display:flex;flex-direction:column;gap:8px">${distAll}</div>
        </div>
        <form class="review-form" id="reviewForm">
          <h4>Sharh yozing</h4>
          <div class="star-pick" id="starPick">${[1,2,3,4,5].map(n => `<button type="button" data-star="${n}" aria-label="${n} yulduz">${ICONS.starEmpty}</button>`).join('')}</div>
          <textarea class="form-input" id="reviewText" rows="3" placeholder="Kitob haqidagi fikringiz..." required></textarea>
          <button type="submit" class="btn btn-primary btn-sm">Yuborish</button>
        </form>
        ${all.length ? cards : '<p style="color:var(--gray-500)">Hozircha sharhlar yo\'q — birinchi bo\'ling.</p>'}`;
      let picked = 5;
      const paintStars = () => {
        revPanel.querySelectorAll('#starPick button').forEach(b => {
          b.innerHTML = +b.dataset.star <= picked ? ICONS.star : ICONS.starEmpty;
        });
      };
      paintStars();
      revPanel.querySelector('#starPick')?.addEventListener('click', e => {
        const b = e.target.closest('button[data-star]');
        if (!b) return;
        picked = +b.dataset.star;
        paintStars();
      });
      document.getElementById('reviewForm')?.addEventListener('submit', e => {
        e.preventDefault();
        if (!requireAuth("Sharh qoldirish uchun tizimga kiring!")) return;
        const user = Store.getUser();
        const text = (document.getElementById('reviewText')?.value || '').trim();
        if (text.length < 8) { UI.showToast('Sharh kamida 8 belgi', 'error'); return; }
        Store.addReview(p.id, { id: Date.now(), userName: user.name, rating: picked, date: new Date().toISOString(), text, helpful: 0 });
        UI.showToast('Sharhingiz qo‘shildi');
        this.initTabs();
      });
      revPanel.querySelectorAll('.review-helpful').forEach(btn => {
        btn.addEventListener('click', () => {
          const n = parseInt(btn.dataset.count, 10) + 1;
          btn.dataset.count = String(n);
          const span = btn.querySelector('span');
          if (span) span.textContent = n;
        });
      });
    }
    const qnaPanel = document.getElementById('tab-qna');
    if (qnaPanel) {
      const allQna = getQna();
      const seeded = allQna[p.id] ? allQna[p.id] : [];
      const local = Store.getLocalQna(p.id);
      const all = [...local, ...seeded];
      qnaPanel.innerHTML = `
        <form class="review-form" id="qnaForm">
          <h4>Savol bering</h4>
          <textarea class="form-input" id="qnaText" rows="2" placeholder="Mahsulot haqida savolingiz..." required></textarea>
          <button type="submit" class="btn btn-primary btn-sm">Yuborish</button>
        </form>
        ${all.length ? all.map(q => `
          <div class="qna-item">
            <p><strong>${escapeHtml(q.userName)}</strong> <span>${UI.formatDate(q.date)}</span></p>
            <p class="qna-q">${escapeHtml(q.text)}</p>
            ${q.answer ? `<p class="qna-a">${ICONS.check} ${escapeHtml(q.answer)}</p>` : '<p class="qna-a muted">Javob kutilmoqda</p>'}
          </div>`).join('') : '<p class="empty-hint">Hozircha savollar yo‘q.</p>'}`;
      document.getElementById('qnaForm')?.addEventListener('submit', e => {
        e.preventDefault();
        if (!requireAuth("Savol berish uchun tizimga kiring!")) return;
        const user = Store.getUser();
        const text = (document.getElementById('qnaText')?.value || '').trim();
        if (text.length < 6) { UI.showToast('Savolni to‘liq yozing', 'error'); return; }
        Store.addQuestion(p.id, { id: Date.now(), userName: user.name, date: new Date().toISOString(), text, answer: '' });
        UI.showToast('Savolingiz yuborildi');
        this.initTabs();
      });
    }
  },

  renderSimilar() {
    const el = document.getElementById('similarProducts');
    if (!el) return;
    const similar = getProducts().filter(pr => pr.categoryId === this.product.categoryId && pr.id !== this.product.id).slice(0, 8);
    el.innerHTML = similar.map(p => renderProductCard(p)).join('');
  }
};

/* ========================================================================
   CART PAGE
   ======================================================================== */
const CartPage = {
  promoApplied: null,
  _bound: false,

  init() {
    if (!requireAuth("Savatni ko'rish uchun avval hisobingizga kiring!")) {
      const el = document.querySelector('.cart-page, main, .container');
      if (el) el.style.display = 'none';
      return;
    }
    this.promoApplied = Store.getPromo();
    this.bindEvents();
    this.render();
    document.getElementById('promoBtn')?.addEventListener('click', () => this.applyPromo());
    document.getElementById('promoInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') this.applyPromo(); });
  },

  bindEvents() {
    const itemsEl = document.getElementById('cartItems');
    if (!itemsEl || this._bound) return;
    this._bound = true;
    itemsEl.addEventListener('click', e => {
      const qtyBtn = e.target.closest('.cart-qty-btn');
      if (qtyBtn) {
        const id = +qtyBtn.dataset.id;
        const ci = Store.getCart().find(i => i.productId === id);
        if (ci) {
          const newQty = qtyBtn.dataset.action === 'plus' ? ci.qty + 1 : ci.qty - 1;
          if (newQty >= 1 && newQty <= 10) { Store.updateCartQty(id, newQty); this.render(); }
        }
        return;
      }
      const removeBtn = e.target.closest('.cart-remove');
      if (removeBtn) {
        UI.showConfirm("Bu mahsulotni savatdan o'chirasizmi?", () => {
          const itemEl = removeBtn.closest('.cart-item');
          if (itemEl) {
            itemEl.style.transition = 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)';
            itemEl.style.opacity = '0';
            itemEl.style.transform = 'translateX(24px)';
            setTimeout(() => {
              Store.removeFromCart(+removeBtn.dataset.id);
              this.render();
              UI.showToast("Savatdan o'chirildi");
            }, 260);
          } else {
            Store.removeFromCart(+removeBtn.dataset.id);
            this.render();
            UI.showToast("Savatdan o'chirildi");
          }
        });
        return;
      }
      const moveBtn = e.target.closest('.cart-move-wl');
      if (moveBtn) {
        Store.moveToWishlist(+moveBtn.dataset.id);
        this.render();
        UI.showToast("Sevimlilarga ko'chirildi");
      }
    });
  },

  render() {
    const cart = Store.getCart();
    const itemsEl = document.getElementById('cartItems');
    const emptyEl = document.getElementById('emptyCart');
    const summaryEl = document.getElementById('cartSummary');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!cart.length) {
      if (itemsEl) itemsEl.style.display = 'none';
      if (summaryEl) summaryEl.style.display = 'none';
      if (emptyEl) emptyEl.style.display = '';
      if (checkoutBtn) checkoutBtn.style.pointerEvents = 'none';
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';
    if (itemsEl) itemsEl.style.display = '';
    if (summaryEl) summaryEl.style.display = '';

    if (itemsEl) {
      const allProducts = getProducts();
      const itemsHtml = cart.map(ci => {
        const p = allProducts.find(pr => pr.id === ci.productId);
        if (!p) return '';
        const safeId = escapeHtml(p.id);
        const encodedId = encodeURIComponent(p.id);
        return `<div class="cart-item" data-id="${safeId}">
          <img class="cart-item__image" src="${sanitizeUrl(p.image)}" alt="${escapeHtml(p.name)}">
          <div class="cart-item__info">
            <a href="book_detail.html?id=${encodedId}" class="cart-item__name">${escapeHtml(p.name)}</a>
            <p class="cart-item__variant">${escapeHtml(p.author)}${ci.variant ? ' • ' + escapeHtml(ci.variant) : ''}</p>
          </div>
          <div class="cart-item__price">${UI.formatPrice(p.price)}</div>
          <div class="quantity-selector cart-item__qty">
            <button type="button" class="cart-qty-btn" data-action="minus" data-id="${safeId}">${ICONS.minus}</button>
            <span style="width:40px;text-align:center;font-weight:600">${Number(ci.qty)}</span>
            <button type="button" class="cart-qty-btn" data-action="plus" data-id="${safeId}">${ICONS.plus}</button>
          </div>
          <div class="cart-item__actions">
            <button type="button" class="btn-icon cart-move-wl" data-id="${safeId}" title="Sevimlilarga">${ICONS.heart}</button>
            <button type="button" class="btn-icon cart-remove" data-id="${safeId}" title="O'chirish" style="color:var(--danger)">${ICONS.trash}</button>
          </div>
        </div>`;
      }).join('');

      const clearBtnHtml = createBinButtonHtml("Tozalash", "danger", "clearCartEatBtn");
      itemsEl.innerHTML = `
        <div class="cart-header-actions" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding:12px 18px;background:var(--bg-card);border:1px solid var(--border);border-radius:16px;box-shadow:var(--shadow-xs);">
          <span style="font-weight:600;font-size:15px;color:var(--text-muted);">${cart.length} xil mahsulot tanlandi</span>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:13px;color:var(--text-muted);">Savatni tozalash:</span>
            ${clearBtnHtml}
          </div>
        </div>
        ${itemsHtml}
      `;

      document.getElementById('clearCartEatBtn')?.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        runBinEatAnimation(btn, () => {
          Store.clearCart();
          this.render();
          UI.showToast("Savat tozalandi!");
        });
      });
    }
    this.updateSummary();
  },

  updateSummary() {
    const { subtotal } = Store.getCartTotal();
    let discount = 0;
    let delivery = 15000;
    if (this.promoApplied) {
      if (this.promoApplied.type === 'percent') discount = Math.round(subtotal * this.promoApplied.value / 100);
      if (this.promoApplied.type === 'freeShipping') delivery = 0;
    }
    const total = Math.max(0, subtotal - discount + delivery);
    const s = id => document.getElementById(id);
    if (s('summarySubtotal')) s('summarySubtotal').textContent = UI.formatPrice(subtotal);
    if (s('summaryDiscount')) s('summaryDiscount').textContent = discount ? '-' + UI.formatPrice(discount) : "0 so'm";
    if (s('summaryDelivery')) s('summaryDelivery').textContent = UI.formatPrice(delivery);
    if (s('summaryTotal')) s('summaryTotal').textContent = UI.formatPrice(total);
  },

  applyPromo() {
    const input = document.getElementById('promoInput');
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    const promo = getPromoCodes().find(p => p.code === code);
    if (!promo) { UI.showToast("Noto'g'ri promo-kod", 'error'); return; }
    const { subtotal } = Store.getCartTotal();
    if (subtotal < promo.minOrder) { UI.showToast(`Minimal buyurtma: ${UI.formatPrice(promo.minOrder)}`, 'error'); return; }
    this.promoApplied = promo;
    Store.setPromo(promo);
    this.updateSummary();
    UI.showToast("Promo-kod qo'llandi!");
    input.disabled = true;
    const btn = document.getElementById('promoBtn');
    if (btn) btn.disabled = true;
  }
};

/* ========================================================================
   CHECKOUT
   ======================================================================== */
const Checkout = {
  currentStep: 1,
  orderData: { address: null, delivery: null, payment: null, deliveryCost: 15000 },
  _bound: false,
  _placing: false,

  init() {
    if (!requireAuth("Buyurtma berish uchun avval hisobingizga kiring!")) {
      const el = document.querySelector('.checkout__layout, main, .container');
      if (el) el.style.display = 'none';
      return;
    }
    if (!Store.getCart().length) { location.href = 'cart.html'; return; }
    this.bindLists();
    this.renderAddresses();
    this.renderDelivery();
    this.renderPayment();
    this.renderSummary();
    this.bindNav();
  },

  bindLists() {
    if (this._bound) return;
    this._bound = true;
    document.getElementById('addressList')?.addEventListener('click', e => {
      const card = e.target.closest('.address-card');
      if (!card) return;
      const addrs = Store.getAddresses();
      this.orderData.address = addrs.find(a => a.id === card.dataset.id);
      this.renderAddresses();
    });
    document.getElementById('deliveryOptions')?.addEventListener('click', e => {
      const card = e.target.closest('.address-card');
      if (!card) return;
      const options = getDeliveryOptions();
      const d = options.find(opt => opt.id === +card.dataset.did);
      if (d) { this.orderData.delivery = d; this.orderData.deliveryCost = d.price; this.renderDelivery(); this.renderSummary(); }
    });
    document.getElementById('paymentOptions')?.addEventListener('click', e => {
      const card = e.target.closest('.address-card');
      if (!card) return;
      const methods = getPaymentMethods();
      this.orderData.payment = methods.find(pm => pm.id === +card.dataset.pid);
      this.renderPayment();
    });
  },

  goToStep(step) {
    if (step < 1 || step > 4) return;
    this.currentStep = step;
    document.querySelectorAll('.checkout__step').forEach(el => el.classList.remove('active'));
    const stepEl = document.getElementById('step' + step);
    if (stepEl) stepEl.classList.add('active');
    document.querySelectorAll('.stepper__step').forEach((el, i) => {
      el.classList.remove('active', 'completed');
      if (i + 1 < step) el.classList.add('completed');
      if (i + 1 === step) el.classList.add('active');
    });
    const activePanel = document.querySelector('.checkout__step.active');
    if (activePanel) {
      activePanel.classList.remove('step-in');
      void activePanel.offsetWidth;
      activePanel.classList.add('step-in');
    }
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (step === 4) this.renderReview();
  },

  bindNav() {
    const bind = (id, step) => document.getElementById(id)?.addEventListener('click', () => this.goToStep(step));
    document.getElementById('toStep2')?.addEventListener('click', () => {
      if (!this.orderData.address) { UI.showToast('Yetkazib berish manzilini tanlang', 'error'); return; }
      this.goToStep(2);
    });
    document.getElementById('toStep3')?.addEventListener('click', () => {
      if (!this.orderData.delivery) { UI.showToast('Yetkazib berish usulini tanlang', 'error'); return; }
      this.goToStep(3);
    });
    document.getElementById('toStep4')?.addEventListener('click', () => {
      if (!this.orderData.payment) { UI.showToast("To'lov usulini tanlang", 'error'); return; }
      this.goToStep(4);
    });
    bind('backToStep1', 1); bind('backToStep2', 2); bind('backToStep3', 3);
    document.getElementById('saveAddrBtn')?.addEventListener('click', () => {
      const name = document.getElementById('addrName')?.value?.trim();
      const phone = document.getElementById('addrPhone')?.value?.trim();
      const city = document.getElementById('addrCity')?.value?.trim();
      const address = document.getElementById('addrAddress')?.value?.trim();
      if (!name || name.length < 3) {
        UI.showToast("Ism va familiyani to'liq kiriting (kamida 3 harf)", 'error');
        return;
      }
      const cleanPhone = (phone || '').replace(/[\s\(\)\-]/g, '');
      if (!cleanPhone || cleanPhone.length < 9) {
        UI.showToast("Telefon raqamini to'g'ri kiriting (+998 ...)", 'error');
        return;
      }
      if (!city || city.length < 2) {
        UI.showToast("Shahar yoki viloyatni kiriting", 'error');
        return;
      }
      if (!address || address.length < 5) {
        UI.showToast("Aniq ko'cha va uy manzilini kiriting", 'error');
        return;
      }
      this.orderData.address = Store.addAddress({ name, phone, city, address, isDefault: false });
      this.renderAddresses();
      UI.showToast("Manzil muvaffaqiyatli saqlandi", 'success');
      ['addrName','addrPhone','addrCity','addrAddress'].forEach(id => { const i = document.getElementById(id); if (i) i.value = ''; });
    });
    document.getElementById('placeOrderBtn')?.addEventListener('click', () => this.placeOrder());
  },

  renderAddresses() {
    const el = document.getElementById('addressList');
    if (!el) return;
    const addrs = Store.getAddresses();
    if (!this.orderData.address && addrs.length) this.orderData.address = addrs.find(a => a.isDefault) || addrs[0];
    if (!addrs.length) {
      el.innerHTML = '<p class="empty-hint">Saqlangan manzil yo‘q. Pastdagi formadan qo‘shing.</p>';
      return;
    }
    el.innerHTML = addrs.map(a => {
      const on = this.orderData.address?.id === a.id;
      return `<label class="choice-card${on ? ' selected' : ''}">
        <input type="radio" name="checkoutAddress" value="${escapeHtml(a.id)}" ${on ? 'checked' : ''}>
        <span class="choice-card__mark">${ICONS.check}</span>
        <div class="choice-card__body">
          <strong>${escapeHtml(a.name)}</strong>
          <p>${escapeHtml(a.phone)}</p>
          <p>${escapeHtml(a.city)}, ${escapeHtml(a.address)}</p>
        </div>
      </label>`;
    }).join('');

    el.querySelectorAll('input[name="checkoutAddress"]').forEach(inp => {
      inp.addEventListener('change', () => {
        this.orderData.address = addrs.find(a => a.id === inp.value);
        this.renderAddresses();
      });
    });
  },

  renderDelivery() {
    const el = document.getElementById('deliveryOptions');
    if (!el) return;
    const options = getDeliveryOptions();
    if (!this.orderData.delivery) this.orderData.delivery = options[0];
    el.innerHTML = options.map(d => {
      const on = this.orderData.delivery?.id === d.id;
      return `<label class="choice-card${on ? ' selected' : ''}">
        <input type="radio" name="checkoutDelivery" value="${escapeHtml(d.id)}" ${on ? 'checked' : ''}>
        <span class="choice-card__mark">${ICONS.check}</span>
        <div class="choice-card__body">
          <strong>${escapeHtml(d.name)}</strong>
          <p>${escapeHtml(d.days)}</p>
        </div>
        <strong class="choice-card__price">${d.price ? UI.formatPrice(d.price) : 'Bepul'}</strong>
      </label>`;
    }).join('');
    el.querySelectorAll('input[name="checkoutDelivery"]').forEach(inp => {
      inp.addEventListener('change', () => {
        const d = options.find(opt => String(opt.id) === String(inp.value));
        if (d) { this.orderData.delivery = d; this.orderData.deliveryCost = d.price; this.renderDelivery(); this.renderSummary(); }
      });
    });
  },

  renderPayment() {
    const el = document.getElementById('paymentOptions');
    if (!el) return;
    const methods = getPaymentMethods();
    if (!this.orderData.payment) this.orderData.payment = methods[0];
    el.innerHTML = methods.map(pm => {
      const on = this.orderData.payment?.id === pm.id;
      return `<label class="choice-card${on ? ' selected' : ''}">
        <input type="radio" name="checkoutPayment" value="${escapeHtml(pm.id)}" ${on ? 'checked' : ''}>
        <span class="choice-card__mark">${ICONS.check}</span>
        <div class="choice-card__body">
          <strong>${escapeHtml(pm.name)}</strong>
          <p>${escapeHtml(pm.description)}</p>
        </div>
      </label>`;
    }).join('');
    el.querySelectorAll('input[name="checkoutPayment"]').forEach(inp => {
      inp.addEventListener('change', () => {
        const pm = methods.find(m => String(m.id) === String(inp.value));
        if (pm) { this.orderData.payment = pm; this.renderPayment(); this.renderSummary(); }
      });
    });
  },

  renderSummary() {
    const { subtotal } = Store.getCartTotal();
    const promo = Store.getPromo();
    let discount = 0;
    let delivery = this.orderData.deliveryCost || 15000;
    if (promo) {
      if (promo.type === 'percent') discount = Math.round(subtotal * promo.value / 100);
      if (promo.type === 'freeShipping') delivery = 0;
    }
    const total = Math.max(0, subtotal - discount + delivery);
    const s = id => document.getElementById(id);
    if (s('checkoutSubtotal')) s('checkoutSubtotal').textContent = UI.formatPrice(subtotal);
    if (s('checkoutDiscount')) s('checkoutDiscount').textContent = discount ? '-' + UI.formatPrice(discount) : "0 so'm";
    if (s('checkoutDelivery')) s('checkoutDelivery').textContent = delivery ? UI.formatPrice(delivery) : 'Bepul';
    if (s('checkoutTotal')) s('checkoutTotal').textContent = UI.formatPrice(total);
    const itemsEl = document.getElementById('checkoutItems');
    if (itemsEl) {
      const allProducts = getProducts();
      itemsEl.innerHTML = Store.getCart().map(ci => {
        const p = allProducts.find(pr => pr.id === ci.productId); if (!p) return '';
        return `<div style="display:flex;gap:12px;padding:8px 0;border-bottom:1px solid var(--gray-100)"><img src="${sanitizeUrl(p.image)}" style="width:48px;height:60px;object-fit:cover;border-radius:6px"><div><p style="font-size:13px;font-weight:600">${escapeHtml(p.name)}</p><p style="font-size:12px;color:var(--gray-400)">${Number(ci.qty)} × ${UI.formatPrice(p.price)}</p></div></div>`;
      }).join('');
    }
  },

  renderReview() {
    const el = document.getElementById('orderReview');
    if (!el) return;
    const a = this.orderData.address;
    const d = this.orderData.delivery;
    const pm = this.orderData.payment;
    el.innerHTML = `
      <div style="display:grid;gap:16px">
        <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md)"><h4 style="display:flex;align-items:center;gap:8px;">${ICONS.mapPin} Manzil</h4><p style="margin-top:4px">${escapeHtml(a?.name)}, ${escapeHtml(a?.phone)}<br>${escapeHtml(a?.city)}, ${escapeHtml(a?.address)}</p></div>
        <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md)"><h4 style="display:flex;align-items:center;gap:8px;">${ICONS.truck} Yetkazib berish</h4><p style="margin-top:4px">${escapeHtml(d?.name)} — ${d?.price ? UI.formatPrice(d.price) : 'Bepul'} (${escapeHtml(d?.days)})</p></div>
        <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md)"><h4 style="display:flex;align-items:center;gap:8px;">${ICONS.creditCard} To'lov usuli</h4><p style="margin-top:4px;display:flex;align-items:center;gap:8px;">${mapPaymentIcon(pm?.icon)} ${escapeHtml(pm?.name)}</p></div>
      </div>`;
  },

  placeOrder() {
    if (this._placing) return;
    if (!this.orderData.address) { UI.showToast('Manzil tanlanmagan', 'error'); this.goToStep(1); return; }
    if (!this.orderData.delivery) { UI.showToast('Yetkazib berish usulini tanlang', 'error'); this.goToStep(2); return; }
    if (!this.orderData.payment) { UI.showToast("To'lov usulini tanlang", 'error'); this.goToStep(3); return; }
    if (!Store.getCart().length) { UI.showToast('Savat bo‘sh', 'error'); return; }
    this._placing = true;
    const btn = document.getElementById('placeOrderBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner" style="display:inline-block;width:20px;height:20px;border:3px solid var(--gray-200);border-top-color:white;border-radius:50%;animation:spin .6s linear infinite"></span> Yuklanmoqda...'; }
    setTimeout(() => {
      const order = Store.createOrder(this.orderData);
      this._placing = false;
      if (!order) { UI.showToast('Buyurtma yaratilmadi', 'error'); if (btn) { btn.disabled = false; btn.textContent = 'Buyurtmani tasdiqlash'; } return; }
      const main = document.querySelector('.checkout__layout');
      const stepper = document.querySelector('.stepper');
      const success = document.getElementById('orderSuccess');
      const orderNum = document.getElementById('orderNumber');
      if (main) main.style.display = 'none';
      if (stepper) stepper.style.display = 'none';
      if (success) success.style.display = '';
      if (orderNum) orderNum.textContent = '#' + order.id;
      success?.classList.add('is-pop');
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 72,
          origin: { y: 0.62 },
          colors: ['#1b4332', '#c85a17', '#2d6a4f', '#d8f3dc', '#fde8d0']
        });
      }
      const copyBtn = document.getElementById('copyOrderId');
      if (copyBtn && !copyBtn.dataset.bound) {
        copyBtn.dataset.bound = '1';
        copyBtn.addEventListener('click', () => {
          const text = (orderNum?.textContent || order.id).replace(/^#/, '');
          if (navigator.clipboard) navigator.clipboard.writeText(text);
          UI.showToast('Buyurtma raqami nusxa olindi');
        });
      }
    }, 1200);
  }
};

// Event listener for cart change (auto rerender CartPage if on cart page)
if (typeof window !== 'undefined') {
  window.addEventListener('booksaw:cartchange', () => {
    if (document?.body?.dataset?.page === 'cart' && typeof CartPage !== 'undefined' && CartPage.render) {
      CartPage.render();
    }
  });

  window.ProductDetail = ProductDetail;
  window.CartPage = CartPage;
  window.Checkout = Checkout;
  window.openLightbox = openLightbox;
}

export {
  ProductDetail,
  CartPage,
  Checkout,
  openLightbox
};
