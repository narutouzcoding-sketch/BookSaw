import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ICONS, Theme, Store } from '../catalog/static/catalog/js/modules/core.js';

class StorageMock {
  constructor() { this.store = {}; }
  getItem(key) { return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null; }
  setItem(key, val) { this.store[key] = String(val); }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}

globalThis.localStorage = new StorageMock();
globalThis.sessionStorage = new StorageMock();
if (typeof globalThis.window === 'undefined' || !globalThis.window.addEventListener) {
  const win = new EventTarget();
  win.localStorage = globalThis.localStorage;
  win.sessionStorage = globalThis.sessionStorage;
  globalThis.window = win;
}

describe('core.js module tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('ICONS', () => {
    it('contains essential svg icon strings', () => {
      expect(ICONS.cart).toContain('<svg');
      expect(ICONS.heart).toContain('<svg');
      expect(ICONS.search).toContain('<svg');
      expect(ICONS.user).toContain('<svg');
    });
  });

  describe('Store: Password Security', () => {
    it('hashes passwords with salt and prefix h_', () => {
      const hash = Store.hashPassword('secret123');
      expect(hash.startsWith('h_')).toBe(true);
      expect(Store.hashPassword('secret123')).toBe(hash);
      expect(Store.hashPassword('different')).not.toBe(hash);
    });

    it('verifies passwords correctly against hash', () => {
      const hash = Store.hashPassword('myPassword');
      expect(Store.verifyPassword('myPassword', hash)).toBe(true);
      expect(Store.verifyPassword('wrongPassword', hash)).toBe(false);
    });
  });

  describe('Store: Cart and CustomEvents', () => {
    it('adds items to cart and dispatches booksaw:cartchange', () => {
      let eventFired = false;
      let eventDetail = null;
      const handler = (e) => {
        eventFired = true;
        eventDetail = e.detail;
      };
      window.addEventListener('booksaw:cartchange', handler);

      Store.addToCart(1, 2, 'Qattiq');
      const cart = Store.getCart();

      expect(cart.length).toBe(1);
      expect(cart[0].productId).toBe(1);
      expect(cart[0].qty).toBe(2);
      expect(cart[0].variant).toBe('Qattiq');
      expect(eventFired).toBe(true);

      window.removeEventListener('booksaw:cartchange', handler);
    });

    it('clears cart and updates state', () => {
      Store.addToCart(2, 1);
      expect(Store.getCart().length).toBe(1);
      Store.clearCart();
      expect(Store.getCart().length).toBe(0);
    });
  });

  describe('Store: Wishlist and CustomEvents', () => {
    it('toggles wishlist items and dispatches booksaw:wishlistchange', () => {
      let eventFired = false;
      const handler = () => { eventFired = true; };
      window.addEventListener('booksaw:wishlistchange', handler);

      const res1 = Store.toggleWishlist(5);
      expect(res1.added).toBe(true);
      expect(Store.isInWishlist(5)).toBe(true);
      expect(eventFired).toBe(true);

      eventFired = false;
      const res2 = Store.toggleWishlist(5);
      expect(res2.added).toBe(false);
      expect(Store.isInWishlist(5)).toBe(false);
      expect(eventFired).toBe(true);

      window.removeEventListener('booksaw:wishlistchange', handler);
    });
  });

  describe('Store: Account and Scoping', () => {
    it('isolates guest and logged-in user cart scopes', () => {
      Store.setUser(null);
      expect(Store.getUserScopeKey()).toBe('guest');

      Store.addToCart(10, 1);
      expect(Store.getCart().some(i => i.productId === 10)).toBe(true);

      const mockUser = { id: 'usr_test_user_99', name: 'Test User', email: 'test@example.com' };
      Store.setUser(mockUser);
      expect(Store.getUserScopeKey()).toBe('usr_test_user_99');

      // The guest cart item was merged into user's cart upon login
      expect(Store.getCart().some(i => i.productId === 10)).toBe(true);
    });
  });
});
