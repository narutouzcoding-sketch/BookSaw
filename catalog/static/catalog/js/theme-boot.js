(function () {
  try {
    var key = 'booksaw-theme';
    var stored = localStorage.getItem(key) || localStorage.getItem('bookscatalog-theme');
    var theme = stored === 'dark' ? 'dark' : 'light';
    if (stored && stored !== localStorage.getItem(key)) {
      try { localStorage.setItem(key, theme); } catch (e2) { /* ignore */ }
    }
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) { /* ignore */ }
})();
