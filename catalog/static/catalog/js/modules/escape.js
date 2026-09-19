/**
 * modules/escape.js
 * XSS himoyasi va xavfsiz matn/URL sanitizatsiyasi
 */

/**
 * HTML belgilarini to'liq escape qilish (&, <, >, ", ')
 * Matn va HTML atributlar kontekstida injection xavfini bartaraf etadi.
 */
export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * URL sanitizatsiyasi (Strict Allowlist uslubida)
 * new URL(v, base) orqali protokol tahlil qilinadi.
 * Ruxsat berilganlar:
 * - href: http:, https:, mailto:, tel:, nisbiy yo'llar
 * - img src: http:, https:, nisbiy yo'llar, data:image/(png|jpeg|webp|gif) (svg qat'iyan taqiqlangan)
 * Barcha boshqa protokollar va xavfli holatlar (javascript:, vbscript:, //evil.com, data:text/html) -> 'about:blank'
 */
export function sanitizeUrl(url, opts = {}) {
  if (url == null || typeof url !== 'string') return 'about:blank';
  const trimmed = url.trim();
  if (!trimmed) return 'about:blank';
  // Protocol-relative external URLs (//evil.com) taqiqlanadi
  if (trimmed.startsWith('//')) return 'about:blank';

  let parsed;
  try {
    const base = typeof location !== 'undefined' && location.href ? location.href : 'http://localhost:3344/';
    parsed = new URL(trimmed, base);
  } catch {
    return 'about:blank';
  }

  const protocol = parsed.protocol.toLowerCase();

  // Data URLs: faqat xavfsiz raster rasmlar (SVG yo'q, chunki SVG script bajarishi mumkin)
  if (protocol === 'data:') {
    if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(trimmed)) {
      return trimmed;
    }
    return 'about:blank';
  }

  // Rasm manbasi bo'lsa (opts.isImage = true), mailto va tel taqiqlanadi
  if (opts && opts.isImage) {
    if (protocol === 'http:' || protocol === 'https:') {
      return trimmed;
    }
    return 'about:blank';
  }

  // href va umumiy URL lar
  if (protocol === 'http:' || protocol === 'https:' || protocol === 'mailto:' || protocol === 'tel:') {
    return trimmed;
  }

  return 'about:blank';
}

/**
 * Qidiruv takliflarida so'rovni xavfsiz highlight qilish.
 * So'rovdagi maxsus belgilar regex uchun escape qilinadi.
 * Xom matndan moslik qismlari topilib, har bir bo'lak alohida escapeHtml dan o'tkaziladi
 * va faqat mos kelgan bo'lak <mark> bilan o'raladi.
 * &amp; yoki boshqa entitilar buzilmaydi va HTML injection sodir bo'lmaydi.
 */
export function highlightMatch(text, query) {
  if (!text) return '';
  if (!query) return escapeHtml(text);
  const q = String(query).trim();
  if (!q) return escapeHtml(text);

  const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedQuery, 'gi');
  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    result += escapeHtml(text.slice(lastIndex, match.index));
    result += `<mark>${escapeHtml(match[0])}</mark>`;
    lastIndex = regex.lastIndex;
  }
  result += escapeHtml(text.slice(lastIndex));
  return result;
}
