import { test, expect } from './fixtures';

// -- Bug 1: Feedback POST sends JSON (not raw markdown) ----------------------

test('feedback POST sends JSON with application/json content type', async ({ postFeedbackPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });

  // Answer the open question so we have feedback to export
  const textarea = page.locator('.q-textarea').first();
  await textarea.click();
  await textarea.pressSequentially('Test answer');
  await page.locator('.q-submit.active').first().click();
  await expect(page.locator('.q-block.answered')).toBeVisible();

  // Intercept the POST to /feedback to capture what's sent
  const [request] = await Promise.all([
    page.waitForRequest((req) => req.url().includes('/feedback') && req.method() === 'POST'),
    page.locator('.panel-export').click(),
  ]);

  // Verify the request sends JSON
  expect(request.headers()['content-type']).toBe('application/json');
  const body = JSON.parse(request.postData() || '{}');
  expect(body).toHaveProperty('feedbackMarkdown');
  expect(typeof body.feedbackMarkdown).toBe('string');
  expect(body.feedbackMarkdown).toContain('# Feedback');
});

// -- Bug 4: Invalid qtype renders as code block, not question ----------------

test('invalid question type renders as code block', async ({ invalidQtypePage: page }) => {
  // The invalid qtype (question:freeform) should render as a code block, not a question block
  const codeBlocks = page.locator('.code-wrap');
  await expect(codeBlocks).toHaveCount(1);
  await expect(codeBlocks.first()).toContainText('question:freeform');

  // Only the valid open question should render as a question block
  const questionBlocks = page.locator('.q-block');
  await expect(questionBlocks).toHaveCount(1);
  await expect(page.locator('.q-text').first()).toContainText('Valid open question');
});

// -- Bug 3: insideListItem try/finally — list items still render properly ----

test('list items render correctly with paragraph content', async ({ basicPage: page }) => {
  // Verify list items render correctly (tests the try/finally path)
  const listItems = page.locator('.el-li');
  await expect(listItems).toHaveCount(2);
  await expect(listItems.first()).toContainText('Item one');
  await expect(listItems.nth(1)).toContainText('Item two');

  // Verify paragraphs outside lists still get the el-p class
  const paragraphs = page.locator('.el-p');
  await expect(paragraphs).not.toHaveCount(0);
});

// -- Bug 6: lineMap memoization — rendering still works after memoization ----

test('elements still have correct indices after lineMap memoization', async ({ basicPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });

  // Click the first paragraph to open the comment sheet
  await page.locator('.el-p').first().click();
  await expect(page.locator('.sheet.open')).toBeVisible();

  // The sheet should open (proves getIndex still works via memoized lineMap)
  const sheetTextarea = page.locator('.sheet textarea');
  await expect(sheetTextarea).toBeFocused({ timeout: 5000 });
  await sheetTextarea.fill('Test memoization');
  await page.locator('.sheet-send.active').click();

  // Annotation dot should appear on the correct element
  await expect(page.locator('.ann-dot')).toBeVisible({ timeout: 10000 });
});
