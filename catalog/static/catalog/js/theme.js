/* Public theme API. theme-boot.js applies the saved choice before first paint. */
window.BooksawTheme = window.BooksawTheme || {
  key: 'booksaw-theme', get() { return document.documentElement.getAttribute('data-theme') || document.documentElement.dataset.theme || 'light'; },
  set(theme) { const next = theme === 'dark' ? 'dark' : 'light'; document.documentElement.setAttribute('data-theme', next); document.documentElement.dataset.theme = next; document.documentElement.style.colorScheme = next; try { localStorage.setItem(this.key, next); } catch (_) { /* Private browsing can block storage. */ } document.dispatchEvent(new CustomEvent('booksaw:themechange', { detail: next })); },
  toggle() { this.set(this.get() === 'dark' ? 'light' : 'dark'); }
};
