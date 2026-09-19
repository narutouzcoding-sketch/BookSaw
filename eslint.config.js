export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        location: 'readonly',
        history: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        performance: 'readonly',
        CustomEvent: 'readonly',
        EventTarget: 'readonly',
        IntersectionObserver: 'readonly',
        ResizeObserver: 'readonly',
        FileReader: 'readonly',
        Image: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        PRODUCTS: 'readonly',
        CATEGORIES: 'readonly',
        BANNERS: 'readonly',
        AUTHORS: 'readonly',
        STORES: 'readonly',
        REVIEWS: 'readonly',
        QNA: 'readonly',
        BRANDS: 'readonly',
        BRAND_PARTNERS: 'readonly',
        POSTS: 'readonly',
        INFO_PAGES: 'readonly',
        DELIVERY_OPTIONS: 'readonly',
        PAYMENT_METHODS: 'readonly',
        PROMO_CODES: 'readonly',
        confetti: 'readonly',
        google: 'readonly'
      }
    },
    rules: {
      'no-undef': 'error'
    }
  }
];
