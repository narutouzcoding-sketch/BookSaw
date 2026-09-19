/**
 * modules/core.js
 * ICONS, Theme va Store (Holat boshqaruvi va doimiy saqlash)
 * Hodisalar (CustomEvent) orqali UI bilan bog'lanadi (sirkulyar bog'liqliksiz)
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
      if (t === 'dark') return 'dark';
      if (t === 'light') return 'light';
    } catch { /* ignore */ }
    return 'light';
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
            <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="6"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(45 16 16)"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(90 16 16)"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(135 16 16)"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(180 16 16)"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(225 16 16)"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(270 16 16)"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(315 16 16)"/></svg>
          </div>
          <div class="track-icon">
            <svg viewBox="0 0 32 32"><path d="M21 16.5C20.8 12.2 17.8 8.8 13.8 8C14.8 9.5 15.3 11.2 15.3 13C15.3 17.4 11.7 21 7.3 21C6.3 21 5.3 20.8 4.5 20.4C5.6 23.6 8.8 26 12.5 26C17.2 26 21 22.2 21 17.5V16.5Z"/><path d="M22 6L22.8 8.2L25 9L22.8 9.8L22 12L21.2 9.8L19 9L21.2 8.2L22 6Z"/><rect x="7" y="27.5" width="15" height="2" rx="1"/><rect x="10" y="30.5" width="9" height="1.8" rx="0.9"/></svg>
          </div>
          <div class="thumb-slider">
            <div class="thumb-icons-wrapper">
              <div class="thumb-icon icon-sun">
                <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="6"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(45 16 16)"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(90 16 16)"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(135 16 16)"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(180 16 16)"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(225 16 16)"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(270 16 16)"/><rect x="14.5" y="2" width="3" height="4.5" rx="1.5" transform="rotate(315 16 16)"/></svg>
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
  }
};

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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('booksaw:cartchange', { detail: { cart } }));
    }
    if (typeof UI !== 'undefined' && UI.updateBadges) {
      UI.updateBadges();
    }
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('booksaw:wishlistchange', { detail: { wishlist: wl } }));
    }
    if (typeof UI !== 'undefined' && UI.updateBadges) {
      UI.updateBadges();
    }
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

  // --- PASSWORD HASHING (Security Hardening) ---
  hashPassword(pwd) {
    if (!pwd) return '';
    let hash = 0x811c9dc5;
    const str = 'bksaw_salt_' + pwd;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }
    return 'h_' + hash.toString(16).padStart(8, '0');
  },
  verifyPassword(inputPwd, storedHashOrPwd) {
    if (!storedHashOrPwd) return true;
    if (storedHashOrPwd.startsWith('h_')) {
      return this.hashPassword(inputPwd) === storedHashOrPwd;
    }
    return inputPwd === storedHashOrPwd || this.hashPassword(inputPwd) === this.hashPassword(storedHashOrPwd);
  },

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

      // Transfer active guest wishlist items into this user's wishlist
      const guestWlRaw = localStorage.getItem('marketplace_wishlist_guest');
      if (guestWlRaw) {
        try {
          const guestWl = JSON.parse(guestWlRaw);
          if (Array.isArray(guestWl) && guestWl.length > 0) {
            const scopedWlKey = 'marketplace_wishlist_' + userKey;
            const currentWl = JSON.parse(localStorage.getItem(scopedWlKey) || '[]');
            guestWl.forEach(id => {
              if (!currentWl.includes(id)) currentWl.push(id);
            });
            localStorage.setItem(scopedWlKey, JSON.stringify(currentWl));
            localStorage.removeItem('marketplace_wishlist_guest');
            user.wishlist = currentWl;
          }
        } catch {}
      }

      try {
        localStorage.setItem('marketplace_user', JSON.stringify(user));
        localStorage.setItem('booksaw_user', JSON.stringify(user));
      } catch {}
      this.saveUserToRegistry(user);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('booksaw:authchange', { detail: { user } }));
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
      if (password) found.passwordHash = this.hashPassword(password);
      delete found.password;
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
      passwordHash: password ? this.hashPassword(password) : '',
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
      if (password) existing.passwordHash = this.hashPassword(password);
      delete existing.password;
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
      passwordHash: password ? this.hashPassword(password) : '',
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

// Orqaga moslik uchun window ga biriktirish
if (typeof window !== 'undefined') {
  window.ICONS = ICONS;
  window.Theme = Theme;
  window.Store = Store;
}

export { ICONS, Theme, Store };
