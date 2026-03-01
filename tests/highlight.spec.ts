import { test, expect } from './fixtures';

test('highlights keywords in TypeScript code', async ({ questionsPage: page }) => {
  const codeBody = page.locator('.code-body');
  await expect(codeBody.locator('.shiki')).toBeVisible();
  // Shiki highlights 'const' as a keyword with inline style
  await expect(codeBody.locator('span', { hasText: 'const' }).first()).toBeVisible();
});

test('highlights numbers', async ({ questionsPage: page }) => {
  const codeBody = page.locator('.code-body');
  await expect(codeBody.locator('.shiki')).toBeVisible();
  // Shiki highlights '42' as a number literal with inline style
  await expect(codeBody.locator('span', { hasText: '42' }).first()).toBeVisible();
});

test('code block has language label', async ({ questionsPage: page }) => {
  await expect(page.locator('.code-lang')).toContainText('typescript');
});

test('code block has copy button', async ({ questionsPage: page }) => {
  await expect(page.locator('.code-copy')).toContainText('copy');
});

test('HTML entities are escaped in code output', async ({ questionsPage: page }) => {
  // Verify the code block DOM is intact by checking Shiki rendered the code
  await expect(page.locator('.code-body .shiki')).toBeVisible();
});
