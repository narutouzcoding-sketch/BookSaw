/**
 * modules/ui.js
 * Foydalanuvchi interfeysi (UI) yordamchilari, modal, bildirishnoma (toast),
 * yulduzchalar va nishonlar sinxronizatsiyasi.
 */
import { escapeHtml, sanitizeUrl, highlightMatch } from './escape.js';
import { ICONS, Store } from './core.js';

/* ==========================================================================
   THE BIN EATS THE LABEL - 4-STAGE PHYSICS ENGINE
   ========================================================================== */
function runBinEatAnimation(button, onComplete) {
  if (!button || button.classList.contains('is-eating')) return;

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  const label = button.querySelector('.btn-label');
  if (!label) {
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  // Split text into individual characters if not yet wrapped
  if (!label.querySelector('.char')) {
    const text = label.textContent.trim();
    label.innerHTML = text.split('').map(char => `<span class="char">${char}</span>`).join('');
  }

  const chars = Array.from(label.querySelectorAll('.char'));
  const binWrapper = button.querySelector('.bin-wrapper');

  const binRect = binWrapper ? binWrapper.getBoundingClientRect() : { left: 0, top: 0, width: 20 };
  const mouthX = binRect.left + binRect.width / 2;
  const mouthY = binRect.top + 4;
  const flightPlan = chars.map(char => {
    const rect = char.getBoundingClientRect();
    return {
      char,
      deltaX: mouthX - (rect.left + rect.width / 2),
      deltaY: mouthY - (rect.top + rect.height / 2)
    };
  });

  // Stage 1: Open bin lid and start animation
  button.classList.add('lid-open');
  button.classList.add('is-eating');

  // Stage 2: Parabolic letter ingestion with staggered delay
  flightPlan.forEach(({ char, deltaX, deltaY }, index) => {
    const delay = index * 45;

    if (char.animate) {
      char.animate([
        { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(${deltaX * 0.5}px, ${deltaY - 18}px) scale(0.85) rotate(-25deg)`, opacity: 0.9, offset: 0.5 },
        { transform: `translate(${deltaX}px, ${deltaY + 8}px) scale(0.1) rotate(-75deg)`, opacity: 0 }
      ], {
        duration: 320,
        delay: delay,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      });
    } else {
      char.style.opacity = '0';
    }
  });

  const totalEatTime = (chars.length * 45) + 320;

  // Stage 3: Close lid & trigger recoil bounce (No circular ring)
  setTimeout(() => {
    button.classList.remove('lid-open');

    if (binWrapper && binWrapper.animate) {
      binWrapper.animate([
        { transform: 'scale(1) translateY(0)' },
        { transform: 'scale(1.15, 0.88) translateY(2px)' },
        { transform: 'scale(0.95, 1.05) translateY(-2px)' },
        { transform: 'scale(1) translateY(0)' }
      ], { duration: 250, easing: 'ease-out' });
    }

    // Stage 4: Execute callback promptly without awkward spinner ring delay
    setTimeout(() => {
      button.classList.remove('is-eating');

      chars.forEach(char => {
        if (char.getAnimations) {
          char.getAnimations().forEach(anim => anim.cancel());
        }
        char.style.opacity = '1';
        char.style.transform = 'none';
      });

      if (typeof onComplete === 'function') {
        try { onComplete(); } catch (err) { console.error('onComplete error:', err); }
      }
    }, 280);

  }, Math.max(200, totalEatTime - 40));
}

function requireAuth(message = "Bu amalni bajarish uchun tizimga kiring", delay = 450) {
  if (!Store.isLoggedIn()) {
    if (location.pathname.includes('login') || location.pathname.includes('register')) {
      return false;
    }
    UI.showToast(message, "info", 2500);
    const currentPath = location.pathname.split('/').pop() || 'book_list.html';
    const redirectUrl = currentPath + location.search;
    setTimeout(() => {
      location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
    }, delay);
    return false;
  }
  return true;
}

function createBinButtonHtml(text, colorClass = 'danger', id = '') {
  const chars = text.split('').map(c => `<span class="char">${c}</span>`).join('');
  return `<button type="button" class="eat-btn ${colorClass}" ${id ? `id="${id}"` : ''} title="${text}">
    <div class="bin-wrapper">
      <svg class="bin-svg" viewBox="0 0 20 24" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <g class="bin-lid">
          <path d="M1 5h18" />
          <path d="M7 5V2.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 13 2.5V5" />
        </g>
        <g class="bin-body">
          <path d="M3.5 5.5l1.2 14.5a2.5 2.5 0 0 0 2.5 2.5h5.6a2.5 2.5 0 0 0 2.5-2.5L16.5 5.5" />
          <line x1="8" y1="10" x2="8" y2="17" stroke-width="1.6" />
          <line x1="12" y1="10" x2="12" y2="17" stroke-width="1.6" />
        </g>
      </svg>
    </div>
    <span class="btn-label">${chars}</span>
  </button>`;
}


function renderStars(rating) {
  let stars = '<span class="stars" style="display:inline-flex;flex-direction:row;align-items:center;gap:2px;">';
  for (let i = 1; i <= 5; i++) {
    stars += i <= Math.round(rating) ? ICONS.star : ICONS.starEmpty;
  }
  stars += '</span>';
  return stars;
}

const mapDeliveryIcon = (icon) => {
    if (!icon) return '';
    if (icon.includes('🚚')) return ICONS.truck;
    if (icon.includes('⚡')) return ICONS.zap;
    if (icon.includes('🏪')) return ICONS.store;
    return icon;
};

const mapPaymentIcon = (icon) => {
    if (!icon) return '';
    if (icon.includes('💳')) return ICONS.creditCard;
    if (icon.includes('📱')) return ICONS.phone;
    if (icon.includes('💵')) return ICONS.creditCard;
    if (icon.includes('⏳')) return ICONS.clock;
    return icon;
};


const UI = {
  escapeHtml,
  sanitizeUrl,
  highlightMatch,
  showToast(message, type = 'success', duration = 3000) {
    let c = document.getElementById('toastContainer');
    if (!c) { c = document.createElement('div'); c.className = 'toast-container'; c.id = 'toastContainer'; document.body.appendChild(c); }
    c.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    c.setAttribute('aria-atomic', 'true');
    const icon = type === 'success' ? ICONS.check : type === 'error' ? ICONS.x : ICONS.info;
    const t = document.createElement('div');
    t.className = `toast toast--${type}`;
    t.innerHTML = `<div class="toast__icon" aria-hidden="true">${icon}</div><div class="toast__message">${message}</div><button class="toast__close" type="button" aria-label="Xabarni yopish" onclick="this.parentElement.remove()">${ICONS.x}</button>`;
    c.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, duration);
  },

  showModal(html, opts = {}) {
    let overlay = document.getElementById('modalOverlay');
    let modal = document.getElementById('modalContent');
    if (!overlay) {
      overlay = document.createElement('div'); overlay.className = 'modal-overlay'; overlay.id = 'modalOverlay';
      modal = document.createElement('div'); modal.className = 'modal'; modal.id = 'modalContent';
      overlay.appendChild(modal); document.body.appendChild(overlay);
    }
    if (opts.className) modal.className = 'modal ' + opts.className;
    else modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `<button class="modal__close" id="modalCloseBtn" type="button" aria-label="Yopish"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>${html}`;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    const close = () => { overlay.classList.remove('active'); document.body.style.overflow = ''; };
    modal.querySelector('#modalCloseBtn').onclick = close;
    overlay.onclick = e => { if (e.target === overlay) close(); };
    const escH = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escH); } };
    document.addEventListener('keydown', escH);
    return { close };
  },

  showConfirm(msg, onConfirm, okText = "Ha, tasdiqlash") {
    const html = `<div style="text-align:center;padding:20px"><h3 style="margin-bottom:12px">Tasdiqlash</h3><p style="margin-bottom:24px;color:var(--gray-500)">${this.escapeHtml(msg)}</p><div style="display:flex;gap:12px;justify-content:center"><button class="btn btn-secondary" id="confirmCancel">Bekor qilish</button><button class="btn btn-primary" id="confirmOk" style="background:var(--danger)">${this.escapeHtml(okText)}</button></div></div>`;
    const { close } = this.showModal(html);
    document.getElementById('confirmCancel').onclick = close;
    document.getElementById('confirmOk').onclick = () => { close(); onConfirm(); };
  },

  showQuickView(productId) {
    const p = PRODUCTS.find(pr => pr.id === productId);
    if (!p) return;
    const inWL = Store.isInWishlist(p.id);
    const html = `<div class="quick-view__container">
      <div class="quick-view__image-col">
        <div class="quick-view__book-wrapper">
          <div class="quick-view__book-cover">
            <img src="${sanitizeUrl(p.image)}" alt="${escapeHtml(p.name)}" class="quick-view__img">
            <div class="quick-view__book-spine"></div>
            ${p.discount ? `<span class="badge badge-sale quick-view__sale-badge">-${p.discount}%</span>` : ''}
          </div>
        </div>
      </div>
      <div class="quick-view__info-col">
        <div class="quick-view__tags-row">
          <span class="quick-view__category">${escapeHtml(p.categoryName)}</span>
          ${p.inStock 
            ? '<span class="badge badge-success quick-view__stock-badge"><i class="fa-solid fa-check"></i> Mavjud</span>' 
            : '<span class="badge badge-danger quick-view__stock-badge"><i class="fa-solid fa-xmark"></i> Tugagan</span>'
          }
        </div>
        
        <h2 class="quick-view__title">${escapeHtml(p.name)}</h2>
        <p class="quick-view__author"><i class="fa-solid fa-user-pen"></i> <span>${escapeHtml(p.author)}</span></p>
        
        <div class="quick-view__rating-row">
          <span class="quick-view__stars">${renderStars(p.rating)}</span>
          <span class="quick-view__rating-num">${p.rating}</span>
          <span class="quick-view__reviews-count">(${p.reviewCount} ta sharh)</span>
        </div>

        <div class="quick-view__price-row">
          <span class="quick-view__price">${UI.formatPrice(p.price)}</span>
          ${p.oldPrice && p.oldPrice > p.price ? `<span class="quick-view__old-price">${UI.formatPrice(p.oldPrice)}</span>` : ''}
          ${p.discount ? `<span class="quick-view__discount-text">Tejov: ${UI.formatPrice(p.oldPrice - p.price)}</span>` : ''}
        </div>

        <p class="quick-view__desc">
          ${escapeHtml(p.description || "Ushbu asar jahon adabiyoti va zamonaviy kitobxonlikning sara namunalaridan biri bo'lib, chuqur ma'no va qiziqarli voqealarga boy.")}
        </p>

        <div class="quick-view__actions">
          <button class="btn btn-primary add-to-cart-btn quick-view__add-btn" data-id="${p.id}" ${!p.inStock ? 'disabled' : ''}>
            ${ICONS.cart} <span>${p.inStock ? "Savatga qo'shish" : "Tugagan"}</span>
          </button>
          <button class="btn btn-secondary wishlist-toggle-btn quick-view__wishlist-btn ${inWL ? 'active' : ''}" data-id="${p.id}" title="${inWL ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}">
            ${inWL ? ICONS.heartFilled : ICONS.heart}
          </button>
          <a href="book_detail.html?id=${p.id}" class="btn btn-outline quick-view__detail-btn">
            Batafsil
          </a>
        </div>
      </div>
    </div>`;
    this.showModal(html, { className: 'modal--quick-view' });
  },

  updateBadges() {
    const { itemCount } = Store.getCartTotal();
    const wlCount = Store.getWishlist().length;
    document.querySelectorAll('#cartBadge, #cartBadgeBottom').forEach(b => {
      b.textContent = itemCount;
      b.classList.toggle('is-on', itemCount > 0);
      b.style.display = itemCount > 0 ? 'flex' : 'none';
    });
    document.querySelectorAll('#wishlistBadge, #wishlistBadgeBottom').forEach(b => {
      b.textContent = wlCount;
      b.classList.toggle('is-on', wlCount > 0);
      b.style.display = wlCount > 0 ? 'flex' : 'none';
    });
    // Mini cart update
    const miniItems = document.getElementById('miniCartItems');
    const miniTotal = document.getElementById('miniCartTotal');
    if (miniItems) {
      const cart = Store.getCart();
      if (cart.length === 0) {
        miniItems.innerHTML = '<p class="text-center text-muted" style="padding:20px">Savat bo\'sh</p>';
      } else {
        miniItems.innerHTML = cart.slice(0, 3).map(ci => {
          const p = PRODUCTS.find(pr => pr.id === ci.productId);
          if (!p) return '';
          return `<div class="mini-cart__item" style="display:flex;gap:12px;padding:12px;border-bottom:1px solid var(--gray-100)">
            <img src="${sanitizeUrl(p.image)}" alt="" style="width:50px;height:60px;object-fit:cover;border-radius:6px">
            <div style="flex:1;min-width:0"><p style="font-weight:600;font-size:13px" class="text-truncate">${escapeHtml(p.name)}</p><p style="font-size:13px;color:var(--gray-500)">${ci.qty} × ${UI.formatPrice(p.price)}</p></div>
          </div>`;
        }).join('') + (cart.length > 3 ? `<p style="text-align:center;padding:8px;color:var(--gray-400);font-size:13px">+${cart.length - 3} ta mahsulot</p>` : '');
      }
    }
    if (miniTotal) { miniTotal.textContent = UI.formatPrice(Store.getCartTotal().subtotal); }
    this.updateHeaderAvatar();
  },
  initials(user) {
    const src = ((user && (user.name || user.email)) || 'K').trim();
    const parts = src.split(/[\s.@]+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return src.slice(0, 2).toUpperCase();
  },
  updateHeaderAvatar() {
    const btn = document.getElementById('userToggle');
    const user = Store.getUser();
    if (btn) {
      btn.querySelectorAll('.header-avatar').forEach(el => el.remove());
      btn.classList.toggle('is-logged', !!user);
      btn.title = user ? (user.name || 'Profil') : 'Profil';
      btn.querySelectorAll('svg, .icon, .user-toggle__icon, .user-toggle__svg').forEach(el => {
        el.style.display = user ? 'none' : '';
      });
      if (user) {
        if (user.avatar) {
          const img = document.createElement('img');
          img.className = 'header-avatar';
          img.alt = user.name || 'Profil';
          img.src = sanitizeUrl(user.avatar);
          btn.appendChild(img);
        } else {
          const span = document.createElement('span');
          span.className = 'header-avatar header-avatar--initials';
          span.textContent = this.initials(user);
          btn.appendChild(span);
        }
      }
    }

    // Dynamic mobile menu sync based on login status
    const mobLinks = document.querySelector('.mobile-menu__links');
    if (mobLinks) {
      if (user) {
        mobLinks.innerHTML = `
          <li><a href="book_list.html">Bosh sahifa</a></li>
          <li><a href="categories.html">Kategoriyalar</a></li>
          <li><a href="cart.html">Savat</a></li>
          <li><a href="profile.html?tab=wishlist">Sevimlilarim</a></li>
          <li><a href="profile.html?tab=orders">Buyurtmalarim</a></li>
          <li><a href="profile.html">Profil (${escapeHtml(user.name || 'Foydalanuvchi')})</a></li>
          <li><a href="#" id="mobLogoutLink" style="color:var(--danger, #ef4444);font-weight:600;"><i class="fa-solid fa-arrow-right-from-bracket" style="margin-right:6px;"></i> Chiqish</a></li>
        `;
        document.getElementById('mobLogoutLink')?.addEventListener('click', (e) => {
          e.preventDefault();
          Store.logout();
          location.reload();
        });
      } else {
        mobLinks.innerHTML = `
          <li><a href="book_list.html">Bosh sahifa</a></li>
          <li><a href="categories.html">Kategoriyalar</a></li>
          <li><a href="cart.html">Savat</a></li>
          <li><a href="login.html">Kirish</a></li>
          <li><a href="register.html">Ro'yxatdan o'tish</a></li>
        `;
      }
    }
  },

  formatPrice(price) {
    if (price == null) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm";
  },
  formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const months = ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'];
    return `${d.getDate()}-${months[d.getMonth()]}, ${d.getFullYear()}`;
  },

  startGoogleOAuth(onSuccess) {
    const clientId = (window.APP_CONFIG && window.APP_CONFIG.GOOGLE_CLIENT_ID) || '';
    if (!clientId) {
      UI.showToast("Google Client ID topilmadi (config.js ni tekshiring)", "error");
      return;
    }

    if (typeof onSuccess === 'function') {
      window._googleAuthSuccessCallback = onSuccess;
    }

    // 1. If Google Identity Services (GSI) is loaded, open Google's native official sign-in popup
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          callback: (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              UI.fetchGoogleUserInfo(tokenResponse.access_token, onSuccess);
            } else if (tokenResponse && tokenResponse.error) {
              console.warn('Google OAuth token error:', tokenResponse);
              UI.showToast("Google hisobiga ulanish bekor qilindi", "info");
            }
          },
          error_callback: (err) => {
            console.warn('Google GSI popup error, redirecting directly to accounts.google.com:', err);
            UI.redirectToGoogleOAuth(clientId);
          }
        });
        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('Google tokenClient exception:', err);
      }
    }

    // 2. Standard direct redirect to accounts.google.com OAuth 2.0 authorization endpoint
    UI.redirectToGoogleOAuth(clientId);
  },

  redirectToGoogleOAuth(clientId) {
    const redirectUri = window.location.origin + window.location.pathname;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=openid%20email%20profile&prompt=select_account&nonce=${Date.now()}`;
    window.location.href = url;
  },

  async fetchGoogleUserInfo(accessToken, onSuccess) {
    try {
      UI.showToast("Google hisobingiz ma'lumotlari yuklanmoqda...", "info");
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error("Google UserInfo API javob bermadi");
      const data = await res.json();
      if (data && (data.email || data.sub)) {
        const existing = Store.findUser(data.email) || Store.findUser(data.sub);
        const onAuthPage = location.pathname.includes('login') || location.pathname.includes('register');
        const isRegisterPage = location.pathname.includes('register') || (document.getElementById('cardContainer')?.classList.contains('flipped'));

        if (existing && existing.username && existing.password && !isRegisterPage) {
          Store.setUser(existing);
          UI.showToast(`Xush kelibsiz, ${existing.name}! Google orqali kirdingiz.`, 'success');
          if (typeof onSuccess === 'function') onSuccess(existing);
          else {
            setTimeout(() => {
              const targetUrl = new URLSearchParams(location.search).get('redirect') || 'book_list.html';
              if (onAuthPage) location.href = targetUrl;
              else location.reload();
            }, 400);
          }
        } else {
          // Open the social registration modal to complete details
          UI.showSocialCompleteModal({
            provider: 'google',
            name: data.name || data.given_name || 'Google Foydalanuvchisi',
            email: data.email || '',
            avatar: data.picture || null
          }, onSuccess);
        }
      } else {
        throw new Error("Profil ma'lumotlari bo'sh qaytdi");
      }
    } catch (err) {
      console.error('Google userinfo error:', err);
      UI.showToast("Google orqali ma'lumotlarni yuklab bo'lmadi", "error");
    }
  },

  checkOAuthRedirect() {
    if (window.location.hash && window.location.hash.includes('access_token=')) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      if (accessToken) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
        UI.fetchGoogleUserInfo(accessToken);
      }
    }
  },

  showGoogleOAuthModal(onSuccess) {
    return this.startGoogleOAuth(onSuccess);
  },

  showTelegramAuthModal(onSuccess) {
    const botUser = (window.APP_CONFIG && window.APP_CONFIG.TELEGRAM_BOT_USERNAME) || 'BooksawUzBot';
    const botUrl = 'https://t.me/' + botUser + '?start=otp';

    let generatedOtp = '';
    let currentPhone = '';
    let countdownInterval = null;

    const html = `
      <div class="telegram-auth-box">
        <div class="tg-badge-icon" style="background: linear-gradient(135deg, #0f172a 0%, #3b82f6 100%); box-shadow: 0 8px 20px rgba(15, 23, 42, 0.25);">
          ${ICONS.telegram}
        </div>

        <!-- STEP 1: Phone number -->
        <div id="tgStepPhone">
          <h3 style="font-size:22px;font-weight:700;margin:0 0 8px;color:var(--text-primary);">Telegram orqali kirish</h3>
          <p style="font-size:14px;color:var(--text-muted);margin:0 0 20px;line-height:1.5;">
            Telegram raqamingizni kiriting. Biz <strong>@${botUser}</strong> boti orqali 6 xonali tasdiqlash kodini yuboramiz.
          </p>

          <div class="tg-phone-input-wrap">
            <span class="tg-phone-prefix">🇺🇿 +998</span>
            <input type="tel" id="tgPhoneInput" class="tg-phone-input" placeholder="(90) 123-45-67" maxlength="15" autocomplete="tel">
          </div>
          <div id="tgPhoneError" style="display:none;color:#ef4444;font-size:13px;margin:-10px 0 14px;text-align:left;"></div>

          <a href="${botUrl}" target="_blank" rel="noopener noreferrer" class="tg-bot-chip" style="width:100%;justify-content:center;color:#2563eb;margin-bottom:12px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">${ICONS.telegram}</svg>
            @${botUser} botida /start ni bosing
          </a>

          <button type="button" class="btn btn-primary" id="tgSendOtpBtn" style="width:100%;background:var(--primary);border-color:var(--primary);font-size:15px;font-weight:600;height:46px;margin-top:6px;">
            Tasdiqlash kodini olish
          </button>

          <p style="font-size:12px;color:var(--text-muted);margin:14px 0 0;line-height:1.4;">
            🔒 Xavfsiz avtorizatsiya. Kod faqat sizning rasmiy Telegram botingizga yuboriladi.
          </p>
        </div>

        <!-- STEP 2: Enter OTP -->
        <div id="tgStepOtp" style="display:none;">
          <h3 style="font-size:22px;font-weight:700;margin:0 0 6px;color:var(--text-primary);">Tasdiqlash kodi</h3>
          <p style="font-size:14px;color:var(--text-muted);margin:0 0 8px;">
            Kod ushbu raqamga bog'langan Telegramga yuborildi:
          </p>
          <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:16px;">
            <strong id="tgEnteredPhone" style="font-size:16px;color:var(--text-primary);">+998</strong>
            <button type="button" id="tgChangePhoneBtn" style="background:none;border:none;color:#2563eb;font-size:13px;cursor:pointer;text-decoration:underline;padding:0;">O'zgartirish</button>
          </div>

          <div class="tg-otp-grid">
            <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="tg-otp-box" data-idx="0" autofocus autocomplete="one-time-code">
            <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="tg-otp-box" data-idx="1">
            <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="tg-otp-box" data-idx="2">
            <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="tg-otp-box" data-idx="3">
            <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="tg-otp-box" data-idx="4">
            <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="tg-otp-box" data-idx="5">
          </div>

          <div id="tgOtpError" style="display:none;color:#ef4444;font-size:13px;margin:-8px 0 14px;font-weight:600;"></div>
          <div id="tgOtpNotice" style="display:none;padding:10px 12px;border-radius:10px;background:var(--bg-hover);border:1px solid var(--border);color:var(--text-muted);font-size:12px;margin-bottom:16px;"></div>

          <div class="tg-timer-text">
            Kodni qayta yuborish: <span class="tg-timer-count" id="tgTimerCount">00:59</span>
            <button type="button" id="tgResendBtn" style="display:none;background:none;border:none;color:#2563eb;font-weight:600;cursor:pointer;text-decoration:underline;margin-left:6px;">Qayta yuborish</button>
          </div>

          <a href="${botUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width:100%;font-size:13px;padding:10px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;gap:6px;">
            💬 Telegram botni ochish (@${botUser})
          </a>

          <button type="button" class="btn btn-primary" id="tgVerifyBtn" style="width:100%;background:var(--primary);border-color:var(--primary);font-size:15px;font-weight:600;height:46px;">
            Tasdiqlash va kirish
          </button>
        </div>
      </div>
    `;

    const modalRes = this.showModal(html, { className: 'modal--telegram-auth' });

    // Elements
    const stepPhone = document.getElementById('tgStepPhone');
    const stepOtp = document.getElementById('tgStepOtp');
    const phoneInput = document.getElementById('tgPhoneInput');
    const phoneError = document.getElementById('tgPhoneError');
    const sendOtpBtn = document.getElementById('tgSendOtpBtn');
    const enteredPhoneEl = document.getElementById('tgEnteredPhone');
    const changePhoneBtn = document.getElementById('tgChangePhoneBtn');
    const otpBoxes = Array.from(document.querySelectorAll('.tg-otp-box'));
    const otpError = document.getElementById('tgOtpError');
    const otpNotice = document.getElementById('tgOtpNotice');
    const timerCount = document.getElementById('tgTimerCount');
    const resendBtn = document.getElementById('tgResendBtn');
    const verifyBtn = document.getElementById('tgVerifyBtn');

    // Auto-mask for phone input: (90) 123-45-67
    if (phoneInput) {
      phoneInput.focus();
      phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.startsWith('998')) val = val.slice(3);
        val = val.slice(0, 9);
        let formatted = '';
        if (val.length > 0) formatted += '(' + val.slice(0, 2);
        if (val.length >= 2) formatted += ') ' + val.slice(2, 5);
        if (val.length >= 5) formatted += '-' + val.slice(5, 7);
        if (val.length >= 7) formatted += '-' + val.slice(7, 9);
        e.target.value = formatted;
        if (phoneError) phoneError.style.display = 'none';
      });
      phoneInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendOtpBtn?.click();
      });
    }

    // Timer logic
    const startTimer = () => {
      if (countdownInterval) clearInterval(countdownInterval);
      let secondsLeft = 59;
      if (timerCount) {
        timerCount.textContent = '00:59';
        timerCount.style.display = '';
      }
      if (resendBtn) resendBtn.style.display = 'none';

      countdownInterval = setInterval(() => {
        secondsLeft--;
        if (secondsLeft <= 0) {
          clearInterval(countdownInterval);
          if (timerCount) timerCount.style.display = 'none';
          if (resendBtn) resendBtn.style.display = 'inline';
        } else {
          const s = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft;
          if (timerCount) timerCount.textContent = '00:' + s;
        }
      }, 1000);
    };

    // The backend sends OTPs; browser code never receives the bot token.
    const dispatchOtp = async (phone) => {
      generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const timeStr = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const text = '🔐 <b>Booksaw Tasdiqlash Kodi:</b> <code>' + generatedOtp + '</code>\n\n' +
                   '📱 <b>Telefon:</b> ' + phone + '\n' +
                   '⏰ <b>Vaqt:</b> ' + timeStr + '\n\n' +
                   '⚠️ Ushbu tasdiqlash kodini hech kimga bermang! Kod 3 daqiqa davomida amal qiladi.';

      let directSuccess = false;
      let apiDesc = '';

      try {
        // The backend owns the Telegram token and sends the message.
        // Calling Telegram directly from the browser would expose the token.
        const data = await Api.sendTelegramOtp(phone);
        directSuccess = data.ok !== false;
        if (data.mock) generatedOtp = '123456';
      } catch (err) {
        apiDesc = err.message || 'Tarmoq / CORS xatoligi';
      }

      if (directSuccess) {
        UI.showToast("Tasdiqlash kodi Telegram botingizga yuborildi!", "success");
        if (otpNotice) {
          otpNotice.innerHTML = Api.isMock()
            ? 'Demo rejim: tasdiqlash kodi <strong>123456</strong>.'
            : `6 xonali tasdiqlash kodi <strong>@${botUser}</strong> botingizga yuborildi. Telegramdagi xabarni tekshiring.`;
          otpNotice.style.display = 'block';
          otpNotice.style.borderColor = 'var(--primary)';
          otpNotice.style.color = 'var(--text-primary)';
        }
      } else {
        UI.showToast("Telegram botiga kod yuborishda xatolik: " + apiDesc, "error");
        if (otpNotice) {
          otpNotice.innerHTML = `
            <div style="text-align:left;line-height:1.5;">
              <div style="color:#ef4444;font-weight:600;margin-bottom:4px;">⚠️ Telegram Bot holati: ${apiDesc}</div>
              <div style="color:var(--text-muted);font-size:12px;">
                Iltimos, avval Telegram ilovangizda <strong>@${botUser}</strong> botini ochib <strong>/start</strong> tugmasini bosing va qaytadan kod so'rang.
              </div>
            </div>`;
          otpNotice.style.display = 'block';
          otpNotice.style.borderColor = '#ef4444';
        }
      }
      return directSuccess;
    };

    // Step 1 -> Step 2
    sendOtpBtn?.addEventListener('click', async () => {
      const raw = (phoneInput?.value || '').replace(/\D/g, '');
      const digits = raw.startsWith('998') ? raw.slice(3) : raw;
      if (digits.length !== 9) {
        if (phoneError) {
          phoneError.textContent = "Iltimos, 9 xonali telefon raqamingizni to'liq kiriting (masalan: 90 123 45 67)";
          phoneError.style.display = 'block';
        }
        phoneInput?.focus();
        return;
      }

      currentPhone = '+998 ' + (phoneInput?.value || digits);
      if (enteredPhoneEl) enteredPhoneEl.textContent = currentPhone;

      sendOtpBtn.disabled = true;
      sendOtpBtn.textContent = 'Kod yuborilmoqda...';

      const sent = await dispatchOtp(currentPhone);

      sendOtpBtn.disabled = false;
      sendOtpBtn.textContent = 'Tasdiqlash kodini olish';
      if (!sent) return;

      if (stepPhone) stepPhone.style.display = 'none';
      if (stepOtp) stepOtp.style.display = 'block';

      // Clear & focus first OTP box
      otpBoxes.forEach(b => { b.value = ''; b.classList.remove('is-filled', 'is-error'); });
      otpBoxes[0]?.focus();
      startTimer();
    });

    // Edit phone button
    changePhoneBtn?.addEventListener('click', () => {
      if (countdownInterval) clearInterval(countdownInterval);
      if (stepOtp) stepOtp.style.display = 'none';
      if (stepPhone) stepPhone.style.display = 'block';
      if (otpError) otpError.style.display = 'none';
      phoneInput?.focus();
    });

    // Resend OTP button
    resendBtn?.addEventListener('click', async () => {
      resendBtn.style.display = 'none';
      if (timerCount) {
        timerCount.style.display = '';
        timerCount.textContent = 'Yuborilmoqda...';
      }
      await dispatchOtp(currentPhone);
      startTimer();
      otpBoxes.forEach(b => { b.value = ''; b.classList.remove('is-filled', 'is-error'); });
      otpBoxes[0]?.focus();
    });

    // OTP Boxes keyboard & paste navigation
    otpBoxes.forEach((box, idx) => {
      box.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val ? val[0] : '';
        if (val) {
          box.classList.add('is-filled');
          box.classList.remove('is-error');
          if (idx < otpBoxes.length - 1) {
            otpBoxes[idx + 1].focus();
          } else {
            const allVal = otpBoxes.map(b => b.value).join('');
            if (allVal.length === 6) verifyOtp();
          }
        } else {
          box.classList.remove('is-filled');
        }
        if (otpError) otpError.style.display = 'none';
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && idx > 0) {
          otpBoxes[idx - 1].focus();
          otpBoxes[idx - 1].value = '';
          otpBoxes[idx - 1].classList.remove('is-filled');
        } else if (e.key === 'ArrowLeft' && idx > 0) {
          otpBoxes[idx - 1].focus();
        } else if (e.key === 'ArrowRight' && idx < otpBoxes.length - 1) {
          otpBoxes[idx + 1].focus();
        } else if (e.key === 'Enter') {
          verifyOtp();
        }
      });

      box.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        if (!text) return;
        for (let i = 0; i < otpBoxes.length; i++) {
          if (text[i]) {
            otpBoxes[i].value = text[i];
            otpBoxes[i].classList.add('is-filled');
          }
        }
        const lastIdx = Math.min(text.length - 1, otpBoxes.length - 1);
        if (lastIdx >= 0) otpBoxes[lastIdx].focus();
        if (text.length >= 6) verifyOtp();
      });
    });

    // Verify OTP logic
    const verifyOtp = async () => {
      const enteredCode = otpBoxes.map(b => b.value).join('');
      if (enteredCode.length < 6) {
        if (otpError) {
          otpError.textContent = "Iltimos, 6 xonali tasdiqlash kodini to'liq kiriting.";
          otpError.style.display = 'block';
        }
        const firstEmpty = otpBoxes.find(b => !b.value);
        if (firstEmpty) firstEmpty.focus();
        return;
      }

      let verified = false;
      try {
        verified = Api.isMock()
          ? enteredCode === generatedOtp
          : (await Api.verifyTelegramOtp(currentPhone, enteredCode)).ok === true;
      } catch (err) {
        if (otpError) {
          otpError.textContent = err.message || "Kod tekshirilmagan. Qayta urinib ko'ring.";
          otpError.style.display = 'block';
        }
        return;
      }

      if (!verified) {
        if (otpError) {
          otpError.textContent = "❌ Tasdiqlash kodi noto'g'ri. Telegram botdagi xabarni tekshiring.";
          otpError.style.display = 'block';
        }
        otpBoxes.forEach(b => {
          b.classList.add('is-error');
          setTimeout(() => b.classList.remove('is-error'), 500);
        });
        otpBoxes[0]?.focus();
        return;
      }

      // SUCCESS!
      if (countdownInterval) clearInterval(countdownInterval);
      if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '✅ Tasdiqlandi!';
      }
      otpBoxes.forEach(b => {
        b.style.borderColor = 'var(--primary)';
        b.style.background = 'var(--bg-hover)';
      });

      setTimeout(() => {
        modalRes.close();
        const existing = Store.findUser(currentPhone);
        const onAuthPage = location.pathname.includes('login') || location.pathname.includes('register');
        const isRegisterPage = location.pathname.includes('register') || (document.getElementById('cardContainer')?.classList.contains('flipped'));
        if (existing && existing.username && existing.password && !isRegisterPage) {
          Store.setUser(existing);
          UI.showToast(`Xush kelibsiz, ${existing.name}!`);
          if (typeof onSuccess === 'function') onSuccess();
          else {
            setTimeout(() => {
              const targetUrl = new URLSearchParams(location.search).get('redirect') || 'book_list.html';
              if (onAuthPage) location.href = targetUrl;
              else location.reload();
            }, 400);
          }
        } else {
          UI.showSocialCompleteModal({
            provider: 'telegram',
            phone: currentPhone,
            name: '',
            email: ''
          }, onSuccess);
        }
      }, 500);
    };

    verifyBtn?.addEventListener('click', verifyOtp);
  },

  showSocialCompleteModal(initialData = {}, onSuccess) {
    const provider = initialData.provider || 'social';
    const isGoogle = provider === 'google';
    const rawName = (initialData.name || '').trim();
    const rawEmail = (initialData.email || '').trim();
    const rawPhone = (initialData.phone || '').trim();
    const suggestedUsername = rawEmail
      ? '@' + rawEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_')
      : (rawName ? '@' + rawName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') : '@foydalanuvchi');

    const providerTitle = isGoogle ? "Google orqali ro'yxatdan o'tish" : "Telegram orqali ro'yxatdan o'tish";
    const providerBadge = isGoogle
      ? `<svg width="28" height="28" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>`
      : `<div style="color:#0088cc;display:flex;align-items:center;justify-content:center;">${ICONS.telegram}</div>`;

    const html = `
      <div class="social-complete-box">
        <div class="social-complete__header">
          <div class="social-complete__badge">
            ${providerBadge}
          </div>
          <h3 class="social-complete__title">${providerTitle}</h3>
          <p class="social-complete__sub">
            Hisobingizni to'liq faollashtirish uchun shaxsiy ma'lumotlar va yangi xavfsiz parol kiriting.
          </p>
        </div>

        <form id="scForm" class="social-complete__form" novalidate>
          <div class="input-group">
            <label for="scName">To'liq ism *</label>
            <input type="text" id="scName" class="input-box" placeholder="Ism va familiyangiz" value="${rawName}" autocomplete="name">
            <span class="neu-input-error" id="scNameError">Ismingizni kamida 2 ta belgi bilan kiriting</span>
          </div>

          <div class="input-group">
            <label for="scUsername">Foydalanuvchi nomi (Username) *</label>
            <input type="text" id="scUsername" class="input-box" placeholder="@username" value="${suggestedUsername}" autocomplete="username">
            <span class="neu-input-error" id="scUsernameError">Username kamida 3 ta harf/raqamdan iborat bo'lishi kerak</span>
          </div>

          <div class="social-complete__row">
            <div class="input-group" style="flex:1;">
              <label for="scEmail">Email manzil *</label>
              <input type="email" id="scEmail" class="input-box" placeholder="pochta@gmail.com" value="${rawEmail}" autocomplete="email">
              <span class="neu-input-error" id="scEmailError">To'g'ri email manzil kiriting</span>
            </div>

            <div class="input-group" style="flex:1;">
              <label for="scPhone">Telefon raqam</label>
              <input type="tel" id="scPhone" class="input-box" placeholder="+998 (90) 123-45-67" value="${rawPhone}" autocomplete="tel">
              <span class="neu-input-error" id="scPhoneError">To'liq telefon raqam kiriting</span>
            </div>
          </div>

          <div class="social-complete__row">
            <div class="input-group" style="flex:1;">
              <label for="scPassword">Yangi parol *</label>
              <input type="password" id="scPassword" class="input-box" placeholder="Kamida 6 ta belgi" autocomplete="new-password">
              <i class="fa-solid fa-eye toggle-pass" data-target="scPassword"></i>
              <span class="neu-input-error" id="scPasswordError">Parol kamida 6 ta belgi bo'lishi kerak</span>
            </div>

            <div class="input-group" style="flex:1;">
              <label for="scConfirm">Parolni tasdiqlash *</label>
              <input type="password" id="scConfirm" class="input-box" placeholder="Qayta kiriting" autocomplete="new-password">
              <i class="fa-solid fa-eye toggle-pass" data-target="scConfirm"></i>
              <span class="neu-input-error" id="scConfirmError">Parollar bir-biriga mos kelmadi</span>
            </div>
          </div>

          <!-- Password strength meter -->
          <div class="neu-strength-meter" id="scStrengthMeter" style="display:none;margin-top:-6px;margin-bottom:14px;">
            <span class="neu-strength-bar" id="scStrBar1"></span>
            <span class="neu-strength-bar" id="scStrBar2"></span>
            <span class="neu-strength-bar" id="scStrBar3"></span>
          </div>

          <div class="options-row" style="margin:6px 0 20px;">
            <label class="checkbox-label" style="font-size:12.5px;cursor:pointer;">
              <input type="checkbox" id="scTerms" checked>
              <span>Men Booksaw <a href="info.html?page=terms" target="_blank" style="color:var(--neu-accent);font-weight:600;">foydalanish shartlari</a>ga roziman</span>
            </label>
          </div>
          <span class="neu-input-error" id="scTermsError" style="margin:-12px 0 12px;">Xizmat shartlariga rozilik bildiring</span>

          <button type="submit" class="btn-submit success" id="scSubmitBtn">
            <i class="fa-solid fa-user-check"></i> Hisobni yaratish va kirish
          </button>
        </form>
      </div>
    `;

    const modalRes = this.showModal(html, { className: 'modal--social-complete' });

    // Eye toggles for password fields
    document.querySelectorAll('.modal--social-complete .toggle-pass').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          btn.classList.remove('fa-eye');
          btn.classList.add('fa-eye-slash');
        } else {
          input.type = 'password';
          btn.classList.remove('fa-eye-slash');
          btn.classList.add('fa-eye');
        }
      });
    });

    // Password strength meter
    const passInput = document.getElementById('scPassword');
    const meter = document.getElementById('scStrengthMeter');
    const b1 = document.getElementById('scStrBar1');
    const b2 = document.getElementById('scStrBar2');
    const b3 = document.getElementById('scStrBar3');
    passInput?.addEventListener('input', () => {
      const val = passInput.value || '';
      if (!val) {
        meter.style.display = 'none';
        [b1, b2, b3].forEach(b => { if (b) b.className = 'neu-strength-bar'; });
        return;
      }
      meter.style.display = 'flex';
      let score = 0;
      if (val.length >= 6) score++;
      if (/[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;
      if (val.length >= 9 && /[A-Z]/.test(val) && /[a-z]/.test(val)) score++;

      [b1, b2, b3].forEach(b => { if (b) b.className = 'neu-strength-bar'; });
      if (score === 1) {
        b1?.classList.add('is-weak');
      } else if (score === 2) {
        b1?.classList.add('is-medium');
        b2?.classList.add('is-medium');
      } else if (score >= 3) {
        b1?.classList.add('is-strong');
        b2?.classList.add('is-strong');
        b3?.classList.add('is-strong');
      }
    });

    // Clear error states on input
    ['scName', 'scUsername', 'scEmail', 'scPhone', 'scPassword', 'scConfirm'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', function () {
        this.classList.remove('error');
        document.getElementById(id + 'Error')?.classList.remove('is-on');
      });
    });

    // Form submit logic
    const form = document.getElementById('scForm');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const nameEl = document.getElementById('scName');
      const userEl = document.getElementById('scUsername');
      const emailEl = document.getElementById('scEmail');
      const phoneEl = document.getElementById('scPhone');
      const passEl = document.getElementById('scPassword');
      const confEl = document.getElementById('scConfirm');
      const termsEl = document.getElementById('scTerms');

      const nameVal = (nameEl?.value || '').trim();
      const userVal = (userEl?.value || '').trim();
      const emailVal = (emailEl?.value || '').trim();
      const phoneVal = (phoneEl?.value || '').trim();
      const passVal = passEl?.value || '';
      const confVal = confEl?.value || '';

      if (nameVal.length < 2) {
        nameEl?.classList.add('error');
        document.getElementById('scNameError')?.classList.add('is-on');
        valid = false;
      }
      const cleanUser = userVal.replace(/^@/, '');
      if (!cleanUser || cleanUser.length < 3 || !/^[a-zA-Z0-9_]+$/.test(cleanUser)) {
        userEl?.classList.add('error');
        document.getElementById('scUsernameError')?.classList.add('is-on');
        valid = false;
      }
      if (!emailVal || !/\S+@\S+\.\S+/.test(emailVal)) {
        emailEl?.classList.add('error');
        document.getElementById('scEmailError')?.classList.add('is-on');
        valid = false;
      }
      if (passVal.length < 6) {
        passEl?.classList.add('error');
        document.getElementById('scPasswordError')?.classList.add('is-on');
        valid = false;
      }
      if (confVal !== passVal) {
        confEl?.classList.add('error');
        document.getElementById('scConfirmError')?.classList.add('is-on');
        valid = false;
      }
      if (termsEl && !termsEl.checked) {
        document.getElementById('scTermsError')?.classList.add('is-on');
        valid = false;
      }

      if (!valid) return;

      const submitBtn = document.getElementById('scSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saqlanmoqda...';
      }

      setTimeout(() => {
        const fullUser = {
          name: nameVal,
          username: userVal.startsWith('@') ? userVal : '@' + userVal,
          email: emailVal,
          phone: phoneVal,
          password: passVal,
          avatar: initialData.avatar || null,
          provider: provider
        };
        Store.loginWithOAuth(fullUser);
        modalRes.close();
        UI.showToast("Muvaffaqiyatli ro'yxatdan o'tdingiz, xush kelibsiz!", "success");
        if (typeof onSuccess === 'function') onSuccess();
        else {
          setTimeout(() => {
            const targetUrl = new URLSearchParams(location.search).get('redirect') || 'book_list.html';
            if (location.pathname.includes('login') || location.pathname.includes('register')) {
              location.href = targetUrl;
            } else {
              location.reload();
            }
          }, 400);
        }
      }, 600);
    });
  }
};

// Hodisalarni avtomatik tinglash (Store CustomEvents)
if (typeof window !== 'undefined') {
  window.addEventListener('booksaw:cartchange', () => UI.updateBadges());
  window.addEventListener('booksaw:wishlistchange', () => UI.updateBadges());
  window.addEventListener('booksaw:authchange', () => {
    UI.updateHeaderAvatar();
    UI.updateBadges();
  });

  // Orqaga moslik uchun window ga biriktirish
  window.UI = UI;
  window.runBinEatAnimation = runBinEatAnimation;
  window.createBinButtonHtml = createBinButtonHtml;
  window.requireAuth = requireAuth;
  window.renderStars = renderStars;
  window.mapDeliveryIcon = mapDeliveryIcon;
  window.mapPaymentIcon = mapPaymentIcon;
}

export {
  UI,
  runBinEatAnimation,
  requireAuth,
  createBinButtonHtml,
  renderStars,
  mapDeliveryIcon,
  mapPaymentIcon
};
