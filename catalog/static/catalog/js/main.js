/**
 * main.js — BooksCatalog Marketplace
 * To'liq biznes-mantiq: Store, UI, Qidiruv, Filtr, Slider, Detail, Cart, Checkout, Auth, Profile, Orders, Wishlist, Animatsiyalar
 * Barcha sahifalar uchun universal JS — data-page atributi orqali tegishli init funksiya chaqiriladi.
 */
import { escapeHtml, sanitizeUrl, highlightMatch } from './modules/escape.js';

import { ICONS, Theme, Store } from './modules/core.js';

import {
  UI,
  runBinEatAnimation,
  requireAuth,
  createBinButtonHtml,
  renderStars,
  mapDeliveryIcon,
  mapPaymentIcon
} from './modules/ui.js';

import {
  Search,
  Catalog,
  renderProductCard,
  Slider,
  enableDragScroll,
  attachCarouselArrows,
  initCatalogPage,
  initCategoriesPage
} from './modules/products.js';

import {
  ProductDetail,
  CartPage,
  Checkout,
  openLightbox
} from './modules/commerce.js';
/* ========================================================================
   9. AUTH
   ======================================================================== */
const Auth = {
  checkAlreadyLoggedIn() {
    const user = Store.getUser();
    if (!user) return false;
    const container = document.getElementById('cardContainer');
    if (!container) return false;
    container.innerHTML = `
      <div class="card card--logged-in" style="width:100%;text-align:center;padding:40px 28px;box-sizing:border-box;">
        <div style="margin-bottom:18px;">
          ${user.avatar ? `<img src="${sanitizeUrl(user.avatar)}" alt="" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin:0 auto;box-shadow:var(--neu-shadow-convex-sm);">` : `<div style="width:80px;height:80px;border-radius:50%;background:var(--primary);color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;margin:0 auto;box-shadow:var(--neu-shadow-convex-sm);">${UI.initials(user)}</div>`}
        </div>
        <h2 style="font-size:24px;font-weight:700;color:var(--neu-text-title);margin:0 0 6px;">${escapeHtml(user.name)}</h2>
        <p style="font-size:14px;color:var(--neu-text-sub);margin:0 0 16px;">${escapeHtml(user.email)}</p>
        <div style="display:inline-block;padding:5px 16px;border-radius:20px;background:rgba(15,23,42,0.08);color:var(--text-primary);font-size:12px;font-weight:700;margin-bottom:28px;">
          ✓ Siz allaqachon tizimga kirgansiz
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <a href="book_list.html" class="btn-submit success" style="text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:700;">
            Bosh sahifaga o'tish
          </a>
          <a href="profile.html" class="btn-submit" style="text-decoration:none;display:flex;align-items:center;justify-content:center;font-weight:600;">
            Mening profilim
          </a>
          <button type="button" class="btn-submit" id="alreadyLoggedLogout" style="color:#ef4444;background:transparent;box-shadow:var(--neu-shadow-inset);cursor:pointer;font-weight:600;">
            <i class="fa-solid fa-arrow-right-from-bracket" style="margin-right:6px;"></i> Hisobdan chiqish
          </button>
        </div>
      </div>
    `;
    container.style.height = 'auto';
    document.getElementById('alreadyLoggedLogout')?.addEventListener('click', () => {
      Store.logout();
      location.reload();
    });
    return true;
  },

  initLogin() {
    if (this.checkAlreadyLoggedIn()) return;
    const form = document.getElementById('loginForm');
    if (!form) return;
    this.setupPasswordToggle('loginPassword', 'loginPassToggle');
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      const email = document.getElementById('loginEmail');
      const pass = document.getElementById('loginPassword');
      if (!email || !email.value || !/\S+@\S+\.\S+/.test(email.value)) {
        if (email) email.classList.add('error');
        document.getElementById('loginEmailError')?.classList.add('is-on');
        valid = false;
      } else {
        email.classList.remove('error');
        document.getElementById('loginEmailError')?.classList.remove('is-on');
      }
      if (!pass || !pass.value || pass.value.length < 6) {
        if (pass) pass.classList.add('error');
        document.getElementById('loginPasswordError')?.classList.add('is-on');
        valid = false;
      } else {
        pass.classList.remove('error');
        document.getElementById('loginPasswordError')?.classList.remove('is-on');
      }
      if (!valid) { this.shake(form); return; }

      const btn = document.getElementById('loginBtn');
      if (btn) {
        btn.disabled = true;
        btn.classList.add('success');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> SUCCESS';
      }
      setTimeout(() => {
        Store.login(email.value, pass.value);
        UI.showToast("Xush kelibsiz!");
        const params = new URLSearchParams(location.search);
        const redirectUrl = params.get('redirect') || 'book_list.html';
        this.showSuccess(() => { location.href = redirectUrl; });
      }, 700);
    });

    // Real-time validation
    ['loginEmail', 'loginPassword'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', function () {
        this.classList.remove('error');
        document.getElementById(id + 'Error')?.classList.remove('is-on');
      });
    });
    this.bindSocial();
    this.bindForgot();
  },

  initRegister() {
    if (this.checkAlreadyLoggedIn()) return;
    const form = document.getElementById('registerForm');
    if (!form) return;
    this.setupPasswordToggle('regPassword', 'regPassToggle');
    this.setupPasswordToggle('regConfirm', 'regConfirmToggle');
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      const nameEl = document.getElementById('regName');
      const emailEl = document.getElementById('regEmail');
      const phoneEl = document.getElementById('regPhone');
      const passEl = document.getElementById('regPassword');
      const confEl = document.getElementById('regConfirm');

      const vals = {
        name: { el: nameEl, err: 'regNameError', check: v => (v || '').length >= 2 },
        email: { el: emailEl, err: 'regEmailError', check: v => /\S+@\S+\.\S+/.test(v || '') },
        phone: { el: phoneEl, err: 'regPhoneError', check: v => !v || v.length >= 7 },
        pass: { el: passEl, err: 'regPasswordError', check: v => (v || '').length >= 6 },
        confirm: { el: confEl, err: 'regConfirmError', check: v => v && passEl && v === passEl.value },
      };
      Object.values(vals).forEach(({ el, err, check }) => {
        if (!el || !check(el.value)) {
          if (el) el.classList.add('error');
          document.getElementById(err)?.classList.add('is-on');
          valid = false;
        } else {
          el.classList.remove('error');
          document.getElementById(err)?.classList.remove('is-on');
        }
      });
      const terms = document.getElementById('regTerms');
      if (terms && !terms.checked) {
        document.getElementById('regTermsError')?.classList.add('is-on');
        valid = false;
      } else {
        document.getElementById('regTermsError')?.classList.remove('is-on');
      }
      if (!valid) { this.shake(form); return; }

      const btn = document.getElementById('registerBtn');
      if (btn) {
        btn.disabled = true;
        btn.classList.add('success');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> SUCCESS';
      }
      setTimeout(() => {
        const phoneVal = phoneEl ? phoneEl.value : '';
        Store.register(nameEl.value, emailEl.value, phoneVal, passEl.value);
        UI.showToast("Hisob muvaffaqiyatli ochildi!");
        const params = new URLSearchParams(location.search);
        const redirectUrl = params.get('redirect') || 'book_list.html';
        this.showSuccess(() => { location.href = redirectUrl; });
      }, 700);
    });

    ['regName', 'regEmail', 'regPhone', 'regPassword', 'regConfirm'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', function () {
        this.classList.remove('error');
        document.getElementById(id + 'Error')?.classList.remove('is-on');
      });
    });
    document.getElementById('regTerms')?.addEventListener('change', () => {
      document.getElementById('regTermsError')?.classList.remove('is-on');
    });

    // Password strength meter
    const passInput = document.getElementById('regPassword');
    const meter = document.getElementById('passStrengthMeter');
    const bar1 = document.getElementById('strBar1');
    const bar2 = document.getElementById('strBar2');
    const bar3 = document.getElementById('strBar3');
    if (passInput && meter) {
      passInput.addEventListener('input', () => {
        const val = passInput.value || '';
        if (!val) {
          meter.style.display = 'none';
          [bar1, bar2, bar3].forEach(b => { if (b) b.className = 'neu-strength-bar'; });
          return;
        }
        meter.style.display = 'flex';
        let score = 0;
        if (val.length >= 6) score++;
        if (/[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;
        if (val.length >= 9 && /[A-Z]/.test(val) && /[a-z]/.test(val)) score++;

        [bar1, bar2, bar3].forEach(b => { if (b) b.className = 'neu-strength-bar'; });
        if (score === 1) {
          if (bar1) bar1.classList.add('is-weak');
        } else if (score === 2) {
          if (bar1) bar1.classList.add('is-medium');
          if (bar2) bar2.classList.add('is-medium');
        } else if (score >= 3) {
          if (bar1) bar1.classList.add('is-strong');
          if (bar2) bar2.classList.add('is-strong');
          if (bar3) bar3.classList.add('is-strong');
        }
        const cardBox = document.getElementById('cardContainer');
        if (cardBox) {
          const activeCard = cardBox.classList.contains('flipped') ? cardBox.querySelector('.signup-card') : cardBox.querySelector('.login-card');
          if (activeCard) cardBox.style.height = activeCard.scrollHeight + 'px';
        }
      });
    }

    this.bindSocial();
  },

  init3DFlip() {
    if (Store.getUser()) return;
    const container = document.getElementById('cardContainer');
    if (!container) return;

    const updateHeight = () => {
      const isFlipped = container.classList.contains('flipped');
      const active = isFlipped ? container.querySelector('.signup-card') : container.querySelector('.login-card');
      if (active) {
        container.style.height = active.scrollHeight + 'px';
      }
    };

    const flipTo = (flipped) => {
      if (flipped) {
        container.classList.add('flipped');
        document.title = "Booksaw — Ro'yxatdan o'tish";
        if (location.pathname.includes('login')) {
          try { history.replaceState(null, '', 'register.html'); } catch (e) {}
        }
      } else {
        container.classList.remove('flipped');
        document.title = "Booksaw — Kirish";
        if (location.pathname.includes('register')) {
          try { history.replaceState(null, '', 'login.html'); } catch (e) {}
        }
      }
      updateHeight();
    };

    // If starting on register page or query, show flipped signup card
    if (document.body.dataset.page === 'register' || location.search.includes('register') || location.hash === '#register') {
      container.classList.add('flipped');
    }

    document.getElementById('flipToRegister')?.addEventListener('click', (e) => {
      e.preventDefault();
      flipTo(true);
    });
    document.getElementById('flipToLogin')?.addEventListener('click', (e) => {
      e.preventDefault();
      flipTo(false);
    });

    // Eye toggles for password fields
    document.querySelectorAll('.toggle-pass').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = targetId ? document.getElementById(targetId) : btn.previousElementSibling;
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

    window.addEventListener('resize', updateHeight);
    setTimeout(updateHeight, 50);
    setTimeout(updateHeight, 300);
  },

  bindSocial() {
    document.querySelectorAll('[data-social]').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const kind = btn.dataset.social;
        if (window.APP_CONFIG && !window.APP_CONFIG.USE_MOCK) {
          try {
            const url = Api.socialAuthStart(kind);
            location.assign(url);
            return;
          } catch (err) { /* fallback to interactive modals */ }
        }
        if (kind === 'google') {
          UI.startGoogleOAuth();
        } else if (kind === 'telegram') {
          UI.showTelegramAuthModal();
        }
      });
    });
  },

  bindForgot() {
    const overlay = document.getElementById('forgotModal');
    const open = document.getElementById('forgotPassBtn');
    const cancel = document.getElementById('forgotCancel');
    const send = document.getElementById('forgotSend');
    if (!overlay || !open) return;
    open.addEventListener('click', () => overlay.classList.add('active'));
    cancel?.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });
    send?.addEventListener('click', () => {
      const email = document.getElementById('forgotEmail')?.value || '';
      if (!/\S+@\S+\.\S+/.test(email)) { UI.showToast('Emailni tekshiring', 'error'); return; }
      overlay.classList.remove('active');
      UI.showToast('Tiklash havolasi emailga yuborildi');
    });
  },

  shake(form) {
    if (!form) return;
    form.classList.remove('shake');
    void form.offsetWidth;
    form.classList.add('shake');
  },

  showSuccess(cb) {
    const el = document.getElementById('authSuccess');
    if (el) {
      el.hidden = false;
      el.querySelectorAll('circle, path').forEach(n => {
        n.style.animation = 'none';
        void n.getBoundingClientRect();
        n.style.animation = '';
      });
    }
    setTimeout(() => { if (typeof cb === 'function') cb(); }, 900);
  },

  setupPasswordToggle(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    if (input && toggle) {
      toggle.addEventListener('click', e => {
        e.preventDefault();
        input.type = input.type === 'password' ? 'text' : 'password';
        toggle.innerHTML = input.type === 'password' ? ICONS.eye : ICONS.eyeOff;
      });
    }
  }
};

/* ========================================================================
   10. PROFILE PAGE
   ======================================================================== */
const ProfilePage = {
  applyAvatar(user) {
    const img = document.getElementById('avatarImg');
    const preview = document.getElementById('avatarPreview');
    const removeBtn = document.getElementById('avatarRemove');
    const has = !!(user && user.avatar);
    if (preview) preview.classList.toggle('has-photo', has);
    if (img) {
      if (has) img.src = user.avatar;
      else img.removeAttribute('src');
    }
    if (removeBtn) removeBtn.hidden = !has;
  },
  compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('read'));
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const max = 320;
          let { width, height } = image;
          if (width > height && width > max) { height = Math.round(height * max / width); width = max; }
          else if (height > max) { width = Math.round(width * max / height); height = max; }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(image, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        image.onerror = () => reject(new Error('img'));
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  },
  init() {
    if (!requireAuth("Profilingizni ko'rish uchun avval hisobingizga kiring!")) {
      const el = document.querySelector('.profile-layout, main, .container');
      if (el) el.style.display = 'none';
      return;
    }
    const user = Store.getUser();
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profName').value = user.name || '';
    document.getElementById('profEmail').value = user.email || '';
    document.getElementById('profPhone').value = user.phone || '';
    this.applyAvatar(user);
    const avatarInput = document.getElementById('avatarInput');
    avatarInput?.addEventListener('change', async () => {
      const file = avatarInput.files && avatarInput.files[0];
      avatarInput.value = '';
      if (!file) return;
      if (!file.type.startsWith('image/')) { UI.showToast('Faqat rasm yuklang', 'error'); return; }
      if (file.size > 8 * 1024 * 1024) { UI.showToast('Rasm 8 MB dan kichik bo‘lsin', 'error'); return; }
      try {
        const dataUrl = await this.compressImage(file);
        const updated = Store.setAvatar(dataUrl);
        this.applyAvatar(updated);
        UI.updateHeaderAvatar();
        UI.showToast('Profil rasmi saqlandi');
      } catch {
        UI.showToast('Rasmni yuklab bo‘lmadi', 'error');
      }
    });
    document.getElementById('avatarRemove')?.addEventListener('click', () => {
      Store.setAvatar(null);
      this.applyAvatar(Store.getUser());
      UI.updateHeaderAvatar();
      UI.showToast('Rasm olib tashlandi');
    });
    // Sidebar nav
    document.querySelectorAll('.profile__menu-item[data-section]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.section === 'logout') {
          Store.logout(); location.href = 'login.html'; return;
        }
        document.querySelectorAll('.profile__menu-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ['sectionPersonal', 'sectionOrders', 'sectionAddresses', 'sectionWishlist', 'sectionPassword', 'sectionSettings'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
        const section = document.getElementById('section' + btn.dataset.section.charAt(0).toUpperCase() + btn.dataset.section.slice(1));
        if (section) section.style.display = '';
        if (btn.dataset.section === 'addresses') this.renderAddresses();
        if (btn.dataset.section === 'orders') this.renderOrders();
        if (btn.dataset.section === 'wishlist') this.renderWishlist();
        if (btn.dataset.section === 'settings') {
          const t = (window.BooksawTheme ? window.BooksawTheme.get() : Theme.get());
          const txt = document.getElementById('profileModeText');
          if (txt) txt.textContent = t === 'dark' ? 'Dark' : 'Light';
        }
      });
    });

    // Profile 3D Theme Switch
    document.getElementById('profileThemeToggleBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      Theme.toggle();
    });

    // Save profile
    document.getElementById('profileForm')?.addEventListener('submit', e => {
      e.preventDefault();
      Store.updateProfile({
        name: document.getElementById('profName').value,
        email: document.getElementById('profEmail').value,
        phone: document.getElementById('profPhone').value
      });
      const fresh = Store.getUser();
      document.getElementById('profileName').textContent = fresh.name;
      document.getElementById('profileEmail').textContent = fresh.email;
      UI.updateHeaderAvatar();
      UI.showToast("Ma'lumotlar saqlandi");
    });
    // Add address
    document.getElementById('addAddrBtn')?.addEventListener('click', () => {
      const name = document.getElementById('newAddrName')?.value?.trim() || user.name;
      const phone = document.getElementById('newAddrPhone')?.value?.trim() || user.phone;
      const city = document.getElementById('newAddrCity')?.value?.trim();
      const line = document.getElementById('newAddrLine')?.value?.trim();
      if (!city || city.length < 2) { UI.showToast("Shaharni kiriting", 'error'); return; }
      if (!line || line.length < 5) { UI.showToast("Aniq manzilni kiriting", 'error'); return; }
      Store.addAddress({ name, phone, city, address: line });
      this.renderAddresses();
      UI.showToast("Manzil muvaffaqiyatli saqlandi", 'success');
      ['newAddrName', 'newAddrPhone', 'newAddrCity', 'newAddrLine'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    });
    // Change password
    document.getElementById('passwordForm')?.addEventListener('submit', e => {
      e.preventDefault();
      const newP = document.getElementById('newPass')?.value;
      const confP = document.getElementById('confirmNewPass')?.value;
      if (!newP || newP.length < 6) { UI.showToast("Parol kamida 6 ta belgi", 'error'); return; }
      if (newP !== confP) { UI.showToast("Parollar mos kelmaydi", 'error'); return; }
      UI.showToast("Parol yangilandi");
      document.getElementById('passwordForm').reset();
    });

    // Check URL tab parameter
    const initialTab = new URLSearchParams(location.search).get('tab');
    if (initialTab) {
      const targetBtn = document.querySelector(`.profile__menu-item[data-section="${initialTab}"]`);
      if (targetBtn) targetBtn.click();
    }
  },
  renderAddresses() {
    const el = document.getElementById('profileAddresses');
    if (!el) return;
    const addrs = Store.getAddresses();
    if (!addrs.length) {
      el.innerHTML = '<p class="text-muted" style="font-size:14px;padding:8px 0;">Hozircha saqlangan manzil yo\'q.</p>';
      return;
    }
    el.innerHTML = addrs.map(a => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:12px;flex-wrap:wrap;gap:12px;">
        <div><strong>${escapeHtml(a.city || '')}</strong><p style="color:var(--text-muted);font-size:14px;margin:2px 0 0;">${escapeHtml(a.address || '')} ${a.name ? '— ' + escapeHtml(a.name) : ''}</p></div>
        <div style="display:flex;align-items:center;">
          ${createBinButtonHtml("O'chirish", "danger", "addrDel_" + a.id)}
        </div>
      </div>`).join('');

    addrs.forEach(a => {
      document.getElementById('addrDel_' + a.id)?.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        runBinEatAnimation(btn, () => {
          Store.removeAddress(a.id);
          this.renderAddresses();
          UI.showToast("Manzil o'chirildi");
        });
      });
    });
  },
  renderOrders() {
    const listEl = document.getElementById('profileOrdersList');
    if (!listEl) return;
    const orders = Store.getOrders();
    if (!orders.length) {
      listEl.innerHTML = `
        <div class="empty-state" style="padding:48px 20px;text-align:center;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);">
          <div class="empty-state__icon" style="margin-bottom:12px;color:var(--text-muted);">${ICONS.orders}</div>
          <h3 style="font-size:18px;margin-bottom:8px;">Hozircha buyurtmalar yo'q</h3>
          <p style="color:var(--text-muted);margin-bottom:16px;font-size:14px;">Siz hali birorta ham buyurtma bermagansiz.</p>
          <a href="book_list.html" class="btn btn-primary btn-sm">Kitoblar katalogiga o'tish</a>
        </div>`;
      return;
    }
    const statusMap = {
      processing: { label: 'Jarayonda', cls: 'is-progress' },
      delivered: { label: 'Yetkazildi', cls: 'is-done' },
      cancelled: { label: 'Bekor qilindi', cls: 'is-cancel' }
    };
    listEl.innerHTML = orders.map(o => {
      const st = statusMap[o.status] || statusMap.processing;
      const pay = escapeHtml(o.payment?.name || '—');
      const addr = o.address ? `${escapeHtml(o.address.city)}, ${escapeHtml(o.address.address)}` : '—';
      const items = (o.items || []).map(i => `
        <div class="order-card__line">
          <img src="${sanitizeUrl(i.image || '')}" alt="">
          <div>
            <strong>${escapeHtml(i.name || 'Kitob')}</strong>
            <p>${i.qty} × ${UI.formatPrice(i.price || 0)}</p>
          </div>
        </div>`).join('');
      return `<article class="order-card" style="margin-bottom:16px;">
        <div class="order-card__header">
          <div><strong class="order-card__id">${escapeHtml(o.id)}</strong><span class="order-card__date">${escapeHtml(UI.formatDate(o.date))}</span></div>
          <span class="order-status ${st.cls}">${escapeHtml(st.label)}</span>
        </div>
        <div class="order-card__body">${items}</div>
        <div class="order-card__meta">
          <p><span>To‘lov:</span> ${pay}</p>
          <p><span>Manzil:</span> ${addr}</p>
        </div>
        <div class="order-card__footer">
          <strong>${UI.formatPrice(o.total)}</strong>
          <div class="order-card__actions">
            <button type="button" class="btn btn-secondary btn-sm order-repeat" data-id="${escapeHtml(o.id)}">Qayta buyurtma</button>
            ${o.status === 'processing' ? `<button type="button" class="btn btn-sm order-cancel" data-id="${escapeHtml(o.id)}">Bekor qilish</button>` : ''}
          </div>
        </div>
      </article>`;
    }).join('');
    listEl.querySelectorAll('.order-repeat').forEach(btn => {
      btn.addEventListener('click', () => {
        if (Store.repeatOrder(btn.dataset.id)) {
          UI.showToast('Mahsulotlar savatga qo‘shildi');
          location.href = 'cart.html';
        }
      });
    });
    listEl.querySelectorAll('.order-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.updateOrderStatus(btn.dataset.id, 'cancelled');
        UI.showToast('Buyurtma bekor qilindi');
        this.renderOrders();
      });
    });
  },
  renderWishlist() {
    const grid = document.getElementById('profileWishlistGrid');
    const countEl = document.getElementById('profileWishlistCount');
    if (!grid) return;
    const ids = Store.getWishlist();
    const prods = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).filter(p => ids.includes(p.id));
    if (countEl) countEl.textContent = `${prods.length} ta kitob`;
    if (!prods.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;padding:48px 20px;text-align:center;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);">
          <div class="empty-state__icon" style="margin-bottom:12px;color:var(--text-muted);">${ICONS.heart}</div>
          <h3 style="font-size:18px;margin-bottom:8px;">Sevimlilar ro'yxati bo'sh</h3>
          <p style="color:var(--text-muted);margin-bottom:16px;font-size:14px;">O'zingizga yoqqan kitoblarni yurakcha belgisi orqali saqlang.</p>
          <a href="book_list.html" class="btn btn-primary btn-sm">Kitoblarni ko'rish</a>
        </div>`;
      return;
    }
    grid.innerHTML = prods.map(p => renderProductCard(p)).join('');
  }
};

/* ========================================================================
   11. ORDERS PAGE
   ======================================================================== */
const OrdersPage = {
  init() {
    if (!requireAuth("Buyurtmalaringizni ko'rish uchun avval hisobingizga kiring!")) {
      const el = document.querySelector('.orders-page, main, .container');
      if (el) el.style.display = 'none';
      return;
    }
    const orders = Store.getOrders();
    const listEl = document.getElementById('ordersList');
    const emptyEl = document.getElementById('emptyOrders');
    if (!orders.length) { if (emptyEl) emptyEl.style.display = ''; if (listEl) listEl.style.display = 'none'; return; }
    if (emptyEl) emptyEl.style.display = 'none';
    if (!listEl) return;
    const statusMap = {
      processing: { label: 'Jarayonda', cls: 'is-progress' },
      delivered: { label: 'Yetkazildi', cls: 'is-done' },
      cancelled: { label: 'Bekor qilindi', cls: 'is-cancel' }
    };
    listEl.innerHTML = orders.map(o => {
      const st = statusMap[o.status] || statusMap.processing;
      const pay = escapeHtml(o.payment?.name || '—');
      const addr = o.address ? `${escapeHtml(o.address.city)}, ${escapeHtml(o.address.address)}` : '—';
      const items = (o.items || []).map(i => `
        <div class="order-card__line">
          <img src="${sanitizeUrl(i.image || '')}" alt="">
          <div>
            <strong>${escapeHtml(i.name || 'Kitob')}</strong>
            <p>${i.qty} × ${UI.formatPrice(i.price || 0)}</p>
          </div>
        </div>`).join('');
      return `<article class="order-card">
        <div class="order-card__header">
          <div><strong class="order-card__id">${escapeHtml(o.id)}</strong><span class="order-card__date">${escapeHtml(UI.formatDate(o.date))}</span></div>
          <span class="order-status ${st.cls}">${escapeHtml(st.label)}</span>
        </div>
        <div class="order-card__body">${items}</div>
        <div class="order-card__meta">
          <p><span>To‘lov:</span> ${pay}</p>
          <p><span>Manzil:</span> ${addr}</p>
        </div>
        <div class="order-card__footer">
          <strong>${UI.formatPrice(o.total)}</strong>
          <div class="order-card__actions">
            <button type="button" class="btn btn-secondary btn-sm order-repeat" data-id="${escapeHtml(o.id)}">Qayta buyurtma</button>
            ${o.status === 'processing' ? `<button type="button" class="btn btn-sm order-cancel" data-id="${escapeHtml(o.id)}">Bekor qilish</button>` : ''}
          </div>
        </div>
      </article>`;
    }).join('');
    listEl.querySelectorAll('.order-repeat').forEach(btn => {
      btn.addEventListener('click', () => {
        if (Store.repeatOrder(btn.dataset.id)) {
          UI.showToast('Mahsulotlar savatga qo‘shildi');
          location.href = 'cart.html';
        }
      });
    });
    listEl.querySelectorAll('.order-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        UI.showConfirm('Buyurtmani bekor qilasizmi?', () => {
          Store.cancelOrder(btn.dataset.id);
          UI.showToast('Buyurtma bekor qilindi');
          this.init();
        }, "Ha, bekor qilish");
      });
    });
  }
};

/* ========================================================================
   12. WISHLIST PAGE
   ======================================================================== */
const WishlistPage = {
  init() {
    if (!requireAuth("Sevimlilar ro'yxatini ko'rish uchun avval hisobingizga kiring!")) {
      const el = document.querySelector('.wishlist-page, main, .container');
      if (el) el.style.display = 'none';
      return;
    }
    const wl = Store.getWishlist();
    const gridEl = document.getElementById('wishlistGrid');
    const emptyEl = document.getElementById('emptyWishlist');
    const addAllBtn = document.getElementById('addAllToCart');
    let clearBtn = document.getElementById('clearWishlistBtn');
    // The static page keeps a semantic fallback; upgrade it to the animated
    // destructive-action control once the shared UI engine is available.
    if (clearBtn && !clearBtn.classList.contains('eat-btn')) {
      const holder = document.createElement('div');
      holder.innerHTML = createBinButtonHtml("Tozalash", 'danger', 'clearWishlistBtn');
      clearBtn.replaceWith(holder.firstElementChild);
      clearBtn = document.getElementById('clearWishlistBtn');
    }
    if (!wl.length) {
      if (gridEl) gridEl.style.display = 'none';
      if (emptyEl) emptyEl.style.display = '';
      if (addAllBtn) addAllBtn.style.display = 'none';
      if (clearBtn) clearBtn.style.display = 'none';
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';
    if (addAllBtn) addAllBtn.style.display = '';
    if (clearBtn) clearBtn.style.display = '';
    if (gridEl) {
      const products = PRODUCTS.filter(p => wl.includes(p.id));
      gridEl.innerHTML = products.map(p => renderProductCard(p)).join('');
      gridEl.style.display = '';
    }
    if (addAllBtn && !addAllBtn.dataset.bound) {
      addAllBtn.dataset.bound = '1';
      addAllBtn.addEventListener('click', () => {
        const ids = Store.getWishlist();
        PRODUCTS.filter(p => ids.includes(p.id) && p.inStock).forEach(p => Store.addToCart(p.id));
        UI.showToast("Barchasi savatga qo'shildi!");
      });
    }
    if (clearBtn && !clearBtn.dataset.bound) {
      clearBtn.dataset.bound = '1';
      clearBtn.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        runBinEatAnimation(btn, () => {
          Store.clearWishlist();
          this.init();
          UI.showToast("Sevimlilar ro'yxati tozalandi!");
        });
      });
    }
  }
};

/* ========================================================================
   13. ANIMATIONS
   ======================================================================== */
const Animations = {
  flyToCart(origin) {
    if (!origin) return;
    const cartIcon = document.getElementById('cartToggle') || document.getElementById('cartBadge');
    if (!cartIcon) return;
    const imgEl = origin.tagName === 'IMG'
      ? origin
      : origin.closest('.product-card, .product-detail, .quick-view__layout, .gallery, .sticky-atc')?.querySelector('img');
    const startEl = imgEl || origin;
    const start = startEl.getBoundingClientRect();
    const end = cartIcon.getBoundingClientRect();
    const clone = document.createElement('img');
    clone.className = 'fly-clone';
    clone.src = imgEl?.src || '';
    clone.alt = '';
    Object.assign(clone.style, {
      top: start.top + 'px',
      left: start.left + 'px',
      width: Math.max(28, start.width) + 'px',
      height: Math.max(28, start.height) + 'px'
    });
    if (!imgEl) {
      clone.remove();
      const dot = document.createElement('div');
      dot.className = 'fly-clone';
      Object.assign(dot.style, {
        top: start.top + 'px', left: start.left + 'px', width: '28px', height: '28px',
        background: 'var(--primary)', borderRadius: '50%'
      });
      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        Object.assign(dot.style, {
          top: end.top + end.height / 2 - 10 + 'px',
          left: end.left + end.width / 2 - 10 + 'px',
          width: '20px', height: '20px', opacity: '0.3'
        });
      });
      setTimeout(() => { dot.remove(); this.bumpCart(cartIcon); }, 600);
      return;
    }
    document.body.appendChild(clone);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        Object.assign(clone.style, {
          top: (end.top + end.height / 2 - 10) + 'px',
          left: (end.left + end.width / 2 - 10) + 'px',
          width: '20px',
          height: '20px',
          opacity: '0.35',
          borderRadius: '50%'
        });
      });
    });
    setTimeout(() => { clone.remove(); this.bumpCart(cartIcon); }, 620);
  },
  bumpCart(el) {
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 300);
  },
  initScrollReveal() {
    const els = document.querySelectorAll('.fade-in-up:not(.visible)');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('visible')); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); } });
    }, { threshold: 0.05, rootMargin: '40px 0px 0px 0px' });
    els.forEach(el => obs.observe(el));
    setTimeout(() => {
      document.querySelectorAll('.fade-in-up:not(.visible)').forEach(el => el.classList.add('visible'));
    }, 1200);
  },
  countUp(el, target, duration = 1000) {
    let start = 0;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      el.textContent = UI.formatPrice(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
};

/* ========================================================================
   14. PAGE INITIALIZATION
   ======================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  Theme.mount();
  initHeader();
  UI.updateBadges();
  UI.checkOAuthRedirect();
  initBottomNav();

  const page = document.body.dataset.page;
  const params = new URLSearchParams(location.search);
  const catalogQuery = params.has('cat') || params.has('q') || params.has('sale') || params.has('all') || params.has('sort') || params.has('gift');

  try {
    if (page === 'home' && catalogQuery) {
      document.body.dataset.page = 'catalog';
      initCatalogPage();
      initBottomNav();
    } else {
      switch (page) {
        case 'home': initHomePage(); break;
        case 'catalog': initCatalogPage(); break;
        case 'detail': ProductDetail.init(); break;
        case 'cart': CartPage.init(); break;
        case 'checkout': Checkout.init(); break;
        case 'login':
        case 'register':
          Auth.initLogin();
          Auth.initRegister();
          Auth.init3DFlip();
          break;
        case 'profile': ProfilePage.init(); break;
        case 'orders': OrdersPage.init(); break;
        case 'wishlist': WishlistPage.init(); break;
        case 'categories': initCategoriesPage(); break;
        case 'store': initStorePage(); break;
        case 'info': initInfoPage(); break;
        case '404': init404Page(); break;
      }
    }
  } catch (err) {
    console.error('Page init error:', err);
  }

  Animations.initScrollReveal();
  enhanceChrome();
});

// BFCache (Back-Forward Cache): Brauzer orqaga/oldinga tugmalari bosilganda savat va nishonlarni yangilash
window.addEventListener('pageshow', () => {
  UI.updateBadges();
  if (document.body.dataset.page === 'cart' && typeof CartPage !== 'undefined' && CartPage.render) {
    CartPage.render();
  }
});

// Boshqa oyna yoki tabda savat/sevimlilar o'zgarganda avtomatik sinxronlash
window.addEventListener('storage', (e) => {
  if (!e.key || e.key.includes('cart') || e.key.includes('wishlist') || e.key.includes('user')) {
    UI.updateBadges();
    if (document.body.dataset.page === 'cart' && typeof CartPage !== 'undefined' && CartPage.render) {
      CartPage.render();
    }
  }
});

// Sahifaga qayta fokus qilinganda yoki tab aktivlashganda yangilash
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    UI.updateBadges();
  }
});
window.addEventListener('focus', () => {
  UI.updateBadges();
});

function initHeader() {
  const header = document.getElementById('header');
  // Make every interactive menu understandable to keyboard and screen-reader users.
  const menuControls = [
    ['cartToggle', 'miniCart'], ['userToggle', 'userDropdown'],
    ['categoriesToggle', 'categoriesDropdown'], ['hamburgerBtn', 'mobileMenu']
  ];
  menuControls.forEach(([buttonId, panelId]) => {
    const button = document.getElementById(buttonId);
    const panel = document.getElementById(panelId);
    if (button && panel) {
      button.setAttribute('aria-controls', panelId);
      button.setAttribute('aria-expanded', 'false');
    }
  });
  // Sticky shadow
  window.addEventListener('scroll', () => {
    const h = document.getElementById('header');
    if (h) h.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
  // Search autocomplete + submit
  const searchInput = document.getElementById('searchInput');
  Search.initAutocomplete(searchInput, document.getElementById('searchSuggestions'));
  const goSearch = () => {
    const q = (searchInput?.value || '').trim();
    if (q) location.href = `book_list.html?q=${encodeURIComponent(q)}`;
  };
  document.querySelector('.header__search-btn')?.addEventListener('click', e => { e.preventDefault(); goSearch(); });
  searchInput?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); goSearch(); } });
  const mobileSearch = document.querySelector('.mobile-menu__search input');
  mobileSearch?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = mobileSearch.value.trim();
      if (q) location.href = `book_list.html?q=${encodeURIComponent(q)}`;
    }
  });

  // Cart toggle (mini-cart)
  const cartToggle = document.getElementById('cartToggle');
  const miniCart = document.getElementById('miniCart');
  if (cartToggle && miniCart) {
    cartToggle.addEventListener('click', e => {
      e.stopPropagation();
      if (!requireAuth("Savatni ko'rish uchun avval hisobingizga kiring!")) return;
      UI.updateBadges();
      miniCart.classList.toggle('active');
      cartToggle.setAttribute('aria-expanded', String(miniCart.classList.contains('active')));
      document.getElementById('userDropdown')?.classList.remove('active');
      document.getElementById('categoriesDropdown')?.classList.remove('active');
    });
  }

  // User dropdown
  const userToggle = document.getElementById('userToggle');
  const userDD = document.getElementById('userDropdown');
  const userContent = document.getElementById('userDropdownContent');
  if (userToggle && userDD) {
    userToggle.addEventListener('click', e => {
      e.stopPropagation();
      const user = Store.getUser();
      if (userContent) {
        userContent.innerHTML = user
          ? `<div class="user-dropdown__head">
               ${user.avatar ? `<img class="dropdown-avatar" src="${sanitizeUrl(user.avatar)}" alt="">` : `<span class="dropdown-avatar dropdown-avatar--initials">${UI.initials(user)}</span>`}
               <div><strong>${escapeHtml(user.name || '')}</strong><p>${escapeHtml(user.email || '')}</p></div>
             </div>
             <a href="profile.html">${ICONS.user} Profil</a>
             <a href="profile.html?tab=orders">${ICONS.orders} Buyurtmalarim</a>
             <a href="profile.html?tab=wishlist">${ICONS.heart} Sevimlilarim</a>
             <button type="button" class="user-dropdown__logout">${ICONS.logOut} Chiqish</button>`
          : `<a href="login.html">${ICONS.login} Kirish</a>
             <a href="register.html">${ICONS.user} Ro'yxatdan o'tish</a>`;
        userContent.querySelector('.user-dropdown__logout')?.addEventListener('click', () => {
          Store.logout();
          location.reload();
        });
      }
      userDD.classList.toggle('active');
      userToggle.setAttribute('aria-expanded', String(userDD.classList.contains('active')));
      miniCart?.classList.remove('active');
      document.getElementById('categoriesDropdown')?.classList.remove('active');
    });
  }

  // Categories dropdown
  const catToggle = document.getElementById('categoriesToggle');
  const catDD = document.getElementById('categoriesDropdown');
  if (catToggle && catDD && typeof CATEGORIES !== 'undefined') {
    const adjustDropdownPosition = () => {
      if (!catDD.classList.contains('active')) {
        catDD.style.transform = '';
        return;
      }
      if (window.innerWidth > 768) {
        catDD.style.transform = '';
        requestAnimationFrame(() => {
          const rect = catDD.getBoundingClientRect();
          if (rect.right > window.innerWidth - 16) {
            const shift = rect.right - (window.innerWidth - 16);
            catDD.style.transform = `translateX(-${shift}px)`;
          } else if (rect.left < 16) {
            const shift = 16 - rect.left;
            catDD.style.transform = `translateX(${shift}px)`;
          } else {
            catDD.style.transform = '';
          }
        });
      } else {
        catDD.style.transform = '';
      }
    };

    catToggle.addEventListener('click', e => {
      e.stopPropagation();
      if (!catDD.innerHTML.trim()) {
        catDD.innerHTML = `<div class="cats-mega">${CATEGORIES.map(c =>
          `<a href="book_list.html?cat=${c.id}" class="cats-mega__item">
            <img src="${sanitizeUrl(c.image)}" alt="${escapeHtml(c.name)}">
            <div><strong>${escapeHtml(c.name)}</strong><p>${c.count} ta kitob</p></div>
          </a>`).join('')}</div>`;
      }
      const willBeActive = !catDD.classList.contains('active');
      catDD.classList.toggle('active', willBeActive);
      catToggle.classList.toggle('active', willBeActive);
      catToggle.setAttribute('aria-expanded', String(willBeActive));
      document.body.classList.toggle('cats-open', willBeActive);
      miniCart?.classList.remove('active');
      userDD?.classList.remove('active');

      adjustDropdownPosition();
    });

    window.addEventListener('resize', adjustDropdownPosition, { passive: true });
  }

  miniCart?.addEventListener('click', e => e.stopPropagation());
  userDD?.addEventListener('click', e => e.stopPropagation());
  catDD?.addEventListener('click', e => e.stopPropagation());

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    miniCart?.classList.remove('active');
    userDD?.classList.remove('active');
    if (catDD) {
      catDD.classList.remove('active');
      catDD.style.transform = '';
    }
    document.body.classList.remove('cats-open');
    cartToggle?.setAttribute('aria-expanded', 'false');
    userToggle?.setAttribute('aria-expanded', 'false');
    catToggle?.setAttribute('aria-expanded', 'false');
    catToggle?.classList.remove('active');
  });

  // Mobile menu
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('closeMobileMenu');
  if (hamburger && mobileMenu) {
    const openMobile = () => { mobileMenu.classList.add('active'); mobileOverlay?.classList.add('active'); hamburger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; };
    const closeMobile = () => { mobileMenu.classList.remove('active'); mobileOverlay?.classList.remove('active'); hamburger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
    hamburger.addEventListener('click', openMobile);
    closeBtn?.addEventListener('click', closeMobile);
    mobileOverlay?.addEventListener('click', closeMobile);
  }
}

const BRAND_PARTNERS = [
  {
    id: 1,
    name: "Booksaw Store",
    vector: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="m9 9.5 2 2 4-4"/></svg>'
  },
  {
    id: 2,
    name: "Flaprise",
    vector: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'
  },
  {
    id: 3,
    name: "Bookstore",
    vector: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>'
  },
  {
    id: 1,
    name: "Bookdoor",
    vector: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M2 20h20"/><circle cx="14" cy="12" r="1"/></svg>'
  },
  {
    id: 2,
    name: "Library House",
    vector: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  {
    id: 3,
    name: "O\'qituvchi Press",
    vector: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
  }
];

function initHomePage() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  const wrap = document.getElementById('catalogView');
  if (wrap) wrap.style.display = 'none';
  const main = document.getElementById('mainContent') || document.querySelector('main');
  if (main) {
    Array.from(main.children).forEach(el => {
      if (el.id !== 'catalogView') el.style.display = '';
    });
  }
  Slider.init();
  // Categories row
  const catRow = document.getElementById('categoriesRow');
  if (catRow && typeof CATEGORIES !== 'undefined') {
    catRow.innerHTML = CATEGORIES.map(c =>
      `<a href="book_list.html?cat=${c.id}" class="category-card">
        <div class="category-card__thumb"><img src="${sanitizeUrl(c.image)}" alt="${escapeHtml(c.name)}"></div>
        <div class="category-card__name">${escapeHtml(c.name)}</div>
      </a>`).join('');
  }
  // Discount products
  const discEl = document.getElementById('discountProducts');
  if (discEl) discEl.innerHTML = PRODUCTS.filter(p => p.discount > 0).map(p => renderProductCard(p)).join('');
  // Bestsellers
  const bestEl = document.getElementById('bestsellerProducts');
  if (bestEl) bestEl.innerHTML = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 8).map(p => renderProductCard(p)).join('');
  // Recommended
  const recEl = document.getElementById('recommendedProducts');
  if (recEl) recEl.innerHTML = PRODUCTS.slice(0, 8).map(p => renderProductCard(p)).join('');
  // Brands
  const brandsEl = document.getElementById('brandsRow');
  if (brandsEl) {
    const list = (typeof BRANDS !== 'undefined' && Array.isArray(BRANDS) && BRANDS.length) ? BRANDS : BRAND_PARTNERS;
    brandsEl.innerHTML = list.map(b =>
      `<a class="publisher-item" href="store.html?id=${encodeURIComponent(b.id || 1)}" title="${escapeHtml(b.name)}">
        <span class="publisher-item__icon">${b.vector || `<img src="${sanitizeUrl(b.logo || '')}" alt="${escapeHtml(b.name)}" draggable="false">`}</span>
        <span class="publisher-item__name">${escapeHtml(b.name)}</span>
      </a>`).join('');
  }
  const newEl = document.getElementById('newProducts');
  if (newEl) newEl.innerHTML = [...PRODUCTS].sort((a, b) => b.year - a.year).slice(0, 8).map(p => renderProductCard(p)).join('');
  const blogEl = document.getElementById('blogGrid');
  if (blogEl && typeof POSTS !== 'undefined') {
    blogEl.innerHTML = POSTS.map(post =>
      `<article class="blog-card" data-href="info.html?page=blog&id=${post.id}" role="link" tabindex="0">
        <div class="blog-card__image"><img src="${sanitizeUrl(post.image)}" alt="${escapeHtml(post.title)}"></div>
        <div class="blog-card__body">
          <time>${UI.formatDate(post.date)}</time>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.excerpt)}</p>
        </div>
      </article>`).join('');
  }

  renderRecentlyViewed('recentHome');
  ensureTrustStrip();
  setTimeout(() => Animations.initScrollReveal(), 100);
}

function initStorePage() {
  const id = parseInt(new URLSearchParams(location.search).get('id'), 10) || 1;
  const store = typeof STORES !== 'undefined' ? STORES.find(s => s.id === id) || STORES[0] : null;
  if (!store) return;
  const text = (eid, val) => { const el = document.getElementById(eid); if (el) el.textContent = val; };
  const html = (eid, val) => { const el = document.getElementById(eid); if (el) el.innerHTML = val; };
  const banner = document.getElementById('storeBanner');
  if (banner) {
    banner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url(${store.banner})`;
    banner.style.backgroundSize = 'cover';
    banner.style.backgroundPosition = 'center';
  }
  text('storeName', store.name);
  text('storeNameInfo', store.name);
  text('storeDesc', store.description);
  const logo = document.getElementById('storeLogo');
  if (logo) { logo.src = store.logo; logo.alt = store.name; }
  html('storeRating', `${ICONS.star} ${store.rating}`);
  text('storeReviews', store.reviewCount + ' ta sharh');
  text('storeProducts', store.productCount + ' ta mahsulot');
  text('storeJoined', new Date(store.joinedDate).getFullYear() + '-dan beri');
  const verified = document.getElementById('storeVerified');
  if (verified && store.verified) {
    verified.innerHTML = `${ICONS.shieldCheck} Tasdiqlangan`;
    verified.style.display = 'inline-flex';
  }
  const grid = document.getElementById('storeProductsGrid');
  if (grid) {
    const list = PRODUCTS.filter(p => p.storeId === store.id);
    grid.innerHTML = (list.length ? list : PRODUCTS.slice(0, 8)).map(p => renderProductCard(p)).join('');
  }
  setTimeout(() => Animations.initScrollReveal(), 100);
}

function initBottomNav() {
  const page = document.body.dataset.page;
  const iconMap = {
    home: ICONS.home,
    catalog: ICONS.grid,
    categories: ICONS.grid,
    cart: ICONS.cart,
    wishlist: ICONS.heart,
    profile: ICONS.user
  };
  const params = new URLSearchParams(location.search);
  document.querySelectorAll('.bottom-nav__item').forEach(item => {
    const itemPage = item.dataset.page;
    const isCatActive = page === 'catalog' && (params.has('cat') ? itemPage === 'categories' : itemPage === 'home');
    const isActive = itemPage === page || (page === 'detail' && itemPage === 'home') || isCatActive;
    item.classList.toggle('active', isActive);
    const iconEl = item.querySelector('.bottom-nav__icon, .icon');
    if (iconEl && iconMap[itemPage]) iconEl.innerHTML = iconMap[itemPage];
    const label = item.querySelector('small');
    const short = { home: 'Bosh', categories: 'Katalog', cart: 'Savat', wishlist: 'Sevimli', profile: 'Profil' };
    if (label && short[itemPage]) label.textContent = short[itemPage];
  });
}

/* ========================================================================
   15. EVENT DELEGATION
   (savatga qo'shish / sevimlilar / tez ko'rish / card navigatsiyasi
   yuqorida Search.initAutocomplete() ichida requireAuth bilan
   himoyalangan holda ro'yxatdan o'tkazilgan — bu yerda takrorlanmaydi)
   ======================================================================== */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.product-card[data-href], .blog-card[data-href]');
  if (!card) return;
  e.preventDefault();
  location.href = card.dataset.href;
});

function renderRecentlyViewed(targetId) {
  let ids = Store.getRecent() || [];
  let items = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  if (items.length > 0 && items.length < 4) {
    const supplement = PRODUCTS.filter(p => !items.some(it => it.id === p.id)).slice(0, 4 - items.length);
    items = [...items, ...supplement];
  }
  if (!items.length) return;
  let host = document.getElementById(targetId);
  if (!host) {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    const sec = document.createElement('section');
    sec.className = 'container home-section';
    sec.style.marginBottom = '48px';
    sec.innerHTML = `<div class="section-header" style="margin-bottom:20px;"><h2 class="section-title">Yaqinda ko‘rilganlar</h2></div><div id="${targetId}" class="product-carousel" style="justify-content:flex-start;"></div>`;
    footer.parentNode.insertBefore(sec, footer);
    host = document.getElementById(targetId);
  }
  host.innerHTML = items.map(p => renderProductCard(p)).join('');
}

function ensureTrustStrip() {
  if (document.getElementById('trustStrip')) return;
  const heroWrap = document.querySelector('.hero')?.closest('.container') || document.querySelector('.hero');
  if (!heroWrap) return;
  const strip = document.createElement('section');
  strip.id = 'trustStrip';
  strip.className = 'trust-strip container';
  strip.innerHTML = `
    <div class="trust-strip__item">${ICONS.shieldCheck}<div><strong>Original nashr</strong><span>Rasmiy yetkazib beruvchilar</span></div></div>
    <div class="trust-strip__item">${ICONS.truck}<div><strong>3–5 kun</strong><span>Toshkent va viloyatlar</span></div></div>
    <div class="trust-strip__item">${ICONS.creditCard}<div><strong>Payme / Click</strong><span>Xavfsiz to‘lov</span></div></div>
    <div class="trust-strip__item">${ICONS.package}<div><strong>14 kun</strong><span>Qaytarish kafolati</span></div></div>`;
  heroWrap.after(strip);
}

function enhanceChrome() {
  if (!document.querySelector('.skip-link')) {
    const a = document.createElement('a');
    a.href = '#mainContent';
    a.className = 'skip-link';
    a.textContent = 'Asosiy kontentga o‘tish';
    document.body.prepend(a);
  }
  const main = document.querySelector('main, .product-detail, .checkout-page, .info-page, .error-page, .card-container');
  if (main && !document.getElementById('mainContent')) main.id = 'mainContent';

  // Keep page weight low without delaying the logo or the first visible image.
  document.querySelectorAll('img').forEach((img, index) => {
    if (!img.hasAttribute('decoding')) img.decoding = 'async';
    if (index > 2 && !img.closest('.hero__slides')) img.loading = 'lazy';
  });

  // Escape closes any open lightweight UI; this is expected by keyboard users.
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    document.getElementById('miniCart')?.classList.remove('active');
    document.getElementById('userDropdown')?.classList.remove('active');
    const catDD = document.getElementById('categoriesDropdown');
    if (catDD) {
      catDD.classList.remove('active');
      catDD.style.transform = '';
    }
    document.getElementById('categoriesToggle')?.classList.remove('active');
    document.getElementById('mobileMenu')?.classList.remove('active');
    document.getElementById('mobileOverlay')?.classList.remove('active');
    document.body.classList.remove('cats-open');
    document.body.style.overflow = '';
  });

  const footer = document.querySelector('.footer .container');
  if (footer && !document.getElementById('newsForm')) {
    const news = document.createElement('div');
    news.className = 'footer-news';
    news.innerHTML = `<h4>Yangiliklarga obuna</h4>
      <p>Chegirma va yangi kitoblar haqida xabar oling</p>
      <form id="newsForm" class="footer-news__form">
        <input type="email" id="newsEmail" class="form-input" placeholder="email@example.com" required>
        <button type="submit" class="btn btn-primary btn-sm">Obuna</button>
      </form>`;
    const bottom = footer.querySelector('.footer__bottom');
    footer.insertBefore(news, bottom);
    document.getElementById('newsForm')?.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('newsEmail')?.value.trim();
      if (!/\S+@\S+\.\S+/.test(email)) { UI.showToast('Emailni tekshiring', 'error'); return; }
      try {
        await Api.newsletter(email);
        UI.showToast('Obuna qilindi');
        e.target.reset();
      } catch (err) {
        UI.showToast(err.message || 'Xatolik', 'error');
      }
    });
  }

  document.querySelectorAll('input[type="tel"], #addrPhone, #regPhone, #profPhone').forEach(el => {
    if (!el || el.dataset.mask) return;
    el.dataset.mask = '1';
    el.addEventListener('input', () => {
      let d = el.value.replace(/\D/g, '');
      if (d.startsWith('998')) d = d.slice(3);
      d = d.slice(0, 9);
      const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
      el.value = parts.length ? '+998 ' + parts.join(' ') : '';
    });
  });

  const catTitle = [...document.querySelectorAll('.footer__title')].find(h => /Kategoriyalar/i.test(h.textContent || ''));
  if (catTitle && typeof CATEGORIES !== 'undefined') {
    const ul = catTitle.parentElement.querySelector('.footer__links');
    if (ul) {
      ul.innerHTML = CATEGORIES.slice(0, 5).map(c =>
        `<li><a href="book_list.html?cat=${c.id}">${escapeHtml(c.name)}</a></li>`
      ).join('');
    }
  }

  if (document.body.dataset.page === 'detail') renderRecentlyViewed('recentDetail');
  if (document.body.dataset.page === 'home') renderRecentlyViewed('recentHome');
  document.querySelectorAll('.product-carousel, .categories-row').forEach(el => {
    enableDragScroll(el);
    attachCarouselArrows(el);
  });
  initPublishersMarquee();
}

function initPublishersMarquee() {
  const track = document.getElementById('brandsRow');
  if (!track || track.dataset.marquee === '1') return;
  const viewport = track.closest('.publishers__viewport');
  if (!viewport || !track.children.length) return;
  track.dataset.marquee = '1';

  const originals = [...track.children];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const autoSpeed = reduceMotion ? 0 : 0.48;
  let offset = 0;
  let setWidth = 0;
  let paused = false;
  let offscreen = false;
  let dragging = false;
  let lastX = 0;
  let vel = 0;
  let moved = false;
  let raf = 0;

  function visibleCount() {
    const w = viewport.clientWidth;
    if (w < 480) return 2;
    if (w < 720) return 3;
    if (w < 1024) return 4;
    return Math.min(5, originals.length);
  }

  function layout() {
    const n = Math.max(1, visibleCount());
    const itemW = viewport.clientWidth / n;
    track.replaceChildren();
    originals.forEach(node => {
      node.style.flex = `0 0 ${itemW}px`;
      node.style.width = `${itemW}px`;
      track.appendChild(node);
    });
    let copies = 0;
    while (track.scrollWidth < viewport.clientWidth * 2 + itemW && copies < 8) {
      originals.forEach(node => {
        const clone = node.cloneNode(true);
        clone.style.flex = `0 0 ${itemW}px`;
        clone.style.width = `${itemW}px`;
        clone.setAttribute('tabindex', '-1');
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
      copies += 1;
    }
    setWidth = itemW * originals.length;
    if (setWidth > 0) offset = ((offset % setWidth) + setWidth) % setWidth;
    apply();
  }

  function apply() {
    if (setWidth > 0) {
      offset = ((offset % setWidth) + setWidth) % setWidth;
    }
    track.style.transform = `translate3d(${-offset}px,0,0)`;
  }

  function tick() {
    if (!dragging && !paused && !offscreen) offset += autoSpeed;
    apply();
    raf = requestAnimationFrame(tick);
  }

  let armed = false;
  let startY = 0;
  viewport.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    armed = true;
    dragging = false;
    moved = false;
    vel = 0;
    lastX = e.clientX;
    startY = e.clientY;
  });
  viewport.addEventListener('pointermove', e => {
    if (!armed && !dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - startY;
    if (!dragging) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        armed = false;
        return;
      }
      dragging = true;
      paused = true;
      viewport.classList.add('is-dragging');
      try { viewport.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    }
    lastX = e.clientX;
    if (Math.abs(dx) > 2) moved = true;
    vel = dx;
    offset -= dx;
    apply();
  });
  const endDrag = () => {
    armed = false;
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove('is-dragging');
    const coast = () => {
      if (dragging) return;
      if (Math.abs(vel) < 0.35) {
        paused = viewport.matches(':hover');
        return;
      }
      offset -= vel;
      vel *= 0.94;
      apply();
      requestAnimationFrame(coast);
    };
    requestAnimationFrame(coast);
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('lostpointercapture', endDrag);
  viewport.addEventListener('mouseenter', () => { if (!dragging) paused = true; });
  viewport.addEventListener('mouseleave', () => { if (!dragging) paused = false; });
  viewport.addEventListener('click', e => {
    if (moved) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  viewport.addEventListener('dragstart', e => e.preventDefault());

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      offscreen = !entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(viewport);
  }

  window.addEventListener('resize', layout);
  layout();
  raf = requestAnimationFrame(tick);
}

function initInfoPage() {
  const params = new URLSearchParams(location.search);
  const key = params.get('page') || 'about';
  const postId = parseInt(params.get('id'), 10);
  const el = document.getElementById('infoContent');
  if (!el) return;
  if (key === 'blog' && postId && typeof POSTS !== 'undefined') {
    const post = POSTS.find(p => p.id === postId);
    if (post) {
      document.title = post.title + ' — Booksaw';
      el.innerHTML = `<article class="blog-article">
        <img src="${post.image}" alt="${post.title}">
        <time>${UI.formatDate(post.date)}</time>
        <h1>${post.title}</h1>
        ${post.body || `<p>${post.excerpt}</p>`}
        <a href="info.html?page=blog" class="btn btn-secondary btn-sm">Barcha maqolalar</a>
      </article>`;
      return;
    }
  }
  if (key === 'blog' && typeof POSTS !== 'undefined') {
    document.title = 'Blog — Booksaw';
    el.innerHTML = `<h1>Blog</h1><div class="blog-grid">${POSTS.map(post => `
      <article class="blog-card" data-href="info.html?page=blog&id=${post.id}" role="link" tabindex="0">
        <div class="blog-card__image"><img src="${post.image}" alt="${post.title}"></div>
        <div class="blog-card__body"><time>${UI.formatDate(post.date)}</time><h3>${post.title}</h3><p>${post.excerpt}</p></div>
      </article>`).join('')}</div>`;
  } else if (typeof INFO_PAGES !== 'undefined' && INFO_PAGES[key]) {
    const page = INFO_PAGES[key];
    document.title = 'Booksaw — ' + page.title;
    el.innerHTML = '<h1>' + page.title + '</h1>' + page.body;
    const breadcrumbEl = document.querySelector('.breadcrumbs__current, [data-info-breadcrumb]');
    if (breadcrumbEl) breadcrumbEl.textContent = page.title;
  }
  document.querySelectorAll('.info-nav a').forEach(a => {
    a.classList.toggle('is-active', a.getAttribute('href') === 'info.html?page=' + key || (key === 'blog' && a.getAttribute('href') === 'info.html?page=blog'));
  });
}

function init404Page() {
  const input = document.querySelector('.error-page input');
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) location.href = 'book_list.html?q=' + encodeURIComponent(q);
    }
  });
}
window.Booksaw = { Store, Api, UI, Search };
window.Store = Store;
window.UI = UI;
window.Search = Search;
window.Catalog = Catalog;
window.ProductDetail = ProductDetail;
window.CartPage = CartPage;
window.Checkout = Checkout;
window.Auth = Auth;
window.ProfilePage = ProfilePage;
window.OrdersPage = OrdersPage;
window.WishlistPage = WishlistPage;
window.Slider = Slider;
window.Animations = Animations;