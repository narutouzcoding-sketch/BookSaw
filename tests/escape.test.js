import { describe, it, expect } from 'vitest';
import { escapeHtml, sanitizeUrl, highlightMatch } from '../catalog/static/catalog/js/modules/escape.js';

describe('escape.js module tests', () => {
  describe('escapeHtml', () => {
    it('escapes standard HTML special characters', () => {
      expect(escapeHtml('<div>Tom & Jerry said "hello" and \'bye\'</div>'))
        .toBe('&lt;div&gt;Tom &amp; Jerry said &quot;hello&quot; and &#039;bye&#039;&lt;/div&gt;');
    });

    it('neutralizes XSS script and tag injection payloads', () => {
      expect(escapeHtml('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(escapeHtml('<img src=x onerror=alert(1)>'))
        .toBe('&lt;img src=x onerror=alert(1)&gt;');
    });

    it('neutralizes HTML attribute breakout payloads', () => {
      expect(escapeHtml('" onmouseover="alert(1)'))
        .toBe('&quot; onmouseover=&quot;alert(1)');
      expect(escapeHtml('\' autofocus onfocus=\'alert(1)'))
        .toBe('&#039; autofocus onfocus=&#039;alert(1)');
    });

    it('handles null, undefined, and non-string inputs safely', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
      expect(escapeHtml('')).toBe('');
      expect(escapeHtml(0)).toBe('0');
      expect(escapeHtml(12345)).toBe('12345');
      expect(escapeHtml(false)).toBe('false');
    });
  });

  describe('sanitizeUrl', () => {
    it('allows valid http and https URLs', () => {
      expect(sanitizeUrl('https://example.com/books/cover.jpg')).toBe('https://example.com/books/cover.jpg');
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
    });

    it('allows relative and root-relative URLs', () => {
      expect(sanitizeUrl('/static/catalog/images/book1.jpg')).toBe('/static/catalog/images/book1.jpg');
      expect(sanitizeUrl('../../static/catalog/images/banner.jpg')).toBe('../../static/catalog/images/banner.jpg');
      expect(sanitizeUrl('book_detail.html?id=1')).toBe('book_detail.html?id=1');
    });

    it('allows mailto and tel URLs for general links', () => {
      expect(sanitizeUrl('mailto:info@booksaw.uz')).toBe('mailto:info@booksaw.uz');
      expect(sanitizeUrl('tel:+998901234567')).toBe('tel:+998901234567');
    });

    it('allows safe raster image data URLs, but blocks them if isImage rejects or SVG', () => {
      expect(sanitizeUrl('data:image/png;base64,iVBORw0KGgo=')).toBe('data:image/png;base64,iVBORw0KGgo=');
      expect(sanitizeUrl('data:image/jpeg;base64,/9j/4AAQSkZJRg==')).toBe('data:image/jpeg;base64,/9j/4AAQSkZJRg==');
      expect(sanitizeUrl('data:image/webp;base64,UklGR')).toBe('data:image/webp;base64,UklGR');
    });

    it('blocks bypass attempts and unsupported protocols returning about:blank', () => {
      expect(sanitizeUrl(' javascript:alert(1)')).toBe('about:blank');
      expect(sanitizeUrl('\tjavascript:x')).toBe('about:blank');
      expect(sanitizeUrl('java\nscript:x')).toBe('about:blank');
      expect(sanitizeUrl('JaVaScRiPt:x')).toBe('about:blank');
      expect(sanitizeUrl('vbscript:x')).toBe('about:blank');
      expect(sanitizeUrl('data:text/html,x')).toBe('about:blank');
      expect(sanitizeUrl('data:image/svg+xml,x')).toBe('about:blank');
      expect(sanitizeUrl('//evil.com')).toBe('about:blank');
      expect(sanitizeUrl('')).toBe('about:blank');
      expect(sanitizeUrl(null)).toBe('about:blank');
      expect(sanitizeUrl(undefined)).toBe('about:blank');
    });
  });

  describe('highlightMatch', () => {
    it('highlights matching substrings case-insensitively with <mark>', () => {
      expect(highlightMatch('Atomic Habits', 'atomic')).toBe('<mark>Atomic</mark> Habits');
      expect(highlightMatch('Clean Code', 'code')).toBe('Clean <mark>Code</mark>');
    });

    it('escapes unmatched and matched chunks while wrapping matches in <mark>', () => {
      expect(highlightMatch('Tom & Jerry', 'Jerry')).toBe('Tom &amp; <mark>Jerry</mark>');
      expect(highlightMatch('<Hello> World', 'Hello')).toBe('&lt;<mark>Hello</mark>&gt; World');
    });

    it('does NOT corrupt HTML entities when searching for entity substrings (e.g. amp)', () => {
      // In a naive approach that escapes before regex replace, searching for "amp" in "Tom & Jerry"
      // would corrupt "&amp;" into "&<mark>amp</mark>;".
      // Our chunked highlightMatch handles raw input and escapes segments independently:
      expect(highlightMatch('Tom & Jerry', 'amp')).toBe('Tom &amp; Jerry');
    });

    it('safely handles regex special characters in the search query without throwing', () => {
      expect(highlightMatch('Learn C++ in 21 Days', 'C++')).toBe('Learn <mark>C++</mark> in 21 Days');
      expect(highlightMatch('Price is $100', '$100')).toBe('Price is <mark>$100</mark>');
      expect(highlightMatch('Check (A|B) option', '(A|B)')).toBe('Check <mark>(A|B)</mark> option');
      expect(highlightMatch('Array[0] item', '[0]')).toBe('Array<mark>[0]</mark> item');
    });

    it('returns escaped text when query is empty or not found', () => {
      expect(highlightMatch('Simple Book', '')).toBe('Simple Book');
      expect(highlightMatch('Simple Book', '   ')).toBe('Simple Book');
      expect(highlightMatch('Simple & Sweet', null)).toBe('Simple &amp; Sweet');
      expect(highlightMatch('', 'query')).toBe('');
    });
  });
});
