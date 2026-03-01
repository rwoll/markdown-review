import { test, expect } from './fixtures';
import { resolve } from 'path';

/**
 * Capture the hero screenshot for the VS Code extension README.
 *
 * The screenshot shows:
 *   - A realistic API Spec document with a mermaid diagram, code block,
 *     and a multiple-choice question
 *   - Existing annotations visible in the sidebar notes panel
 *   - The comment drawer open with an in-progress comment
 */
test('capture README hero screenshot', async ({ apiSpecPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });

  // ── Step 1: Add an annotation on the "Architecture Overview" heading ──
  const archHeading = page.locator('.el-h2', { hasText: 'Architecture Overview' });
  await archHeading.click();
  await expect(page.locator('.sheet.open')).toBeVisible();

  const sheetTextarea = page.locator('.sheet textarea');
  await expect(sheetTextarea).toBeFocused({ timeout: 5000 });
  await sheetTextarea.fill('Looks great — should we add a fallback if Redis is unavailable?');
  await page.locator('.sheet-send.active').click();
  await expect(page.locator('.ann-dot').first()).toBeVisible({ timeout: 10000 });

  // ── Step 2: Add a second annotation on the "Rate Limiting" section ──
  const rateLimitHeading = page.locator('.el-h2', { hasText: 'Rate Limiting' });
  await rateLimitHeading.click();
  await expect(page.locator('.sheet.open')).toBeVisible();

  await expect(sheetTextarea).toBeFocused({ timeout: 5000 });
  await sheetTextarea.fill('+1, let\'s keep the sliding window approach.');
  await page.locator('.sheet-send.active').click();
  await expect(page.locator('.ann-dot').nth(1)).toBeVisible({ timeout: 10000 });

  // ── Step 3: Scroll so mermaid, code, and question are visible ──
  // Click the Create User heading to open the comment drawer mid-page
  const createUserHeading = page.locator('.el-h2', { hasText: 'Create User' });
  await createUserHeading.scrollIntoViewIfNeeded();
  await createUserHeading.click();
  await expect(page.locator('.sheet.open')).toBeVisible();
  await expect(sheetTextarea).toBeFocused({ timeout: 5000 });
  await sheetTextarea.fill('Can we also cover the migration path from v1?');

  // Scroll so the Architecture Overview heading is near the top — this positions
  // the mermaid diagram, code block, and question all within the viewport.
  await archHeading.scrollIntoViewIfNeeded();

  // ── Step 4: Capture the screenshot ──
  await page.waitForTimeout(500);

  const screenshot = await page.screenshot({ clip: { x: 0, y: 0, width: 1400, height: 900 } });
  const outputPath = resolve(__dirname, '..', 'packages', 'vscode', 'images', 'hero-screenshot.png');

  const fs = await import('fs');
  fs.writeFileSync(outputPath, screenshot);
});
