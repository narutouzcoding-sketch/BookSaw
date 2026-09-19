import { describe, it, expect, vi } from 'vitest';
import {
  UI,
  renderStars,
  createBinButtonHtml,
  mapDeliveryIcon,
  mapPaymentIcon
} from '../catalog/static/catalog/js/modules/ui.js';

describe('ui.js module tests', () => {
  describe('renderStars', () => {
    it('renders 5 stars for rating 5', () => {
      const html = renderStars(5);
      expect(html).toContain('class="stars"');
      // Should have 5 full stars
      const fullStars = (html.match(/fill="currentColor"/g) || []).length;
      expect(fullStars).toBeGreaterThanOrEqual(5);
    });

    it('renders stars for fractional rating 3.5', () => {
      const html = renderStars(3.5);
      expect(html).toContain('class="stars"');
      expect(html).toContain('<svg');
    });

    it('renders empty stars for rating 0', () => {
      const html = renderStars(0);
      expect(html).toContain('class="stars"');
      const emptyStars = (html.match(/fill="none"/g) || []).length;
      expect(emptyStars).toBe(5);
    });
  });

  describe('createBinButtonHtml', () => {
    it('creates button HTML containing bin-wrapper and label with wrapped chars', () => {
      const html = createBinButtonHtml("O'chirish");
      expect(html).toContain('eat-btn danger');
      expect(html).toContain('bin-wrapper');
      expect(html).toContain('btn-label');
      expect(html).toContain('<span class="char">O</span>');
    });
  });

  describe('mapDeliveryIcon', () => {
    it('returns appropriate icon for known delivery methods', () => {
      expect(mapDeliveryIcon('🚚 Standart')).toContain('<svg');
      expect(mapDeliveryIcon('⚡ Tezkor')).toContain('<svg');
      expect(mapDeliveryIcon('🏪 Olib ketish')).toContain('<svg');
    });

    it('returns raw icon string when no emoji match is found', () => {
      expect(mapDeliveryIcon('oddiy_yetkazish')).toBe('oddiy_yetkazish');
    });
  });

  describe('mapPaymentIcon', () => {
    it('returns appropriate icon for known payment methods', () => {
      expect(mapPaymentIcon('💳 Karta')).toContain('<svg');
      expect(mapPaymentIcon('📱 Payme/Click')).toContain('<svg');
      expect(mapPaymentIcon('💵 Naqd')).toContain('<svg');
      expect(mapPaymentIcon('⏳ Nasiya')).toContain('<svg');
    });
  });

  describe('UI Event Synchronization', () => {
    it('listens for booksaw:cartchange and invokes updateBadges', () => {
      const spy = vi.spyOn(UI, 'updateBadges').mockImplementation(() => {});
      window.dispatchEvent(new CustomEvent('booksaw:cartchange', { detail: { cart: [] } }));
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('listens for booksaw:wishlistchange and invokes updateBadges', () => {
      const spy = vi.spyOn(UI, 'updateBadges').mockImplementation(() => {});
      window.dispatchEvent(new CustomEvent('booksaw:wishlistchange', { detail: { wishlist: [] } }));
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('listens for booksaw:authchange and updates avatar and badges', () => {
      const badgeSpy = vi.spyOn(UI, 'updateBadges').mockImplementation(() => {});
      const avatarSpy = vi.spyOn(UI, 'updateHeaderAvatar').mockImplementation(() => {});
      window.dispatchEvent(new CustomEvent('booksaw:authchange', { detail: { user: null } }));
      expect(badgeSpy).toHaveBeenCalled();
      expect(avatarSpy).toHaveBeenCalled();
      badgeSpy.mockRestore();
      avatarSpy.mockRestore();
    });
  });
});
