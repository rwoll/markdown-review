import { test, expect } from './fixtures';

// -- Basic markdown (no questions) -----------------------------------------

test('renders h1', async ({ basicPage: page }) => {
  await expect(page.locator('.el-h1')).toContainText('Test Plan');
});

test('renders h2', async ({ basicPage: page }) => {
  await expect(page.locator('.el-h2')).toContainText('Section One');
});

test('renders h3', async ({ basicPage: page }) => {
  await expect(page.locator('.el-h3')).toContainText('Subsection');
});

test('renders paragraphs', async ({ basicPage: page }) => {
  const paragraphs = page.locator('.el-p');
  await expect(paragraphs).not.toHaveCount(0);
  await expect(paragraphs.first()).toContainText('bold');
});

test('renders inline bold', async ({ basicPage: page }) => {
  await expect(page.locator('strong').first()).toContainText('bold');
});

test('renders inline code', async ({ basicPage: page }) => {
  await expect(page.locator('code.inline').first()).toContainText('code');
});

test('renders unordered list items', async ({ basicPage: page }) => {
  const items = page.locator('.el-li');
  await expect(items).toHaveCount(2);
  await expect(items.first()).toContainText('Item one');
  await expect(items.nth(1)).toContainText('Item two');
});

test('renders ordered list items', async ({ basicPage: page }) => {
  const items = page.locator('.el-ol');
  await expect(items).toHaveCount(2);
  await expect(items.first()).toContainText('First ordered');
});

test('renders blockquote', async ({ basicPage: page }) => {
  const quotes = page.locator('.el-quote');
  await expect(quotes).toHaveCount(1);
  await expect(quotes.first()).toContainText('A blockquote here');
});

test('renders image with src and alt', async ({ basicPage: page }) => {
  const img = page.locator('img[alt="Architecture diagram"]');
  await expect(img).toHaveCount(1);
  await expect(img).toHaveAttribute('src', 'https://example.com/diagram.png');
});

test('renders raw HTML img tag', async ({ basicPage: page }) => {
  const img = page.locator('img[alt="Logo image"]');
  await expect(img).toHaveCount(1);
  await expect(img).toHaveAttribute('src', 'https://example.com/logo.png');
  await expect(img).toHaveAttribute('width', '128');
  await expect(img).toHaveAttribute('height', '128');
});

test('image block is clickable for annotation', async ({ basicPage: page }) => {
  const imgBlock = page.locator('.block:has(img[alt="Logo image"])');
  await expect(imgBlock).toHaveCount(1);
  await imgBlock.click();
  await expect(page.locator('.sheet.open')).toBeVisible();
});

test('renders table with headers and rows', async ({ basicPage: page }) => {
  const table = page.locator('table');
  await expect(table).toHaveCount(1);
  await expect(table.locator('th').first()).toContainText('Feature');
  await expect(table.locator('th').nth(1)).toContainText('Status');
  await expect(table.locator('td').first()).toContainText('Auth');
  await expect(table.locator('td').nth(1)).toContainText('Done');
  await expect(table.locator('tr')).toHaveCount(3); // header + 2 data rows
});

test('basic doc has no question blocks', async ({ basicPage: page }) => {
  await expect(page.locator('.q-block')).toHaveCount(0);
});

// -- Markdown with questions ------------------------------------------------

test('renders all three question types', async ({ questionsPage: page }) => {
  await expect(page.locator('.q-block')).toHaveCount(3);
});

test('renders open question text', async ({ questionsPage: page }) => {
  await expect(page.locator('.q-text').first()).toContainText('What do you think about this?');
});

test('renders choice question with options', async ({ questionsPage: page }) => {
  await expect(page.locator('.q-text').nth(1)).toContainText('Pick one');
  await expect(page.locator('.q-option').first()).toBeVisible();
});

test('renders checkbox question', async ({ questionsPage: page }) => {
  await expect(page.locator('.q-text').nth(2)).toContainText('Select all that apply');
});

test('renders syntax-highlighted code block', async ({ questionsPage: page }) => {
  await expect(page.locator('.code-wrap')).toHaveCount(1);
  await expect(page.locator('.code-body .shiki')).toBeVisible();
  await expect(page.locator('.code-body')).toContainText('const');
  await expect(page.locator('.code-body')).toContainText('42');
});
