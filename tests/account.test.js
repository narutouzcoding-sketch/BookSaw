import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Store } from '../catalog/static/catalog/js/modules/core.js';
import {
  Auth,
  ProfilePage,
  OrdersPage,
  WishlistPage
} from '../catalog/static/catalog/js/modules/account.js';

describe('account.js module tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Auth', () => {
    it('checkAlreadyLoggedIn returns false when no user is logged in', () => {
      expect(Auth.checkAlreadyLoggedIn()).toBe(false);
    });

    it('checkAlreadyLoggedIn returns true and renders card when user is logged in', () => {
      Store.setUser({ name: 'Alisher Navoiy', email: 'navoiy@booksaw.uz' });
      const container = { innerHTML: '', style: {} };
      vi.spyOn(document, 'getElementById').mockImplementation(id => {
        if (id === 'cardContainer') return container;
        return null;
      });

      const result = Auth.checkAlreadyLoggedIn();
      expect(result).toBe(true);
      expect(container.innerHTML).toContain('Alisher Navoiy');
      expect(container.innerHTML).toContain('navoiy@booksaw.uz');

      vi.restoreAllMocks();
    });

    it('shake adds shake class to form element', () => {
      const form = {
        classList: {
          _classes: new Set(),
          add(c) { this._classes.add(c); },
          remove(c) { this._classes.delete(c); },
          contains(c) { return this._classes.has(c); }
        },
        offsetWidth: 100
      };
      Auth.shake(form);
      expect(form.classList.contains('shake')).toBe(true);
    });
  });

  describe('ProfilePage', () => {
    it('applyAvatar toggles has-photo class and sets image src', () => {
      const img = { src: '', removeAttribute: vi.fn() };
      const preview = {
        classList: {
          _classes: new Set(),
          toggle(c, val) { if (val) this._classes.add(c); else this._classes.delete(c); },
          contains(c) { return this._classes.has(c); }
        }
      };
      const removeBtn = { hidden: true };

      vi.spyOn(document, 'getElementById').mockImplementation(id => {
        if (id === 'avatarImg') return img;
        if (id === 'avatarPreview') return preview;
        if (id === 'avatarRemove') return removeBtn;
        return null;
      });

      ProfilePage.applyAvatar({ avatar: 'avatar.png' });
      expect(img.src).toBe('avatar.png');
      expect(preview.classList.contains('has-photo')).toBe(true);
      expect(removeBtn.hidden).toBe(false);

      ProfilePage.applyAvatar(null);
      expect(img.removeAttribute).toHaveBeenCalledWith('src');
      expect(preview.classList.contains('has-photo')).toBe(false);
      expect(removeBtn.hidden).toBe(true);

      vi.restoreAllMocks();
    });
  });

  describe('Module Exports and Methods', () => {
    it('exports Auth, ProfilePage, OrdersPage, WishlistPage objects', () => {
      expect(typeof Auth.initLogin).toBe('function');
      expect(typeof Auth.initRegister).toBe('function');
      expect(typeof Auth.init3DFlip).toBe('function');
      expect(typeof ProfilePage.init).toBe('function');
      expect(typeof ProfilePage.renderOrders).toBe('function');
      expect(typeof ProfilePage.renderAddresses).toBe('function');
      expect(typeof OrdersPage.init).toBe('function');
      expect(typeof WishlistPage.init).toBe('function');
    });
  });

  describe('Wishlist Change Synchronization', () => {
    it('listens for booksaw:wishlistchange and invokes WishlistPage.init when on wishlist page', () => {
      document.body.dataset.page = 'wishlist';
      const spy = vi.spyOn(WishlistPage, 'init').mockImplementation(() => {});
      window.dispatchEvent(new CustomEvent('booksaw:wishlistchange', { detail: { wishlist: [] } }));
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
      document.body.dataset.page = '';
    });
  });
});
