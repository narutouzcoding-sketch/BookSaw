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
 * Xavfli URL protokollarini (javascript:, data:text/html) xavfsizlantirish
 */
export function sanitizeUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (/^(javascript:|data:text\/html)/i.test(trimmed)) {
    return '#';
  }
  return trimmed;
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
