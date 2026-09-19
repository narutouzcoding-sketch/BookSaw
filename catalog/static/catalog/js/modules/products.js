/**
 * modules/products.js
 * Mahsulot kartochkasi, qidiruv/filtr, slaydlar, karusel navigatsiyasi
 * va katalog sahifasi logikasi.
 */
import { escapeHtml, sanitizeUrl, highlightMatch } from './escape.js';
import { ICONS, Store } from './core.js';
import { UI, renderStars, requireAuth } from './ui.js';

const getProducts = () => (typeof window !== 'undefined' && window.PRODUCTS) || (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []);
const getCategories = () => (typeof window !== 'undefined' && window.CATEGORIES) || (typeof CATEGORIES !== 'undefined' ? CATEGORIES : []);
const getBanners = () => (typeof window !== 'undefined' && window.BANNERS) || (typeof BANNERS !== 'undefined' ? BANNERS : []);

/* ========================================================================
   SEARCH & FILTER
   ======================================================================== */
const Search = {
  query: '',
  filters: { categories: [], minPrice: 0, maxPrice: Infinity, ratings: [], inStock: false },
  sortBy: 'popular',
  viewMode: 'grid',

  search(query) {
    let results = [...getProducts()];
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
      );
    }
    return this.sort(this.applyFilters(results));
  },

  applyFilters(products) {
    return products.filter(p => {
      if (this.filters.categories.length && !this.filters.categories.includes(p.categoryId)) return false;
      if (p.price < this.filters.minPrice || p.price > this.filters.maxPrice) return false;
      if (this.filters.ratings.length && !this.filters.ratings.some(r => p.rating >= r)) return false;
      if (this.filters.inStock && !p.inStock) return false;
      return true;
    });
  },

  sort(products) {
    const c = [...products];
    switch (this.sortBy) {
      case 'price-asc': return c.sort((a, b) => a.price - b.price);
      case 'price-desc': return c.sort((a, b) => b.price - a.price);
      case 'newest': return c.sort((a, b) => b.year - a.year);
      case 'rating': return c.sort((a, b) => b.rating - a.rating);
      default: return c.sort((a, b) => b.sold - a.sold);
    }
  },

  renderResults(products, container) {
    if (!container) return;
    if (!products.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state__icon">${ICONS.search}</div><h3 class="empty-state__title">Hech narsa topilmadi</h3><p class="empty-state__text">Boshqa kalit so'z bilan qidirib ko'ring</p></div>`;
      return;
    }
    container.innerHTML = products.map(p => renderProductCard(p, this.viewMode)).join('');
  },

  initAutocomplete(inputEl, suggestionsEl) {
    if (!inputEl || !suggestionsEl) return;
    let timer;
    let selectedIndex = -1;

    const updateSelection = (items) => {
      items.forEach((item, idx) => {
        if (idx === selectedIndex) {
          item.classList.add('is-selected');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('is-selected');
        }
      });
    };

    inputEl.addEventListener('input', () => {
      clearTimeout(timer);
      selectedIndex = -1;
      const val = inputEl.value.trim();
      if (val.length < 2) {
        suggestionsEl.classList.remove('active');
        return;
      }
      timer = setTimeout(() => {
        const results = this.search(val).slice(0, 6);
        if (results.length) {
          suggestionsEl.innerHTML = `
            <div class="search-suggestions__list">
              ${results.map(p => `
                <a href="book_detail.html?id=${encodeURIComponent(p.id)}" class="search-suggestions__item" data-id="${escapeHtml(p.id)}" style="display:flex;gap:12px;padding:10px 14px;align-items:center;text-decoration:none;color:inherit;border-radius:8px;margin:2px 4px;transition:background 0.15s ease;">
                  <img src="${sanitizeUrl(p.image)}" alt="" style="width:40px;height:52px;object-fit:cover;border-radius:4px 8px 8px 4px;box-shadow:-2px 4px 10px rgba(0,0,0,0.18);flex-shrink:0;">
                  <div style="flex:1;min-width:0;">
                    <p style="font-weight:600;font-size:14px;line-height:1.3;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                      ${highlightMatch(p.name, val)}
                    </p>
                    <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--gray-500);margin-top:2px;">
                      <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${highlightMatch(p.author, val)}</span>
                      <span style="font-size:10px;padding:1px 6px;border-radius:4px;background:var(--bg-hover, rgba(0,0,0,0.05));color:var(--gray-500);">${escapeHtml(p.categoryName)}</span>
                    </div>
                    <div style="font-size:13px;font-weight:700;color:var(--primary);margin-top:2px;">
                      ${UI.formatPrice(p.price)}
                      ${p.oldPrice && p.oldPrice > p.price ? `<span style="font-size:11px;color:var(--gray-400);text-decoration:line-through;margin-left:6px;font-weight:400;">${UI.formatPrice(p.oldPrice)}</span>` : ''}
                    </div>
                  </div>
                </a>`).join('')}
            </div>
            <div style="padding:8px 14px;border-top:1px solid var(--border-color, rgba(0,0,0,0.08));display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--gray-400);background:rgba(0,0,0,0.02);">
              <span><kbd style="padding:2px 5px;background:var(--bg-hover, #eee);border-radius:3px;font-size:10px;">↵ Enter</kbd> to‘liq qidiruv</span>
              <span>${results.length} ta natija</span>
            </div>`;
        } else {
          suggestionsEl.innerHTML = `
            <div style="padding:24px 16px;color:var(--gray-400);text-align:center;">
              <div style="font-size:24px;margin-bottom:6px;opacity:0.6;">🔍</div>
              <p style="font-weight:600;font-size:13px;margin:0 0 2px;">Natija topilmadi</p>
              <p style="font-size:12px;margin:0;opacity:0.8;">Boshqa kalit so'z bilan sinab ko'ring</p>
            </div>`;
        }
        suggestionsEl.classList.add('active');
      }, 250);
    });

    // Keyboard navigation within search input
    inputEl.addEventListener('keydown', e => {
      const items = suggestionsEl.querySelectorAll('.search-suggestions__item');
      if (!suggestionsEl.classList.contains('active') || !items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelection(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelection(items);
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && items[selectedIndex]) {
          e.preventDefault();
          items[selectedIndex].click();
        }
      } else if (e.key === 'Escape') {
        suggestionsEl.classList.remove('active');
        selectedIndex = -1;
      }
    });

    document.addEventListener('click', e => {
      // 0. HIMOYALANGAN SAHIFALARGA BO'LGAN HAVOLALAR
      const protectedLink = e.target.closest('a[href*="cart.html"], a[href*="wishlist.html"], a[href*="checkout.html"], a[href*="profile.html"], a[href*="orders.html"]');
      if (protectedLink && !Store.isLoggedIn()) {
        e.preventDefault();
        e.stopPropagation();
        const href = protectedLink.getAttribute('href') || 'cart.html';
        const pageName = href.includes('cart') ? 'Savatni' :
                         href.includes('wishlist') ? "Sevimlilar ro'yxatini" :
                         href.includes('checkout') ? 'Buyurtma berish sahifasini' :
                         href.includes('profile') ? 'Profilingizni' : 'Buyurtmalaringizni';
        UI.showToast(`${pageName} ko'rish uchun avval hisobingizga kiring!`, "info", 2500);
        setTimeout(() => {
          location.href = `login.html?redirect=${encodeURIComponent(href)}`;
        }, 400);
        return;
      }

      // 1. SEVIMLILAR (WISHLIST) TUGMASI BOSILGANDA
      const wlBtn = e.target.closest('.product-card__wishlist, .quick-view__wishlist-btn');
      if (wlBtn) {
        e.preventDefault();
        e.stopPropagation();

        if (!requireAuth("Sevimlilarga qo'shish uchun avval hisobingizga kiring!")) return;

        const id = +wlBtn.dataset.id;
        const res = Store.toggleWishlist(id);
        document.querySelectorAll(`.product-card__wishlist[data-id="${id}"], .quick-view__wishlist-btn[data-id="${id}"]`).forEach(btn => {
          btn.classList.toggle('active', res.added);
          btn.innerHTML = res.added ? ICONS.heartFilled : ICONS.heart;
          btn.style.transform = 'scale(1.25)';
          setTimeout(() => btn.style.transform = '', 300);
        });
        UI.showToast(res.added ? "Sevimlilarga qo'shildi" : "Sevimlilardan o'chirildi");
        if (document.body?.dataset.page === 'wishlist' && !res.added) window.WishlistPage?.init?.();
        if (document.body?.dataset.page === 'profile') window.ProfilePage?.renderWishlist?.();
        return;
      }

      // 2. SAVATGA QO'SHISH TUGMASI BOSILGANDA
      const cartBtn = e.target.closest('.add-to-cart-btn');
      if (cartBtn) {
        e.preventDefault();
        e.stopPropagation();

        if (!requireAuth("Kitobni savatga qo'shish uchun avval hisobingizga kiring!")) return;

        if (cartBtn.disabled) return;
        const id = +cartBtn.dataset.id;
        const product = getProducts().find(pr => pr.id === id);
        if (product && !product.inStock) { UI.showToast('Mahsulot tugagan', 'error'); return; }
        Store.addToCart(id);
        UI.showToast("Savatga qo'shildi!");
        if (window.Animations?.flyToCart) {
          window.Animations.flyToCart(cartBtn);
        }
        return;
      }

      // Quick view
      const qvBtn = e.target.closest('.quick-view-btn');
      if (qvBtn) {
        e.preventDefault();
        e.stopPropagation();
        UI.showQuickView(+qvBtn.dataset.id);
        return;
      }

      // Card navigation: 1-click navigation
      const card = e.target.closest('.product-card[data-href], .blog-card[data-href]');
      if (card) {
        if (e.target.closest('button, input, select, label')) return;
        const href = card.dataset.href;
        if (!href) return;
        const img = card.querySelector('.product-card__image--primary');
        if (img && href.includes('book_detail')) {
          document.querySelectorAll('.product-card__image--primary').forEach(i => { i.style.viewTransitionName = ''; });
          const id = new URL(href, location.href).searchParams.get('id');
          if (id) img.style.viewTransitionName = 'book-' + id;
        }
        location.href = href;
      }
    });

    // Global keyboard shortcut: Ctrl+K, Cmd+K or / to focus search
    if (typeof window !== 'undefined' && !window._searchShortcutBound) {
      window._searchShortcutBound = true;
      document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          inputEl.focus();
          inputEl.select();
        } else if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
          e.preventDefault();
          inputEl.focus();
        }
      });
    }
  }
};

/* ========================================================================
   PRODUCT CARD RENDERER
   ======================================================================== */
function renderProductCard(product, mode = 'grid') {
  const inWL = Store.isInWishlist(product.id);
  const listCls = mode === 'list' ? ' product-card--list' : '';
  const outOverlay = !product.inStock ? '<div class="product-card__out-overlay"><span>Tugagan</span></div>' : '';

  let badgeHtml = '';
  if (product.discount) badgeHtml += `<span class="badge badge-sale">-${Number(product.discount)}%</span>`;
  if (product.badge === 'new') badgeHtml += '<span class="badge badge-new">Yangi</span>';
  if (product.badge === 'bestseller') badgeHtml += '<span class="badge badge-bestseller">Bestseller</span>';

  const safeName = escapeHtml(product.name);
  const safeAuthor = escapeHtml(product.author);
  const safeCat = escapeHtml(product.categoryName);
  const safeImg = sanitizeUrl(product.image);
  const safeImg2 = sanitizeUrl(product.image2 || product.image);
  const safeId = escapeHtml(product.id);
  const encodedId = encodeURIComponent(product.id);

  return `<div class="product-card${listCls}${product.inStock ? '' : ' is-out'}" data-href="book_detail.html?id=${encodedId}" role="link" tabindex="0">
    <a href="book_detail.html?id=${encodedId}" class="product-card__image-wrap" aria-label="${safeName}">
      <img class="product-card__image product-card__image--primary" src="${safeImg}" alt="${safeName}" loading="lazy" draggable="false">
      <img class="product-card__image product-card__image--hover" src="${safeImg2}" alt="" loading="lazy" draggable="false">
      ${outOverlay}
      <div class="product-card__badges">${badgeHtml}</div>
      <button type="button" class="product-card__wishlist${inWL ? ' active' : ''}" data-id="${safeId}" title="Sevimlilarga">${inWL ? ICONS.heartFilled : ICONS.heart}</button>
    </a>
    <div class="product-card__body">
      <div class="product-card__category">${safeCat}</div>
      <a href="book_detail.html?id=${encodedId}" class="product-card__title">${safeName}</a>
      <p class="product-card__author">${safeAuthor}</p>
      <div class="product-card__rating"><span class="stars">${renderStars(product.rating)}</span>${product.reviewCount ? ` <span>(${Number(product.reviewCount)})</span>` : ''}</div>
      <div class="product-card__price">
        <span class="product-card__price-current">${UI.formatPrice(product.price)}</span>
        ${product.oldPrice && product.oldPrice > product.price ? `<span class="product-card__price-old">${UI.formatPrice(product.oldPrice)}</span>` : ''}
      </div>
      <div class="product-card__cta">
        <button type="button" class="btn btn-primary btn-sm add-to-cart-btn" data-id="${safeId}"${!product.inStock ? ' disabled' : ''}>${product.inStock ? `${ICONS.cart} Savatga` : 'Tugagan'}</button>
        <button type="button" class="btn btn-secondary btn-sm quick-view-btn" data-id="${safeId}">Ko'rish</button>
      </div>
    </div>
  </div>`;
}

/* ========================================================================
   HERO SLIDER
   ======================================================================== */
const Slider = {
  current: 0,
  interval: null,
  total: 0,
  dragging: false,

  init() {
    const slidesEl = document.getElementById('heroSlides');
    const dotsEl = document.getElementById('heroDots');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    const banners = getBanners();
    if (!slidesEl || !banners.length) return;
    this.total = banners.length;

    slidesEl.innerHTML = banners.map(b => `
      <div class="hero__slide">
        <img src="${sanitizeUrl(b.image)}" alt="${escapeHtml(b.title)}">
        <div class="hero__content">
          <h2>${escapeHtml(b.title)}</h2>
          <p>${escapeHtml(b.subtitle)}</p>
          <a href="${sanitizeUrl(b.link)}" class="btn btn-primary">${escapeHtml(b.buttonText)}</a>
        </div>
      </div>`).join('');

    if (dotsEl) dotsEl.innerHTML = banners.map((_, i) => `<button class="hero__dot${i === 0 ? ' active' : ''}" data-idx="${i}"></button>`).join('');

    if (prevBtn) {
      prevBtn.innerHTML = ICONS.chevronLeft;
      prevBtn.onclick = () => this.go(this.current - 1);
    }
    if (nextBtn) {
      nextBtn.innerHTML = ICONS.chevronRight;
      nextBtn.onclick = () => this.go(this.current + 1);
    }
    if (dotsEl) dotsEl.addEventListener('click', e => { const idx = e.target.dataset.idx; if (idx != null) this.go(+idx); });

    const hero = slidesEl.closest('.hero');
    if (hero) {
      hero.onmouseenter = () => this.stop();
      hero.onmouseleave = () => { if (!this.dragging) this.play(); };
    }
    this.layout();
    window.addEventListener('resize', () => { if (!this.dragging) this.layout(); });
    requestAnimationFrame(() => this.layout());
    this.bindDrag();
    this.play();
  },

  bindDrag() {
    const slidesEl = document.getElementById('heroSlides');
    const hero = slidesEl?.closest('.hero');
    if (!hero || hero.dataset.dragBound) return;
    hero.dataset.dragBound = '1';
    let startX = 0, startT = 0, dx = 0, w = 0, moved = false;
    const width = () => Math.round(hero.getBoundingClientRect().width);
    hero.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      if (e.target.closest('a, button')) return;
      this.dragging = true;
      moved = false;
      dx = 0;
      this.stop();
      w = width();
      startX = e.clientX;
      startT = -this.current * w;
      slidesEl.style.transition = 'none';
      hero.classList.add('is-dragging');
      try { hero.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    });
    hero.addEventListener('pointermove', e => {
      if (!this.dragging) return;
      dx = e.clientX - startX;
      if (Math.abs(dx) > 6) moved = true;
      slidesEl.style.transform = `translate3d(${startT + dx}px,0,0)`;
    });
    const end = () => {
      if (!this.dragging) return;
      this.dragging = false;
      hero.classList.remove('is-dragging');
      slidesEl.style.transition = '';
      if (Math.abs(dx) > Math.max(48, w * 0.16)) this.go(this.current + (dx < 0 ? 1 : -1));
      else this.go(this.current);
      dx = 0;
      this.play();
    };
    hero.addEventListener('pointerup', end);
    hero.addEventListener('pointercancel', end);
    hero.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  },

  layout() {
    const slidesEl = document.getElementById('heroSlides');
    if (!slidesEl || this.dragging) return;
    const hero = slidesEl.closest('.hero') || slidesEl.parentElement;
    const w = Math.round(hero.getBoundingClientRect().width);
    if (!w) return;
    slidesEl.style.width = (this.total * w) + 'px';
    slidesEl.querySelectorAll('.hero__slide').forEach(s => {
      s.style.flex = `0 0 ${w}px`;
      s.style.width = w + 'px';
      s.style.minWidth = w + 'px';
      s.style.maxWidth = w + 'px';
    });
    slidesEl.style.transform = `translate3d(-${this.current * w}px,0,0)`;
  },

  go(idx) {
    if (idx >= this.total) idx = 0; if (idx < 0) idx = this.total - 1;
    this.current = idx;
    this.layout();
    document.querySelectorAll('.hero__dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  },

  play() { this.stop(); this.interval = setInterval(() => this.go(this.current + 1), 5000); },
  stop() { clearInterval(this.interval); }
};

/* ========================================================================
   CAROUSEL NAVIGATION ARROWS
   ======================================================================== */
function attachCarouselArrows(el) {
  if (!el || el.dataset.arrowsBound) return;
  el.dataset.arrowsBound = '1';
  let wrap = el.parentElement;
  if (!wrap || !wrap.classList.contains('carousel-wrap')) {
    wrap = document.createElement('div');
    wrap.className = 'carousel-wrap';
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
  }
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'carousel-nav-btn prev';
  prevBtn.setAttribute('aria-label', 'Oldingi');
  prevBtn.innerHTML = ICONS.chevronLeft;

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'carousel-nav-btn next';
  nextBtn.setAttribute('aria-label', 'Keyingi');
  nextBtn.innerHTML = ICONS.chevronRight;

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    el.scrollBy({ left: -320, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    el.scrollBy({ left: 320, behavior: 'smooth' });
  });

  wrap.appendChild(prevBtn);
  wrap.appendChild(nextBtn);

  const updateNavState = () => {
    if (window.getComputedStyle?.(el).display === 'grid') {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      return;
    }
    const hasOverflow = el.scrollWidth > el.clientWidth + 28;
    prevBtn.style.display = hasOverflow ? '' : 'none';
    nextBtn.style.display = hasOverflow ? '' : 'none';
    if (!hasOverflow) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    prevBtn.disabled = el.scrollLeft <= 4;
    nextBtn.disabled = el.scrollLeft >= maxScroll - 4;
  };

  el.addEventListener('scroll', updateNavState, { passive: true });
  window.addEventListener('resize', updateNavState);
  if (typeof window !== 'undefined' && window.ResizeObserver) {
    new ResizeObserver(updateNavState).observe(el);
  }
  requestAnimationFrame(updateNavState);
  setTimeout(updateNavState, 300);
  updateNavState();
}

/* ========================================================================
   DRAG / SWIPE SCROLL ENGINE
   ======================================================================== */
function enableDragScroll(el) {
  if (!el || el.dataset.dragBound) return;
  el.dataset.dragBound = '1';

  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let hasMoved = false;
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;
  let momentumID = null;

  const cancelMomentum = () => {
    if (momentumID) {
      cancelAnimationFrame(momentumID);
      momentumID = null;
    }
  };

  const beginMomentum = () => {
    cancelMomentum();
    const step = () => {
      if (Math.abs(velocity) > 0.4) {
        el.scrollLeft += velocity;
        velocity *= 0.92;
        momentumID = requestAnimationFrame(step);
      }
    };
    momentumID = requestAnimationFrame(step);
  };

  el.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, input, select, textarea, .product-card__wishlist, .add-to-cart-btn, .quick-view-btn')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    cancelMomentum();
    isDown = true;
    hasMoved = false;
    startX = e.clientX;
    scrollStart = el.scrollLeft;
    lastX = e.clientX;
    lastTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    velocity = 0;
  });

  el.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const deltaX = e.clientX - startX;

    if (!hasMoved && Math.abs(deltaX) > 12) {
      hasMoved = true;
      el.classList.add('is-dragging');
      try { el.setPointerCapture(e.pointerId); } catch {}
    }

    if (hasMoved) {
      e.preventDefault();
      el.scrollLeft = scrollStart - deltaX;
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const dt = now - lastTime || 16;
      const dx = e.clientX - lastX;
      velocity = -(dx / dt) * 14;
      lastX = e.clientX;
      lastTime = now;
    }
  });

  const onPointerUp = (e) => {
    if (!isDown) return;
    isDown = false;
    try { el.releasePointerCapture(e.pointerId); } catch {}
    el.classList.remove('is-dragging');

    if (hasMoved) {
      beginMomentum();
      setTimeout(() => { hasMoved = false; }, 60);
    }
  };

  el.addEventListener('pointerup', onPointerUp);
  el.addEventListener('pointercancel', onPointerUp);

  // Prevent link navigation if user dragged/swiped horizontally,
  // but ensure single clicks immediately open the card on 1st click!
  el.addEventListener('click', (e) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      hasMoved = false;
      return;
    }
    if (e.target.closest('button, input, select, label, .product-card__wishlist, .add-to-cart-btn, .quick-view-btn')) {
      return;
    }
    const card = e.target.closest('.product-card, .category-card');
    if (card) {
      const href = card.dataset.href || card.getAttribute('href');
      if (href) {
        window.location.href = href;
      }
    }
  }, true);
}

/* ========================================================================
   CATALOG PAGE
   ======================================================================== */
function initCatalogPage() {
  const params = new URLSearchParams(location.search);
  const catId = parseInt(params.get('cat'), 10);
  const q = params.get('q') || '';
  const sale = params.get('sale') === 'true';
  const gift = params.get('gift') === 'true';
  const sort = params.get('sort') || 'popular';

  const main = document.getElementById('mainContent') || document.querySelector('main');
  if (main) {
    Array.from(main.children).forEach(el => {
      if (el.id !== 'catalogView') el.style.display = 'none';
    });
  }

  document.querySelectorAll('.hero, .home-hero-wrap, .home-section, .home-content > section, body[data-page="home"] > section, .trust-strip, #trustStrip').forEach(el => {
    el.style.display = 'none';
  });

  let wrap = document.getElementById('catalogView');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'catalogView';
    wrap.className = 'container';
    if (main) {
      main.prepend(wrap);
    } else {
      const footer = document.querySelector('.footer');
      if (footer) footer.parentNode.insertBefore(wrap, footer);
      else document.body.appendChild(wrap);
    }
  } else if (main && wrap.parentNode !== main) {
    main.prepend(wrap);
  }
  wrap.style.display = '';

  Search.sortBy = sort;
  Search.query = q;
  Search.filters = { categories: Number.isFinite(catId) ? [catId] : [], minPrice: 0, maxPrice: Infinity, ratings: [], inStock: false };

  const categories = getCategories();
  const cat = Number.isFinite(catId) ? categories.find(c => c.id === catId) : null;
  const title = q ? `Qidiruv: “${q}”` : sale ? 'Chegirmadagi kitoblar' : gift ? 'Sovg‘a to‘plamlari' : cat ? cat.name : 'Barcha kitoblar';

  wrap.innerHTML = `
    <nav class="breadcrumb" style="margin-bottom:20px; padding:0;">
      <a href="book_list.html">Bosh sahifa</a> <span>/</span>
      ${cat ? `<a href="categories.html">Kategoriyalar</a> <span>/</span> <span>${escapeHtml(cat.name)}</span>` : `<span>${escapeHtml(title)}</span>`}
    </nav>
    <div class="catalog-toolbar">
      <h1 class="section-title" style="margin:0">${escapeHtml(title)}</h1>
      <button type="button" class="btn btn-secondary btn-sm filter-mobile-btn" id="openFilters">${ICONS.filter} Filtr</button>
    </div>
    <div class="catalog-layout">
      <aside class="filter-sidebar" id="filterSidebar">
        <div class="mobile-filter-header" style="display:none" id="filterMobileHeader">
          <strong>Filtrlar</strong>
          <button type="button" class="mobile-filter-close" id="closeFilters">${ICONS.x}</button>
        </div>
        <div class="filter-section">
          <h4 class="filter-section__title">Kategoriya</h4>
          <div class="filter-section__content" id="filterCats"></div>
        </div>
        <div class="filter-section">
          <h4 class="filter-section__title">Narx</h4>
          <div class="price-inputs">
            <input type="number" id="minPrice" placeholder="Dan" min="0">
            <input type="number" id="maxPrice" placeholder="Gacha" min="0">
          </div>
        </div>
        <div class="filter-section">
          <h4 class="filter-section__title">Reyting</h4>
          <label class="filter-checkbox"><input type="checkbox" data-rating="4"> 4+ yulduz</label>
          <label class="filter-checkbox"><input type="checkbox" data-rating="5"> 5 yulduz</label>
        </div>
        <div class="filter-section">
          <label class="filter-checkbox"><input type="checkbox" id="filterStock"> Faqat mavjudlari</label>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" id="resetFilters" style="width:100%">Tozalash</button>
      </aside>
      <div class="catalog-content">
        <div class="listing-controls">
          <div class="listing-controls__results" id="catalogCount"></div>
          <div class="listing-controls__actions">
            <select class="sort-select" id="catalogSort">
              <option value="popular"${sort === 'popular' ? ' selected' : ''}>Ommabop</option>
              <option value="newest"${sort === 'newest' ? ' selected' : ''}>Yangi</option>
              <option value="price-asc"${sort === 'price-asc' ? ' selected' : ''}>Arzon</option>
              <option value="price-desc"${sort === 'price-desc' ? ' selected' : ''}>Qimmat</option>
              <option value="rating"${sort === 'rating' ? ' selected' : ''}>Reyting</option>
            </select>
            <div class="view-toggle">
              <button type="button" class="view-toggle__btn active" data-view="grid" title="Katak">${ICONS.grid}</button>
              <button type="button" class="view-toggle__btn" data-view="list" title="Ro'yxat">${ICONS.orders}</button>
            </div>
          </div>
        </div>
        <div id="catalogGrid" class="product-grid"></div>
      </div>
    </div>
    <div class="mobile-filter-overlay" id="filterOverlay"></div>
  `;

  const catsEl = document.getElementById('filterCats');
  if (catsEl) {
    catsEl.innerHTML = categories.map(c => `
      <label class="filter-checkbox">
        <input type="checkbox" data-cat="${escapeHtml(c.id)}"${c.id === catId ? ' checked' : ''}>
        ${escapeHtml(c.name)} <span class="count">${Number(c.count)}</span>
      </label>`).join('');
  }

  const grid = document.getElementById('catalogGrid');
  const countEl = document.getElementById('catalogCount');

  const apply = () => {
    const checked = [...document.querySelectorAll('#filterCats input:checked')].map(i => +i.dataset.cat);
    Search.filters.categories = checked;
    Search.filters.minPrice = parseInt(document.getElementById('minPrice')?.value, 10) || 0;
    Search.filters.maxPrice = parseInt(document.getElementById('maxPrice')?.value, 10) || Infinity;
    Search.filters.ratings = [...document.querySelectorAll('[data-rating]:checked')].map(i => +i.dataset.rating);
    Search.filters.inStock = !!document.getElementById('filterStock')?.checked;
    Search.sortBy = document.getElementById('catalogSort')?.value || 'popular';
    let products = Search.search(q);
    if (sale) products = products.filter(p => p.discount > 0);
    if (gift) products = products.filter(p => p.badge === 'bestseller' || p.discount > 0);
    const pageSize = 8;
    let page = parseInt(wrap.dataset.page, 10) || 1;
    const pages = Math.max(1, Math.ceil(products.length / pageSize));
    if (page > pages) page = pages;
    wrap.dataset.page = String(page);
    const slice = products.slice((page - 1) * pageSize, page * pageSize);
    if (countEl) countEl.textContent = `${products.length} ta kitob topildi`;
    Search.renderResults(slice, grid);
    let pager = document.getElementById('catalogPager');
    if (!pager) {
      pager = document.createElement('div');
      pager.id = 'catalogPager';
      pager.className = 'pager';
      grid.after(pager);
    }
    pager.innerHTML = pages < 2 ? '' : Array.from({ length: pages }, (_, i) =>
      `<button type="button" class="pager__btn${i + 1 === page ? ' is-on' : ''}" data-page="${i + 1}">${i + 1}</button>`
    ).join('');
    let recBlock = document.getElementById('catalogRecommendations');
    const allProducts = getProducts();
    if (products.length < 3 && allProducts.length) {
      if (!recBlock) {
        recBlock = document.createElement('div');
        recBlock.id = 'catalogRecommendations';
        recBlock.className = 'catalog-recommendations';
        recBlock.style.marginTop = '40px';
        pager.after(recBlock);
      }
      const recItems = allProducts.filter(p => !products.some(pr => pr.id === p.id)).slice(0, 4);
      recBlock.innerHTML = `
        <div class="section-header" style="margin-bottom:16px;">
          <h3 class="section-title" style="font-size:1.25rem;">Tavsiya etilgan boshqa sara kitoblar</h3>
        </div>
        <div class="product-grid">${recItems.map(p => renderProductCard(p)).join('')}</div>
      `;
    } else if (recBlock) {
      recBlock.remove();
    }
    pager.onclick = e => {
      const b = e.target.closest('[data-page]');
      if (!b) return;
      wrap.dataset.page = b.dataset.page;
      apply();
      wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.Animations?.initScrollReveal) {
        window.Animations.initScrollReveal();
      }
    }, 50);
  };

  wrap.addEventListener('change', e => {
    if (e.target.closest('#filterSidebar') || e.target.id === 'catalogSort') {
      wrap.dataset.page = '1';
      apply();
    }
  });
  document.getElementById('minPrice')?.addEventListener('change', apply);
  document.getElementById('maxPrice')?.addEventListener('change', apply);
  document.getElementById('resetFilters')?.addEventListener('click', () => {
    wrap.querySelectorAll('#filterSidebar input[type="checkbox"]').forEach(i => { i.checked = false; });
    const min = document.getElementById('minPrice');
    const max = document.getElementById('maxPrice');
    if (min) min.value = '';
    if (max) max.value = '';
    wrap.dataset.page = '1';
    apply();
  });
  wrap.querySelectorAll('.view-toggle__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      wrap.querySelectorAll('.view-toggle__btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Search.viewMode = btn.dataset.view;
      grid.classList.toggle('product-grid--list', Search.viewMode === 'list');
      apply();
    });
  });

  const sidebar = document.getElementById('filterSidebar');
  const overlay = document.getElementById('filterOverlay');
  const header = document.getElementById('filterMobileHeader');
  const open = () => {
    sidebar?.classList.add('is-open');
    overlay?.classList.add('active');
    if (header) header.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    sidebar?.classList.remove('is-open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };
  document.getElementById('openFilters')?.addEventListener('click', open);
  document.getElementById('closeFilters')?.addEventListener('click', close);
  overlay?.addEventListener('click', close);

  apply();
}

/* ========================================================================
   CATEGORIES PAGE
   ======================================================================== */
function initCategoriesPage() {
  const grid = document.getElementById('categoriesGrid');
  const categories = getCategories();
  if (!grid || !categories.length) return;
  grid.innerHTML = categories.map(c => `
    <a href="book_list.html?cat=${encodeURIComponent(c.id)}" class="category-page-card">
      <div class="category-page-card__image"><img src="${sanitizeUrl(c.image)}" alt="${escapeHtml(c.name)}" draggable="false"></div>
      <div class="category-page-card__body">
        <h3>${escapeHtml(c.name)}</h3>
        <p>${Number(c.count)} ta kitob</p>
      </div>
    </a>`).join('');
}

const Catalog = {
  init: initCatalogPage,
  initCategories: initCategoriesPage
};

// Global / Window binding
if (typeof window !== 'undefined') {
  window.Search = Search;
  window.Catalog = Catalog;
  window.renderProductCard = renderProductCard;
  window.Slider = Slider;
  window.enableDragScroll = enableDragScroll;
  window.attachCarouselArrows = attachCarouselArrows;
  window.initCatalogPage = initCatalogPage;
  window.initCategoriesPage = initCategoriesPage;
}

export {
  Search,
  Catalog,
  renderProductCard,
  Slider,
  enableDragScroll,
  attachCarouselArrows,
  initCatalogPage,
  initCategoriesPage
};
