/**
 * modules/account.js
 * Foydalanuvchi hisobi, autentifikatsiya (Auth), profil sahifasi (ProfilePage),
 * buyurtmalar tarixi (OrdersPage) va sevimlilar (WishlistPage).
 */
import { escapeHtml, sanitizeUrl } from './escape.js';
import { ICONS, Theme, Store } from './core.js';
import {
  UI,
  runBinEatAnimation,
  createBinButtonHtml,
  renderStars,
  mapDeliveryIcon,
  mapPaymentIcon,
  requireAuth
} from './ui.js';
import { renderProductCard } from './products.js';

const getProducts = () => (typeof window !== 'undefined' && window.PRODUCTS) || (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []);

/* ========================================================================
   AUTHENTICATION & LOGIN/REGISTER
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
    if (document.body?.dataset.page === 'register' || location.search.includes('register') || location.hash === '#register') {
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
            const url = window.Api?.socialAuthStart(kind);
            if (url) {
              location.assign(url);
              return;
            }
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
   PROFILE PAGE
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
    if (!user) return;
    const pName = document.getElementById('profileName');
    const pEmail = document.getElementById('profileEmail');
    const fName = document.getElementById('profName');
    const fEmail = document.getElementById('profEmail');
    const fPhone = document.getElementById('profPhone');

    if (pName) pName.textContent = user.name;
    if (pEmail) pEmail.textContent = user.email;
    if (fName) fName.value = user.name || '';
    if (fEmail) fEmail.value = user.email || '';
    if (fPhone) fPhone.value = user.phone || '';

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
        name: document.getElementById('profName')?.value || '',
        email: document.getElementById('profEmail')?.value || '',
        phone: document.getElementById('profPhone')?.value || ''
      });
      const fresh = Store.getUser();
      if (fresh) {
        if (pName) pName.textContent = fresh.name;
        if (pEmail) pEmail.textContent = fresh.email;
      }
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
      document.getElementById('passwordForm')?.reset();
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
    const prods = getProducts().filter(p => ids.includes(p.id));
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
   ORDERS PAGE
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
   WISHLIST PAGE
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
      const products = getProducts().filter(p => wl.includes(p.id));
      gridEl.innerHTML = products.map(p => renderProductCard(p)).join('');
      gridEl.style.display = '';
    }
    if (addAllBtn && !addAllBtn.dataset.bound) {
      addAllBtn.dataset.bound = '1';
      addAllBtn.addEventListener('click', () => {
        const ids = Store.getWishlist();
        getProducts().filter(p => ids.includes(p.id) && p.inStock).forEach(p => Store.addToCart(p.id));
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

// Global / Window binding
if (typeof window !== 'undefined') {
  window.Auth = Auth;
  window.ProfilePage = ProfilePage;
  window.OrdersPage = OrdersPage;
  window.WishlistPage = WishlistPage;

  // Listen to wishlistchange event to refresh WishlistPage or ProfilePage if open
  window.addEventListener('booksaw:wishlistchange', () => {
    if (document?.body?.dataset?.page === 'wishlist' && typeof WishlistPage !== 'undefined' && WishlistPage.init) {
      WishlistPage.init();
    }
    if (document?.body?.dataset?.page === 'profile' && typeof ProfilePage !== 'undefined' && ProfilePage.renderWishlist) {
      ProfilePage.renderWishlist();
    }
  });
}

export {
  Auth,
  ProfilePage,
  OrdersPage,
  WishlistPage
};
