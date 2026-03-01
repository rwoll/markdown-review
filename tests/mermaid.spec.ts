import { test, expect } from './fixtures';

// -- Mermaid diagram rendering ------------------------------------------------

test('mermaid diagram renders SVG', async ({ mermaidPage: page }) => {
  const mermaidBody = page.locator('.mermaid-body');
  await expect(mermaidBody).toHaveCount(1);
  // SVG should be rendered inside the mermaid body
  await expect(mermaidBody.locator('svg')).toBeVisible();
});

test('mermaid block has language label', async ({ mermaidPage: page }) => {
  await expect(page.locator('.code-lang')).toContainText('mermaid');
});

test('mermaid diagram contains expected nodes', async ({ mermaidPage: page }) => {
  const svg = page.locator('.mermaid-body svg');
  await expect(svg).toBeVisible();
  // The diagram should contain the node labels from the fixture
  await expect(svg).toContainText('Start');
  await expect(svg).toContainText('Decision');
});

test('mermaid diagram is clickable for annotation', async ({ mermaidPage: page }) => {
  const block = page.locator('.block:has(.mermaid-body)');
  await expect(block).toHaveCount(1);
  await block.click();
  await expect(page.locator('.sheet.open')).toBeVisible();
});

test('mermaid diagram screenshot', async ({ mermaidPage: page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await expect(page).toHaveScreenshot('mermaid-diagram.png');
});

// -- Image loading ------------------------------------------------------------

test('image triggers network request for src', async ({ page }) => {
  const imageRequests: string[] = [];

  // Intercept image requests using route
  await page.route('**/*.png', (route) => {
    imageRequests.push(route.request().url());
    // Fulfill with a 1x1 transparent PNG to avoid broken image icons
    route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64',
      ),
    });
  });

  await page.goto('/mermaid');
  await expect(page.locator('.el-h1')).toBeVisible();

  // Wait for the image element to appear and be attached, which triggers the request
  await expect(page.locator('img[alt="Test image"]')).toBeAttached();

  // Verify the UI attempted to load the test image
  expect(imageRequests.some((url) => url.includes('test-image.png'))).toBe(true);
});

test('markdown image renders img element with correct attributes', async ({ mermaidPage: page }) => {
  const img = page.locator('img[alt="Test image"]');
  await expect(img).toHaveCount(1);
  await expect(img).toHaveAttribute('src', 'https://example.com/test-image.png');
});
