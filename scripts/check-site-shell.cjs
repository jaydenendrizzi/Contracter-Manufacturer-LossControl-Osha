const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Layout and navigation checks for the shared R&R shell, with synthetic local data only.
(async () => {
  const browser = await chromium.launch({executablePath: '/usr/bin/chromium', args: ['--no-sandbox']});
  const output = path.resolve(__dirname, '../review/design');
  fs.mkdirSync(output, {recursive: true});
  try {
    const context = await browser.newContext({viewport: {width: 1440, height: 1000}, reducedMotion: 'reduce'});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const open = async target => {
      await page.goto('http://127.0.0.1:8888/' + target, {waitUntil: 'domcontentloaded'});
      await page.locator('.lc-ready').waitFor();
      await page.evaluate(() => document.fonts.ready);
    };
    const fits = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, page.url());
    await open('index.html#lookup');
    assert.equal(await page.locator('.lc-sidebar').evaluate(el => Math.round(el.getBoundingClientRect().width)), 260);
    assert.equal(await page.locator('.lc-menu').isVisible(), false);
    assert.equal(await page.locator('.lc-nav a[aria-current]').textContent(), 'Site lookup');
    assert.equal(await page.evaluate(() => getComputedStyle(document.body).fontFamily.split(',')[0]), 'Overpass');
    await fits();
    await page.screenshot({path: path.join(output, 'lookup-desktop.png'), fullPage: true});
    await page.locator('.lc-nav a[href="#walk"]').click();
    await page.locator('#v-walk:not([hidden])').waitFor();
    assert.equal(await page.locator('.lc-breadcrumb b').innerText(), 'Walkthrough');
    await page.screenshot({path: path.join(output, 'walkthrough-desktop.png'), fullPage: true});

    await page.setViewportSize({width: 390, height: 844});
    await page.locator('.lc-menu').click();
    await page.getByRole('dialog').waitFor();
    assert.equal(await page.locator('.lc-workspace').evaluate(el => el.inert), true);
    await page.locator('.lc-backup-link').focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.className), 'lc-brand');
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.activeElement.className), 'lc-backup-link');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.lc-menu').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('.lc-menu').evaluate(el => el === document.activeElement), true);
    assert.equal(await page.locator('.lc-sidebar').evaluate(el => el.inert), true);
    await page.locator('.lc-menu').click();
    await page.screenshot({path: path.join(output, 'navigation-390.png')});
    await page.locator('.lc-nav a[href="#library"]').click();
    await page.locator('#v-library:not([hidden])').waitFor();
    assert.equal(await page.locator('.lc-menu').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('.lc-nav a[aria-current]').textContent(), 'Library');
    await page.locator('.lc-menu').click();
    await page.locator('.lc-backdrop').click({position: {x: 365, y: 300}});
    assert.equal(await page.locator('.lc-menu').getAttribute('aria-expanded'), 'false');

    for (const view of ['lookup', 'walk', 'library', 'stats', 'industry', 'prospects']) {
      await open('index.html#' + view);
      await page.locator('#v-' + view + ':not([hidden])').waitFor();
      await fits();
      await page.screenshot({path: path.join(output, view + '-390.png'), fullPage: true});
    }
    for (const [file, active] of [['handouts.html', 'Handouts'], ['clients.html', 'Clients'], ['backup.html', null], ['content-review.html', null]]) {
      await open(file);
      if (active) assert.equal((await page.locator('.lc-nav a[aria-current]').textContent()).trim(), active);
      if (file === 'handouts.html') await page.waitForFunction(() => document.querySelectorAll('#hazard-list input').length === 50);
      await fits();
      await page.screenshot({path: path.join(output, file.replace('.html', '') + '-390.png'), fullPage: true});
      await page.setViewportSize({width: 1440, height: 1000});
      await fits();
      await page.screenshot({path: path.join(output, file.replace('.html', '') + '-desktop.png'), fullPage: true});
      await page.setViewportSize({width: 390, height: 844});
    }

    await open('index.html#walk');
    await page.locator('.lc-skip').focus();
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#walk');
    assert.equal(await page.locator('main').evaluate(el => el === document.activeElement), true);
    const logo = await page.locator('#rr-logo').getAttribute('src');
    assert(logo.startsWith('data:image/png;base64,'));
    const original = fs.readFileSync(path.resolve(__dirname, '../rr-logo.png'));
    assert.deepEqual(Buffer.from(logo.split(',')[1], 'base64'), original);
    await page.emulateMedia({media: 'print'});
    assert.equal(await page.locator('.lc-sidebar').isVisible(), false);
    assert.equal(await page.locator('.lc-topbar').isVisible(), false);
    await page.emulateMedia({media: 'screen'});

    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(async () => {
      const names = await caches.keys();
      return names.includes('rr-lc-2026-11-19-shared-design-v1');
    });
    const cached = await page.evaluate(async () => {
      const c = await caches.open('rr-lc-2026-11-19-shared-design-v1');
      return Promise.all(['/site-shell.css', '/site-shell.js', ...[400,500,600,700,800].map(w => '/fonts/overpass-latin-' + w + '-normal.woff2')].map(async key => !!await c.match(key)));
    });
    assert(cached.every(Boolean));
    await context.setOffline(true);
    for (const file of ['index.html#walk', 'handouts.html', 'clients.html', 'backup.html']) {
      await open(file);
      await fits();
      assert.equal(await page.evaluate(() => document.fonts.check('600 14px Overpass')), true);
      await page.locator('.lc-menu').click();
      assert.equal(await page.locator('.lc-menu').getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
    }
    assert.deepEqual(errors, []);
    console.log('PASS: shared desktop/mobile shell, all six main views and four tool pages, active navigation, keyboard focus and trap, skip link, original PDF logo, print isolation, cached shell/fonts, offline navigation, 390 px without overflow or page errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
