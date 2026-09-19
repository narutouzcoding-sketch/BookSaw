import { test, expect } from '@playwright/test';

test.describe('E2E Flows: User Journeys & State Synchronization', () => {

  // Flow 1: Card click -> Detail page (1-click navigation)
  test('Flow 1: Product card navigates to product detail page on 1 click', async ({ page }) => {
    await page.goto('/catalog/templates/catalog/book_list.html');
    await page.waitForLoadState('networkidle');

    // Wait for at least one product card to be present
    const firstCard = page.locator('.product-card').first();
    await expect(firstCard).toBeVisible();

    // Get expected book ID from data-href
    const dataHref = await firstCard.getAttribute('data-href');
    expect(dataHref).toContain('book_detail.html?id=');

    // 1-click on the card title or card itself
    const titleLink = firstCard.locator('.product-card__title');
    await titleLink.click();

    // Verify navigation directly opens detail page
    await page.waitForURL(/book_detail\.html\?id=\d+/);
    await expect(page.locator('#productDetail, #tab-desc, h1, .product-detail__title').first()).toBeVisible();
    expect(page.url()).toContain('book_detail.html?id=');
  });

  // Flow 2: Real form Authentication: Register -> Logout -> Login -> Logout
  test('Flow 2: Real form Authentication (Register -> Logout -> Login -> Logout)', async ({ page }) => {
    const testEmail = `kitobxon_${Date.now()}@example.com`;
    const testPassword = 'Password123!';
    const testName = 'Sherzod Qodirov';
    const testPhone = '+998991112233';

    // 1. Go to register page
    await page.goto('/catalog/templates/catalog/register.html');
    await page.waitForLoadState('networkidle');

    // If flip card, ensure signup card is visible
    const signupCard = page.locator('#cardContainer');
    await expect(signupCard).toHaveClass(/flipped/);

    await page.fill('#regName', testName);
    await page.fill('#regEmail', testEmail);
    await page.fill('#regPhone', testPhone);
    await page.fill('#regPassword', testPassword);
    await page.fill('#regConfirm', testPassword);

    const regTerms = page.locator('#regTerms');
    if (await regTerms.isVisible()) {
      await regTerms.check();
    }

    // Submit register form
    await page.click('#registerBtn');

    // Should show success and redirect to book_list.html
    await page.waitForURL(/book_list\.html/, { timeout: 10000 });
    await expect(page.locator('#userToggle')).toBeVisible();

    // Verify user is saved in storage
    const userInStorage = await page.evaluate(() => {
      const u = localStorage.getItem('marketplace_user');
      return u ? JSON.parse(u) : null;
    });
    expect(userInStorage).not.toBeNull();
    expect(userInStorage.email).toBe(testEmail);

    // 2. Logout via user dropdown
    await page.click('#userToggle');
    const logoutBtn = page.locator('#userDropdownContent button, #userDropdownContent a').filter({ hasText: /chiqish/i });
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
    } else {
      // Direct logout via Store if dropdown has different format
      await page.evaluate(() => window.Store.logout());
      await page.reload();
    }

    // Verify logged out
    const userAfterLogout = await page.evaluate(() => window.Store.getUser());
    expect(userAfterLogout).toBeNull();

    // 3. Login using real form
    await page.goto('/catalog/templates/catalog/login.html');
    await page.waitForLoadState('networkidle');

    await page.fill('#loginEmail', testEmail);
    await page.fill('#loginPassword', testPassword);
    await page.click('#loginBtn');

    // Wait for login redirect
    await page.waitForURL(/book_list\.html/, { timeout: 10000 });
    const userAfterLogin = await page.evaluate(() => window.Store.getUser());
    expect(userAfterLogin).not.toBeNull();
    expect(userAfterLogin.email).toBe(testEmail);
  });

  // Flow 3: Cart Operations: Add -> Badge increment -> Remove -> Clear -> Badge 0
  test('Flow 3: Cart operations (add, remove, clear, badges update)', async ({ page }) => {
    // Seed authenticated user
    await page.addInitScript(() => {
      const u = { id: 'usr_flow_cart', name: 'Zafar', email: 'zafar@example.com' };
      localStorage.setItem('marketplace_user', JSON.stringify(u));
      localStorage.setItem('booksaw_user', JSON.stringify(u));
    });

    await page.goto('/catalog/templates/catalog/book_list.html');
    await page.waitForLoadState('networkidle');

    const cartBadge = page.locator('#cartBadge');
    await expect(cartBadge).toHaveText('0');

    // Add first item to cart (product 1)
    const firstAddBtn = page.locator('.add-to-cart-btn[data-id="1"]').first();
    await firstAddBtn.click();

    // Verify cart badge incremented to 1
    await expect(cartBadge).toHaveText('1');

    // Add second item (product 2)
    const secondAddBtn = page.locator('.add-to-cart-btn[data-id="2"]').first();
    await secondAddBtn.click();
    await expect(cartBadge).toHaveText('2');

    // Navigate to cart page
    await page.goto('/catalog/templates/catalog/cart.html');
    await page.waitForLoadState('networkidle');

    // Verify cart items are visible
    const cartItems = page.locator('.cart-item, [data-cart-item]');
    await expect(cartItems.first()).toBeVisible();

    // Remove one item (specifically the item's trash button, not the clear all button)
    const removeBtn = page.locator('.cart-item .cart-remove').first();
    await removeBtn.click();
    await page.locator('#confirmOk').click();

    // Badge should be 1
    await expect(cartBadge).toHaveText('1');

    // Clear remaining cart via clear button
    const clearBtn = page.locator('#clearCartEatBtn');
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    } else {
      await page.evaluate(() => window.Store.clearCart());
    }

    // Verify badge is 0
    await expect(cartBadge).toHaveText('0');
  });

  // Flow 4: Wishlist: Toggle Add -> Badge 1 -> Toggle Remove -> Badge 0
  test('Flow 4: Wishlist operations and badge count update', async ({ page }) => {
    await page.addInitScript(() => {
      const u = { id: 'usr_flow_wl', name: 'Madina', email: 'madina@example.com' };
      localStorage.setItem('marketplace_user', JSON.stringify(u));
      localStorage.setItem('booksaw_user', JSON.stringify(u));
      localStorage.removeItem('marketplace_wishlist_usr_flow_wl');
    });

    await page.goto('/catalog/templates/catalog/book_list.html');
    await page.waitForLoadState('networkidle');

    const wishlistBadge = page.locator('#wishlistBadge');
    await expect(wishlistBadge).toHaveText('0');

    // Click wishlist button on first card
    const firstWlBtn = page.locator('.product-card__wishlist').first();
    await firstWlBtn.click();

    // Verify badge incremented to 1
    await expect(wishlistBadge).toHaveText('1');
    await expect(firstWlBtn).toHaveClass(/active/);

    // Click again to toggle remove
    await firstWlBtn.click();
    await expect(wishlistBadge).toHaveText('0');
    await expect(firstWlBtn).not.toHaveClass(/active/);
  });

  // Flow 5: Review submission on product detail page
  test('Flow 5: Review submission on book detail page', async ({ page }) => {
    await page.addInitScript(() => {
      const u = { id: 'usr_flow_rev', name: 'Dilorom Rahimova', email: 'dilorom@example.com' };
      localStorage.setItem('marketplace_user', JSON.stringify(u));
      localStorage.setItem('booksaw_user', JSON.stringify(u));
    });

    await page.goto('/catalog/templates/catalog/book_detail.html?id=1');
    await page.waitForLoadState('networkidle');

    // Switch to reviews tab
    const reviewsTabBtn = page.locator('button[data-tab="reviews"]');
    if (await reviewsTabBtn.isVisible()) {
      await reviewsTabBtn.click();
    }

    const reviewForm = page.locator('#reviewForm');
    await expect(reviewForm).toBeVisible();

    // Select 5 stars
    const starBtn = page.locator('#starPick button[data-star="5"]');
    if (await starBtn.isVisible()) {
      await starBtn.click();
    }

    // Fill review text
    const reviewText = 'Bu kitob menga juda yoqdi. Tavsiya qilaman barchaga!';
    await page.fill('#reviewText', reviewText);
    await reviewForm.locator('button[type="submit"]').click();

    // Verify review appears in reviews list
    const addedReview = page.locator('#tab-reviews').filter({ hasText: 'Dilorom Rahimova' });
    await expect(addedReview).toBeVisible();
    await expect(page.locator('#tab-reviews')).toContainText(reviewText);
  });

  // Flow 6: Complete Checkout Flow (Step 1 -> 2 -> 3 -> 4 -> Order Placed)
  test('Flow 6: Complete checkout flow to confirmation', async ({ page }) => {
    await page.addInitScript(() => {
      const u = { id: 'usr_flow_chk', name: 'Jasur Bek', email: 'jasur@example.com', phone: '+998901112233' };
      localStorage.setItem('marketplace_user', JSON.stringify(u));
      localStorage.setItem('booksaw_user', JSON.stringify(u));
      // Seed 1 item in cart
      localStorage.setItem('marketplace_cart_usr_flow_chk', JSON.stringify([{ productId: 1, qty: 1 }]));
    });

    await page.goto('/catalog/templates/catalog/checkout.html');
    await page.waitForLoadState('networkidle');

    // Step 1: Add or ensure address
    await expect(page.locator('#step1')).toHaveClass(/active/);

    // Fill address form
    await page.fill('#addrName', 'Jasur Bek');
    await page.fill('#addrPhone', '+998 90 111 22 33');
    await page.fill('#addrCity', 'Toshkent');
    await page.fill('#addrAddress', 'Chilonzor tumani 9-mavze 12-uy');
    await page.click('#saveAddrBtn');
    await expect(page.locator('#addressList .choice-card').first()).toBeVisible();

    // Proceed to step 2
    await page.click('#toStep2');
    await expect(page.locator('#step2')).toHaveClass(/active/);

    // Proceed to step 3 (delivery default is auto-selected)
    await page.click('#toStep3');
    await expect(page.locator('#step3')).toHaveClass(/active/);

    // Proceed to step 4 (payment default is auto-selected)
    await page.click('#toStep4');
    await expect(page.locator('#step4')).toHaveClass(/active/);

    // Confirm Order
    await page.click('#placeOrderBtn');

    // Verify order placed successfully
    const successScreen = page.locator('#orderSuccess');
    await expect(successScreen).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#orderNumber')).not.toBeEmpty();
  });

  // Flow 7: Multi-tab Synchronization
  test('Flow 7: Multi-tab synchronization (cart and badge update across tabs)', async ({ context }) => {
    // Shared user session
    await context.addInitScript(() => {
      const u = { id: 'usr_multitab', name: 'Otabek', email: 'otabek@example.com' };
      localStorage.setItem('marketplace_user', JSON.stringify(u));
      localStorage.setItem('booksaw_user', JSON.stringify(u));
      localStorage.removeItem('marketplace_cart_usr_multitab');
    });

    const page1 = await context.newPage();
    const page2 = await context.newPage();

    await page1.goto('/catalog/templates/catalog/book_list.html');
    await page2.goto('/catalog/templates/catalog/book_list.html');
    await page1.waitForLoadState('networkidle');
    await page2.waitForLoadState('networkidle');

    // Both badges initial 0
    await expect(page1.locator('#cartBadge')).toHaveText('0');
    await expect(page2.locator('#cartBadge')).toHaveText('0');

    // Tab 1 adds product to cart
    await page1.locator('.add-to-cart-btn').first().click();
    await expect(page1.locator('#cartBadge')).toHaveText('1');

    // Tab 2 should update its badge via storage event
    await expect(page2.locator('#cartBadge')).toHaveText('1');

    await page1.close();
    await page2.close();
  });

  // Flow 8: BFCache Back/Forward Navigation Badge Sync
  test('Flow 8: BFCache (pageshow) updates badges on browser back navigation', async ({ page }) => {
    await page.addInitScript(() => {
      const u = { id: 'usr_bfcache', name: 'Sardor', email: 'sardor@example.com' };
      localStorage.setItem('marketplace_user', JSON.stringify(u));
      localStorage.setItem('booksaw_user', JSON.stringify(u));
    });

    // 1. Start on book list
    await page.goto('/catalog/templates/catalog/book_list.html');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#cartBadge')).toHaveText('0');

    // 2. Click title to go to detail
    await page.locator('.product-card__title').first().click();
    await page.waitForURL(/book_detail\.html/);

    // 3. Add to cart on detail page
    const detailAddBtn = page.locator('#detailAddToCart, button:has-text("Savatga")').first();
    await detailAddBtn.click();
    await expect(page.locator('#cartBadge')).toHaveText('1');

    // 4. Browser back button
    await page.goBack();
    await page.waitForURL(/book_list\.html/);

    // 5. Verify badge is updated to 1 via pageshow / BFCache handler
    await expect(page.locator('#cartBadge')).toHaveText('1');
  });

});
