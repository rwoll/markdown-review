import { test, expect, captureFeedbackMarkdown } from './fixtures';

// These tests verify the text content of the feedback markdown output
// by exercising the UI and capturing what would be exported.

test('feedback with answered open question', async ({ questionsPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });

  // Answer the open question
  const textarea = page.locator('.q-textarea').first();
  await textarea.click();
  await textarea.pressSequentially('Looks good to me');
  await page.locator('.q-submit.active').first().click();
  await expect(page.locator('.q-block.answered')).toBeVisible();

  const normalized = await captureFeedbackMarkdown(page);
  expect(normalized).toMatchSnapshot('feedback-open-question.txt');
});

test('feedback with all questions answered', async ({ questionsPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });

  // Answer open question
  const openTextarea = page.locator('.q-textarea').first();
  await openTextarea.click();
  await openTextarea.pressSequentially('Looks good to me');
  await page.locator('.q-submit.active').first().click();
  await expect(page.locator('.q-block.answered')).toBeVisible();

  // Answer choice question — select "Beta"
  const choiceOptions = page.locator('.q-option');
  await choiceOptions.nth(1).click();
  await expect(page.locator('.q-option.selected')).toBeVisible();
  await page.locator('.q-submit.active').first().click();

  // Answer checkbox question — select Red and Blue
  await expect(page.locator('.q-block.unanswered .q-option').first()).toBeVisible();
  const checkboxOptions = page.locator('.q-option');
  await checkboxOptions.nth(0).click();
  await expect(page.locator('.q-option.selected').first()).toBeVisible();
  await checkboxOptions.nth(2).click();
  await expect(page.locator('.q-submit.active')).toBeVisible();
  await page.locator('.q-submit.active').first().click();

  // All three questions answered
  await expect(page.locator('.q-block.answered')).toHaveCount(3);

  const normalized = await captureFeedbackMarkdown(page);
  expect(normalized).toMatchSnapshot('feedback-all-answered.txt');
});

test('feedback with inline annotation', async ({ basicPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });

  // Click a paragraph to open the comment sheet
  await page.locator('.el-p').first().click();
  await expect(page.locator('.sheet.open')).toBeVisible();

  // Wait for the textarea to receive focus (Sheet focuses after 280ms),
  // then fill and submit
  const sheetTextarea = page.locator('.sheet textarea');
  await expect(sheetTextarea).toBeFocused({ timeout: 5000 });
  await sheetTextarea.fill('This section needs more detail');
  await page.locator('.sheet-send.active').click();

  // Wait for annotation dot to appear (auto-retries)
  await expect(page.locator('.ann-dot')).toBeVisible({ timeout: 10000 });

  const normalized = await captureFeedbackMarkdown(page);
  expect(normalized).toMatchSnapshot('feedback-inline-annotation.txt');
});

test('feedback shows type:table when annotating a table', async ({ basicPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });

  // Click the table to open the comment sheet
  await page.locator('.el-table').click();
  const sheetTextarea = page.locator('.sheet textarea');
  await expect(sheetTextarea).toBeFocused({ timeout: 5000 });
  await sheetTextarea.fill('Table comment');
  await page.locator('.sheet-send.active').click();

  await expect(page.locator('.ann-dot')).toBeVisible({ timeout: 10000 });

  const normalized = await captureFeedbackMarkdown(page);
  expect(normalized).toContain('type:  table');
});

test('feedback empty state shows message', async ({ questionsPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await expect(page.locator('.panel-empty')).toContainText('No notes or answers yet');
});
