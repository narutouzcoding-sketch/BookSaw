/**
 * main.js — BooksCatalog Marketplace
 * To'liq biznes-mantiq: Store, UI, Qidiruv, Filtr, Slider, Detail, Cart, Checkout, Auth, Profile, Orders, Wishlist, Animatsiyalar
 * Barcha sahifalar uchun universal JS — data-page atributi orqali tegishli init funksiya chaqiriladi.
 */
import { escapeHtml, sanitizeUrl, highlightMatch } from './modules/escape.js';

import { ICONS, Theme, Store } from './modules/core.js';

import {
  UI,
  Animations,
  runBinEatAnimation,
  requireAuth,
  createBinButtonHtml,
  renderStars,
  mapDeliveryIcon,
  mapPaymentIcon
} from './modules/ui.js';

import {
  Search,
  Catalog,
  renderProductCard,
  Slider,
  enableDragScroll,
  attachCarouselArrows,
  initCatalogPage,
  initCategoriesPage
} from './modules/products.js';

import {
  ProductDetail,
  CartPage,
  Checkout,
  openLightbox
} from './modules/commerce.js';

import {
  Auth,
  ProfilePage,
  OrdersPage,
  WishlistPage
} from './modules/account.js';
/* ========================================================================
   14. PAGE INITIALIZATION
   ======================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  Theme.mount();
  initHeader();
  UI.updateBadges();
  UI.checkOAuthRedirect();
  initBottomNav();

  const page = document.body.dataset.page;
  const params = new URLSearchParams(location.search);
  const catalogQuery = params.has('cat') || params.has('q') || params.has('sale') || params.has('all') || params.has('sort') || params.has('gift');

  try {
    if (page === 'home' && catalogQuery) {
      document.body.dataset.page = 'catalog';
      initCatalogPage();
      initBottomNav();
    } else {
      switch (page) {
        case 'home': initHomePage(); break;
        case 'catalog': initCatalogPage(); break;
        case 'detail': ProductDetail.init(); break;
        case 'cart': CartPage.init(); break;
        case 'checkout': Checkout.init(); break;
        case 'login':
        case 'register':
          Auth.initLogin();
          Auth.initRegister();
          Auth.init3DFlip();
          break;
        case 'profile': ProfilePage.init(); break;
        case 'orders': OrdersPage.init(); break;
        case 'wishlist': WishlistPage.init(); break;
        case 'categories': initCategoriesPage(); break;
        case 'store': initStorePage(); break;
        case 'info': initInfoPage(); break;
        case '404': init404Page(); break;
      }
    }
  } catch (err) {
    console.error('Page init error:', err);
  }

  Animations.initScrollReveal();
  enhanceChrome();
});

// BFCache (Back-Forward Cache): Brauzer orqaga/oldinga tugmalari bosilganda savat va nishonlarni yangilash
window.addEventListener('pageshow', () => {
  UI.updateBadges();
  if (document.body.dataset.page === 'cart' && typeof CartPage !== 'undefined' && CartPage.render) {
    CartPage.render();
  }
});

// Boshqa oyna yoki tabda savat/sevimlilar o'zgarganda avtomatik sinxronlash
window.addEventListener('storage', (e) => {
  if (!e.key || e.key.includes('cart') || e.key.includes('wishlist') || e.key.includes('user')) {
    UI.updateBadges();
    if (document.body.dataset.page === 'cart' && typeof CartPage !== 'undefined' && CartPage.render) {
      CartPage.render();
    }
  }
});

// Sahifaga qayta fokus qilinganda yoki tab aktivlashganda yangilash
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    UI.updateBadges();
  }
});
window.addEventListener('focus', () => {
  UI.updateBadges();
});

function initHeader() {
  const header = document.getElementById('header');
  // Make every interactive menu understandable to keyboard and screen-reader users.
  const menuControls = [
    ['cartToggle', 'miniCart'], ['userToggle', 'userDropdown'],
    ['categoriesToggle', 'categoriesDropdown'], ['hamburgerBtn', 'mobileMenu']
  ];
  menuControls.forEach(([buttonId, panelId]) => {
    const button = document.getElementById(buttonId);
    const panel = document.getElementById(panelId);
    if (button && panel) {
      button.setAttribute('aria-controls', panelId);
      button.setAttribute('aria-expanded', 'false');
    }
  });
  // Sticky shadow
  window.addEventListener('scroll', () => {
    const h = document.getElementById('header');
    if (h) h.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
  // Search autocomplete + submit
  const searchInput = document.getElementById('searchInput');
  Search.initAutocomplete(searchInput, document.getElementById('searchSuggestions'));
  const goSearch = () => {
    const q = (searchInput?.value || '').trim();
    if (q) location.href = `book_list.html?q=${encodeURIComponent(q)}`;
  };
  document.querySelector('.header__search-btn')?.addEventListener('click', e => { e.preventDefault(); goSearch(); });
  searchInput?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); goSearch(); } });
  const mobileSearch = document.querySelector('.mobile-menu__search input');
  mobileSearch?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = mobileSearch.value.trim();
      if (q) location.href = `book_list.html?q=${encodeURIComponent(q)}`;
    }
  });

  // Cart toggle (mini-cart)
  const cartToggle = document.getElementById('cartToggle');
  const miniCart = document.getElementById('miniCart');
  if (cartToggle && miniCart) {
    cartToggle.addEventListener('click', e => {
      e.stopPropagation();
      if (!requireAuth("Savatni ko'rish uchun avval hisobingizga kiring!")) return;
      UI.updateBadges();
      miniCart.classList.toggle('active');
      cartToggle.setAttribute('aria-expanded', String(miniCart.classList.contains('active')));
      document.getElementById('userDropdown')?.classList.remove('active');
      document.getElementById('categoriesDropdown')?.classList.remove('active');
    });
  }

  // User dropdown
  const userToggle = document.getElementById('userToggle');
  const userDD = document.getElementById('userDropdown');
  const userContent = document.getElementById('userDropdownContent');
  if (userToggle && userDD) {
    userToggle.addEventListener('click', e => {
      e.stopPropagation();
      const user = Store.getUser();
      if (userContent) {
        userContent.innerHTML = user
          ? `<div class="user-dropdown__head">
               ${user.avatar ? `<img class="dropdown-avatar" src="${sanitizeUrl(user.avatar)}" alt="">` : `<span class="dropdown-avatar dropdown-avatar--initials">${UI.initials(user)}</span>`}
               <div><strong>${escapeHtml(user.name || '')}</strong><p>${escapeHtml(user.email || '')}</p></div>
             </div>
             <a href="profile.html">${ICONS.user} Profil</a>
             <a href="profile.html?tab=orders">${ICONS.orders} Buyurtmalarim</a>
             <a href="profile.html?tab=wishlist">${ICONS.heart} Sevimlilarim</a>
             <button type="button" class="user-dropdown__logout">${ICONS.logOut} Chiqish</button>`
          : `<a href="login.html">${ICONS.login} Kirish</a>
             <a href="register.html">${ICONS.user} Ro'yxatdan o'tish</a>`;
        userContent.querySelector('.user-dropdown__logout')?.addEventListener('click', () => {
          Store.logout();
          location.reload();
        });
      }
      userDD.classList.toggle('active');
      userToggle.setAttribute('aria-expanded', String(userDD.classList.contains('active')));
      miniCart?.classList.remove('active');
      document.getElementById('categoriesDropdown')?.classList.remove('active');
    });
  }

  // Categories dropdown
  const catToggle = document.getElementById('categoriesToggle');
  const catDD = document.getElementById('categoriesDropdown');
  if (catToggle && catDD && typeof CATEGORIES !== 'undefined') {
    const adjustDropdownPosition = () => {
      if (!catDD.classList.contains('active')) {
        catDD.style.transform = '';
        return;
      }
      if (window.innerWidth > 768) {
        catDD.style.transform = '';
        requestAnimationFrame(() => {
          const rect = catDD.getBoundingClientRect();
          if (rect.right > window.innerWidth - 16) {
            const shift = rect.right - (window.innerWidth - 16);
            catDD.style.transform = `translateX(-${shift}px)`;
          } else if (rect.left < 16) {
            const shift = 16 - rect.left;
            catDD.style.transform = `translateX(${shift}px)`;
          } else {
            catDD.style.transform = '';
          }
        });
      } else {
        catDD.style.transform = '';
      }
    };

    catToggle.addEventListener('click', e => {
      e.stopPropagation();
      if (!catDD.innerHTML.trim()) {
        catDD.innerHTML = `<div class="cats-mega">${CATEGORIES.map(c =>
          `<a href="book_list.html?cat=${c.id}" class="cats-mega__item">
            <img src="${sanitizeUrl(c.image)}" alt="${escapeHtml(c.name)}">
            <div><strong>${escapeHtml(c.name)}</strong><p>${c.count} ta kitob</p></div>
          </a>`).join('')}</div>`;
      }
      const willBeActive = !catDD.classList.contains('active');
      catDD.classList.toggle('active', willBeActive);
      catToggle.classList.toggle('active', willBeActive);
      catToggle.setAttribute('aria-expanded', String(willBeActive));
      document.body.classList.toggle('cats-open', willBeActive);
      miniCart?.classList.remove('active');
      userDD?.classList.remove('active');

      adjustDropdownPosition();
    });

    window.addEventListener('resize', adjustDropdownPosition, { passive: true });
  }

  miniCart?.addEventListener('click', e => e.stopPropagation());
  userDD?.addEventListener('click', e => e.stopPropagation());
  catDD?.addEventListener('click', e => e.stopPropagation());

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    miniCart?.classList.remove('active');
    userDD?.classList.remove('active');
    if (catDD) {
      catDD.classList.remove('active');
      catDD.style.transform = '';
    }
    document.body.classList.remove('cats-open');
    cartToggle?.setAttribute('aria-expanded', 'false');
    userToggle?.setAttribute('aria-expanded', 'false');
    catToggle?.setAttribute('aria-expanded', 'false');
    catToggle?.classList.remove('active');
  });

  // Mobile menu
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('closeMobileMenu');
  if (hamburger && mobileMenu) {
    const openMobile = () => { mobileMenu.classList.add('active'); mobileOverlay?.classList.add('active'); hamburger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; };
    const closeMobile = () => { mobileMenu.classList.remove('active'); mobileOverlay?.classList.remove('active'); hamburger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
    hamburger.addEventListener('click', openMobile);
    closeBtn?.addEventListener('click', closeMobile);
    mobileOverlay?.addEventListener('click', closeMobile);
  }
}

const BRAND_PARTNERS = [
  {
    id: 1,
    name: "Booksaw Store",
    vector: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="m9 9.5 2 2 4-4"/></svg>'
  },
  {
    id: 2,
    name: "Flaprise",
    vector: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'
  },
  {
    id: 3,
    name: "Bookstore",
    vector: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>'
  },
  {
    id: 1,
    name: "Bookdoor",
    vector: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M2 20h20"/><circle cx="14" cy="12" r="1"/></svg>'
  },
  {
    id: 2,
    name: "Library House",
    vector: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  {
    id: 3,
    name: "O\'qituvchi Press",
    vector: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
  }
];

function initHomePage() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  const wrap = document.getElementById('catalogView');
  if (wrap) wrap.style.display = 'none';
  const main = document.getElementById('mainContent') || document.querySelector('main');
  if (main) {
    Array.from(main.children).forEach(el => {
      if (el.id !== 'catalogView') el.style.display = '';
    });
  }
  Slider.init();
  // Categories row
  const catRow = document.getElementById('categoriesRow');
  if (catRow && typeof CATEGORIES !== 'undefined') {
    catRow.innerHTML = CATEGORIES.map(c =>
      `<a href="book_list.html?cat=${c.id}" class="category-card">
        <div class="category-card__thumb"><img src="${sanitizeUrl(c.image)}" alt="${escapeHtml(c.name)}"></div>
        <div class="category-card__name">${escapeHtml(c.name)}</div>
      </a>`).join('');
  }
  // Discount products
  const discEl = document.getElementById('discountProducts');
  if (discEl) discEl.innerHTML = PRODUCTS.filter(p => p.discount > 0).map(p => renderProductCard(p)).join('');
  // Bestsellers
  const bestEl = document.getElementById('bestsellerProducts');
  if (bestEl) bestEl.innerHTML = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 8).map(p => renderProductCard(p)).join('');
  // Recommended
  const recEl = document.getElementById('recommendedProducts');
  if (recEl) recEl.innerHTML = PRODUCTS.slice(0, 8).map(p => renderProductCard(p)).join('');
  // Brands
  const brandsEl = document.getElementById('brandsRow');
  if (brandsEl) {
    const list = (typeof BRANDS !== 'undefined' && Array.isArray(BRANDS) && BRANDS.length) ? BRANDS : BRAND_PARTNERS;
    brandsEl.innerHTML = list.map(b =>
      `<a class="publisher-item" href="store.html?id=${encodeURIComponent(b.id || 1)}" title="${escapeHtml(b.name)}">
        <span class="publisher-item__icon">${b.vector || `<img src="${sanitizeUrl(b.logo || '')}" alt="${escapeHtml(b.name)}" draggable="false">`}</span>
        <span class="publisher-item__name">${escapeHtml(b.name)}</span>
      </a>`).join('');
  }
  const newEl = document.getElementById('newProducts');
  if (newEl) newEl.innerHTML = [...PRODUCTS].sort((a, b) => b.year - a.year).slice(0, 8).map(p => renderProductCard(p)).join('');
  const blogEl = document.getElementById('blogGrid');
  if (blogEl && typeof POSTS !== 'undefined') {
    blogEl.innerHTML = POSTS.map(post =>
      `<article class="blog-card" data-href="info.html?page=blog&id=${post.id}" role="link" tabindex="0">
        <div class="blog-card__image"><img src="${sanitizeUrl(post.image)}" alt="${escapeHtml(post.title)}"></div>
        <div class="blog-card__body">
          <time>${UI.formatDate(post.date)}</time>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.excerpt)}</p>
        </div>
      </article>`).join('');
  }

  renderRecentlyViewed('recentHome');
  ensureTrustStrip();
  setTimeout(() => Animations.initScrollReveal(), 100);
}

function initStorePage() {
  const id = parseInt(new URLSearchParams(location.search).get('id'), 10) || 1;
  const store = typeof STORES !== 'undefined' ? STORES.find(s => s.id === id) || STORES[0] : null;
  if (!store) return;
  const text = (eid, val) => { const el = document.getElementById(eid); if (el) el.textContent = val; };
  const html = (eid, val) => { const el = document.getElementById(eid); if (el) el.innerHTML = val; };
  const banner = document.getElementById('storeBanner');
  if (banner) {
    banner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(${store.banner})`;
    banner.style.backgroundSize = 'cover';
    banner.style.backgroundPosition = 'center';
  }
  text('storeName', store.name);
  text('storeNameInfo', store.name);
  text('storeDesc', store.description);
  const logo = document.getElementById('storeLogo');
  if (logo) { logo.src = store.logo; logo.alt = store.name; }
  html('storeRating', `${ICONS.star} ${store.rating}`);
  text('storeReviews', store.reviewCount + ' ta sharh');
  text('storeProducts', store.productCount + ' ta mahsulot');
  text('storeJoined', new Date(store.joinedDate).getFullYear() + '-dan beri');
  const verified = document.getElementById('storeVerified');
  if (verified && store.verified) {
    verified.innerHTML = `${ICONS.shieldCheck} Tasdiqlangan`;
    verified.style.display = 'inline-flex';
  }
  const grid = document.getElementById('storeProductsGrid');
  if (grid) {
    const list = PRODUCTS.filter(p => p.storeId === store.id);
    grid.innerHTML = (list.length ? list : PRODUCTS.slice(0, 8)).map(p => renderProductCard(p)).join('');
  }
  setTimeout(() => Animations.initScrollReveal(), 100);
}

function initBottomNav() {
  const page = document.body.dataset.page;
  const iconMap = {
    home: ICONS.home,
    catalog: ICONS.grid,
    categories: ICONS.grid,
    cart: ICONS.cart,
    wishlist: ICONS.heart,
    profile: ICONS.user
  };
  const params = new URLSearchParams(location.search);
  document.querySelectorAll('.bottom-nav__item').forEach(item => {
    const itemPage = item.dataset.page;
    const isCatActive = page === 'catalog' && (params.has('cat') ? itemPage === 'categories' : itemPage === 'home');
    const isActive = itemPage === page || (page === 'detail' && itemPage === 'home') || isCatActive;
    item.classList.toggle('active', isActive);
    const iconEl = item.querySelector('.bottom-nav__icon, .icon');
    if (iconEl && iconMap[itemPage]) iconEl.innerHTML = iconMap[itemPage];
    const label = item.querySelector('small');
    const short = { home: 'Bosh', categories: 'Katalog', cart: 'Savat', wishlist: 'Sevimli', profile: 'Profil' };
    if (label && short[itemPage]) label.textContent = short[itemPage];
  });
}

/* ========================================================================
   15. EVENT DELEGATION
   (savatga qo'shish / sevimlilar / tez ko'rish / card navigatsiyasi
   yuqorida Search.initAutocomplete() ichida requireAuth bilan
   himoyalangan holda ro'yxatdan o'tkazilgan — bu yerda takrorlanmaydi)
   ======================================================================== */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.product-card[data-href], .blog-card[data-href]');
  if (!card) return;
  e.preventDefault();
  location.href = card.dataset.href;
});

function renderRecentlyViewed(targetId) {
  let ids = Store.getRecent() || [];
  let items = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  if (items.length > 0 && items.length < 4) {
    const supplement = PRODUCTS.filter(p => !items.some(it => it.id === p.id)).slice(0, 4 - items.length);
    items = [...items, ...supplement];
  }
  if (!items.length) return;
  let host = document.getElementById(targetId);
  if (!host) {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    const sec = document.createElement('section');
    sec.className = 'container home-section';
    sec.style.marginBottom = '48px';
    sec.innerHTML = `<div class="section-header" style="margin-bottom:20px;"><h2 class="section-title">Yaqinda ko‘rilganlar</h2></div><div id="${targetId}" class="product-carousel" style="justify-content:flex-start;"></div>`;
    footer.parentNode.insertBefore(sec, footer);
    host = document.getElementById(targetId);
  }
  host.innerHTML = items.map(p => renderProductCard(p)).join('');
}

function ensureTrustStrip() {
  if (document.getElementById('trustStrip')) return;
  const heroWrap = document.querySelector('.hero')?.closest('.container') || document.querySelector('.hero');
  if (!heroWrap) return;
  const strip = document.createElement('section');
  strip.id = 'trustStrip';
  strip.className = 'trust-strip container';
  strip.innerHTML = `
    <div class="trust-strip__item">${ICONS.shieldCheck}<div><strong>Original nashr</strong><span>Rasmiy yetkazib beruvchilar</span></div></div>
    <div class="trust-strip__item">${ICONS.truck}<div><strong>3–5 kun</strong><span>Toshkent va viloyatlar</span></div></div>
    <div class="trust-strip__item">${ICONS.creditCard}<div><strong>Payme / Click</strong><span>Xavfsiz to‘lov</span></div></div>
    <div class="trust-strip__item">${ICONS.package}<div><strong>14 kun</strong><span>Qaytarish kafolati</span></div></div>`;
  heroWrap.after(strip);
}

function enhanceChrome() {
  if (!document.querySelector('.skip-link')) {
    const a = document.createElement('a');
    a.href = '#mainContent';
    a.className = 'skip-link';
    a.textContent = 'Asosiy kontentga o‘tish';
    document.body.prepend(a);
  }
  const main = document.querySelector('main, .product-detail, .checkout-page, .info-page, .error-page, .card-container');
  if (main && !document.getElementById('mainContent')) main.id = 'mainContent';

  // Keep page weight low without delaying the logo or the first visible image.
  document.querySelectorAll('img').forEach((img, index) => {
    if (!img.hasAttribute('decoding')) img.decoding = 'async';
    if (index > 2 && !img.closest('.hero__slides')) img.loading = 'lazy';
  });

  // Escape closes any open lightweight UI; this is expected by keyboard users.
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    document.getElementById('miniCart')?.classList.remove('active');
    document.getElementById('userDropdown')?.classList.remove('active');
    const catDD = document.getElementById('categoriesDropdown');
    if (catDD) {
      catDD.classList.remove('active');
      catDD.style.transform = '';
    }
    document.getElementById('categoriesToggle')?.classList.remove('active');
    document.getElementById('mobileMenu')?.classList.remove('active');
    document.getElementById('mobileOverlay')?.classList.remove('active');
    document.body.classList.remove('cats-open');
    document.body.style.overflow = '';
  });

  const footer = document.querySelector('.footer .container');
  if (footer && !document.getElementById('newsForm')) {
    const news = document.createElement('div');
    news.className = 'footer-news';
    news.innerHTML = `<h4>Yangiliklarga obuna</h4>
      <p>Chegirma va yangi kitoblar haqida xabar oling</p>
      <form id="newsForm" class="footer-news__form">
        <input type="email" id="newsEmail" class="form-input" placeholder="email@example.com" required>
        <button type="submit" class="btn btn-primary btn-sm">Obuna</button>
      </form>`;
    const bottom = footer.querySelector('.footer__bottom');
    footer.insertBefore(news, bottom);
    document.getElementById('newsForm')?.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('newsEmail')?.value.trim();
      if (!/\S+@\S+\.\S+/.test(email)) { UI.showToast('Emailni tekshiring', 'error'); return; }
      try {
        await Api.newsletter(email);
        UI.showToast('Obuna qilindi');
        e.target.reset();
      } catch (err) {
        UI.showToast(err.message || 'Xatolik', 'error');
      }
    });
  }

  document.querySelectorAll('input[type="tel"], #addrPhone, #regPhone, #profPhone').forEach(el => {
    if (!el || el.dataset.mask) return;
    el.dataset.mask = '1';
    el.addEventListener('input', () => {
      let d = el.value.replace(/\D/g, '');
      if (d.startsWith('998')) d = d.slice(3);
      d = d.slice(0, 9);
      const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
      el.value = parts.length ? '+998 ' + parts.join(' ') : '';
    });
  });

  const catTitle = [...document.querySelectorAll('.footer__title')].find(h => /Kategoriyalar/i.test(h.textContent || ''));
  if (catTitle && typeof CATEGORIES !== 'undefined') {
    const ul = catTitle.parentElement.querySelector('.footer__links');
    if (ul) {
      ul.innerHTML = CATEGORIES.slice(0, 5).map(c =>
        `<li><a href="book_list.html?cat=${c.id}">${escapeHtml(c.name)}</a></li>`
      ).join('');
    }
  }

  if (document.body.dataset.page === 'detail') renderRecentlyViewed('recentDetail');
  if (document.body.dataset.page === 'home') renderRecentlyViewed('recentHome');
  document.querySelectorAll('.product-carousel, .categories-row').forEach(el => {
    enableDragScroll(el);
    attachCarouselArrows(el);
  });
  initPublishersMarquee();
}

function initPublishersMarquee() {
  const track = document.getElementById('brandsRow');
  if (!track || track.dataset.marquee === '1') return;
  const viewport = track.closest('.publishers__viewport');
  if (!viewport || !track.children.length) return;
  track.dataset.marquee = '1';

  const originals = [...track.children];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const autoSpeed = reduceMotion ? 0 : 0.48;
  let offset = 0;
  let setWidth = 0;
  let paused = false;
  let offscreen = false;
  let dragging = false;
  let lastX = 0;
  let vel = 0;
  let moved = false;
  let raf = 0;

  function visibleCount() {
    const w = viewport.clientWidth;
    if (w < 480) return 2;
    if (w < 720) return 3;
    if (w < 1024) return 4;
    return Math.min(5, originals.length);
  }

  function layout() {
    const n = Math.max(1, visibleCount());
    const itemW = viewport.clientWidth / n;
    track.replaceChildren();
    originals.forEach(node => {
      node.style.flex = `0 0 ${itemW}px`;
      node.style.width = `${itemW}px`;
      track.appendChild(node);
    });
    let copies = 0;
    while (track.scrollWidth < viewport.clientWidth * 2 + itemW && copies < 8) {
      originals.forEach(node => {
        const clone = node.cloneNode(true);
        clone.style.flex = `0 0 ${itemW}px`;
        clone.style.width = `${itemW}px`;
        clone.setAttribute('tabindex', '-1');
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
      copies += 1;
    }
    setWidth = itemW * originals.length;
    if (setWidth > 0) offset = ((offset % setWidth) + setWidth) % setWidth;
    apply();
  }

  function apply() {
    if (setWidth > 0) {
      offset = ((offset % setWidth) + setWidth) % setWidth;
    }
    track.style.transform = `translate3d(${-offset}px,0,0)`;
  }

  function tick() {
    if (!dragging && !paused && !offscreen) offset += autoSpeed;
    apply();
    raf = requestAnimationFrame(tick);
  }

  let armed = false;
  let startY = 0;
  viewport.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    armed = true;
    dragging = false;
    moved = false;
    vel = 0;
    lastX = e.clientX;
    startY = e.clientY;
  });
  viewport.addEventListener('pointermove', e => {
    if (!armed && !dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - startY;
    if (!dragging) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        armed = false;
        return;
      }
      dragging = true;
      paused = true;
      viewport.classList.add('is-dragging');
      try { viewport.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    }
    lastX = e.clientX;
    if (Math.abs(dx) > 2) moved = true;
    vel = dx;
    offset -= dx;
    apply();
  });
  const endDrag = () => {
    armed = false;
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove('is-dragging');
    const coast = () => {
      if (dragging) return;
      if (Math.abs(vel) < 0.35) {
        paused = viewport.matches(':hover');
        return;
      }
      offset -= vel;
      vel *= 0.94;
      apply();
      requestAnimationFrame(coast);
    };
    requestAnimationFrame(coast);
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('lostpointercapture', endDrag);
  viewport.addEventListener('mouseenter', () => { if (!dragging) paused = true; });
  viewport.addEventListener('mouseleave', () => { if (!dragging) paused = false; });
  viewport.addEventListener('click', e => {
    if (moved) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  viewport.addEventListener('dragstart', e => e.preventDefault());

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      offscreen = !entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(viewport);
  }

  window.addEventListener('resize', layout);
  layout();
  raf = requestAnimationFrame(tick);
}

function initInfoPage() {
  const params = new URLSearchParams(location.search);
  const key = params.get('page') || 'about';
  const postId = parseInt(params.get('id'), 10);
  const el = document.getElementById('infoContent');
  if (!el) return;
  if (key === 'blog' && postId && typeof POSTS !== 'undefined') {
    const post = POSTS.find(p => p.id === postId);
    if (post) {
      document.title = post.title + ' — Booksaw';
      el.innerHTML = `<article class="blog-article">
        <img src="${post.image}" alt="${post.title}">
        <time>${UI.formatDate(post.date)}</time>
        <h1>${post.title}</h1>
        ${post.body || `<p>${post.excerpt}</p>`}
        <a href="info.html?page=blog" class="btn btn-secondary btn-sm">Barcha maqolalar</a>
      </article>`;
      return;
    }
  }
  if (key === 'blog' && typeof POSTS !== 'undefined') {
    document.title = 'Blog — Booksaw';
    el.innerHTML = `<h1>Blog</h1><div class="blog-grid">${POSTS.map(post => `
      <article class="blog-card" data-href="info.html?page=blog&id=${post.id}" role="link" tabindex="0">
        <div class="blog-card__image"><img src="${post.image}" alt="${post.title}"></div>
        <div class="blog-card__body"><time>${UI.formatDate(post.date)}</time><h3>${post.title}</h3><p>${post.excerpt}</p></div>
      </article>`).join('')}</div>`;
  } else if (typeof INFO_PAGES !== 'undefined' && INFO_PAGES[key]) {
    const page = INFO_PAGES[key];
    document.title = 'Booksaw — ' + page.title;
    el.innerHTML = '<h1>' + page.title + '</h1>' + page.body;
    const breadcrumbEl = document.querySelector('.breadcrumbs__current, [data-info-breadcrumb]');
    if (breadcrumbEl) breadcrumbEl.textContent = page.title;
  }
  document.querySelectorAll('.info-nav a').forEach(a => {
    a.classList.toggle('is-active', a.getAttribute('href') === 'info.html?page=' + key || (key === 'blog' && a.getAttribute('href') === 'info.html?page=blog'));
  });
}

function init404Page() {
  const input = document.querySelector('.error-page input');
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) location.href = 'book_list.html?q=' + encodeURIComponent(q);
    }
  });
}
window.Booksaw = { Store, Api, UI, Search };
window.Store = Store;
window.UI = UI;
window.Search = Search;
window.Catalog = Catalog;
window.ProductDetail = ProductDetail;
window.CartPage = CartPage;
window.Checkout = Checkout;
window.Auth = Auth;
window.ProfilePage = ProfilePage;
window.OrdersPage = OrdersPage;
window.WishlistPage = WishlistPage;
window.Slider = Slider;
window.Animations = Animations;