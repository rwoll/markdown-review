import { test as base, expect, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helper: capture the feedback markdown that the Export button would download.
// Works by temporarily intercepting the Blob constructor so we can read the
// generated markdown string instead of triggering an actual file download.
// ---------------------------------------------------------------------------
export async function captureFeedbackMarkdown(page: Page): Promise<string> {
  const raw = await page.evaluate(() => {
    let captured = '';
    const OrigBlob = window.Blob;
    const origCreateObjectURL = URL.createObjectURL;
    const origRevokeObjectURL = URL.revokeObjectURL;

    (window as any).Blob = class extends OrigBlob {
      constructor(parts: any[], options?: any) {
        super(parts, options);
        if (options?.type === 'text/markdown') {
          captured = parts.join('');
        }
      }
    };
    URL.createObjectURL = () => 'blob:fake';
    URL.revokeObjectURL = () => {};

    (document.querySelector('.panel-dl') as HTMLElement)?.click();

    (window as any).Blob = OrigBlob;
    URL.createObjectURL = origCreateObjectURL;
    URL.revokeObjectURL = origRevokeObjectURL;

    return captured;
  });

  // Normalise the timestamp so snapshots remain stable across runs.
  return raw.replace(/\*\*Generated:\*\* .+/, '**Generated:** <TIMESTAMP>');
}

// ---------------------------------------------------------------------------
// Custom fixtures
// ---------------------------------------------------------------------------

type PlanReviewFixtures = {
  /** Page already navigated to the /basic route (basic markdown, no questions). */
  basicPage: Page;
  /** Page already navigated to the /questions route (markdown with questions). */
  questionsPage: Page;
  /** Page already navigated to the /invalid-qtype route (markdown with invalid question type). */
  invalidQtypePage: Page;
  /** Page already navigated to the /post-feedback route (questions with feedbackMode='post'). */
  postFeedbackPage: Page;
  /** Page already navigated to the /mermaid route (markdown with mermaid diagram and images). */
  mermaidPage: Page;
};

export const test = base.extend<PlanReviewFixtures>({
  basicPage: async ({ page }, use) => {
    await page.goto('/basic');
    // Web-first assertion: wait until the primary heading is visible.
    await expect(page.locator('.el-h1')).toBeVisible();
    await use(page);
  },

  questionsPage: async ({ page }, use) => {
    await page.goto('/questions');
    // Web-first assertion: wait until at least one question block is visible.
    await expect(page.locator('.q-block').first()).toBeVisible();
    await use(page);
  },

  invalidQtypePage: async ({ page }, use) => {
    await page.goto('/invalid-qtype');
    await expect(page.locator('.el-h1')).toBeVisible();
    await use(page);
  },

  postFeedbackPage: async ({ page }, use) => {
    await page.goto('/post-feedback');
    await expect(page.locator('.q-block').first()).toBeVisible();
    await use(page);
  },

  mermaidPage: async ({ page }, use) => {
    await page.goto('/mermaid');
    // Wait for the mermaid diagram to render (SVG appears in .mermaid-body)
    await expect(page.locator('.mermaid-body svg').first()).toBeVisible({ timeout: 15000 });
    await use(page);
  },
});

export { expect };
