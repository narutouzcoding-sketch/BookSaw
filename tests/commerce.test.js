import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Store } from '../catalog/static/catalog/js/modules/core.js';
import {
  ProductDetail,
  CartPage,
  Checkout,
  openLightbox
} from '../catalog/static/catalog/js/modules/commerce.js';

describe('commerce.js module tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    Store.clearCart();
    Store.setPromo(null);
  });

  describe('openLightbox', () => {
    it('creates lightbox element with image src and active class', () => {
      openLightbox('sample.jpg', 'Sample Book');
      const lb = document.getElementById('lightbox');
      expect(lb).toBeDefined();
      expect(lb.classList.contains('is-on')).toBe(true);
      const img = lb.querySelector('img');
      expect(img.src).toBe('sample.jpg');
      expect(img.alt).toBe('Sample Book');
    });
  });

  describe('CartPage calculations', () => {
    it('computes summary with subtotal and delivery', () => {
      // Mock subtotal: 100,000
      vi.spyOn(Store, 'getCartTotal').mockReturnValue({ subtotal: 100000, count: 2 });
      CartPage.promoApplied = null;

      const subtotalEl = { textContent: '' };
      const deliveryEl = { textContent: '' };
      const totalEl = { textContent: '' };

      vi.spyOn(document, 'getElementById').mockImplementation(id => {
        if (id === 'summarySubtotal') return subtotalEl;
        if (id === 'summaryDelivery') return deliveryEl;
        if (id === 'summaryTotal') return totalEl;
        return null;
      });

      CartPage.updateSummary();

      expect(subtotalEl.textContent).toContain('100 000');
      expect(deliveryEl.textContent).toContain('15 000');
      expect(totalEl.textContent).toContain('115 000');

      vi.restoreAllMocks();
    });

    it('computes summary with percentage promo discount', () => {
      vi.spyOn(Store, 'getCartTotal').mockReturnValue({ subtotal: 100000, count: 2 });
      CartPage.promoApplied = { code: 'SAVE10', type: 'percent', value: 10 };

      const subtotalEl = { textContent: '' };
      const discountEl = { textContent: '' };
      const deliveryEl = { textContent: '' };
      const totalEl = { textContent: '' };

      vi.spyOn(document, 'getElementById').mockImplementation(id => {
        if (id === 'summarySubtotal') return subtotalEl;
        if (id === 'summaryDiscount') return discountEl;
        if (id === 'summaryDelivery') return deliveryEl;
        if (id === 'summaryTotal') return totalEl;
        return null;
      });

      CartPage.updateSummary();

      expect(discountEl.textContent).toContain('-10 000');
      expect(totalEl.textContent).toContain('105 000');

      vi.restoreAllMocks();
    });
  });

  describe('Checkout Stepper Navigation', () => {
    it('navigates to steps between 1 and 4', () => {
      Checkout.goToStep(2);
      expect(Checkout.currentStep).toBe(2);

      Checkout.goToStep(3);
      expect(Checkout.currentStep).toBe(3);

      // Invalid steps ignored
      Checkout.goToStep(5);
      expect(Checkout.currentStep).toBe(3);
      Checkout.goToStep(0);
      expect(Checkout.currentStep).toBe(3);
    });
  });

  describe('Cart Change Synchronization', () => {
    it('listens for booksaw:cartchange and rerenders if on cart page', () => {
      document.body.dataset.page = 'cart';
      const spy = vi.spyOn(CartPage, 'render').mockImplementation(() => {});
      window.dispatchEvent(new CustomEvent('booksaw:cartchange', { detail: { cart: [] } }));
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
      document.body.dataset.page = '';
    });
  });
});
