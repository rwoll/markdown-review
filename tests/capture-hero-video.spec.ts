import { test as base, expect } from '@playwright/test';
import { resolve } from 'path';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { pathToFileURL } from 'url';

/**
 * Capture a hero demo video (converted to gif) for the README files.
 *
 * The video walks through the core review workflow:
 *   1. Page loads with the API Spec document
 *   2. User scrolls through the document
 *   3. User clicks a heading to annotate it and submits a comment
 *   4. User clicks another section and submits a second annotation
 *   5. User opens the comment drawer with a draft comment in progress
 *
 * Playwright records a webm video which is then converted to gif via ffmpeg.
 */

const videoDir = resolve(__dirname, '..', 'test-results', 'hero-video');

const test = base.extend({
  // Override context to enable video recording at a specific size
  context: async ({ browser }, use) => {
    if (!existsSync(videoDir)) {
      mkdirSync(videoDir, { recursive: true });
    }
    const context = await browser.newContext({
      viewport: { width: 1400, height: 900 },
      recordVideo: {
        dir: videoDir,
        size: { width: 1400, height: 900 },
      },
    });
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  },
});

test('capture README hero video', async ({ page }) => {
  // Navigate to the api-spec fixture
  await page.goto('/api-spec');
  await expect(page.locator('.mermaid-body svg').first()).toBeVisible({ timeout: 15000 });
  await expect(page.locator('.el-h1')).toBeVisible();

  // Inject a blue click-indicator dot that appears at each click location
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes click-ring {
        0%   { transform: translate(-50%, -50%) scale(0.5); opacity: 0.9; }
        100% { transform: translate(-50%, -50%) scale(2.0); opacity: 0; }
      }
      .click-dot {
        position: fixed;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(56, 132, 255, 0.5);
        border: 2px solid rgba(56, 132, 255, 0.8);
        pointer-events: none;
        z-index: 999999;
        animation: click-ring 0.5s ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    document.addEventListener('mousedown', (e) => {
      const dot = document.createElement('div');
      dot.className = 'click-dot';
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 500);
    }, true);
  });

  // Pause to show the initial document
  await page.waitForTimeout(1500);

  // ── Step 1: Click "Architecture Overview" to annotate ──
  const archHeading = page.locator('.el-h2', { hasText: 'Architecture Overview' });
  await archHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await archHeading.click();
  await expect(page.locator('.sheet.open')).toBeVisible();

  const sheetTextarea = page.locator('.sheet textarea');
  await expect(sheetTextarea).toBeFocused({ timeout: 5000 });

  // Type slowly for the video effect
  await sheetTextarea.pressSequentially('Looks great — should we add a fallback if Redis is unavailable?', { delay: 30 });
  await page.waitForTimeout(600);
  await page.locator('.sheet-send.active').click();
  await expect(page.locator('.ann-dot').first()).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(800);

  // ── Step 2: Click "Rate Limiting" to annotate ──
  const rateLimitHeading = page.locator('.el-h2', { hasText: 'Rate Limiting' });
  await rateLimitHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await rateLimitHeading.click();
  await expect(page.locator('.sheet.open')).toBeVisible();

  await expect(sheetTextarea).toBeFocused({ timeout: 5000 });
  await sheetTextarea.pressSequentially('+1, let\'s keep the sliding window approach.', { delay: 30 });
  await page.waitForTimeout(600);
  await page.locator('.sheet-send.active').click();
  await expect(page.locator('.ann-dot').nth(1)).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(800);

  // ── Step 3: Scroll to show all features, open drawer with a draft ──
  const createUserHeading = page.locator('.el-h2', { hasText: 'Create User' });
  await createUserHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await createUserHeading.click();
  await expect(page.locator('.sheet.open')).toBeVisible();
  await expect(sheetTextarea).toBeFocused({ timeout: 5000 });
  await sheetTextarea.pressSequentially('Can we also cover the migration path from v1?', { delay: 30 });

  // Scroll back to show the full document with the mermaid diagram, code, and question
  await archHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);

  // Close the page to finalize the video
  await page.close();
});

test.afterAll(async () => {
  // Find the recorded webm file and convert to gif
  const files = readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) {
    throw new Error('No webm video found in ' + videoDir);
  }

  const webmPath = resolve(videoDir, files[0]);
  const gifPath = resolve(__dirname, '..', 'packages', 'vscode', 'images', 'hero-demo.gif');

  // ── Load @ffmpeg/core (WebAssembly) directly in Node.js ──
  const corePath = resolve(__dirname, '..', 'node_modules', '@ffmpeg', 'core', 'dist', 'umd', 'ffmpeg-core.js');
  const wasmPath = resolve(__dirname, '..', 'node_modules', '@ffmpeg', 'core', 'dist', 'umd', 'ffmpeg-core.wasm');

  // Polyfill browser globals that Emscripten expects
  if (typeof globalThis.self === 'undefined') (globalThis as Record<string, unknown>).self = globalThis;
  if (typeof globalThis.location === 'undefined') {
    (globalThis as Record<string, unknown>).location = { href: pathToFileURL(corePath).toString() };
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const createFFmpegCore = require(corePath);
  const wasmBinary = readFileSync(wasmPath);
  const ffmpeg = await createFFmpegCore({ wasmBinary });

  const webmData = new Uint8Array(readFileSync(webmPath));

  // Convert webm to gif using ffmpeg with a good palette for quality
  // Two-pass approach: generate palette, then use it for the gif
  ffmpeg.FS.writeFile('input.webm', webmData);

  // Disable timeout — conversion duration depends on video length
  ffmpeg.setTimeout(-1);
  ffmpeg.exec('-y', '-i', 'input.webm', '-vf', 'fps=12,scale=700:-1:flags=lanczos,palettegen=stats_mode=diff', 'palette.png');
  if (ffmpeg.ret !== 0) throw new Error(`ffmpeg palette generation failed with code ${ffmpeg.ret}`);
  // Reset internal state between exec calls
  ffmpeg.reset();

  ffmpeg.setTimeout(-1);
  ffmpeg.exec('-y', '-i', 'input.webm', '-i', 'palette.png', '-lavfi', 'fps=12,scale=700:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle', 'output.gif');
  if (ffmpeg.ret !== 0) throw new Error(`ffmpeg gif conversion failed with code ${ffmpeg.ret}`);
  ffmpeg.reset();

  const gifData = ffmpeg.FS.readFile('output.gif');
  writeFileSync(gifPath, gifData);

  console.log(`Hero gif saved to ${gifPath}`);
});
