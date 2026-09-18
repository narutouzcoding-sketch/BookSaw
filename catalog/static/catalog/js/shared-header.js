/* One source of truth for navigation chrome on all pages. */
(function () {
  const icon = (p, cls = '') => `<svg aria-hidden="true" class="${cls}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const I = {
    search: icon('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
    grid: icon('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
    heart: icon('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.9-8.6a5.5 5.5 0 0 0-.1-7.8Z"/>'),
    cart: icon('<circle cx="9" cy="20" r="1"/><circle cx="20" cy="20" r="1"/><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.5L22 7H6"/>'),
    user: icon('<circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>', 'user-toggle__svg'),
    menu: icon('<path d="M4 6h16M4 12h16M4 18h16"/>'),
    close: icon('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
    sun: icon('<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>', 'icon-sun'),
    moon: icon('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>', 'icon-moon')
  };
  const switch3D = `
    <div class="switch-chassis compact" role="button" aria-label="Rejimni almashtirish">
      <div class="switch-track">
        <div class="track-icon">
          <svg viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="6"/>
            <rect x="14.5" y="2" width="3" height="4.5" rx="1.5"/>
            <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(45 16 16)"/>
            <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(90 16 16)"/>
            <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(135 16 16)"/>
            <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(180 16 16)"/>
            <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(225 16 16)"/>
            <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(270 16 16)"/>
            <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(315 16 16)"/>
          </svg>
        </div>
        <div class="track-icon">
          <svg viewBox="0 0 32 32">
            <path d="M21 16.5C20.8 12.2 17.8 8.8 13.8 8C14.8 9.5 15.3 11.2 15.3 13C15.3 17.4 11.7 21 7.3 21C6.3 21 5.3 20.8 4.5 20.4C5.6 23.6 8.8 26 12.5 26C17.2 26 21 22.2 21 17.5V16.5Z"/>
            <path d="M22 6L22.8 8.2L25 9L22.8 9.8L22 12L21.2 9.8L19 9L21.2 8.2L22 6Z"/>
            <rect x="7" y="27.5" width="15" height="2" rx="1"/>
            <rect x="10" y="30.5" width="9" height="1.8" rx="0.9"/>
          </svg>
        </div>
        <div class="thumb-slider">
          <div class="thumb-icons-wrapper">
            <div class="thumb-icon icon-sun">
              <svg viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="6"/>
                <rect x="14.5" y="2" width="3" height="4.5" rx="1.5"/>
                <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(45 16 16)"/>
                <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(90 16 16)"/>
                <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(135 16 16)"/>
                <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(180 16 16)"/>
                <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(225 16 16)"/>
                <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(270 16 16)"/>
                <rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(315 16 16)"/>
              </svg>
            </div>
            <div class="thumb-icon icon-moon">
              <svg viewBox="0 0 32 32">
                <path d="M21 16.5C20.8 12.2 17.8 8.8 13.8 8C14.8 9.5 15.3 11.2 15.3 13C15.3 17.4 11.7 21 7.3 21C6.3 21 5.3 20.8 4.5 20.4C5.6 23.6 8.8 26 12.5 26C17.2 26 21 22.2 21 17.5V16.5Z"/>
                <path d="M22 6L22.8 8.2L25 9L22.8 9.8L22 12L21.2 9.8L19 9L21.2 8.2L22 6Z"/>
                <rect x="7" y="27.5" width="15" height="2" rx="1"/>
                <rect x="10" y="30.5" width="9" height="1.8" rx="0.9"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  function getUser() {
    try {
      const u = localStorage.getItem('booksaw_user') || localStorage.getItem('marketplace_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  }

  function getHeaderHtml() {
    const user = getUser();
    const navLinks = user
      ? `<li><a href="book_list.html">Bosh sahifa</a></li>
         <li><a href="categories.html">Kategoriyalar</a></li>
         <li><a href="cart.html">Savat</a></li>
         <li><a href="profile.html?tab=wishlist">Sevimlilarim</a></li>
         <li><a href="profile.html?tab=orders">Buyurtmalarim</a></li>
         <li><a href="profile.html">Profil (${user.name || 'Foydalanuvchi'})</a></li>
         <li><a href="#" id="sharedMobLogout" style="color:#ef4444;font-weight:600;">Chiqish</a></li>`
      : `<li><a href="book_list.html">Bosh sahifa</a></li>
         <li><a href="categories.html">Kategoriyalar</a></li>
         <li><a href="cart.html">Savat</a></li>
         <li><a href="login.html">Kirish</a></li>
         <li><a href="register.html">Ro'yxatdan o'tish</a></li>`;

    return `
<header class="header" id="header">
  <div class="container header__inner">
    <a href="book_list.html" class="header__logo" aria-label="Booksaw bosh sahifasi">
      <img src="../../static/catalog/images/main-logo.png" alt="Booksaw">
    </a>
    <div class="header__search">
      <input type="search" id="searchInput" placeholder="Kitob, muallif yoki kalit so'z qidiring..." autocomplete="off">
      <button type="button" class="header__search-btn" aria-label="Qidirish">${I.search}</button>
      <div class="search-suggestions" id="searchSuggestions"></div>
    </div>
    <div class="header__actions">
      <div class="header__action-item">
        <button type="button" class="header__action-btn" id="categoriesToggle" title="Kategoriyalar" aria-label="Kategoriyalar">${I.grid}</button>
        <div class="categories-dropdown" id="categoriesDropdown"></div>
      </div>
      <div class="header__action-item">
        <button type="button" class="header__action-btn theme-toggle theme-toggle--3d" id="themeToggle" title="Tungi / Kunduzgi rejim" aria-label="Mavzuni almashtirish">
          ${switch3D}
        </button>
      </div>
      <div class="header__action-item">
        <a href="wishlist.html" class="header__action-btn" title="Sevimlilar" aria-label="Sevimlilar">${I.heart}<span class="badge-count" id="wishlistBadge">0</span></a>
      </div>
      <div class="header__action-item">
        <button type="button" class="header__action-btn" id="cartToggle" title="Savat" aria-label="Savat">${I.cart}<span class="badge-count" id="cartBadge">0</span></button>
        <div class="mini-cart" id="miniCart">
          <div class="mini-cart__header"><h4>Savatingiz</h4></div>
          <div class="mini-cart__items" id="miniCartItems"></div>
          <div class="mini-cart__footer">
            <div class="flex-between"><strong>Jami:</strong><strong id="miniCartTotal">0 so'm</strong></div>
            <a href="cart.html" class="btn btn-primary mini-cart__link">Savatga o'tish</a>
          </div>
        </div>
      </div>
      <div class="header__action-item">
        <button type="button" class="header__action-btn" id="userToggle" title="Profil" aria-label="Profil"><span class="user-toggle__icon">${I.user}</span></button>
        <div class="user-dropdown" id="userDropdown">
          <div id="userDropdownContent"></div>
        </div>
      </div>
      <button type="button" class="header__hamburger mobile-only" id="hamburgerBtn" aria-label="Menyu">${I.menu}</button>
    </div>
  </div>
</header>
<div class="mobile-menu-overlay" id="mobileOverlay"></div>
<nav class="mobile-menu" id="mobileMenu" aria-label="Mobil menyu">
  <div class="mobile-menu__header">
    <img src="../../static/catalog/images/main-logo.png" alt="Booksaw">
    <button type="button" id="closeMobileMenu" aria-label="Yopish">${I.close}</button>
  </div>
  <div class="mobile-menu__search">
    <input type="search" placeholder="Qidirish...">
  </div>
  <ul class="mobile-menu__links">
    ${navLinks}
  </ul>
</nav>`;
  }

  function mount() {
    const oldHeader = document.querySelector('header.header'),
          oldMobile = document.getElementById('mobileMenu'),
          oldOverlay = document.getElementById('mobileOverlay');
    if (oldMobile) oldMobile.remove();
    if (oldOverlay) oldOverlay.remove();
    const html = getHeaderHtml();
    if (oldHeader) oldHeader.outerHTML = html;
    else document.body.insertAdjacentHTML('afterbegin', html);

    document.getElementById('themeToggle')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.BooksawTheme && typeof window.BooksawTheme.toggle === 'function') {
        window.BooksawTheme.toggle();
      }
    });

    document.getElementById('sharedMobLogout')?.addEventListener('click', (e) => {
      e.preventDefault();
      try {
        localStorage.removeItem('booksaw_user');
        localStorage.removeItem('marketplace_user');
      } catch (err) {}
      location.reload();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
}());
