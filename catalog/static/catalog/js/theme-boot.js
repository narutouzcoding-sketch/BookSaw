(function () {
  try {
    var key = 'booksaw-theme';
    var stored = localStorage.getItem(key) || localStorage.getItem('bookscatalog-theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (stored && stored !== localStorage.getItem(key)) {
      try { localStorage.setItem(key, theme); } catch (e2) { /* ignore */ }
    }
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) { /* ignore */ }
})();
