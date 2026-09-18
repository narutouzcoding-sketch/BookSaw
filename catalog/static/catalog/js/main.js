/**
 * main.js — BooksCatalog Marketplace
 * To'liq biznes-mantiq: Store, UI, Qidiruv, Filtr, Slider, Detail, Cart, Checkout, Auth, Profile, Orders, Wishlist, Animatsiyalar
 * Barcha sahifalar uchun universal JS — data-page atributi orqali tegishli init funksiya chaqiriladi.
 */

const ICONS = {
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L23 6H6"/></svg>',
  heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  heartFilled: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/></svg>',
  x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  grid: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',
  orders: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>',
  login: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>',
  star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starEmpty: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  minus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  trash: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  eye: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>',
  chevronLeft: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  chevronRight: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  truck: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
  creditCard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
  mapPin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  phone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  zap: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  telegram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
  instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',
  facebook: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  youtube: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  package: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  shieldCheck: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>',
  book: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
  store: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>',
  arrowRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  filter: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  logOut: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
  lock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  thumbsUp: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>',
  clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  tag: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>',
  gift: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>',
  info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  sun: '<svg class="icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  moon: '<svg class="icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
};

const Theme = {
  key: 'booksaw-theme',
  get() {
    try {
      const t = localStorage.getItem(this.key) || localStorage.getItem('bookscatalog-theme');
      if (t === 'light' || t === 'dark') return t;
    } catch { /* ignore */ }
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem(this.key, theme); } catch { /* ignore */ }
    this.syncControls(theme);
    this._applying = true;
    document.dispatchEvent(new CustomEvent('booksaw:themechange', { detail: theme }));
    this._applying = false;
  },
  syncControls(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0d1310' : '#1b5e45';
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const dark = theme === 'dark';
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.setAttribute('aria-label', dark ? 'Kunduzgi rejim' : 'Tungi rejim');
      btn.title = dark ? 'Kunduzgi rejim' : 'Tungi rejim';
    });
    document.querySelectorAll('#profileModeText, #modeText, .mode-title-3d').forEach(el => {
      el.style.transform = 'translateY(-4px)';
      el.style.opacity = '0.4';
      setTimeout(() => {
        el.textContent = theme === 'dark' ? 'Dark' : 'Light';
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      }, 180);
    });
  },
  toggle() {
    this.apply(this.get() === 'dark' ? 'light' : 'dark');
  },
  buttonHtml() {
    return `<button type="button" class="header__action-btn theme-toggle theme-toggle--3d" id="themeToggle" aria-label="Tungi rejim" title="Tungi rejim">
      <div class="switch-chassis compact" role="button" aria-label="Rejimni almashtirish">
        <div class="switch-track">
          <div class="track-icon">
            <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="6"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5"/><rect x="14.5" y="25.5" width="3" height="4.5" rx="1.5"/><rect x="2" y="14.5" width="4.5" height="3" rx="1.5"/><rect x="25.5" y="14.5" width="4.5" height="3" rx="1.5"/><rect x="5.5" y="6" width="4.5" height="3" rx="1.5" transform="rotate(45 7.75 7.5)"/><rect x="22" y="22.5" width="4.5" height="3" rx="1.5" transform="rotate(45 24.25 24)"/><rect x="22.5" y="6.5" width="3" height="4.5" rx="1.5" transform="rotate(45 24 8.75)"/><rect x="6" y="23" width="3" height="4.5" rx="1.5" transform="rotate(45 7.5 25.25)"/></svg>
          </div>
          <div class="track-icon">
            <svg viewBox="0 0 32 32"><path d="M21 16.5C20.8 12.2 17.8 8.8 13.8 8C14.8 9.5 15.3 11.2 15.3 13C15.3 17.4 11.7 21 7.3 21C6.3 21 5.3 20.8 4.5 20.4C5.6 23.6 8.8 26 12.5 26C17.2 26 21 22.2 21 17.5V16.5Z"/><path d="M22 6L22.8 8.2L25 9L22.8 9.8L22 12L21.2 9.8L19 9L21.2 8.2L22 6Z"/><rect x="7" y="27.5" width="15" height="2" rx="1"/><rect x="10" y="30.5" width="9" height="1.8" rx="0.9"/></svg>
          </div>
          <div class="thumb-slider">
            <div class="thumb-icons-wrapper">
              <div class="thumb-icon icon-sun">
                <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="6"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5"/><rect x="14.5" y="25.5" width="3" height="4.5" rx="1.5"/><rect x="2" y="14.5" width="4.5" height="3" rx="1.5"/><rect x="25.5" y="14.5" width="4.5" height="3" rx="1.5"/><rect x="5.5" y="6" width="4.5" height="3" rx="1.5" transform="rotate(45 7.75 7.5)"/><rect x="22" y="22.5" width="4.5" height="3" rx="1.5" transform="rotate(45 24.25 24)"/><rect x="22.5" y="6.5" width="3" height="4.5" rx="1.5" transform="rotate(45 24 8.75)"/><rect x="6" y="23" width="3" height="4.5" rx="1.5" transform="rotate(45 7.5 25.25)"/></svg>
              </div>
              <div class="thumb-icon icon-moon">
                <svg viewBox="0 0 32 32"><path d="M21 16.5C20.8 12.2 17.8 8.8 13.8 8C14.8 9.5 15.3 11.2 15.3 13C15.3 17.4 11.7 21 7.3 21C6.3 21 5.3 20.8 4.5 20.4C5.6 23.6 8.8 26 12.5 26C17.2 26 21 22.2 21 17.5V16.5Z"/><path d="M22 6L22.8 8.2L25 9L22.8 9.8L22 12L21.2 9.8L19 9L21.2 8.2L22 6Z"/><rect x="7" y="27.5" width="15" height="2" rx="1"/><rect x="10" y="30.5" width="9" height="1.8" rx="0.9"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>`;
  },
  bind(btn) {
    if (!btn || btn.dataset.themeBound) return;
    btn.dataset.themeBound = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });
  },
  mount() {
    this.apply(this.get());
    document.querySelectorAll('.header__actions').forEach(actions => {
      if (actions.querySelector('.theme-toggle')) return;
      const wrap = document.createElement('div');
      wrap.className = 'header__action-item';
      wrap.innerHTML = this.buttonHtml();
      const ham = actions.querySelector('.header__hamburger');
      if (ham) actions.insertBefore(wrap, ham);
      else actions.appendChild(wrap);
    });
    document.querySelectorAll('header.header').forEach(header => {
      if (header.querySelector('.theme-toggle')) return;
      if (header.querySelector('.header__actions')) return;
      const inner = header.querySelector('.header__inner') || header;
      const wrap = document.createElement('div');
      wrap.className = 'header__action-item';
      wrap.innerHTML = this.buttonHtml();
      inner.appendChild(wrap);
    });
    if (!document.querySelector('.theme-toggle') && document.querySelector('.auth-page, .error-page, .neu-auth-page')) {
      const btnWrap = document.createElement('div');
      btnWrap.innerHTML = this.buttonHtml();
      const btn = btnWrap.firstElementChild;
      btn.classList.add('theme-toggle--float');
      document.body.appendChild(btn);
    }
    document.querySelectorAll('.theme-toggle').forEach(btn => this.bind(btn));
    document.querySelectorAll('.switch-chassis, #profileThemeToggleBtn').forEach(sw => {
      if (!sw.dataset.themeBound) {
        sw.dataset.themeBound = '1';
        sw.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggle();
        });
      }
    });
    // shared-header can be mounted after this module. Keep its controls and
    // accessibility text in sync even when the lightweight public API toggles.
    document.addEventListener('booksaw:themechange', (e) => {
      if (e.detail && !this._applying) this.syncControls(e.detail);
    });
    if (window.matchMedia) {
      matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        try { if (localStorage.getItem(this.key)) return; } catch { return; }
        this.apply(e.matches ? 'dark' : 'light');
      });
    }
  }
};

/* ==========================================================================
   THE BIN EATS THE LABEL - 4-STAGE PHYSICS ENGINE
   ========================================================================== */
function runBinEatAnimation(button, onComplete) {
  if (!button || button.classList.contains('is-eating')) return;

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  const label = button.querySelector('.btn-label');
  if (!label) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  // Split text into individual characters if not yet wrapped
  if (!label.querySelector('.char')) {
    const text = label.textContent.trim();
    label.innerHTML = text.split('').map(char => `<span class="char">${char}</span>`).join('');
  }

  const chars = Array.from(label.querySelectorAll('.char'));
  const binWrapper = button.querySelector('.bin-wrapper');

  const binRect = binWrapper ? binWrapper.getBoundingClientRect() : { left: 0, top: 0, width: 20 };
  const mouthX = binRect.left + binRect.width / 2;
  const mouthY = binRect.top + 4;
  const flightPlan = chars.map(char => {
    const rect = char.getBoundingClientRect();
    return {
      char,
      deltaX: mouthX - (rect.left + rect.width / 2),
      deltaY: mouthY - (rect.top + rect.height / 2)
    };
  });

  // Stage 1: Open bin lid and start animation
  button.classList.add('lid-open');
  button.classList.add('is-eating');

  // Stage 2: Parabolic letter ingestion with staggered delay
  flightPlan.forEach(({ char, deltaX, deltaY }, index) => {
    const delay = index * 45;

    if (char.animate) {
      char.animate([
        { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(${deltaX * 0.5}px, ${deltaY - 18}px) scale(0.85) rotate(-25deg)`, opacity: 0.9, offset: 0.5 },
        { transform: `translate(${deltaX}px, ${deltaY + 8}px) scale(0.1) rotate(-75deg)`, opacity: 0 }
      ], {
        duration: 320,
        delay: delay,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      });
    } else {
      char.style.opacity = '0';
    }
  });

  const totalEatTime = (chars.length * 45) + 320;

  // Stage 3: Close lid & trigger recoil bounce (No circular ring)
  setTimeout(() => {
    button.classList.remove('lid-open');

    if (binWrapper && binWrapper.animate) {
      binWrapper.animate([
        { transform: 'scale(1) translateY(0)' },
        { transform: 'scale(1.15, 0.88) translateY(2px)' },
        { transform: 'scale(0.95, 1.05) translateY(-2px)' },
        { transform: 'scale(1) translateY(0)' }
      ], { duration: 250, easing: 'ease-out' });
    }

    // Stage 4: Execute callback promptly without awkward spinner ring delay
    setTimeout(() => {
      button.classList.remove('is-eating');

      chars.forEach(char => {
        if (char.getAnimations) {
          char.getAnimations().forEach(anim => anim.cancel());
        }
        char.style.opacity = '1';
        char.style.transform = 'none';
      });

      if (typeof onComplete === 'function') {
        try { onComplete(); } catch (err) { console.error('onComplete error:', err); }
      }
    }, 280);

  }, Math.max(200, totalEatTime - 40));
}

function createBinButtonHtml(text, colorClass = 'danger', id = '') {
  const chars = text.split('').map(c => `<span class="char">${c}</span>`).join('');
  return `<button type="button" class="eat-btn ${colorClass}" ${id ? `id="${id}"` : ''} title="${text}">
    <div class="bin-wrapper">
      <svg class="bin-svg" viewBox="0 0 20 24" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <g class="bin-lid">
          <path d="M1 5h18" />
          <path d="M7 5V2.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 13 2.5V5" />
        </g>
        <g class="bin-body">
          <path d="M3.5 5.5l1.2 14.5a2.5 2.5 0 0 0 2.5 2.5h5.6a2.5 2.5 0 0 0 2.5-2.5L16.5 5.5" />
          <line x1="8" y1="10" x2="8" y2="17" stroke-width="1.6" />
          <line x1="12" y1="10" x2="12" y2="17" stroke-width="1.6" />
        </g>
      </svg>
    </div>
    <span class="btn-label">${chars}</span>
  </button>`;
}

window.runBinEatAnimation = runBinEatAnimation;
window.createBinButtonHtml = createBinButtonHtml;

function renderStars(rating) {
  let stars = '<span class="stars" style="display:inline-flex;flex-direction:row;align-items:center;gap:2px;">';
  for (let i = 1; i <= 5; i++) {
    stars += i <= Math.round(rating) ? ICONS.star : ICONS.starEmpty;
  }
  stars += '</span>';
  return stars;
}

const mapDeliveryIcon = (icon) => {
    if (!icon) return '';
    if (icon.includes('🚚')) return ICONS.truck;
    if (icon.includes('⚡')) return ICONS.zap;
    if (icon.includes('🏪')) return ICONS.store;
    return icon;
};

const mapPaymentIcon = (icon) => {
    if (!icon) return '';
    if (icon.includes('💳')) return ICONS.creditCard;
    if (icon.includes('📱')) return ICONS.phone;
    if (icon.includes('💵')) return ICONS.creditCard;
    if (icon.includes('⏳')) return ICONS.clock;
    return icon;
};

/* ========================================================================
   1. STORE — LocalStorage State Management & Account Isolation
   ======================================================================== */
const Store = {
  // --- ACCOUNT DATA ISOLATION & SCOPING ---
  getUserScopeKey(u = null) {
    const user = u || this.getUser();
    if (!user) return 'guest';
    if (user.id) {
      const idStr = String(user.id);
      return idStr.startsWith('usr_') ? idStr : ('usr_' + idStr);
    }
    if (user.email) return 'usr_' + user.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (user.phone) return 'usr_' + user.phone.replace(/\D/g, '');
    if (user.username) return 'usr_' + user.username.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return 'usr_default';
  },

  _scopedGet(prefix, fallbackLegacy = true) {
    const scope = this.getUserScopeKey();
    const scopedKey = prefix + '_' + scope;
    try {
      const data = localStorage.getItem(scopedKey);
      if (data !== null) return JSON.parse(data);

      // Check current user object
      const u = this.getUser();
      const fieldMap = {
        'marketplace_cart': 'cart',
        'marketplace_wishlist': 'wishlist',
        'marketplace_orders': 'orders',
        'marketplace_addresses': 'addresses'
      };
      if (u && fieldMap[prefix] && Array.isArray(u[fieldMap[prefix]]) && u[fieldMap[prefix]].length > 0) {
        localStorage.setItem(scopedKey, JSON.stringify(u[fieldMap[prefix]]));
        return u[fieldMap[prefix]];
      }

      // Check legacy storage if guest or allowed
      if (fallbackLegacy && scope === 'guest') {
        const legacy = localStorage.getItem(prefix);
        if (legacy !== null) return JSON.parse(legacy);
      }
    } catch { /* ignore */ }
    return [];
  },

  _scopedSet(prefix, value) {
    const scope = this.getUserScopeKey();
    const scopedKey = prefix + '_' + scope;
    localStorage.setItem(scopedKey, JSON.stringify(value));

    // Mirror to active user record and user registry
    const currentUser = this.getUser();
    if (currentUser && currentUser.id) {
      const fieldMap = {
        'marketplace_cart': 'cart',
        'marketplace_wishlist': 'wishlist',
        'marketplace_orders': 'orders',
        'marketplace_addresses': 'addresses'
      };
      const field = fieldMap[prefix];
      if (field) {
        currentUser[field] = value;
        localStorage.setItem('marketplace_user', JSON.stringify(currentUser));
        localStorage.setItem('booksaw_user', JSON.stringify(currentUser));
        this.saveUserToRegistry(currentUser);
      }
    }
  },

  // --- CART ---
  getCart() {
    return this._scopedGet('marketplace_cart');
  },
  _saveCart(cart) {
    this._scopedSet('marketplace_cart', cart);
    UI.updateBadges();
  },
  addToCart(productId, qty = 1, variant = null) {
    const cart = this.getCart();
    const idx = cart.findIndex(i => i.productId === productId);
    if (idx > -1) { cart[idx].qty = Math.min(10, cart[idx].qty + qty); }
    else { cart.push({ productId, qty, variant }); }
    this._saveCart(cart);
    return cart;
  },
  removeFromCart(productId) {
    this._saveCart(this.getCart().filter(i => i.productId !== productId));
  },
  updateCartQty(productId, qty) {
    const cart = this.getCart();
    const item = cart.find(i => i.productId === productId);
    if (item) { item.qty = Math.max(1, Math.min(10, qty)); }
    this._saveCart(cart);
  },
  getCartTotal() {
    const cart = this.getCart();
    let subtotal = 0, itemCount = 0;
    cart.forEach(item => {
      const p = PRODUCTS.find(pr => pr.id === item.productId);
      if (p) { subtotal += p.price * item.qty; itemCount += item.qty; }
    });
    return { subtotal, itemCount };
  },
  clearCart() { this._saveCart([]); },
  moveToWishlist(productId) {
    this.removeFromCart(productId);
    if (!this.isInWishlist(productId)) this.toggleWishlist(productId);
  },

  // --- WISHLIST ---
  getWishlist() {
    return this._scopedGet('marketplace_wishlist');
  },
  _saveWishlist(wl) {
    this._scopedSet('marketplace_wishlist', wl);
    UI.updateBadges();
  },
  clearWishlist() {
    this._saveWishlist([]);
  },
  removeFromWishlist(productId) {
    let wl = this.getWishlist();
    if (wl.includes(productId)) {
      wl = wl.filter(id => id !== productId);
      this._saveWishlist(wl);
    }
  },
  toggleWishlist(productId) {
    let wl = this.getWishlist();
    const exists = wl.includes(productId);
    if (exists) wl = wl.filter(id => id !== productId);
    else wl.push(productId);
    this._saveWishlist(wl);
    return { added: !exists };
  },
  isInWishlist(id) { return this.getWishlist().includes(id); },

  // --- AUTH & USER REGISTRY ---
  getAllUsers() {
    try {
      const list = JSON.parse(localStorage.getItem('marketplace_all_users'));
      if (Array.isArray(list) && list.length > 0) return list;
    } catch { /* ignore */ }

    // Seed realistic default accounts for 1:1 account integrity
    const seeds = [
      {
        id: 'usr_qosimov_1',
        name: 'Quvonchbek Qosimov',
        username: '@quvonchbek',
        email: 'qosimovquvonc@gmail.com',
        phone: '+998 90 123 45 67',
        password: 'password123',
        avatar: null,
        provider: 'google',
        orders: [
          {
            id: 'ORD-984210',
            userId: 'usr_qosimov_1',
            userEmail: 'qosimovquvonc@gmail.com',
            userName: 'Quvonchbek Qosimov',
            date: '2026-03-12T10:30:00.000Z',
            status: 'delivered',
            items: [{ productId: 1, name: "O'tkan kunlar", price: 65000, qty: 1, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80" }],
            subtotal: 65000,
            discount: 0,
            deliveryCost: 15000,
            total: 80000,
            payment: { name: "Payme / Click" },
            address: { city: "Toshkent shahri", address: "Amir Temur ko'chasi 14-uy" }
          }
        ],
        addresses: [
          { id: 'addr_1', name: 'Quvonchbek Qosimov', phone: '+998 90 123 45 67', city: 'Toshkent shahri', address: "Amir Temur ko'chasi 14-uy", isDefault: true }
        ],
        cart: [],
        wishlist: [1, 3]
      },
      {
        id: 'usr_naruto_2',
        name: 'Uzumaki Naruto',
        username: '@narutouzumaki',
        email: 'naruto.uz.coding@gmail.com',
        phone: '+998 93 555 77 88',
        password: 'password123',
        avatar: null,
        provider: 'google',
        orders: [
          {
            id: 'ORD-541239',
            userId: 'usr_naruto_2',
            userEmail: 'naruto.uz.coding@gmail.com',
            userName: 'Uzumaki Naruto',
            date: '2026-03-10T14:15:00.000Z',
            status: 'processing',
            items: [{ productId: 4, name: "Clean Code", price: 120000, qty: 1, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80" }],
            subtotal: 120000,
            discount: 0,
            deliveryCost: 15000,
            total: 135000,
            payment: { name: "Naqd pul bilan" },
            address: { city: "Samarqand shahri", address: "Registon ko'chasi 5-uy" }
          }
        ],
        addresses: [
          { id: 'addr_2', name: 'Uzumaki Naruto', phone: '+998 93 555 77 88', city: 'Samarqand shahri', address: "Registon ko'chasi 5-uy", isDefault: true }
        ],
        cart: [{ productId: 4, qty: 1 }],
        wishlist: [2]
      },
      {
        id: 'usr_qosimov_87',
        name: 'Quvonchbek Qosimov',
        username: '@quvonchbek87',
        email: 'qosimovquvonchbek87@gmail.com',
        phone: '+998 97 700 87 87',
        password: 'password123',
        avatar: null,
        provider: 'google',
        orders: [],
        addresses: [
          { id: 'addr_3', name: 'Quvonchbek Qosimov', phone: '+998 97 700 87 87', city: "Farg'ona shahri", address: "Al-Farg'oniy 22-uy", isDefault: true }
        ],
        cart: [],
        wishlist: [5]
      },
      {
        id: 'usr_music_yt',
        name: 'Music YouTube',
        username: '@musicyt',
        email: 'qosimovquvoncmusic@gmail.com',
        phone: '+998 99 888 11 22',
        password: 'password123',
        avatar: null,
        provider: 'google',
        orders: [],
        addresses: [],
        cart: [],
        wishlist: []
      },
      {
        id: 'usr_dls_yt',
        name: 'Dls Youtube',
        username: '@dlsyoutube',
        email: 'ydls4576@gmail.com',
        phone: '+998 91 333 44 55',
        password: 'password123',
        avatar: null,
        provider: 'google',
        orders: [],
        addresses: [],
        cart: [],
        wishlist: []
      }
    ];
    try {
      localStorage.setItem('marketplace_all_users', JSON.stringify(seeds));
    } catch {}
    return seeds;
  },

  saveUserToRegistry(u) {
    if (!u) return;
    const users = this.getAllUsers();
    const uEmail = (u.email || '').trim().toLowerCase();
    const uUser = (u.username || '').trim().toLowerCase().replace(/^@/, '');
    const uPhone = (u.phone || '').replace(/\D/g, '');
    const uId = u.id ? String(u.id).toLowerCase() : '';

    const idx = users.findIndex(x => {
      if (!x) return false;
      const xId = x.id ? String(x.id).toLowerCase() : '';
      if (uId && xId && uId === xId) return true;
      const xEmail = (x.email || '').trim().toLowerCase();
      if (uEmail && xEmail && uEmail === xEmail) return true;
      const xUser = (x.username || '').trim().toLowerCase().replace(/^@/, '');
      if (uUser && xUser && uUser === xUser) return true;
      const xPhone = (x.phone || '').replace(/\D/g, '');
      if (uPhone.length >= 7 && xPhone.length >= 7 && uPhone.slice(-7) === xPhone.slice(-7)) return true;
      return false;
    });

    if (idx >= 0) {
      users[idx] = { ...users[idx], ...u };
    } else {
      users.push(u);
    }
    try {
      localStorage.setItem('marketplace_all_users', JSON.stringify(users));
    } catch {}
  },

  findUser(identifier) {
    if (!identifier) return null;
    const clean = String(identifier).trim().toLowerCase();
    const cleanHandle = clean.replace(/^@/, '');
    const cleanDigits = String(identifier).replace(/\D/g, '');

    return this.getAllUsers().find(u => {
      if (!u) return false;
      const uId = u.id ? String(u.id).toLowerCase() : '';
      if (uId && (uId === clean || uId === ('usr_' + clean))) return true;

      const uEmail = (u.email || '').trim().toLowerCase();
      if (uEmail && uEmail === clean) return true;

      const uHandle = (u.username || '').trim().toLowerCase().replace(/^@/, '');
      if (uHandle && (uHandle === cleanHandle || uHandle === clean)) return true;

      const uPhone = (u.phone || '').replace(/\D/g, '');
      if (cleanDigits.length >= 7 && uPhone.length >= 7 && uPhone.slice(-7) === cleanDigits.slice(-7)) return true;

      return false;
    }) || null;
  },

  getUser() {
    try {
      const u = JSON.parse(localStorage.getItem('marketplace_user'));
      if (u && (!u.name || u.name === 'Foydalanuvchi') && u.email) {
        u.name = u.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      }
      return u;
    } catch { return null; }
  },

  setUser(user) {
    if (!user) {
      localStorage.removeItem('marketplace_user');
      localStorage.removeItem('booksaw_user');
    } else {
      // Guarantee unique permanent ID
      if (!user.id) {
        const existing = this.findUser(user.email) || this.findUser(user.phone) || this.findUser(user.username);
        if (existing && existing.id) {
          user.id = existing.id;
        } else {
          const baseKey = (user.email || user.username || user.phone || ('u' + Date.now())).toLowerCase().replace(/[^a-z0-9]/g, '_');
          user.id = 'usr_' + baseKey;
        }
      }

      // Restore user's previous data from registry if not already attached
      const existingInRegistry = this.findUser(user.id) || this.findUser(user.email) || this.findUser(user.phone) || this.findUser(user.username);
      if (existingInRegistry) {
        ['orders', 'addresses', 'wishlist', 'cart'].forEach(field => {
          if ((!user[field] || (Array.isArray(user[field]) && user[field].length === 0)) && Array.isArray(existingInRegistry[field]) && existingInRegistry[field].length > 0) {
            user[field] = existingInRegistry[field];
          }
        });
      }

      // Populate scoped data in localStorage
      const userKey = this.getUserScopeKey(user);
      ['cart', 'wishlist', 'orders', 'addresses'].forEach(field => {
        const scopedKey = 'marketplace_' + field + '_' + userKey;
        const stored = localStorage.getItem(scopedKey);
        if (stored !== null) {
          try {
            user[field] = JSON.parse(stored);
          } catch {}
        } else if (user[field] && Array.isArray(user[field])) {
          localStorage.setItem(scopedKey, JSON.stringify(user[field]));
        }
      });

      // Transfer active guest cart items into this user's cart (if any were added before logging in)
      const guestCartRaw = localStorage.getItem('marketplace_cart_guest');
      if (guestCartRaw) {
        try {
          const guestCart = JSON.parse(guestCartRaw);
          if (Array.isArray(guestCart) && guestCart.length > 0) {
            const scopedCartKey = 'marketplace_cart_' + userKey;
            const currentCart = JSON.parse(localStorage.getItem(scopedCartKey) || '[]');
            guestCart.forEach(gItem => {
              const ex = currentCart.find(i => i.productId === gItem.productId);
              if (ex) ex.qty = Math.min(10, ex.qty + gItem.qty);
              else currentCart.push(gItem);
            });
            localStorage.setItem(scopedCartKey, JSON.stringify(currentCart));
            localStorage.removeItem('marketplace_cart_guest');
            user.cart = currentCart;
          }
        } catch {}
      }

      try {
        localStorage.setItem('marketplace_user', JSON.stringify(user));
        localStorage.setItem('booksaw_user', JSON.stringify(user));
      } catch {}
      this.saveUserToRegistry(user);
    }

    if (typeof UI !== 'undefined') {
      if (UI.updateHeaderAvatar) UI.updateHeaderAvatar();
      if (UI.updateBadges) UI.updateBadges();
    }
    return user;
  },

  login(emailOrUser, password) {
    const found = this.findUser(emailOrUser);
    if (found) {
      if (password && !found.password) found.password = password;
      return this.setUser(found);
    }
    const cleanId = 'usr_' + String(emailOrUser || 'user').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const derived = (emailOrUser || '').split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Kitobxon';
    const isEmail = (emailOrUser || '').includes('@');
    const user = {
      id: cleanId,
      name: derived,
      username: '@' + (isEmail ? emailOrUser.split('@')[0] : emailOrUser).toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      email: isEmail ? emailOrUser : '',
      phone: !isEmail ? emailOrUser : '',
      password: password || '',
      avatar: null,
      cart: [],
      wishlist: [],
      orders: [],
      addresses: []
    };
    return this.setUser(user);
  },

  register(name, email, phone, password, username = '') {
    const existing = this.findUser(email) || this.findUser(phone) || (username ? this.findUser(username) : null);
    if (existing) {
      if (name && !existing.name) existing.name = name;
      if (password && !existing.password) existing.password = password;
      return this.setUser(existing);
    }
    const handle = username ? (username.startsWith('@') ? username : '@' + username) : ('@' + (email ? email.split('@')[0] : (name || 'user').toLowerCase().replace(/\s+/g, '_')));
    const cleanId = 'usr_' + (email || phone || handle || ('u' + Date.now())).toLowerCase().replace(/[^a-z0-9]/g, '_');
    const user = {
      id: cleanId,
      name: name || 'Kitobxon',
      username: handle,
      email: email || '',
      phone: phone || '',
      password: password || '',
      avatar: null,
      cart: [],
      wishlist: [],
      orders: [],
      addresses: []
    };
    return this.setUser(user);
  },

  loginWithOAuth({ name, username = '', email = '', phone = '', avatar = null, provider = 'oauth', password = '' }) {
    const existing = this.findUser(email) || this.findUser(phone) || (username ? this.findUser(username) : null);
    const handle = username ? (username.startsWith('@') ? username : '@' + username) : ('@' + (email ? email.split('@')[0] : (name || 'user').toLowerCase().replace(/\s+/g, '_')));
    const cleanId = existing?.id || ('usr_' + (email || phone || handle || ('u' + Date.now())).toLowerCase().replace(/[^a-z0-9]/g, '_'));
    const user = {
      id: cleanId,
      name: name || existing?.name || (provider === 'google' ? 'Google Foydalanuvchisi' : 'Telegram Foydalanuvchisi'),
      username: handle || existing?.username || '@foydalanuvchi',
      email: email || existing?.email || '',
      phone: phone || existing?.phone || '',
      password: password || existing?.password || '',
      avatar: avatar || existing?.avatar || null,
      provider: provider || existing?.provider || 'oauth',
      cart: existing?.cart || [],
      wishlist: existing?.wishlist || [],
      orders: existing?.orders || [],
      addresses: existing?.addresses || []
    };
    return this.setUser(user);
  },

  logout() {
    this.setUser(null);
  },
  isLoggedIn() { return !!this.getUser(); },
  updateProfile(data) {
    const user = this.getUser() || {};
    Object.assign(user, data);
    this.setUser(user);
    return user;
  },
  setAvatar(dataUrl) {
    return this.updateProfile({ avatar: dataUrl || null });
  },

  // --- ORDERS ---
  getOrders() {
    return this._scopedGet('marketplace_orders');
  },
  createOrder(orderData) {
    const cart = this.getCart();
    if (!cart.length) return this.getOrders()[0] || null;
    const orders = this.getOrders();
    const { subtotal } = this.getCartTotal();
    const promo = this.getPromo();
    let discount = 0;
    let deliveryCost = orderData.deliveryCost ?? 15000;
    if (promo) {
      if (promo.type === 'percent') discount = Math.round(subtotal * promo.value / 100);
      if (promo.type === 'freeShipping') deliveryCost = 0;
    }
    const currentUser = this.getUser();
    const order = {
      id: 'ORD-' + String(Date.now()).slice(-6),
      userId: currentUser?.id || 'guest',
      userEmail: currentUser?.email || '',
      userName: currentUser?.name || 'Xaridor',
      date: new Date().toISOString(),
      status: 'processing',
      items: cart.map(ci => {
        const p = PRODUCTS.find(pr => pr.id === ci.productId);
        return { ...ci, name: p?.name, price: p?.price, image: p?.image };
      }),
      ...orderData,
      subtotal,
      discount,
      promo: promo ? promo.code : null,
      deliveryCost,
      total: Math.max(0, subtotal - discount + deliveryCost)
    };
    orders.unshift(order);
    this._scopedSet('marketplace_orders', orders);
    this.clearCart();
    this.setPromo(null);
    return order;
  },
  cancelOrder(id) {
    const orders = this.getOrders().map(o => o.id === id ? { ...o, status: 'cancelled' } : o);
    this._scopedSet('marketplace_orders', orders);
  },
  updateOrderStatus(id, status) {
    const orders = this.getOrders().map(o => o.id === id ? { ...o, status } : o);
    this._scopedSet('marketplace_orders', orders);
  },
  repeatOrder(id) {
    const o = this.getOrders().find(x => x.id === id);
    if (!o) return false;
    (o.items || []).forEach(i => { if (i.productId) this.addToCart(i.productId, i.qty || 1, i.variant); });
    return true;
  },

  // --- ADDRESSES ---
  getAddresses() {
    return this._scopedGet('marketplace_addresses');
  },
  saveAddresses(a) {
    this._scopedSet('marketplace_addresses', a);
  },
  addAddress(addr) {
    const addrs = this.getAddresses();
    addr.id = 'addr_' + Date.now();
    if (!addrs.length) addr.isDefault = true;
    addrs.push(addr);
    this.saveAddresses(addrs);
    return addr;
  },
  removeAddress(id) {
    let addrs = this.getAddresses().filter(a => a.id !== id);
    if (addrs.length && !addrs.some(a => a.isDefault)) addrs[0].isDefault = true;
    this.saveAddresses(addrs);
  },

  getRecent() {
    try { return JSON.parse(localStorage.getItem('marketplace_recent')) || []; }
    catch { return []; }
  },
  addRecent(productId) {
    let ids = this.getRecent().filter(id => id !== productId);
    ids.unshift(productId);
    localStorage.setItem('marketplace_recent', JSON.stringify(ids.slice(0, 8)));
  },
  getPromo() {
    try { return JSON.parse(sessionStorage.getItem('marketplace_promo')); }
    catch { return null; }
  },
  setPromo(p) {
    if (p) sessionStorage.setItem('marketplace_promo', JSON.stringify(p));
    else sessionStorage.removeItem('marketplace_promo');
  },
  getLocalReviews(productId) {
    try { return JSON.parse(localStorage.getItem('marketplace_reviews_' + productId)) || []; }
    catch { return []; }
  },
  addReview(productId, review) {
    const list = this.getLocalReviews(productId);
    list.unshift(review);
    localStorage.setItem('marketplace_reviews_' + productId, JSON.stringify(list));
    return list;
  },
  getLocalQna(productId) {
    try { return JSON.parse(localStorage.getItem('marketplace_qna_' + productId)) || []; }
    catch { return []; }
  },
  addQuestion(productId, q) {
    const list = this.getLocalQna(productId);
    list.unshift(q);
    localStorage.setItem('marketplace_qna_' + productId, JSON.stringify(list));
    return list;
  }
};

/* ========================================================================
   2. UI UTILITIES
   ======================================================================== */
const UI = {
  showToast(message, type = 'success', duration = 3000) {
    let c = document.getElementById('toastContainer');
    if (!c) { c = document.createElement('div'); c.className = 'toast-container'; c.id = 'toastContainer'; document.body.appendChild(c); }
    c.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    c.setAttribute('aria-atomic', 'true');
    const icon = type === 'success' ? ICONS.check : type === 'error' ? ICONS.x : ICONS.info;
    const t = document.createElement('div');
    t.className = `toast toast--${type}`;
    t.innerHTML = `<div class="toast__icon" aria-hidden="true">${icon}</div><div class="toast__message">${message}</div><button class="toast__close" type="button" aria-label="Xabarni yopish" onclick="this.parentElement.remove()">${ICONS.x}</button>`;
    c.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, duration);
  },

  showModal(html, opts = {}) {
    let overlay = document.getElementById('modalOverlay');
    let modal = document.getElementById('modalContent');
    if (!overlay) {
      overlay = document.createElement('div'); overlay.className = 'modal-overlay'; overlay.id = 'modalOverlay';
      modal = document.createElement('div'); modal.className = 'modal'; modal.id = 'modalContent';
      overlay.appendChild(modal); document.body.appendChild(overlay);
    }
    if (opts.className) modal.className = 'modal ' + opts.className;
    else modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `<button class="modal__close" id="modalCloseBtn" type="button" aria-label="Yopish"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>${html}`;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    const close = () => { overlay.classList.remove('active'); document.body.style.overflow = ''; };
    modal.querySelector('#modalCloseBtn').onclick = close;
    overlay.onclick = e => { if (e.target === overlay) close(); };
    const escH = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escH); } };
    document.addEventListener('keydown', escH);
    return { close };
  },

  showConfirm(msg, onConfirm) {
    const html = `<div style="text-align:center;padding:20px"><h3 style="margin-bottom:12px">Tasdiqlash</h3><p style="margin-bottom:24px;color:var(--gray-500)">${msg}</p><div style="display:flex;gap:12px;justify-content:center"><button class="btn btn-secondary" id="confirmCancel">Bekor qilish</button><button class="btn btn-primary" id="confirmOk" style="background:var(--danger)">Ha, o'chirish</button></div></div>`;
    const { close } = this.showModal(html);
    document.getElementById('confirmCancel').onclick = close;
    document.getElementById('confirmOk').onclick = () => { close(); onConfirm(); };
  },

  showQuickView(productId) {
    const p = PRODUCTS.find(pr => pr.id === productId);
    if (!p) return;
    const inWL = Store.isInWishlist(p.id);
    const html = `<div class="quick-view__container">
      <div class="quick-view__image-col">
        <div class="quick-view__book-wrapper">
          <div class="quick-view__book-cover">
            <img src="${p.image}" alt="${p.name}" class="quick-view__img">
            <div class="quick-view__book-spine"></div>
            ${p.discount ? `<span class="badge badge-sale quick-view__sale-badge">-${p.discount}%</span>` : ''}
          </div>
        </div>
      </div>
      <div class="quick-view__info-col">
        <div class="quick-view__tags-row">
          <span class="quick-view__category">${p.categoryName}</span>
          ${p.inStock 
            ? '<span class="badge badge-success quick-view__stock-badge"><i class="fa-solid fa-check"></i> Mavjud</span>' 
            : '<span class="badge badge-danger quick-view__stock-badge"><i class="fa-solid fa-xmark"></i> Tugagan</span>'
          }
        </div>
        
        <h2 class="quick-view__title">${p.name}</h2>
        <p class="quick-view__author"><i class="fa-solid fa-user-pen"></i> <span>${p.author}</span></p>
        
        <div class="quick-view__rating-row">
          <span class="quick-view__stars">${renderStars(p.rating)}</span>
          <span class="quick-view__rating-num">${p.rating}</span>
          <span class="quick-view__reviews-count">(${p.reviewCount} ta sharh)</span>
        </div>

        <div class="quick-view__price-row">
          <span class="quick-view__price">${UI.formatPrice(p.price)}</span>
          ${p.oldPrice && p.oldPrice > p.price ? `<span class="quick-view__old-price">${UI.formatPrice(p.oldPrice)}</span>` : ''}
          ${p.discount ? `<span class="quick-view__discount-text">Tejov: ${UI.formatPrice(p.oldPrice - p.price)}</span>` : ''}
        </div>

        <p class="quick-view__desc">
          ${p.description || "Ushbu asar jahon adabiyoti va zamonaviy kitobxonlikning sara namunalaridan biri bo'lib, chuqur ma'no va qiziqarli voqealarga boy."}
        </p>

        <div class="quick-view__actions">
          <button class="btn btn-primary add-to-cart-btn quick-view__add-btn" data-id="${p.id}" ${!p.inStock ? 'disabled' : ''}>
            ${ICONS.cart} <span>${p.inStock ? "Savatga qo'shish" : "Tugagan"}</span>
          </button>
          <button class="btn btn-secondary wishlist-toggle-btn quick-view__wishlist-btn ${inWL ? 'active' : ''}" data-id="${p.id}" title="${inWL ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}">
            ${inWL ? ICONS.heartFilled : ICONS.heart}
          </button>
          <a href="book_detail.html?id=${p.id}" class="btn btn-outline quick-view__detail-btn">
            Batafsil
          </a>
        </div>
      </div>
    </div>`;
    this.showModal(html, { className: 'modal--quick-view' });
  },

  updateBadges() {
    const { itemCount } = Store.getCartTotal();
    const wlCount = Store.getWishlist().length;
    document.querySelectorAll('#cartBadge, #cartBadgeBottom').forEach(b => {
      b.textContent = itemCount;
      b.classList.toggle('is-on', itemCount > 0);
      b.style.display = itemCount > 0 ? 'flex' : 'none';
    });
    document.querySelectorAll('#wishlistBadge, #wishlistBadgeBottom').forEach(b => {
      b.textContent = wlCount;
      b.classList.toggle('is-on', wlCount > 0);
      b.style.display = wlCount > 0 ? 'flex' : 'none';
    });
    // Mini cart update
    const miniItems = document.getElementById('miniCartItems');
    const miniTotal = document.getElementById('miniCartTotal');
    if (miniItems) {
      const cart = Store.getCart();
      if (cart.length === 0) {
        miniItems.innerHTML = '<p class="text-center text-muted" style="padding:20px">Savat bo\'sh</p>';
      } else {
        miniItems.innerHTML = cart.slice(0, 3).map(ci => {
          const p = PRODUCTS.find(pr => pr.id === ci.productId);
          if (!p) return '';
          return `<div class="mini-cart__item" style="display:flex;gap:12px;padding:12px;border-bottom:1px solid var(--gray-100)">
            <img src="${p.image}" alt="" style="width:50px;height:60px;object-fit:cover;border-radius:6px">
            <div style="flex:1;min-width:0"><p style="font-weight:600;font-size:13px" class="text-truncate">${p.name}</p><p style="font-size:13px;color:var(--gray-500)">${ci.qty} × ${UI.formatPrice(p.price)}</p></div>
          </div>`;
        }).join('') + (cart.length > 3 ? `<p style="text-align:center;padding:8px;color:var(--gray-400);font-size:13px">+${cart.length - 3} ta mahsulot</p>` : '');
      }
    }
    if (miniTotal) { miniTotal.textContent = UI.formatPrice(Store.getCartTotal().subtotal); }
    this.updateHeaderAvatar();
  },
  initials(user) {
    const src = ((user && (user.name || user.email)) || 'K').trim();
    const parts = src.split(/[\s.@]+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return src.slice(0, 2).toUpperCase();
  },
  updateHeaderAvatar() {
    const btn = document.getElementById('userToggle');
    const user = Store.getUser();
    if (btn) {
      btn.querySelectorAll('.header-avatar').forEach(el => el.remove());
      btn.classList.toggle('is-logged', !!user);
      btn.title = user ? (user.name || 'Profil') : 'Profil';
      btn.querySelectorAll('svg, .icon, .user-toggle__icon, .user-toggle__svg').forEach(el => {
        el.style.display = user ? 'none' : '';
      });
      if (user) {
        if (user.avatar) {
          const img = document.createElement('img');
          img.className = 'header-avatar';
          img.alt = user.name || 'Profil';
          img.src = user.avatar;
          btn.appendChild(img);
        } else {
          const span = document.createElement('span');
          span.className = 'header-avatar header-avatar--initials';
          span.textContent = this.initials(user);
          btn.appendChild(span);
        }
      }
    }

    // Dynamic mobile menu sync based on login status
    const mobLinks = document.querySelector('.mobile-menu__links');
    if (mobLinks) {
      if (user) {
        mobLinks.innerHTML = `
          <li><a href="book_list.html">Bosh sahifa</a></li>
          <li><a href="categories.html">Kategoriyalar</a></li>
          <li><a href="cart.html">Savat</a></li>
          <li><a href="profile.html?tab=wishlist">Sevimlilarim</a></li>
          <li><a href="profile.html?tab=orders">Buyurtmalarim</a></li>
          <li><a href="profile.html">Profil (${user.name || 'Foydalanuvchi'})</a></li>
          <li><a href="#" id="mobLogoutLink" style="color:var(--danger, #ef4444);font-weight:600;"><i class="fa-solid fa-arrow-right-from-bracket" style="margin-right:6px;"></i> Chiqish</a></li>
        `;
        document.getElementById('mobLogoutLink')?.addEventListener('click', (e) => {
          e.preventDefault();
          Store.logout();
          location.reload();
        });
      } else {
        mobLinks.innerHTML = `
          <li><a href="book_list.html">Bosh sahifa</a></li>
          <li><a href="categories.html">Kategoriyalar</a></li>
          <li><a href="cart.html">Savat</a></li>
          <li><a href="login.html">Kirish</a></li>
          <li><a href="register.html">Ro'yxatdan o'tish</a></li>
        `;
      }
    }
  },

  formatPrice(price) {
    if (price == null) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm";
  },
  formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const months = ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'];
    return `${d.getDate()}-${months[d.getMonth()]}, ${d.getFullYear()}`;
  },

  startGoogleOAuth(onSuccess) {
    const clientId = (window.APP_CONFIG && window.APP_CONFIG.GOOGLE_CLIENT_ID) || '';
    if (!clientId) {
      UI.showToast("Google Client ID topilmadi (config.js ni tekshiring)", "error");
      return;
    }

    if (typeof onSuccess === 'function') {
      window._googleAuthSuccessCallback = onSuccess;
    }

    // 1. If Google Identity Services (GSI) is loaded, open Google's native official sign-in popup
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          callback: (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              UI.fetchGoogleUserInfo(tokenResponse.access_token, onSuccess);
            } else if (tokenResponse && tokenResponse.error) {
              console.warn('Google OAuth token error:', tokenResponse);
              UI.showToast("Google hisobiga ulanish bekor qilindi", "info");
            }
          },
          error_callback: (err) => {
            console.warn('Google GSI popup error, redirecting directly to accounts.google.com:', err);
            UI.redirectToGoogleOAuth(clientId);
          }
        });
        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('Google tokenClient exception:', err);
      }
    }

    // 2. Standard direct redirect to accounts.google.com OAuth 2.0 authorization endpoint
    UI.redirectToGoogleOAuth(clientId);
  },

  redirectToGoogleOAuth(clientId) {
    const redirectUri = window.location.origin + window.location.pathname;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=openid%20email%20profile&prompt=select_account&nonce=${Date.now()}`;
    window.location.href = url;
  },

  async fetchGoogleUserInfo(accessToken, onSuccess) {
    try {
      UI.showToast("Google hisobingiz ma'lumotlari yuklanmoqda...", "info");
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error("Google UserInfo API javob bermadi");
      const data = await res.json();
      if (data && (data.email || data.sub)) {
        const existing = Store.findUser(data.email) || Store.findUser(data.sub);
        const onAuthPage = location.pathname.includes('login') || location.pathname.includes('register');
        const isRegisterPage = location.pathname.includes('register') || (document.getElementById('cardContainer')?.classList.contains('flipped'));

        if (existing && existing.username && existing.password && !isRegisterPage) {
          Store.setUser(existing);
          UI.showToast(`Xush kelibsiz, ${existing.name}! Google orqali kirdingiz.`, 'success');
          if (typeof onSuccess === 'function') onSuccess(existing);
          else {
            setTimeout(() => {
              if (onAuthPage) location.href = 'book_list.html';
              else location.reload();
            }, 400);
          }
        } else {
          // Open the social registration modal to complete details
          UI.showSocialCompleteModal({
            provider: 'google',
            name: data.name || data.given_name || 'Google Foydalanuvchisi',
            email: data.email || '',
            avatar: data.picture || null
          }, onSuccess);
        }
      } else {
        throw new Error("Profil ma'lumotlari bo'sh qaytdi");
      }
    } catch (err) {
      console.error('Google userinfo error:', err);
      UI.showToast("Google orqali ma'lumotlarni yuklab bo'lmadi", "error");
    }
  },

  checkOAuthRedirect() {
    if (window.location.hash && window.location.hash.includes('access_token=')) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      if (accessToken) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
        UI.fetchGoogleUserInfo(accessToken);
      }
    }
  },

  showGoogleOAuthModal(onSuccess) {
    return this.startGoogleOAuth(onSuccess);
  },

  showTelegramAuthModal(onSuccess) {
    const botUser = (window.APP_CONFIG && window.APP_CONFIG.TELEGRAM_BOT_USERNAME) || 'BooksawUzBot';
    const botUrl = 'https://t.me/' + botUser + '?start=otp';

    let generatedOtp = '';
    let currentPhone = '';
    let countdownInterval = null;

    const html = `
      <div class="telegram-auth-box">
        <div class="tg-badge-icon" style="background: linear-gradient(135deg, #0f172a 0%, #3b82f6 100%); box-shadow: 0 8px 20px rgba(15, 23, 42, 0.25);">
          ${ICONS.telegram}
        </div>

        <!-- STEP 1: Phone number -->
        <div id="tgStepPhone">
          <h3 style="font-size:22px;font-weight:700;margin:0 0 8px;color:var(--text-primary);">Telegram orqali kirish</h3>
          <p style="font-size:14px;color:var(--text-muted);margin:0 0 20px;line-height:1.5;">
            Telegram raqamingizni kiriting. Biz <strong>@${botUser}</strong> boti orqali 6 xonali tasdiqlash kodini yuboramiz.
          </p>

          <div class="tg-phone-input-wrap">
            <span class="tg-phone-prefix">🇺🇿 +998</span>
            <input type="tel" id="tgPhoneInput" class="tg-phone-input" placeholder="(90) 123-45-67" maxlength="15" autocomplete="tel">
          </div>
          <div id="tgPhoneError" style="display:none;color:#ef4444;font-size:13px;margin:-10px 0 14px;text-align:left;"></div>

          <a href="${botUrl}" target="_blank" rel="noopener noreferrer" class="tg-bot-chip" style="width:100%;justify-content:center;color:#2563eb;margin-bottom:12px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">${ICONS.telegram}</svg>
            @${botUser} botida /start ni bosing
          </a>

          <button type="button" class="btn btn-primary" id="tgSendOtpBtn" style="width:100%;background:var(--primary);border-color:var(--primary);font-size:15px;font-weight:600;height:46px;margin-top:6px;">
            Tasdiqlash kodini olish
          </button>

          <p style="font-size:12px;color:var(--text-muted);margin:14px 0 0;line-height:1.4;">
            🔒 Xavfsiz avtorizatsiya. Kod faqat sizning rasmiy Telegram botingizga yuboriladi.
          </p>
        </div>

        <!-- STEP 2: Enter OTP -->
        <div id="tgStepOtp" style="display:none;">
          <h3 style="font-size:22px;font-weight:700;margin:0 0 6px;color:var(--text-primary);">Tasdiqlash kodi</h3>
          <p style="font-size:14px;color:var(--text-muted);margin:0 0 8px;">
            Kod ushbu raqamga bog'langan Telegramga yuborildi:
          </p>
          <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:16px;">
            <strong id="tgEnteredPhone" style="font-size:16px;color:var(--text-primary);">+998</strong>
            <button type="button" id="tgChangePhoneBtn" style="background:none;border:none;color:#2563eb;font-size:13px;cursor:pointer;text-decoration:underline;padding:0;">O'zgartirish</button>
          </div>

          <div class="tg-otp-grid">
            <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="tg-otp-box" data-idx="0" autofocus autocomplete="one-time-code">
            <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="tg-otp-box" data-idx="1">
            <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="tg-otp-box" data-idx="2">
            <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="tg-otp-box" data-idx="3">
            <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="tg-otp-box" data-idx="4">
            <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="tg-otp-box" data-idx="5">
          </div>

          <div id="tgOtpError" style="display:none;color:#ef4444;font-size:13px;margin:-8px 0 14px;font-weight:600;"></div>
          <div id="tgOtpNotice" style="display:none;padding:10px 12px;border-radius:10px;background:var(--bg-hover);border:1px solid var(--border);color:var(--text-muted);font-size:12px;margin-bottom:16px;"></div>

          <div class="tg-timer-text">
            Kodni qayta yuborish: <span class="tg-timer-count" id="tgTimerCount">00:59</span>
            <button type="button" id="tgResendBtn" style="display:none;background:none;border:none;color:#2563eb;font-weight:600;cursor:pointer;text-decoration:underline;margin-left:6px;">Qayta yuborish</button>
          </div>

          <a href="${botUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width:100%;font-size:13px;padding:10px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;gap:6px;">
            💬 Telegram botni ochish (@${botUser})
          </a>

          <button type="button" class="btn btn-primary" id="tgVerifyBtn" style="width:100%;background:var(--primary);border-color:var(--primary);font-size:15px;font-weight:600;height:46px;">
            Tasdiqlash va kirish
          </button>
        </div>
      </div>
    `;

    const modalRes = this.showModal(html, { className: 'modal--telegram-auth' });

    // Elements
    const stepPhone = document.getElementById('tgStepPhone');
    const stepOtp = document.getElementById('tgStepOtp');
    const phoneInput = document.getElementById('tgPhoneInput');
    const phoneError = document.getElementById('tgPhoneError');
    const sendOtpBtn = document.getElementById('tgSendOtpBtn');
    const enteredPhoneEl = document.getElementById('tgEnteredPhone');
    const changePhoneBtn = document.getElementById('tgChangePhoneBtn');
    const otpBoxes = Array.from(document.querySelectorAll('.tg-otp-box'));
    const otpError = document.getElementById('tgOtpError');
    const otpNotice = document.getElementById('tgOtpNotice');
    const timerCount = document.getElementById('tgTimerCount');
    const resendBtn = document.getElementById('tgResendBtn');
    const verifyBtn = document.getElementById('tgVerifyBtn');

    // Auto-mask for phone input: (90) 123-45-67
    if (phoneInput) {
      phoneInput.focus();
      phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.startsWith('998')) val = val.slice(3);
        val = val.slice(0, 9);
        let formatted = '';
        if (val.length > 0) formatted += '(' + val.slice(0, 2);
        if (val.length >= 2) formatted += ') ' + val.slice(2, 5);
        if (val.length >= 5) formatted += '-' + val.slice(5, 7);
        if (val.length >= 7) formatted += '-' + val.slice(7, 9);
        e.target.value = formatted;
        if (phoneError) phoneError.style.display = 'none';
      });
      phoneInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendOtpBtn?.click();
      });
    }

    // Timer logic
    const startTimer = () => {
      if (countdownInterval) clearInterval(countdownInterval);
      let secondsLeft = 59;
      if (timerCount) {
        timerCount.textContent = '00:59';
        timerCount.style.display = '';
      }
      if (resendBtn) resendBtn.style.display = 'none';

      countdownInterval = setInterval(() => {
        secondsLeft--;
        if (secondsLeft <= 0) {
          clearInterval(countdownInterval);
          if (timerCount) timerCount.style.display = 'none';
          if (resendBtn) resendBtn.style.display = 'inline';
        } else {
          const s = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft;
          if (timerCount) timerCount.textContent = '00:' + s;
        }
      }, 1000);
    };

    // The backend sends OTPs; browser code never receives the bot token.
    const dispatchOtp = async (phone) => {
      generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const timeStr = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const text = '🔐 <b>Booksaw Tasdiqlash Kodi:</b> <code>' + generatedOtp + '</code>\n\n' +
                   '📱 <b>Telefon:</b> ' + phone + '\n' +
                   '⏰ <b>Vaqt:</b> ' + timeStr + '\n\n' +
                   '⚠️ Ushbu tasdiqlash kodini hech kimga bermang! Kod 3 daqiqa davomida amal qiladi.';

      let directSuccess = false;
      let apiDesc = '';

      try {
        // The backend owns the Telegram token and sends the message.
        // Calling Telegram directly from the browser would expose the token.
        const data = await Api.sendTelegramOtp(phone);
        directSuccess = data.ok !== false;
        if (data.mock) generatedOtp = '123456';
      } catch (err) {
        apiDesc = err.message || 'Tarmoq / CORS xatoligi';
      }

      if (directSuccess) {
        UI.showToast("Tasdiqlash kodi Telegram botingizga yuborildi!", "success");
        if (otpNotice) {
          otpNotice.innerHTML = Api.isMock()
            ? 'Demo rejim: tasdiqlash kodi <strong>123456</strong>.'
            : `6 xonali tasdiqlash kodi <strong>@${botUser}</strong> botingizga yuborildi. Telegramdagi xabarni tekshiring.`;
          otpNotice.style.display = 'block';
          otpNotice.style.borderColor = 'var(--primary)';
          otpNotice.style.color = 'var(--text-primary)';
        }
      } else {
        UI.showToast("Telegram botiga kod yuborishda xatolik: " + apiDesc, "error");
        if (otpNotice) {
          otpNotice.innerHTML = `
            <div style="text-align:left;line-height:1.5;">
              <div style="color:#ef4444;font-weight:600;margin-bottom:4px;">⚠️ Telegram Bot holati: ${apiDesc}</div>
              <div style="color:var(--text-muted);font-size:12px;">
                Iltimos, avval Telegram ilovangizda <strong>@${botUser}</strong> botini ochib <strong>/start</strong> tugmasini bosing va qaytadan kod so'rang.
              </div>
            </div>`;
          otpNotice.style.display = 'block';
          otpNotice.style.borderColor = '#ef4444';
        }
      }
      return directSuccess;
    };

    // Step 1 -> Step 2
    sendOtpBtn?.addEventListener('click', async () => {
      const raw = (phoneInput?.value || '').replace(/\D/g, '');
      const digits = raw.startsWith('998') ? raw.slice(3) : raw;
      if (digits.length !== 9) {
        if (phoneError) {
          phoneError.textContent = "Iltimos, 9 xonali telefon raqamingizni to'liq kiriting (masalan: 90 123 45 67)";
          phoneError.style.display = 'block';
        }
        phoneInput?.focus();
        return;
      }

      currentPhone = '+998 ' + (phoneInput?.value || digits);
      if (enteredPhoneEl) enteredPhoneEl.textContent = currentPhone;

      sendOtpBtn.disabled = true;
      sendOtpBtn.textContent = 'Kod yuborilmoqda...';

      const sent = await dispatchOtp(currentPhone);

      sendOtpBtn.disabled = false;
      sendOtpBtn.textContent = 'Tasdiqlash kodini olish';
      if (!sent) return;

      if (stepPhone) stepPhone.style.display = 'none';
      if (stepOtp) stepOtp.style.display = 'block';

      // Clear & focus first OTP box
      otpBoxes.forEach(b => { b.value = ''; b.classList.remove('is-filled', 'is-error'); });
      otpBoxes[0]?.focus();
      startTimer();
    });

    // Edit phone button
    changePhoneBtn?.addEventListener('click', () => {
      if (countdownInterval) clearInterval(countdownInterval);
      if (stepOtp) stepOtp.style.display = 'none';
      if (stepPhone) stepPhone.style.display = 'block';
      if (otpError) otpError.style.display = 'none';
      phoneInput?.focus();
    });

    // Resend OTP button
    resendBtn?.addEventListener('click', async () => {
      resendBtn.style.display = 'none';
      if (timerCount) {
        timerCount.style.display = '';
        timerCount.textContent = 'Yuborilmoqda...';
      }
      await dispatchOtp(currentPhone);
      startTimer();
      otpBoxes.forEach(b => { b.value = ''; b.classList.remove('is-filled', 'is-error'); });
      otpBoxes[0]?.focus();
    });

    // OTP Boxes keyboard & paste navigation
    otpBoxes.forEach((box, idx) => {
      box.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val ? val[0] : '';
        if (val) {
          box.classList.add('is-filled');
          box.classList.remove('is-error');
          if (idx < otpBoxes.length - 1) {
            otpBoxes[idx + 1].focus();
          } else {
            const allVal = otpBoxes.map(b => b.value).join('');
            if (allVal.length === 6) verifyOtp();
          }
        } else {
          box.classList.remove('is-filled');
        }
        if (otpError) otpError.style.display = 'none';
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && idx > 0) {
          otpBoxes[idx - 1].focus();
          otpBoxes[idx - 1].value = '';
          otpBoxes[idx - 1].classList.remove('is-filled');
        } else if (e.key === 'ArrowLeft' && idx > 0) {
          otpBoxes[idx - 1].focus();
        } else if (e.key === 'ArrowRight' && idx < otpBoxes.length - 1) {
          otpBoxes[idx + 1].focus();
        } else if (e.key === 'Enter') {
          verifyOtp();
        }
      });

      box.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        if (!text) return;
        for (let i = 0; i < otpBoxes.length; i++) {
          if (text[i]) {
            otpBoxes[i].value = text[i];
            otpBoxes[i].classList.add('is-filled');
          }
        }
        const lastIdx = Math.min(text.length - 1, otpBoxes.length - 1);
        if (lastIdx >= 0) otpBoxes[lastIdx].focus();
        if (text.length >= 6) verifyOtp();
      });
    });

    // Verify OTP logic
    const verifyOtp = async () => {
      const enteredCode = otpBoxes.map(b => b.value).join('');
      if (enteredCode.length < 6) {
        if (otpError) {
          otpError.textContent = "Iltimos, 6 xonali tasdiqlash kodini to'liq kiriting.";
          otpError.style.display = 'block';
        }
        const firstEmpty = otpBoxes.find(b => !b.value);
        if (firstEmpty) firstEmpty.focus();
        return;
      }

      let verified = false;
      try {
        verified = Api.isMock()
          ? enteredCode === generatedOtp
          : (await Api.verifyTelegramOtp(currentPhone, enteredCode)).ok === true;
      } catch (err) {
        if (otpError) {
          otpError.textContent = err.message || "Kod tekshirilmagan. Qayta urinib ko'ring.";
          otpError.style.display = 'block';
        }
        return;
      }

      if (!verified) {
        if (otpError) {
          otpError.textContent = "❌ Tasdiqlash kodi noto'g'ri. Telegram botdagi xabarni tekshiring.";
          otpError.style.display = 'block';
        }
        otpBoxes.forEach(b => {
          b.classList.add('is-error');
          setTimeout(() => b.classList.remove('is-error'), 500);
        });
        otpBoxes[0]?.focus();
        return;
      }

      // SUCCESS!
      if (countdownInterval) clearInterval(countdownInterval);
      if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '✅ Tasdiqlandi!';
      }
      otpBoxes.forEach(b => {
        b.style.borderColor = 'var(--primary)';
        b.style.background = 'var(--bg-hover)';
      });

      setTimeout(() => {
        modalRes.close();
        const existing = Store.findUser(currentPhone);
        const onAuthPage = location.pathname.includes('login') || location.pathname.includes('register');
        const isRegisterPage = location.pathname.includes('register') || (document.getElementById('cardContainer')?.classList.contains('flipped'));
        if (existing && existing.username && existing.password && !isRegisterPage) {
          Store.setUser(existing);
          UI.showToast(`Xush kelibsiz, ${existing.name}!`);
          if (typeof onSuccess === 'function') onSuccess();
          else {
            setTimeout(() => {
              if (onAuthPage) location.href = 'book_list.html';
              else location.reload();
            }, 400);
          }
        } else {
          UI.showSocialCompleteModal({
            provider: 'telegram',
            phone: currentPhone,
            name: '',
            email: ''
          }, onSuccess);
        }
      }, 500);
    };

    verifyBtn?.addEventListener('click', verifyOtp);
  },

  showSocialCompleteModal(initialData = {}, onSuccess) {
    const provider = initialData.provider || 'social';
    const isGoogle = provider === 'google';
    const rawName = (initialData.name || '').trim();
    const rawEmail = (initialData.email || '').trim();
    const rawPhone = (initialData.phone || '').trim();
    const suggestedUsername = rawEmail
      ? '@' + rawEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_')
      : (rawName ? '@' + rawName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') : '@foydalanuvchi');

    const providerTitle = isGoogle ? "Google orqali ro'yxatdan o'tish" : "Telegram orqali ro'yxatdan o'tish";
    const providerBadge = isGoogle
      ? `<svg width="28" height="28" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>`
      : `<div style="color:#0088cc;display:flex;align-items:center;justify-content:center;">${ICONS.telegram}</div>`;

    const html = `
      <div class="social-complete-box">
        <div class="social-complete__header">
          <div class="social-complete__badge">
            ${providerBadge}
          </div>
          <h3 class="social-complete__title">${providerTitle}</h3>
          <p class="social-complete__sub">
            Hisobingizni to'liq faollashtirish uchun shaxsiy ma'lumotlar va yangi xavfsiz parol kiriting.
          </p>
        </div>

        <form id="scForm" class="social-complete__form" novalidate>
          <div class="input-group">
            <label for="scName">To'liq ism *</label>
            <input type="text" id="scName" class="input-box" placeholder="Ism va familiyangiz" value="${rawName}" autocomplete="name">
            <span class="neu-input-error" id="scNameError">Ismingizni kamida 2 ta belgi bilan kiriting</span>
          </div>

          <div class="input-group">
            <label for="scUsername">Foydalanuvchi nomi (Username) *</label>
            <input type="text" id="scUsername" class="input-box" placeholder="@username" value="${suggestedUsername}" autocomplete="username">
            <span class="neu-input-error" id="scUsernameError">Username kamida 3 ta harf/raqamdan iborat bo'lishi kerak</span>
          </div>

          <div class="social-complete__row">
            <div class="input-group" style="flex:1;">
              <label for="scEmail">Email manzil *</label>
              <input type="email" id="scEmail" class="input-box" placeholder="pochta@gmail.com" value="${rawEmail}" autocomplete="email">
              <span class="neu-input-error" id="scEmailError">To'g'ri email manzil kiriting</span>
            </div>

            <div class="input-group" style="flex:1;">
              <label for="scPhone">Telefon raqam</label>
              <input type="tel" id="scPhone" class="input-box" placeholder="+998 (90) 123-45-67" value="${rawPhone}" autocomplete="tel">
              <span class="neu-input-error" id="scPhoneError">To'liq telefon raqam kiriting</span>
            </div>
          </div>

          <div class="social-complete__row">
            <div class="input-group" style="flex:1;">
              <label for="scPassword">Yangi parol *</label>
              <input type="password" id="scPassword" class="input-box" placeholder="Kamida 6 ta belgi" autocomplete="new-password">
              <i class="fa-solid fa-eye toggle-pass" data-target="scPassword"></i>
              <span class="neu-input-error" id="scPasswordError">Parol kamida 6 ta belgi bo'lishi kerak</span>
            </div>

            <div class="input-group" style="flex:1;">
              <label for="scConfirm">Parolni tasdiqlash *</label>
              <input type="password" id="scConfirm" class="input-box" placeholder="Qayta kiriting" autocomplete="new-password">
              <i class="fa-solid fa-eye toggle-pass" data-target="scConfirm"></i>
              <span class="neu-input-error" id="scConfirmError">Parollar bir-biriga mos kelmadi</span>
            </div>
          </div>

          <!-- Password strength meter -->
          <div class="neu-strength-meter" id="scStrengthMeter" style="display:none;margin-top:-6px;margin-bottom:14px;">
            <span class="neu-strength-bar" id="scStrBar1"></span>
            <span class="neu-strength-bar" id="scStrBar2"></span>
            <span class="neu-strength-bar" id="scStrBar3"></span>
          </div>

          <div class="options-row" style="margin:6px 0 20px;">
            <label class="checkbox-label" style="font-size:12.5px;cursor:pointer;">
              <input type="checkbox" id="scTerms" checked>
              <span>Men Booksaw <a href="info.html?page=terms" target="_blank" style="color:var(--neu-accent);font-weight:600;">foydalanish shartlari</a>ga roziman</span>
            </label>
          </div>
          <span class="neu-input-error" id="scTermsError" style="margin:-12px 0 12px;">Xizmat shartlariga rozilik bildiring</span>

          <button type="submit" class="btn-submit success" id="scSubmitBtn">
            <i class="fa-solid fa-user-check"></i> Hisobni yaratish va kirish
          </button>
        </form>
      </div>
    `;

    const modalRes = this.showModal(html, { className: 'modal--social-complete' });

    // Eye toggles for password fields
    document.querySelectorAll('.modal--social-complete .toggle-pass').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          btn.classList.remove('fa-eye');
          btn.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          btn.classList.remove('fa-eye-slash');
          btn.classList.add('fa-eye');
        }
      });
    });

    // Password strength meter
    const passInput = document.getElementById('scPassword');
    const meter = document.getElementById('scStrengthMeter');
    const b1 = document.getElementById('scStrBar1');
    const b2 = document.getElementById('scStrBar2');
    const b3 = document.getElementById('scStrBar3');
    passInput?.addEventListener('input', () => {
      const val = passInput.value || '';
      if (!val) {
        meter.style.display = 'none';
        [b1, b2, b3].forEach(b => { if (b) b.className = 'neu-strength-bar'; });
        return;
      }
      meter.style.display = 'flex';
      let score = 0;
      if (val.length >= 6) score++;
      if (/[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;
      if (val.length >= 9 && /[A-Z]/.test(val) && /[a-z]/.test(val)) score++;

      [b1, b2, b3].forEach(b => { if (b) b.className = 'neu-strength-bar'; });
      if (score === 1) {
        b1?.classList.add('is-weak');
      } else if (score === 2) {
        b1?.classList.add('is-medium');
        b2?.classList.add('is-medium');
      } else if (score >= 3) {
        b1?.classList.add('is-strong');
        b2?.classList.add('is-strong');
        b3?.classList.add('is-strong');
      }
    });

    // Clear error states on input
    ['scName', 'scUsername', 'scEmail', 'scPhone', 'scPassword', 'scConfirm'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', function () {
        this.classList.remove('error');
        document.getElementById(id + 'Error')?.classList.remove('is-on');
      });
    });

    // Form submit logic
    const form = document.getElementById('scForm');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const nameEl = document.getElementById('scName');
      const userEl = document.getElementById('scUsername');
      const emailEl = document.getElementById('scEmail');
      const phoneEl = document.getElementById('scPhone');
      const passEl = document.getElementById('scPassword');
      const confEl = document.getElementById('scConfirm');
      const termsEl = document.getElementById('scTerms');

      const nameVal = (nameEl?.value || '').trim();
      const userVal = (userEl?.value || '').trim();
      const emailVal = (emailEl?.value || '').trim();
      const phoneVal = (phoneEl?.value || '').trim();
      const passVal = passEl?.value || '';
      const confVal = confEl?.value || '';

      if (nameVal.length < 2) {
        nameEl?.classList.add('error');
        document.getElementById('scNameError')?.classList.add('is-on');
        valid = false;
      }
      const cleanUser = userVal.replace(/^@/, '');
      if (!cleanUser || cleanUser.length < 3 || !/^[a-zA-Z0-9_]+$/.test(cleanUser)) {
        userEl?.classList.add('error');
        document.getElementById('scUsernameError')?.classList.add('is-on');
        valid = false;
      }
      if (!emailVal || !/\S+@\S+\.\S+/.test(emailVal)) {
        emailEl?.classList.add('error');
        document.getElementById('scEmailError')?.classList.add('is-on');
        valid = false;
      }
      if (passVal.length < 6) {
        passEl?.classList.add('error');
        document.getElementById('scPasswordError')?.classList.add('is-on');
        valid = false;
      }
      if (confVal !== passVal) {
        confEl?.classList.add('error');
        document.getElementById('scConfirmError')?.classList.add('is-on');
        valid = false;
      }
      if (termsEl && !termsEl.checked) {
        document.getElementById('scTermsError')?.classList.add('is-on');
        valid = false;
      }

      if (!valid) return;

      const submitBtn = document.getElementById('scSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saqlanmoqda...';
      }

      setTimeout(() => {
        const fullUser = {
          name: nameVal,
          username: userVal.startsWith('@') ? userVal : '@' + userVal,
          email: emailVal,
          phone: phoneVal,
          password: passVal,
          avatar: initialData.avatar || null,
          provider: provider
        };
        Store.loginWithOAuth(fullUser);
        modalRes.close();
        UI.showToast("Muvaffaqiyatli ro'yxatdan o'tdingiz, xush kelibsiz!", "success");
        if (typeof onSuccess === 'function') onSuccess();
        else {
          setTimeout(() => {
            if (location.pathname.includes('login') || location.pathname.includes('register')) {
              location.href = 'book_list.html';
            } else {
              location.reload();
            }
          }, 400);
        }
      }, 600);
    });
  }
};

/* ========================================================================
   3. SEARCH & FILTER
   ======================================================================== */
const Search = {
  query: '', filters: { categories: [], minPrice: 0, maxPrice: Infinity, ratings: [], inStock: false },
  sortBy: 'popular', viewMode: 'grid',

  search(query) {
    let results = [...PRODUCTS];
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

    const highlightMatch = (text, query) => {
      if (!query) return text || '';
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return (text || '').replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
    };

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
                <a href="book_detail.html?id=${p.id}" class="search-suggestions__item" data-id="${p.id}" style="display:flex;gap:12px;padding:10px 14px;align-items:center;text-decoration:none;color:inherit;border-radius:8px;margin:2px 4px;transition:background 0.15s ease;">
                  <img src="${p.image}" alt="" style="width:40px;height:52px;object-fit:cover;border-radius:4px 8px 8px 4px;box-shadow:-2px 4px 10px rgba(0,0,0,0.18);flex-shrink:0;">
                  <div style="flex:1;min-width:0;">
                    <p style="font-weight:600;font-size:14px;line-height:1.3;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                      ${highlightMatch(p.name, val)}
                    </p>
                    <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--gray-500);margin-top:2px;">
                      <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${highlightMatch(p.author, val)}</span>
                      <span style="font-size:10px;padding:1px 6px;border-radius:4px;background:var(--bg-hover, rgba(0,0,0,0.05));color:var(--gray-500);">${p.categoryName}</span>
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
      if (!inputEl.contains(e.target) && !suggestionsEl.contains(e.target)) {
        suggestionsEl.classList.remove('active');
        selectedIndex = -1;
      }
    });

    // Global keyboard shortcut: Ctrl+K, Cmd+K or / to focus search
    if (!window._searchShortcutBound) {
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
   4. PRODUCT CARD RENDERER
   ======================================================================== */
function renderProductCard(product, mode = 'grid') {
  const inWL = Store.isInWishlist(product.id);
  const listCls = mode === 'list' ? ' product-card--list' : '';
  const outOverlay = !product.inStock ? '<div class="product-card__out-overlay"><span>Tugagan</span></div>' : '';

  let badgeHtml = '';
  if (product.discount) badgeHtml += `<span class="badge badge-sale">-${product.discount}%</span>`;
  if (product.badge === 'new') badgeHtml += '<span class="badge badge-new">Yangi</span>';
  if (product.badge === 'bestseller') badgeHtml += '<span class="badge badge-bestseller">Bestseller</span>';

  return `<div class="product-card${listCls}${product.inStock ? '' : ' is-out'}" data-href="book_detail.html?id=${product.id}" role="link" tabindex="0">
    <a href="book_detail.html?id=${product.id}" class="product-card__image-wrap" aria-label="${product.name}">
      <img class="product-card__image product-card__image--primary" src="${product.image}" alt="${product.name}" loading="lazy" draggable="false">
      <img class="product-card__image product-card__image--hover" src="${product.image2 || product.image}" alt="" loading="lazy" draggable="false">
      ${outOverlay}
      <div class="product-card__badges">${badgeHtml}</div>
      <button type="button" class="product-card__wishlist${inWL ? ' active' : ''}" data-id="${product.id}" title="Sevimlilarga">${inWL ? ICONS.heartFilled : ICONS.heart}</button>
    </a>
    <div class="product-card__body">
      <div class="product-card__category">${product.categoryName}</div>
      <a href="book_detail.html?id=${product.id}" class="product-card__title">${product.name}</a>
      <p class="product-card__author">${product.author}</p>
      <div class="product-card__rating"><span class="stars">${renderStars(product.rating)}</span>${product.reviewCount ? ` <span>(${product.reviewCount})</span>` : ''}</div>
      <div class="product-card__price">
        <span class="product-card__price-current">${UI.formatPrice(product.price)}</span>
        ${product.oldPrice && product.oldPrice > product.price ? `<span class="product-card__price-old">${UI.formatPrice(product.oldPrice)}</span>` : ''}
      </div>
      <div class="product-card__cta">
        <button type="button" class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product.id}"${!product.inStock ? ' disabled' : ''}>${product.inStock ? `${ICONS.cart} Savatga` : 'Tugagan'}</button>
        <button type="button" class="btn btn-secondary btn-sm quick-view-btn" data-id="${product.id}">Ko'rish</button>
      </div>
    </div>
  </div>`;
}

/* ========================================================================
   5. HERO SLIDER
   ======================================================================== */
const Slider = {
  current: 0, interval: null, total: 0, dragging: false,
  init() {
    const slidesEl = document.getElementById('heroSlides');
    const dotsEl = document.getElementById('heroDots');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    if (!slidesEl || typeof BANNERS === 'undefined' || !BANNERS.length) return;
    this.total = BANNERS.length;

    slidesEl.innerHTML = BANNERS.map(b => `
      <div class="hero__slide">
        <img src="${b.image}" alt="${b.title}">
        <div class="hero__content">
          <h2>${b.title}</h2>
          <p>${b.subtitle}</p>
          <a href="${b.link}" class="btn btn-primary">${b.buttonText}</a>
        </div>
      </div>`).join('');

    if (dotsEl) dotsEl.innerHTML = BANNERS.map((_, i) => `<button class="hero__dot${i === 0 ? ' active' : ''}" data-idx="${i}"></button>`).join('');

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
   6. PRODUCT DETAIL
   ======================================================================== */
const ProductDetail = {
  product: null,
  init() {
    const id = parseInt(new URLSearchParams(location.search).get('id'));
    this.product = PRODUCTS.find(p => p.id === id);
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
      bc.innerHTML = `<a href="book_list.html?cat=${p.categoryId}">${p.categoryName}</a>`;
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
        `<div class="gallery__thumb${i === 0 ? ' active' : ''}" data-img="${img}"><img src="${img}" alt=""></div>`
      ).join('');
      thumbsC.addEventListener('click', e => {
        const thumb = e.target.closest('.gallery__thumb');
        if (!thumb) return;
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
        <div class="variant-options">${covers.map((v, i) => `<button type="button" class="variant-option${i === 0 ? ' selected' : ''}" data-variant="${v}">${v}</button>`).join('')}</div>
      </div>` : covers.length === 1 ? `<p class="product-info__cover-type">Muqova: ${covers[0]}</p>` : '';

    infoEl.innerHTML = `
      <div class="product-info__category" style="color:var(--gray-400);font-size:13px;text-transform:uppercase">${p.categoryName}</div>
      <h1 class="product-info__title">${p.name}</h1>
      <p style="color:var(--gray-500);margin:4px 0 12px">${p.author}</p>
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
        <a class="link-btn" href="store.html?id=${p.storeId || 1}">${ICONS.store} Sotuvchi</a>
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
      const qty = parseInt(qtyInput?.value) || 1;
      const variant = infoEl.querySelector('.variant-option.selected')?.dataset.variant || null;
      Store.addToCart(p.id, qty, variant);
      UI.showToast("Savatga qo'shildi!");
      Animations.flyToCart(document.getElementById('mainImage') || document.getElementById('addToCartDetail'));
    });
    // Buy now
    document.getElementById('buyNowDetail')?.addEventListener('click', () => {
      const qty = parseInt(qtyInput?.value) || 1;
      Store.addToCart(p.id, qty);
      location.href = 'checkout.html';
    });
    document.getElementById('wishDetail')?.addEventListener('click', () => {
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
      <img src="${p.image}" alt="">
      <div><strong>${p.name}</strong><span>${UI.formatPrice(p.price)}</span></div>
      <button type="button" class="btn btn-primary btn-sm" id="stickyAdd"${p.inStock ? '' : ' disabled'}>Savatga</button>
    </div>`;
    document.body.appendChild(bar);
    document.getElementById('stickyAdd')?.addEventListener('click', () => {
      const qty = parseInt(document.getElementById('qtyInput')?.value) || 1;
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
    // Zoom lens on main image
    const mainImg = document.getElementById('mainImage');
    const lens = document.getElementById('zoomLens');
    if (!mainImg || !lens) return;
    const container = mainImg.parentElement;
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
    // Populate description & features & reviews
    const p = this.product;
    const descPanel = document.getElementById('tab-description');
    if (descPanel) descPanel.innerHTML = `<div style="max-width:800px;line-height:1.8">${p.description}</div>`;
    const featPanel = document.getElementById('tab-features');
    if (featPanel && p.features) {
      featPanel.innerHTML = `<table style="width:100%;max-width:600px;border-collapse:collapse">${p.features.map(f =>
        `<tr style="border-bottom:1px solid var(--gray-100)"><td style="padding:12px 16px;font-weight:600;color:var(--gray-600);width:40%">${f.label}</td><td style="padding:12px 16px">${f.value}</td></tr>`
      ).join('')}</table>`;
    }
    const revPanel = document.getElementById('tab-reviews');
    if (revPanel) {
      const reviews = (typeof REVIEWS !== 'undefined' && REVIEWS[p.id]) ? REVIEWS[p.id] : [];
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
            <strong>${r.userName}</strong><span style="color:var(--gray-400);font-size:13px">${UI.formatDate(r.date)}</span>
          </div>
          <div style="color:var(--accent);margin-bottom:8px;display:flex;">${renderStars(r.rating)}</div>
          <p style="color:var(--gray-600);line-height:1.7">${r.text}</p>
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
        const user = Store.getUser();
        if (!user) { location.href = 'login.html'; return; }
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
      const seeded = (typeof QNA !== 'undefined' && QNA[p.id]) ? QNA[p.id] : [];
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
            <p><strong>${q.userName}</strong> <span>${UI.formatDate(q.date)}</span></p>
            <p class="qna-q">${q.text}</p>
            ${q.answer ? `<p class="qna-a">${ICONS.check} ${q.answer}</p>` : '<p class="qna-a muted">Javob kutilmoqda</p>'}
          </div>`).join('') : '<p class="empty-hint">Hozircha savollar yo‘q.</p>'}`;
      document.getElementById('qnaForm')?.addEventListener('submit', e => {
        e.preventDefault();
        const user = Store.getUser();
        if (!user) { location.href = 'login.html'; return; }
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
    const similar = PRODUCTS.filter(pr => pr.categoryId === this.product.categoryId && pr.id !== this.product.id).slice(0, 8);
    el.innerHTML = similar.map(p => renderProductCard(p)).join('');
  }
};

/* ========================================================================
   7. CART PAGE
   ======================================================================== */
const CartPage = {
  promoApplied: null,
  _bound: false,
  init() {
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
      const itemsHtml = cart.map(ci => {
        const p = PRODUCTS.find(pr => pr.id === ci.productId);
        if (!p) return '';
        return `<div class="cart-item" data-id="${p.id}">
          <img class="cart-item__image" src="${p.image}" alt="${p.name}">
          <div class="cart-item__info">
            <a href="book_detail.html?id=${p.id}" class="cart-item__name">${p.name}</a>
            <p class="cart-item__variant">${p.author}${ci.variant ? ' • ' + ci.variant : ''}</p>
          </div>
          <div class="cart-item__price">${UI.formatPrice(p.price)}</div>
          <div class="quantity-selector cart-item__qty">
            <button type="button" class="cart-qty-btn" data-action="minus" data-id="${p.id}">${ICONS.minus}</button>
            <span style="width:40px;text-align:center;font-weight:600">${ci.qty}</span>
            <button type="button" class="cart-qty-btn" data-action="plus" data-id="${p.id}">${ICONS.plus}</button>
          </div>
          <div class="cart-item__actions">
            <button type="button" class="btn-icon cart-move-wl" data-id="${p.id}" title="Sevimlilarga">${ICONS.heart}</button>
            <button type="button" class="btn-icon cart-remove" data-id="${p.id}" title="O'chirish" style="color:var(--danger)">${ICONS.trash}</button>
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
    const total = subtotal - discount + delivery;
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
    const promo = PROMO_CODES.find(p => p.code === code);
    if (!promo) { UI.showToast("Noto'g'ri promo-kod", 'error'); return; }
    const { subtotal } = Store.getCartTotal();
    if (subtotal < promo.minOrder) { UI.showToast(`Minimal buyurtma: ${UI.formatPrice(promo.minOrder)}`, 'error'); return; }
    this.promoApplied = promo;
    Store.setPromo(promo);
    this.updateSummary();
    UI.showToast("Promo-kod qo'llandi!");
    input.disabled = true;
    document.getElementById('promoBtn').disabled = true;
  }
};

/* ========================================================================
   8. CHECKOUT
   ======================================================================== */
const Checkout = {
  currentStep: 1,
  orderData: { address: null, delivery: null, payment: null, deliveryCost: 15000 },
  _bound: false,

  init() {
    if (!Store.getCart().length) { location.href = 'cart.html'; return; }
    if (!Store.getUser()) {
      const layout = document.querySelector('.checkout__layout');
      if (layout && !document.getElementById('guestNote')) {
        const n = document.createElement('p');
        n.id = 'guestNote';
        n.className = 'guest-note';
        n.innerHTML = `Mehmon sifatida davom etyapsiz. <a href="login.html">Kirish</a> buyurtmalaringizni profilga bog‘laydi.`;
        layout.before(n);
      }
    }
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
      const d = DELIVERY_OPTIONS.find(opt => opt.id === +card.dataset.did);
      if (d) { this.orderData.delivery = d; this.orderData.deliveryCost = d.price; this.renderDelivery(); this.renderSummary(); }
    });
    document.getElementById('paymentOptions')?.addEventListener('click', e => {
      const card = e.target.closest('.address-card');
      if (!card) return;
      this.orderData.payment = PAYMENT_METHODS.find(pm => pm.id === +card.dataset.pid);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <input type="radio" name="checkoutAddress" value="${a.id}" ${on ? 'checked' : ''}>
        <span class="choice-card__mark">${ICONS.check}</span>
        <div class="choice-card__body">
          <strong>${a.name}</strong>
          <p>${a.phone}</p>
          <p>${a.city}, ${a.address}</p>
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
    if (!this.orderData.delivery) this.orderData.delivery = DELIVERY_OPTIONS[0];
    el.innerHTML = DELIVERY_OPTIONS.map(d => {
      const on = this.orderData.delivery?.id === d.id;
      return `<label class="choice-card${on ? ' selected' : ''}">
        <input type="radio" name="checkoutDelivery" value="${d.id}" ${on ? 'checked' : ''}>
        <span class="choice-card__mark">${ICONS.check}</span>
        <div class="choice-card__body">
          <strong>${d.name}</strong>
          <p>${d.days}</p>
        </div>
        <strong class="choice-card__price">${d.price ? UI.formatPrice(d.price) : 'Bepul'}</strong>
      </label>`;
    }).join('');
    el.querySelectorAll('input[name="checkoutDelivery"]').forEach(inp => {
      inp.addEventListener('change', () => {
        const d = DELIVERY_OPTIONS.find(opt => opt.id === +inp.value);
        if (d) { this.orderData.delivery = d; this.orderData.deliveryCost = d.price; this.renderDelivery(); this.renderSummary(); }
      });
    });
  },
  renderPayment() {
    const el = document.getElementById('paymentOptions');
    if (!el) return;
    if (!this.orderData.payment) this.orderData.payment = PAYMENT_METHODS[0];
    el.innerHTML = PAYMENT_METHODS.map(pm => {
      const on = this.orderData.payment?.id === pm.id;
      return `<label class="choice-card${on ? ' selected' : ''}">
        <input type="radio" name="checkoutPayment" value="${pm.id}" ${on ? 'checked' : ''}>
        <span class="choice-card__mark">${ICONS.check}</span>
        <div class="choice-card__body">
          <strong>${pm.name}</strong>
          <p>${pm.description}</p>
        </div>
      </label>`;
    }).join('');
    el.querySelectorAll('input[name="checkoutPayment"]').forEach(inp => {
      inp.addEventListener('change', () => {
        this.orderData.payment = PAYMENT_METHODS.find(pm => pm.id === +inp.value);
        this.renderPayment();
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
      itemsEl.innerHTML = Store.getCart().map(ci => {
        const p = PRODUCTS.find(pr => pr.id === ci.productId); if (!p) return '';
        return `<div style="display:flex;gap:12px;padding:8px 0;border-bottom:1px solid var(--gray-100)"><img src="${p.image}" style="width:48px;height:60px;object-fit:cover;border-radius:6px"><div><p style="font-size:13px;font-weight:600">${p.name}</p><p style="font-size:12px;color:var(--gray-400)">${ci.qty} × ${UI.formatPrice(p.price)}</p></div></div>`;
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
        <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md)"><h4 style="display:flex;align-items:center;gap:8px;">${ICONS.mapPin} Manzil</h4><p style="margin-top:4px">${a?.name}, ${a?.phone}<br>${a?.city}, ${a?.address}</p></div>
        <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md)"><h4 style="display:flex;align-items:center;gap:8px;">${ICONS.truck} Yetkazib berish</h4><p style="margin-top:4px">${d?.name} — ${d?.price ? UI.formatPrice(d.price) : 'Bepul'} (${d?.days})</p></div>
        <div style="padding:16px;background:var(--gray-50);border-radius:var(--radius-md)"><h4 style="display:flex;align-items:center;gap:8px;">${ICONS.creditCard} To'lov usuli</h4><p style="margin-top:4px;display:flex;align-items:center;gap:8px;">${mapPaymentIcon(pm?.icon)} ${pm?.name}</p></div>
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

/* ========================================================================
   9. AUTH
   ======================================================================== */
const Auth = {
  checkAlreadyLoggedIn() {
    const user = Store.getUser();
    if (!user) return false;
    const container = document.getElementById('cardContainer');
    if (!container) return false;
    container.innerHTML = `
      <div class="card card--logged-in" style="width:100%;text-align:center;padding:40px 28px;box-sizing:border-box;">
        <div style="margin-bottom:18px;">
          ${user.avatar ? `<img src="${user.avatar}" alt="" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin:0 auto;box-shadow:var(--neu-shadow-convex-sm);">` : `<div style="width:80px;height:80px;border-radius:50%;background:var(--primary);color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;margin:0 auto;box-shadow:var(--neu-shadow-convex-sm);">${UI.initials(user)}</div>`}
        </div>
        <h2 style="font-size:24px;font-weight:700;color:var(--neu-text-title);margin:0 0 6px;">${user.name}</h2>
        <p style="font-size:14px;color:var(--neu-text-sub);margin:0 0 16px;">${user.email}</p>
        <div style="display:inline-block;padding:5px 16px;border-radius:20px;background:rgba(15,23,42,0.08);color:var(--text-primary);font-size:12px;font-weight:700;margin-bottom:28px;">
          ✓ Siz allaqachon tizimga kirgansiz
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <a href="book_list.html" class="btn-submit success" style="text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:700;">
            Bosh sahifaga o'tish
          </a>
          <a href="profile.html" class="btn-submit" style="text-decoration:none;display:flex;align-items:center;justify-content:center;font-weight:600;">
            Mening profilim
          </a>
          <button type="button" class="btn-submit" id="alreadyLoggedLogout" style="color:#ef4444;background:transparent;box-shadow:var(--neu-shadow-inset);cursor:pointer;font-weight:600;">
            <i class="fa-solid fa-arrow-right-from-bracket" style="margin-right:6px;"></i> Hisobdan chiqish
          </button>
        </div>
      </div>
    `;
    container.style.height = 'auto';
    document.getElementById('alreadyLoggedLogout')?.addEventListener('click', () => {
      Store.logout();
      location.reload();
    });
    return true;
  },

  initLogin() {
    if (this.checkAlreadyLoggedIn()) return;
    const form = document.getElementById('loginForm');
    if (!form) return;
    this.setupPasswordToggle('loginPassword', 'loginPassToggle');
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      const email = document.getElementById('loginEmail');
      const pass = document.getElementById('loginPassword');
      if (!email || !email.value || !/\S+@\S+\.\S+/.test(email.value)) {
        if (email) email.classList.add('error');
        document.getElementById('loginEmailError')?.classList.add('is-on');
        valid = false;
      } else {
        email.classList.remove('error');
        document.getElementById('loginEmailError')?.classList.remove('is-on');
      }
      if (!pass || !pass.value || pass.value.length < 6) {
        if (pass) pass.classList.add('error');
        document.getElementById('loginPasswordError')?.classList.add('is-on');
        valid = false;
      } else {
        pass.classList.remove('error');
        document.getElementById('loginPasswordError')?.classList.remove('is-on');
      }
      if (!valid) { this.shake(form); return; }

      const btn = document.getElementById('loginBtn');
      if (btn) {
        btn.disabled = true;
        btn.classList.add('success');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> SUCCESS';
      }
      setTimeout(() => {
        Store.login(email.value, pass.value);
        UI.showToast("Xush kelibsiz!");
        this.showSuccess(() => { location.href = 'book_list.html'; });
      }, 700);
    });

    // Real-time validation
    ['loginEmail', 'loginPassword'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', function () {
        this.classList.remove('error');
        document.getElementById(id + 'Error')?.classList.remove('is-on');
      });
    });
    this.bindSocial();
    this.bindForgot();
  },

  initRegister() {
    if (this.checkAlreadyLoggedIn()) return;
    const form = document.getElementById('registerForm');
    if (!form) return;
    this.setupPasswordToggle('regPassword', 'regPassToggle');
    this.setupPasswordToggle('regConfirm', 'regConfirmToggle');
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      const nameEl = document.getElementById('regName');
      const emailEl = document.getElementById('regEmail');
      const phoneEl = document.getElementById('regPhone');
      const passEl = document.getElementById('regPassword');
      const confEl = document.getElementById('regConfirm');

      const vals = {
        name: { el: nameEl, err: 'regNameError', check: v => (v || '').length >= 2 },
        email: { el: emailEl, err: 'regEmailError', check: v => /\S+@\S+\.\S+/.test(v || '') },
        phone: { el: phoneEl, err: 'regPhoneError', check: v => !v || v.length >= 7 },
        pass: { el: passEl, err: 'regPasswordError', check: v => (v || '').length >= 6 },
        confirm: { el: confEl, err: 'regConfirmError', check: v => v && passEl && v === passEl.value },
      };
      Object.values(vals).forEach(({ el, err, check }) => {
        if (!el || !check(el.value)) {
          if (el) el.classList.add('error');
          document.getElementById(err)?.classList.add('is-on');
          valid = false;
        } else {
          el.classList.remove('error');
          document.getElementById(err)?.classList.remove('is-on');
        }
      });
      const terms = document.getElementById('regTerms');
      if (terms && !terms.checked) {
        document.getElementById('regTermsError')?.classList.add('is-on');
        valid = false;
      } else {
        document.getElementById('regTermsError')?.classList.remove('is-on');
      }
      if (!valid) { this.shake(form); return; }

      const btn = document.getElementById('registerBtn');
      if (btn) {
        btn.disabled = true;
        btn.classList.add('success');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> SUCCESS';
      }
      setTimeout(() => {
        const phoneVal = phoneEl ? phoneEl.value : '';
        Store.register(nameEl.value, emailEl.value, phoneVal, passEl.value);
        UI.showToast("Hisob muvaffaqiyatli ochildi!");
        this.showSuccess(() => { location.href = 'book_list.html'; });
      }, 700);
    });

    ['regName', 'regEmail', 'regPhone', 'regPassword', 'regConfirm'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', function () {
        this.classList.remove('error');
        document.getElementById(id + 'Error')?.classList.remove('is-on');
      });
    });
    document.getElementById('regTerms')?.addEventListener('change', () => {
      document.getElementById('regTermsError')?.classList.remove('is-on');
    });

    // Password strength meter
    const passInput = document.getElementById('regPassword');
    const meter = document.getElementById('passStrengthMeter');
    const bar1 = document.getElementById('strBar1');
    const bar2 = document.getElementById('strBar2');
    const bar3 = document.getElementById('strBar3');
    if (passInput && meter) {
      passInput.addEventListener('input', () => {
        const val = passInput.value || '';
        if (!val) {
          meter.style.display = 'none';
          [bar1, bar2, bar3].forEach(b => { if (b) b.className = 'neu-strength-bar'; });
          return;
        }
        meter.style.display = 'flex';
        let score = 0;
        if (val.length >= 6) score++;
        if (/[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;
        if (val.length >= 9 && /[A-Z]/.test(val) && /[a-z]/.test(val)) score++;

        [bar1, bar2, bar3].forEach(b => { if (b) b.className = 'neu-strength-bar'; });
        if (score === 1) {
          if (bar1) bar1.classList.add('is-weak');
        } else if (score === 2) {
          if (bar1) bar1.classList.add('is-medium');
          if (bar2) bar2.classList.add('is-medium');
        } else if (score >= 3) {
          if (bar1) bar1.classList.add('is-strong');
          if (bar2) bar2.classList.add('is-strong');
          if (bar3) bar3.classList.add('is-strong');
        }
        const cardBox = document.getElementById('cardContainer');
        if (cardBox) {
          const activeCard = cardBox.classList.contains('flipped') ? cardBox.querySelector('.signup-card') : cardBox.querySelector('.login-card');
          if (activeCard) cardBox.style.height = activeCard.scrollHeight + 'px';
        }
      });
    }

    this.bindSocial();
  },

  init3DFlip() {
    if (Store.getUser()) return;
    const container = document.getElementById('cardContainer');
    if (!container) return;

    const updateHeight = () => {
      const isFlipped = container.classList.contains('flipped');
      const active = isFlipped ? container.querySelector('.signup-card') : container.querySelector('.login-card');
      if (active) {
        container.style.height = active.scrollHeight + 'px';
      }
    };

    const flipTo = (flipped) => {
      if (flipped) {
        container.classList.add('flipped');
        document.title = "Booksaw — Ro'yxatdan o'tish";
        if (location.pathname.includes('login')) {
          try { history.replaceState(null, '', 'register.html'); } catch (e) {}
        }
      } else {
        container.classList.remove('flipped');
        document.title = "Booksaw — Kirish";
        if (location.pathname.includes('register')) {
          try { history.replaceState(null, '', 'login.html'); } catch (e) {}
        }
      }
      updateHeight();
    };

    // If starting on register page or query, show flipped signup card
    if (document.body.dataset.page === 'register' || location.search.includes('register') || location.hash === '#register') {
      container.classList.add('flipped');
    }

    document.getElementById('flipToRegister')?.addEventListener('click', (e) => {
      e.preventDefault();
      flipTo(true);
    });
    document.getElementById('flipToLogin')?.addEventListener('click', (e) => {
      e.preventDefault();
      flipTo(false);
    });

    // Eye toggles for password fields
    document.querySelectorAll('.toggle-pass').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = targetId ? document.getElementById(targetId) : btn.previousElementSibling;
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          btn.classList.remove('fa-eye');
          btn.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          btn.classList.remove('fa-eye-slash');
          btn.classList.add('fa-eye');
        }
      });
    });

    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 50);
    setTimeout(updateHeight, 300);
  },

  bindSocial() {
    document.querySelectorAll('[data-social]').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const kind = btn.dataset.social;
        if (window.APP_CONFIG && !window.APP_CONFIG.USE_MOCK) {
          try {
            const url = Api.socialAuthStart(kind);
            location.assign(url);
            return;
          } catch (err) { /* fallback to interactive modals */ }
        }
        if (kind === 'google') {
          UI.startGoogleOAuth();
        } else if (kind === 'telegram') {
          UI.showTelegramAuthModal();
        }
      });
    });
  },

  bindForgot() {
    const overlay = document.getElementById('forgotModal');
    const open = document.getElementById('forgotPassBtn');
    const cancel = document.getElementById('forgotCancel');
    const send = document.getElementById('forgotSend');
    if (!overlay || !open) return;
    open.addEventListener('click', () => overlay.classList.add('active'));
    cancel?.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });
    send?.addEventListener('click', () => {
      const email = document.getElementById('forgotEmail')?.value || '';
      if (!/\S+@\S+\.\S+/.test(email)) { UI.showToast('Emailni tekshiring', 'error'); return; }
      overlay.classList.remove('active');
      UI.showToast('Tiklash havolasi emailga yuborildi');
    });
  },

  shake(form) {
    if (!form) return;
    form.classList.remove('shake');
    void form.offsetWidth;
    form.classList.add('shake');
  },

  showSuccess(cb) {
    const el = document.getElementById('authSuccess');
    if (el) {
      el.hidden = false;
      el.querySelectorAll('circle, path').forEach(n => {
        n.style.animation = 'none';
        void n.getBoundingClientRect();
        n.style.animation = '';
      });
    }
    setTimeout(() => { if (typeof cb === 'function') cb(); }, 900);
  },

  setupPasswordToggle(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    if (input && toggle) {
      toggle.addEventListener('click', e => {
        e.preventDefault();
        input.type = input.type === 'password' ? 'text' : 'password';
        toggle.innerHTML = input.type === 'password' ? ICONS.eye : ICONS.eyeOff;
      });
    }
  }
};

/* ========================================================================
   10. PROFILE PAGE
   ======================================================================== */
const ProfilePage = {
  applyAvatar(user) {
    const img = document.getElementById('avatarImg');
    const preview = document.getElementById('avatarPreview');
    const removeBtn = document.getElementById('avatarRemove');
    const has = !!(user && user.avatar);
    if (preview) preview.classList.toggle('has-photo', has);
    if (img) {
      if (has) img.src = user.avatar;
      else img.removeAttribute('src');
    }
    if (removeBtn) removeBtn.hidden = !has;
  },
  compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('read'));
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const max = 320;
          let { width, height } = image;
          if (width > height && width > max) { height = Math.round(height * max / width); width = max; }
          else if (height > max) { width = Math.round(width * max / height); height = max; }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(image, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        image.onerror = () => reject(new Error('img'));
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  },
  init() {
    const user = Store.getUser();
    if (!user) { location.href = 'login.html'; return; }
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profName').value = user.name || '';
    document.getElementById('profEmail').value = user.email || '';
    document.getElementById('profPhone').value = user.phone || '';
    this.applyAvatar(user);
    const avatarInput = document.getElementById('avatarInput');
    avatarInput?.addEventListener('change', async () => {
      const file = avatarInput.files && avatarInput.files[0];
      avatarInput.value = '';
      if (!file) return;
      if (!file.type.startsWith('image/')) { UI.showToast('Faqat rasm yuklang', 'error'); return; }
      if (file.size > 8 * 1024 * 1024) { UI.showToast('Rasm 8 MB dan kichik bo‘lsin', 'error'); return; }
      try {
        const dataUrl = await this.compressImage(file);
        const updated = Store.setAvatar(dataUrl);
        this.applyAvatar(updated);
        UI.updateHeaderAvatar();
        UI.showToast('Profil rasmi saqlandi');
      } catch {
        UI.showToast('Rasmni yuklab bo‘lmadi', 'error');
      }
    });
    document.getElementById('avatarRemove')?.addEventListener('click', () => {
      Store.setAvatar(null);
      this.applyAvatar(Store.getUser());
      UI.updateHeaderAvatar();
      UI.showToast('Rasm olib tashlandi');
    });
    // Sidebar nav
    document.querySelectorAll('.profile__menu-item[data-section]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.section === 'logout') {
          Store.logout(); location.href = 'login.html'; return;
        }
        document.querySelectorAll('.profile__menu-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ['sectionPersonal', 'sectionOrders', 'sectionAddresses', 'sectionWishlist', 'sectionPassword', 'sectionSettings'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
        const section = document.getElementById('section' + btn.dataset.section.charAt(0).toUpperCase() + btn.dataset.section.slice(1));
        if (section) section.style.display = '';
        if (btn.dataset.section === 'addresses') this.renderAddresses();
        if (btn.dataset.section === 'orders') this.renderOrders();
        if (btn.dataset.section === 'wishlist') this.renderWishlist();
        if (btn.dataset.section === 'settings') {
          const t = (window.BooksawTheme ? window.BooksawTheme.get() : Theme.get());
          const txt = document.getElementById('profileModeText');
          if (txt) txt.textContent = t === 'dark' ? 'Dark' : 'Light';
        }
      });
    });

    // Profile 3D Theme Switch
    document.getElementById('profileThemeToggleBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      Theme.toggle();
    });

    // Save profile
    document.getElementById('profileForm')?.addEventListener('submit', e => {
      e.preventDefault();
      Store.updateProfile({
        name: document.getElementById('profName').value,
        email: document.getElementById('profEmail').value,
        phone: document.getElementById('profPhone').value
      });
      const fresh = Store.getUser();
      document.getElementById('profileName').textContent = fresh.name;
      document.getElementById('profileEmail').textContent = fresh.email;
      UI.updateHeaderAvatar();
      UI.showToast("Ma'lumotlar saqlandi");
    });
    // Add address
    document.getElementById('addAddrBtn')?.addEventListener('click', () => {
      const name = document.getElementById('newAddrName')?.value?.trim() || user.name;
      const phone = document.getElementById('newAddrPhone')?.value?.trim() || user.phone;
      const city = document.getElementById('newAddrCity')?.value?.trim();
      const line = document.getElementById('newAddrLine')?.value?.trim();
      if (!city || city.length < 2) { UI.showToast("Shaharni kiriting", 'error'); return; }
      if (!line || line.length < 5) { UI.showToast("Aniq manzilni kiriting", 'error'); return; }
      Store.addAddress({ name, phone, city, address: line });
      this.renderAddresses();
      UI.showToast("Manzil muvaffaqiyatli saqlandi", 'success');
      ['newAddrName', 'newAddrPhone', 'newAddrCity', 'newAddrLine'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    });
    // Change password
    document.getElementById('passwordForm')?.addEventListener('submit', e => {
      e.preventDefault();
      const newP = document.getElementById('newPass')?.value;
      const confP = document.getElementById('confirmNewPass')?.value;
      if (!newP || newP.length < 6) { UI.showToast("Parol kamida 6 ta belgi", 'error'); return; }
      if (newP !== confP) { UI.showToast("Parollar mos kelmaydi", 'error'); return; }
      UI.showToast("Parol yangilandi");
      document.getElementById('passwordForm').reset();
    });

    // Check URL tab parameter
    const initialTab = new URLSearchParams(location.search).get('tab');
    if (initialTab) {
      const targetBtn = document.querySelector(`.profile__menu-item[data-section="${initialTab}"]`);
      if (targetBtn) targetBtn.click();
    }
  },
  renderAddresses() {
    const el = document.getElementById('profileAddresses');
    if (!el) return;
    const addrs = Store.getAddresses();
    if (!addrs.length) {
      el.innerHTML = '<p class="text-muted" style="font-size:14px;padding:8px 0;">Hozircha saqlangan manzil yo\'q.</p>';
      return;
    }
    el.innerHTML = addrs.map(a => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:12px;flex-wrap:wrap;gap:12px;">
        <div><strong>${a.city || ''}</strong><p style="color:var(--text-muted);font-size:14px;margin:2px 0 0;">${a.address || ''} ${a.name ? '— ' + a.name : ''}</p></div>
        <div style="display:flex;align-items:center;">
          ${createBinButtonHtml("O'chirish", "danger", "addrDel_" + a.id)}
        </div>
      </div>`).join('');

    addrs.forEach(a => {
      document.getElementById('addrDel_' + a.id)?.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        runBinEatAnimation(btn, () => {
          Store.removeAddress(a.id);
          this.renderAddresses();
          UI.showToast("Manzil o'chirildi");
        });
      });
    });
  },
  renderOrders() {
    const listEl = document.getElementById('profileOrdersList');
    if (!listEl) return;
    const orders = Store.getOrders();
    if (!orders.length) {
      listEl.innerHTML = `
        <div class="empty-state" style="padding:48px 20px;text-align:center;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);">
          <div class="empty-state__icon" style="margin-bottom:12px;color:var(--text-muted);">${ICONS.orders}</div>
          <h3 style="font-size:18px;margin-bottom:8px;">Hozircha buyurtmalar yo'q</h3>
          <p style="color:var(--text-muted);margin-bottom:16px;font-size:14px;">Siz hali birorta ham buyurtma bermagansiz.</p>
          <a href="book_list.html" class="btn btn-primary btn-sm">Kitoblar katalogiga o'tish</a>
        </div>`;
      return;
    }
    const statusMap = {
      processing: { label: 'Jarayonda', cls: 'is-progress' },
      delivered: { label: 'Yetkazildi', cls: 'is-done' },
      cancelled: { label: 'Bekor qilindi', cls: 'is-cancel' }
    };
    listEl.innerHTML = orders.map(o => {
      const st = statusMap[o.status] || statusMap.processing;
      const pay = o.payment?.name || '—';
      const addr = o.address ? `${o.address.city}, ${o.address.address}` : '—';
      const items = (o.items || []).map(i => `
        <div class="order-card__line">
          <img src="${i.image || ''}" alt="">
          <div>
            <strong>${i.name || 'Kitob'}</strong>
            <p>${i.qty} × ${UI.formatPrice(i.price || 0)}</p>
          </div>
        </div>`).join('');
      return `<article class="order-card" style="margin-bottom:16px;">
        <div class="order-card__header">
          <div><strong class="order-card__id">${o.id}</strong><span class="order-card__date">${UI.formatDate(o.date)}</span></div>
          <span class="order-status ${st.cls}">${st.label}</span>
        </div>
        <div class="order-card__body">${items}</div>
        <div class="order-card__meta">
          <p><span>To‘lov:</span> ${pay}</p>
          <p><span>Manzil:</span> ${addr}</p>
        </div>
        <div class="order-card__footer">
          <strong>${UI.formatPrice(o.total)}</strong>
          <div class="order-card__actions">
            <button type="button" class="btn btn-secondary btn-sm order-repeat" data-id="${o.id}">Qayta buyurtma</button>
            ${o.status === 'processing' ? `<button type="button" class="btn btn-sm order-cancel" data-id="${o.id}">Bekor qilish</button>` : ''}
          </div>
        </div>
      </article>`;
    }).join('');
    listEl.querySelectorAll('.order-repeat').forEach(btn => {
      btn.addEventListener('click', () => {
        if (Store.repeatOrder(btn.dataset.id)) {
          UI.showToast('Mahsulotlar savatga qo‘shildi');
          location.href = 'cart.html';
        }
      });
    });
    listEl.querySelectorAll('.order-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.updateOrderStatus(btn.dataset.id, 'cancelled');
        UI.showToast('Buyurtma bekor qilindi');
        this.renderOrders();
      });
    });
  },
  renderWishlist() {
    const grid = document.getElementById('profileWishlistGrid');
    const countEl = document.getElementById('profileWishlistCount');
    if (!grid) return;
    const ids = Store.getWishlist();
    const prods = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).filter(p => ids.includes(p.id));
    if (countEl) countEl.textContent = `${prods.length} ta kitob`;
    if (!prods.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;padding:48px 20px;text-align:center;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);">
          <div class="empty-state__icon" style="margin-bottom:12px;color:var(--text-muted);">${ICONS.heart}</div>
          <h3 style="font-size:18px;margin-bottom:8px;">Sevimlilar ro'yxati bo'sh</h3>
          <p style="color:var(--text-muted);margin-bottom:16px;font-size:14px;">O'zingizga yoqqan kitoblarni yurakcha belgisi orqali saqlang.</p>
          <a href="book_list.html" class="btn btn-primary btn-sm">Kitoblarni ko'rish</a>
        </div>`;
      return;
    }
    grid.innerHTML = prods.map(p => renderProductCard(p)).join('');
  }
};

/* ========================================================================
   11. ORDERS PAGE
   ======================================================================== */
const OrdersPage = {
  init() {
    const orders = Store.getOrders();
    const listEl = document.getElementById('ordersList');
    const emptyEl = document.getElementById('emptyOrders');
    if (!orders.length) { if (emptyEl) emptyEl.style.display = ''; if (listEl) listEl.style.display = 'none'; return; }
    if (emptyEl) emptyEl.style.display = 'none';
    if (!listEl) return;
    const statusMap = {
      processing: { label: 'Jarayonda', cls: 'is-progress' },
      delivered: { label: 'Yetkazildi', cls: 'is-done' },
      cancelled: { label: 'Bekor qilindi', cls: 'is-cancel' }
    };
    listEl.innerHTML = orders.map(o => {
      const st = statusMap[o.status] || statusMap.processing;
      const pay = o.payment?.name || '—';
      const addr = o.address ? `${o.address.city}, ${o.address.address}` : '—';
      const items = (o.items || []).map(i => `
        <div class="order-card__line">
          <img src="${i.image || ''}" alt="">
          <div>
            <strong>${i.name || 'Kitob'}</strong>
            <p>${i.qty} × ${UI.formatPrice(i.price || 0)}</p>
          </div>
        </div>`).join('');
      return `<article class="order-card">
        <div class="order-card__header">
          <div><strong class="order-card__id">${o.id}</strong><span class="order-card__date">${UI.formatDate(o.date)}</span></div>
          <span class="order-status ${st.cls}">${st.label}</span>
        </div>
        <div class="order-card__body">${items}</div>
        <div class="order-card__meta">
          <p><span>To‘lov:</span> ${pay}</p>
          <p><span>Manzil:</span> ${addr}</p>
        </div>
        <div class="order-card__footer">
          <strong>${UI.formatPrice(o.total)}</strong>
          <div class="order-card__actions">
            <button type="button" class="btn btn-secondary btn-sm order-repeat" data-id="${o.id}">Qayta buyurtma</button>
            ${o.status === 'processing' ? `<button type="button" class="btn btn-sm order-cancel" data-id="${o.id}">Bekor qilish</button>` : ''}
          </div>
        </div>
      </article>`;
    }).join('');
    listEl.querySelectorAll('.order-repeat').forEach(btn => {
      btn.addEventListener('click', () => {
        if (Store.repeatOrder(btn.dataset.id)) {
          UI.showToast('Mahsulotlar savatga qo‘shildi');
          location.href = 'cart.html';
        }
      });
    });
    listEl.querySelectorAll('.order-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        UI.showConfirm('Buyurtmani bekor qilasizmi?', () => {
          Store.cancelOrder(btn.dataset.id);
          UI.showToast('Buyurtma bekor qilindi');
          this.init();
        });
      });
    });
  }
};

/* ========================================================================
   12. WISHLIST PAGE
   ======================================================================== */
const WishlistPage = {
  init() {
    const wl = Store.getWishlist();
    const gridEl = document.getElementById('wishlistGrid');
    const emptyEl = document.getElementById('emptyWishlist');
    const addAllBtn = document.getElementById('addAllToCart');
    let clearBtn = document.getElementById('clearWishlistBtn');
    // The static page keeps a semantic fallback; upgrade it to the animated
    // destructive-action control once the shared UI engine is available.
    if (clearBtn && !clearBtn.classList.contains('eat-btn')) {
      const holder = document.createElement('div');
      holder.innerHTML = createBinButtonHtml("Tozalash", 'danger', 'clearWishlistBtn');
      clearBtn.replaceWith(holder.firstElementChild);
      clearBtn = document.getElementById('clearWishlistBtn');
    }
    if (!wl.length) {
      if (gridEl) gridEl.style.display = 'none';
      if (emptyEl) emptyEl.style.display = '';
      if (addAllBtn) addAllBtn.style.display = 'none';
      if (clearBtn) clearBtn.style.display = 'none';
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';
    if (addAllBtn) addAllBtn.style.display = '';
    if (clearBtn) clearBtn.style.display = '';
    if (gridEl) {
      const products = PRODUCTS.filter(p => wl.includes(p.id));
      gridEl.innerHTML = products.map(p => renderProductCard(p)).join('');
      gridEl.style.display = '';
    }
    if (addAllBtn && !addAllBtn.dataset.bound) {
      addAllBtn.dataset.bound = '1';
      addAllBtn.addEventListener('click', () => {
        const ids = Store.getWishlist();
        PRODUCTS.filter(p => ids.includes(p.id) && p.inStock).forEach(p => Store.addToCart(p.id));
        UI.showToast("Barchasi savatga qo'shildi!");
      });
    }
    if (clearBtn && !clearBtn.dataset.bound) {
      clearBtn.dataset.bound = '1';
      clearBtn.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        runBinEatAnimation(btn, () => {
          Store.clearWishlist();
          this.init();
          UI.showToast("Sevimlilar ro'yxati tozalandi!");
        });
      });
    }
  }
};

/* ========================================================================
   13. ANIMATIONS
   ======================================================================== */
const Animations = {
  flyToCart(origin) {
    if (!origin) return;
    const cartIcon = document.getElementById('cartToggle') || document.getElementById('cartBadge');
    if (!cartIcon) return;
    const imgEl = origin.tagName === 'IMG'
      ? origin
      : origin.closest('.product-card, .product-detail, .quick-view__layout, .gallery, .sticky-atc')?.querySelector('img');
    const startEl = imgEl || origin;
    const start = startEl.getBoundingClientRect();
    const end = cartIcon.getBoundingClientRect();
    const clone = document.createElement('img');
    clone.className = 'fly-clone';
    clone.src = imgEl?.src || '';
    clone.alt = '';
    Object.assign(clone.style, {
      top: start.top + 'px',
      left: start.left + 'px',
      width: Math.max(28, start.width) + 'px',
      height: Math.max(28, start.height) + 'px'
    });
    if (!imgEl) {
      clone.remove();
      const dot = document.createElement('div');
      dot.className = 'fly-clone';
      Object.assign(dot.style, {
        top: start.top + 'px', left: start.left + 'px', width: '28px', height: '28px',
        background: 'var(--primary)', borderRadius: '50%'
      });
      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        Object.assign(dot.style, {
          top: end.top + end.height / 2 - 10 + 'px',
          left: end.left + end.width / 2 - 10 + 'px',
          width: '20px', height: '20px', opacity: '0.3'
        });
      });
      setTimeout(() => { dot.remove(); this.bumpCart(cartIcon); }, 600);
      return;
    }
    document.body.appendChild(clone);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        Object.assign(clone.style, {
          top: (end.top + end.height / 2 - 10) + 'px',
          left: (end.left + end.width / 2 - 10) + 'px',
          width: '20px',
          height: '20px',
          opacity: '0.35',
          borderRadius: '50%'
        });
      });
    });
    setTimeout(() => { clone.remove(); this.bumpCart(cartIcon); }, 620);
  },
  bumpCart(el) {
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 300);
  },
  initScrollReveal() {
    const els = document.querySelectorAll('.fade-in-up:not(.visible)');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); } });
    }, { threshold: 0.05, rootMargin: '40px 0px 0px 0px' });
    els.forEach(el => obs.observe(el));
    setTimeout(() => {
      document.querySelectorAll('.fade-in-up:not(.visible)').forEach(el => el.classList.add('visible'));
    }, 1200);
  },
  countUp(el, target, duration = 1000) {
    let start = 0;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      el.textContent = UI.formatPrice(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
};

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
               ${user.avatar ? `<img class="dropdown-avatar" src="${user.avatar}" alt="">` : `<span class="dropdown-avatar dropdown-avatar--initials">${UI.initials(user)}</span>`}
               <div><strong>${user.name || ''}</strong><p>${user.email || ''}</p></div>
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
            <img src="${c.image}" alt="${c.name}">
            <div><strong>${c.name}</strong><p>${c.count} ta kitob</p></div>
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
        <div class="category-card__thumb"><img src="${c.image}" alt="${c.name}"></div>
        <div class="category-card__name">${c.name}</div>
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
      `<a class="publisher-item" href="store.html?id=${b.id || 1}" title="${b.name}">
        <span class="publisher-item__icon">${b.vector || `<img src="${b.logo || ''}" alt="${b.name}" draggable="false">`}</span>
        <span class="publisher-item__name">${b.name}</span>
      </a>`).join('');
  }
  const newEl = document.getElementById('newProducts');
  if (newEl) newEl.innerHTML = [...PRODUCTS].sort((a, b) => b.year - a.year).slice(0, 8).map(p => renderProductCard(p)).join('');
  const blogEl = document.getElementById('blogGrid');
  if (blogEl && typeof POSTS !== 'undefined') {
    blogEl.innerHTML = POSTS.map(post =>
      `<article class="blog-card" data-href="info.html?page=blog&id=${post.id}" role="link" tabindex="0">
        <div class="blog-card__image"><img src="${post.image}" alt="${post.title}"></div>
        <div class="blog-card__body">
          <time>${UI.formatDate(post.date)}</time>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
        </div>
      </article>`).join('');
  }

  renderRecentlyViewed('recentHome');
  ensureTrustStrip();
  setTimeout(() => Animations.initScrollReveal(), 100);
}

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

  const cat = Number.isFinite(catId) ? CATEGORIES.find(c => c.id === catId) : null;
  const title = q ? `Qidiruv: “${q}”` : sale ? 'Chegirmadagi kitoblar' : gift ? 'Sovg‘a to‘plamlari' : cat ? cat.name : 'Barcha kitoblar';

  wrap.innerHTML = `
    <nav class="breadcrumb" style="margin-bottom:20px; padding:0;">
      <a href="book_list.html">Bosh sahifa</a> <span>/</span>
      ${cat ? `<a href="categories.html">Kategoriyalar</a> <span>/</span> <span>${cat.name}</span>` : `<span>${title}</span>`}
    </nav>
    <div class="catalog-toolbar">
      <h1 class="section-title" style="margin:0">${title}</h1>
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
    catsEl.innerHTML = CATEGORIES.map(c => `
      <label class="filter-checkbox">
        <input type="checkbox" data-cat="${c.id}"${c.id === catId ? ' checked' : ''}>
        ${c.name} <span class="count">${c.count}</span>
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
    if (products.length < 3 && typeof PRODUCTS !== 'undefined') {
      if (!recBlock) {
        recBlock = document.createElement('div');
        recBlock.id = 'catalogRecommendations';
        recBlock.className = 'catalog-recommendations';
        recBlock.style.marginTop = '40px';
        pager.after(recBlock);
      }
      const recItems = PRODUCTS.filter(p => !products.some(pr => pr.id === p.id)).slice(0, 4);
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
    setTimeout(() => Animations.initScrollReveal(), 50);
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

function initCategoriesPage() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid || typeof CATEGORIES === 'undefined') return;
  grid.innerHTML = CATEGORIES.map(c => `
    <a href="book_list.html?cat=${c.id}" class="category-page-card">
      <div class="category-page-card__image"><img src="${c.image}" alt="${c.name}" draggable="false"></div>
      <div class="category-page-card__body">
        <h3>${c.name}</h3>
        <p>${c.count} ta kitob</p>
      </div>
    </a>`).join('');
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
   ======================================================================== */
document.addEventListener('click', e => {
  const wlBtn = e.target.closest('.product-card__wishlist, .quick-view__wishlist-btn');
  if (wlBtn) {
    e.preventDefault();
    e.stopPropagation();
    const id = +wlBtn.dataset.id;
    const res = Store.toggleWishlist(id);
    document.querySelectorAll(`.product-card__wishlist[data-id="${id}"], .quick-view__wishlist-btn[data-id="${id}"]`).forEach(btn => {
      btn.classList.toggle('active', res.added);
      btn.innerHTML = res.added ? ICONS.heartFilled : ICONS.heart;
      btn.style.transform = 'scale(1.25)';
      setTimeout(() => btn.style.transform = '', 300);
    });
    UI.showToast(res.added ? "Sevimlilarga qo'shildi" : "Sevimlilardan o'chirildi");
    if (document.body.dataset.page === 'wishlist' && !res.added) WishlistPage.init();
    return;
  }
  const cartBtn = e.target.closest('.add-to-cart-btn');
  if (cartBtn) {
    e.preventDefault();
    e.stopPropagation();
    if (cartBtn.disabled) return;
    const id = +cartBtn.dataset.id;
    const product = PRODUCTS.find(pr => pr.id === id);
    if (product && !product.inStock) { UI.showToast('Mahsulot tugagan', 'error'); return; }
    Store.addToCart(id);
    UI.showToast("Savatga qo'shildi!");
    Animations.flyToCart(cartBtn);
    return;
  }
  const qvBtn = e.target.closest('.quick-view-btn');
  if (qvBtn) {
    e.preventDefault();
    e.stopPropagation();
    UI.showQuickView(+qvBtn.dataset.id);
    return;
  }
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

function openLightbox(src, alt) {
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
  img.src = src;
  img.alt = alt || '';
  lb.classList.add('is-on');
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
        `<li><a href="book_list.html?cat=${c.id}">${c.name}</a></li>`
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

  // Only show arrows when the row actually overflows, and disable whichever
  // side has nothing left to scroll to. No more dead arrows sitting next to
  // a row that already shows every card.
  const updateNavState = () => {
    if (window.getComputedStyle(el).display === 'grid') {
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
  if (window.ResizeObserver) {
    new ResizeObserver(updateNavState).observe(el);
  }
  // Cards can still be injected asynchronously right after this call
  // (recently-viewed rows, fetched recommendations), so re-check a beat later too.
  requestAnimationFrame(updateNavState);
  setTimeout(updateNavState, 300);
  updateNavState();
}

function enableDragScroll(el) {
  if (!el || el.dataset.dragBound) return;
  el.dataset.dragBound = '1';

  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let isDragging = false; // Faqat haqiqiy surish boshlangandagina true bo'ladi
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;
  let momentumID = null;

  // Inersiyali silliq to'xtash (Momentum physics)
  const beginMomentum = () => {
    cancelAnimationFrame(momentumID);
    const step = () => {
      if (Math.abs(velocity) > 0.5) {
        el.scrollLeft += velocity;
        velocity *= 0.92; // Sekinlashish koeffitsiyenti
        momentumID = requestAnimationFrame(step);
      }
    };
    momentumID = requestAnimationFrame(step);
  };

  el.addEventListener('mousedown', (e) => {
    // Interaktiv tugmalar (savat, yurakcha, tez ko'rish) bosilganda drag ishlamasin
    if (e.target.closest('button, input, select, textarea, .product-card__wishlist, .add-to-cart-btn, .quick-view-btn')) return;
    if (e.button !== 0) return; // Faqat chap tugma

    cancelAnimationFrame(momentumID);
    isDown = true;
    isDragging = false;
    startX = e.pageX;
    scrollStart = el.scrollLeft;
    lastX = e.pageX;
    lastTime = performance.now();
    velocity = 0;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;

    const deltaX = e.pageX - startX;

    // THRESHOLD: Agar 8 pikseldan ko'p surilsa, bu haqiqiy drag hisoblanadi
    if (!isDragging && Math.abs(deltaX) > 8) {
      isDragging = true;
      el.classList.add('is-dragging');
    }

    if (isDragging) {
      e.preventDefault();
      el.scrollLeft = scrollStart - deltaX;

      const now = performance.now();
      const dt = now - lastTime || 16;
      const dx = e.pageX - lastX;
      velocity = -(dx / dt) * 12;
      lastX = e.pageX;
      lastTime = now;
    }
  });

  const stopDrag = () => {
    if (!isDown) return;
    isDown = false;
    el.classList.remove('is-dragging');

    if (isDragging) {
      beginMomentum();
      // Faqat drag qilingan bo'lsagina bir zum click'ni ushlab turadi
      setTimeout(() => { isDragging = false; }, 50);
    }
  };

  window.addEventListener('mouseup', stopDrag);

  // Kartochka ustiga bosilganda click hodisasini boshqarish
  el.addEventListener('click', (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // 1 ta click bo'lsa — to'g'ridan-to'g'ri kitob sahifasiga o'tadi
    const card = e.target.closest('.product-card, .category-card');
    if (card && !e.target.closest('button, .product-card__wishlist, .add-to-cart-btn, .quick-view-btn')) {
      const href = card.dataset.href || card.getAttribute('href');
      if (href) {
        window.location.href = href;
      }
    }
  });
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
