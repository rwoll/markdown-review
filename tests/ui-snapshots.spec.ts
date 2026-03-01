import { test, expect } from './fixtures';

// -- Basic document snapshots -----------------------------------------------

test('basic document renders correctly', async ({ basicPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await expect(page).toHaveScreenshot('basic-doc-desktop.png', { fullPage: true });
});

test('basic document mobile layout', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/basic');
  await expect(page.locator('.el-h1')).toBeVisible();
  await expect(page).toHaveScreenshot('basic-doc-mobile.png', { fullPage: true });
});

// -- Questions document snapshots -------------------------------------------

test('questions unanswered state — desktop', async ({ questionsPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await expect(page).toHaveScreenshot('questions-unanswered-desktop.png', { fullPage: true });
});

test('questions unanswered state — tablet', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 1024 });
  await page.goto('/questions');
  await expect(page.locator('.q-block').first()).toBeVisible();
  await expect(page).toHaveScreenshot('questions-unanswered-tablet.png', { fullPage: true });
});

test('questions unanswered state — mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/questions');
  await expect(page.locator('.q-block').first()).toBeVisible();
  await expect(page).toHaveScreenshot('questions-unanswered-mobile.png', { fullPage: true });
});

test('open question answered', async ({ questionsPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });

  // Answer the open question
  const textarea = page.locator('.q-textarea').first();
  await textarea.click();
  await textarea.pressSequentially('Looks good to me');
  await page.locator('.q-submit.active').first().click();

  // Web-first assertion: wait for the answered state
  await expect(page.locator('.q-block.answered')).toBeVisible();
  await expect(page).toHaveScreenshot('question-open-answered.png', { fullPage: true });
});

test('comment sheet open', async ({ basicPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });

  // Click a paragraph to open the sheet
  await page.locator('.el-p').first().click();
  await expect(page.locator('.sheet.open')).toBeVisible();

  await expect(page).toHaveScreenshot('sheet-open.png');
});

test('annotation dot appears after commenting', async ({ basicPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });

  // Click a paragraph to open the sheet
  await page.locator('.el-p').first().click();
  await expect(page.locator('.sheet.open')).toBeVisible();

  // Wait for the textarea to receive focus (Sheet focuses after 280ms),
  // then fill and submit
  const sheetTextarea = page.locator('.sheet textarea');
  await expect(sheetTextarea).toBeFocused({ timeout: 5000 });
  await sheetTextarea.fill('Great point here');
  await page.locator('.sheet-send.active').click();

  // Web-first assertion: wait for the annotation dot to appear (auto-retries)
  await expect(page.locator('.ann-dot')).toBeVisible({ timeout: 10000 });
  await expect(page).toHaveScreenshot('annotation-dot-visible.png', { fullPage: true });
});
