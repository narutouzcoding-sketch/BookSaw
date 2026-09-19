import { describe, it, expect, beforeEach } from 'vitest';
import {
  Search,
  Catalog,
  renderProductCard,
  Slider,
  enableDragScroll,
  attachCarouselArrows
} from '../catalog/static/catalog/js/modules/products.js';

describe('products.js module tests', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'O\'tkan kunlar',
      author: 'Abdulla Qodiriy',
      categoryId: 1,
      categoryName: 'Badiiy',
      price: 50000,
      oldPrice: 60000,
      discount: 16,
      rating: 4.8,
      reviewCount: 42,
      sold: 120,
      year: 2020,
      inStock: true,
      image: 'book1.jpg'
    },
    {
      id: 2,
      name: 'Atomic Habits',
      author: 'James Clear',
      categoryId: 2,
      categoryName: 'Biznes',
      price: 80000,
      oldPrice: null,
      discount: 0,
      rating: 4.9,
      reviewCount: 95,
      sold: 350,
      year: 2022,
      inStock: false,
      image: 'book2.jpg'
    },
    {
      id: 3,
      name: 'Mehrobdan chayon',
      author: 'Abdulla Qodiriy',
      categoryId: 1,
      categoryName: 'Badiiy',
      price: 45000,
      oldPrice: 50000,
      discount: 10,
      rating: 4.5,
      reviewCount: 30,
      sold: 80,
      year: 2019,
      inStock: true,
      image: 'book3.jpg'
    }
  ];

  beforeEach(() => {
    window.PRODUCTS = mockProducts;
    Search.query = '';
    Search.filters = { categories: [], minPrice: 0, maxPrice: Infinity, ratings: [], inStock: false };
    Search.sortBy = 'popular';
  });

  describe('Search and Filtering', () => {
    it('searches products by author or title query', () => {
      const results = Search.search('Qodiriy');
      expect(results.length).toBe(2);
      expect(results.every(p => p.author.includes('Qodiriy'))).toBe(true);
    });

    it('filters products by categoryId', () => {
      Search.filters.categories = [2];
      const results = Search.search('');
      expect(results.length).toBe(1);
      expect(results[0].id).toBe(2);
    });

    it('filters products by inStock status', () => {
      Search.filters.inStock = true;
      const results = Search.search('');
      expect(results.length).toBe(2);
      expect(results.every(p => p.inStock)).toBe(true);
    });

    it('filters products by price range', () => {
      Search.filters.minPrice = 48000;
      Search.filters.maxPrice = 60000;
      const results = Search.search('');
      expect(results.length).toBe(1);
      expect(results[0].id).toBe(1);
    });

    it('sorts products by price-asc and price-desc', () => {
      Search.sortBy = 'price-asc';
      let results = Search.search('');
      expect(results[0].price).toBe(45000);
      expect(results[results.length - 1].price).toBe(80000);

      Search.sortBy = 'price-desc';
      results = Search.search('');
      expect(results[0].price).toBe(80000);
      expect(results[results.length - 1].price).toBe(45000);
    });
  });

  describe('renderProductCard', () => {
    it('renders card with correct title, author and price markup', () => {
      const cardHtml = renderProductCard(mockProducts[0]);
      expect(cardHtml).toContain('product-card');
      expect(cardHtml).toContain('O&#039;tkan kunlar');
      expect(cardHtml).toContain('Abdulla Qodiriy');
      expect(cardHtml).toContain('50 000');
    });

    it('renders out-of-stock overlay when book is not in stock', () => {
      const cardHtml = renderProductCard(mockProducts[1]);
      expect(cardHtml).toContain('is-out');
      expect(cardHtml).toContain('product-card__out-overlay');
      expect(cardHtml).toContain('Tugagan');
    });

    it('escapes unsafe characters in product name and author to prevent XSS', () => {
      const maliciousProduct = {
        ...mockProducts[0],
        id: 99,
        name: '<script>alert("xss")</script>',
        author: 'Evil <img src=x onerror=alert(1)>'
      };
      const cardHtml = renderProductCard(maliciousProduct);
      expect(cardHtml).not.toContain('<script>alert("xss")</script>');
      expect(cardHtml).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(cardHtml).not.toContain('<img src=x');
    });
  });

  describe('Module Exports and Methods', () => {
    it('exports Slider object with expected methods', () => {
      expect(typeof Slider.init).toBe('function');
      expect(typeof Slider.go).toBe('function');
      expect(typeof Slider.play).toBe('function');
      expect(typeof Slider.stop).toBe('function');
    });

    it('exports Catalog coordinator with init functions', () => {
      expect(typeof Catalog.init).toBe('function');
      expect(typeof Catalog.initCategories).toBe('function');
    });

    it('exports carousel helper functions', () => {
      expect(typeof attachCarouselArrows).toBe('function');
      expect(typeof enableDragScroll).toBe('function');
    });
  });
});
