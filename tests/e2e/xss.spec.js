import { test, expect } from '@playwright/test';

test.describe('Enhanced XSS Sanitization & Defense Verification', () => {

  test('XSS 1: Search suggestions do not parse HTML elements and show literal text', async ({ page }) => {
    let alertTriggered = false;
    page.on('dialog', async dialog => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    await page.goto('/catalog/templates/catalog/book_list.html');
    await page.waitForLoadState('networkidle');

    const payload = '<img src=x onerror=alert("XSS_SEARCH")>';
    await page.fill('#searchInput', payload);
    await page.dispatchEvent('#searchInput', 'input');
    await expect(page.locator('#searchSuggestions')).toBeVisible({ timeout: 3000 });

    // 1. Verify no dialog/alert popped up
    expect(alertTriggered).toBe(false);

    // 2. Verify no <img> tag with src="x" was created in the DOM
    const badImg = await page.$('img[src="x"]');
    expect(badImg).toBeNull();

    // 3. Verify suggestions container renders payload as safe escaped literal text if shown
    const suggestions = page.locator('#searchSuggestions');
    if (await suggestions.isVisible()) {
      const html = await suggestions.innerHTML();
      expect(html).not.toContain('<img src=x onerror=');
    }
  });

  test('XSS 2: Profile name with payload renders as literal text, survives reload, and shows safely in header', async ({ page }) => {
    let alertTriggered = false;
    page.on('dialog', async dialog => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    const xssName = '<img src=x onerror=alert("XSS_NAME")>';

    await page.addInitScript((payload) => {
      const u = {
        id: 'usr_xss_test',
        name: payload,
        email: 'xss_victim@example.com'
      };
      localStorage.setItem('marketplace_user', JSON.stringify(u));
      localStorage.setItem('booksaw_user', JSON.stringify(u));
    }, xssName);

    // Navigate to profile page
    await page.goto('/catalog/templates/catalog/profile.html');
    await page.waitForLoadState('networkidle');

    // 1. No alert
    expect(alertTriggered).toBe(false);

    // 2. No DOM element injected
    expect(await page.$('img[src="x"]')).toBeNull();

    // 3. Check profile name heading: must be literal text
    const profileHeading = page.locator('#profileName');
    await expect(profileHeading).toHaveText(xssName);

    // 4. Check header avatar / user toggle area
    const headerUser = page.locator('#userToggle, #headerUser');
    await expect(headerUser).toBeVisible();
    expect(await page.$('img[src="x"]')).toBeNull();

    // 5. Test persistence after page reload
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(alertTriggered).toBe(false);
    expect(await page.$('img[src="x"]')).toBeNull();
    await expect(profileHeading).toHaveText(xssName);

    // 6. Navigate to a DIFFERENT page (book_list.html) and check header menu dropdown
    await page.goto('/catalog/templates/catalog/book_list.html');
    await page.waitForLoadState('networkidle');
    expect(alertTriggered).toBe(false);
    expect(await page.$('img[src="x"]')).toBeNull();

    // Open user dropdown if present
    await page.click('#userToggle');
    await expect(page.locator('#userDropdown')).toHaveClass(/active/);
    expect(alertTriggered).toBe(false);
    expect(await page.$('img[src="x"]')).toBeNull();

    // Dropdown content must not contain unescaped raw <img tag
    const dropdownHtml = await page.locator('#userDropdownContent').innerHTML();
    expect(dropdownHtml).not.toContain('<img src=x onerror=');
  });

  test('XSS 3: Review submission escapes comment text and author name', async ({ page }) => {
    let alertTriggered = false;
    page.on('dialog', async dialog => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    const xssAuthor = 'Hacker <script>alert(1)</script>';
    const xssComment = 'Ajoyib kitob <img src=x onerror=alert("XSS_REV")>';

    await page.addInitScript((author) => {
      const u = {
        id: 'usr_xss_rev',
        name: author,
        email: 'hacker@example.com'
      };
      localStorage.setItem('marketplace_user', JSON.stringify(u));
      localStorage.setItem('booksaw_user', JSON.stringify(u));
    }, xssAuthor);

    await page.goto('/catalog/templates/catalog/book_detail.html?id=1');
    await page.waitForLoadState('networkidle');

    // Switch to reviews tab
    const tabReviewsBtn = page.locator('button[data-tab="reviews"]');
    if (await tabReviewsBtn.isVisible()) {
      await tabReviewsBtn.click();
    }

    await page.fill('#reviewText', xssComment);
    await page.click('#reviewForm button[type="submit"]');

    expect(alertTriggered).toBe(false);
    expect(await page.$('img[src="x"]')).toBeNull();

    // Review card should display literal text safely
    const tabContent = page.locator('#tab-reviews');
    await expect(tabContent).toContainText('Hacker <script>alert(1)</script>');
    await expect(tabContent).toContainText('Ajoyib kitob <img src=x onerror=alert("XSS_REV")>');
  });

  test('XSS 4: Attribute escape payload (" onmouseover=...) and javascript: href are neutral', async ({ page }) => {
    let alertTriggered = false;
    page.on('dialog', async dialog => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    // Test attribute breaking payload in address and profile
    const attrPayload = '" onmouseover="alert(\'XSS_ATTR\')" data-vuln="';
    const jsHrefPayload = 'javascript:alert("XSS_HREF")';

    await page.addInitScript(({ attr, jsHref }) => {
      const u = {
        id: 'usr_xss_attr',
        name: attr,
        avatar: jsHref,
        email: 'attacker@example.com'
      };
      localStorage.setItem('marketplace_user', JSON.stringify(u));
      localStorage.setItem('booksaw_user', JSON.stringify(u));
    }, { attr: attrPayload, jsHref: jsHrefPayload });

    await page.goto('/catalog/templates/catalog/profile.html');
    await page.waitForLoadState('networkidle');

    expect(alertTriggered).toBe(false);
    // Verify onmouseover was not injected as an active DOM attribute on elements
    const elementsWithHandler = await page.$$('[onmouseover]');
    expect(elementsWithHandler.length).toBe(0);

    // Verify avatar link does not have href="javascript:..."
    const jsHrefElements = await page.$$('a[href^="javascript:"], img[src^="javascript:"]');
    expect(jsHrefElements.length).toBe(0);
  });

});
