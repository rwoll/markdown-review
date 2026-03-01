import { test, expect } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import { resolve } from 'path';
import { writeFileSync, mkdtempSync, unlinkSync, existsSync } from 'fs';
import { tmpdir } from 'os';

const root = resolve(__dirname, '..');
const cliBin = resolve(root, 'packages/markdown-review/bin/markdown-review.js');
const fixtureMd = resolve(root, 'packages/core/tests/fixtures/with-questions.md');

/**
 * Start the markdown-review CLI server on a random port with --no-open,
 * wait for it to be ready, and return the child process + port.
 */
async function startCli(
  mdFile: string,
  extraArgs: string[] = [],
): Promise<{ child: ChildProcess; port: number }> {
  const child = spawn('node', [cliBin, mdFile, '--no-open', ...extraArgs], {
    cwd: root,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  const port = await new Promise<number>((resolve, reject) => {
    let stderr = '';
    child.stderr!.on('data', (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/http:\/\/localhost:(\d+)/);
      if (match) resolve(parseInt(match[1], 10));
    });
    child.on('exit', (code) =>
      reject(new Error(`CLI exited early (code ${code}). stderr: ${stderr}`)),
    );
    setTimeout(() => reject(new Error(`Server did not start. stderr: ${stderr}`)), 10000);
  });

  return { child, port };
}

/** Collect all stdout from a child process until it exits. */
function collectStdout(child: ChildProcess): Promise<string> {
  return new Promise((resolve) => {
    let out = '';
    child.stdout!.on('data', (chunk) => { out += chunk.toString(); });
    child.on('close', () => resolve(out));
    setTimeout(() => { child.kill(); resolve(out); }, 10000);
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('CLI end-to-end', () => {
  let child: ChildProcess;

  test.afterEach(() => {
    if (child && !child.killed) child.kill();
  });

  test('serves the review UI and page loads', async ({ page }) => {
    const result = await startCli(fixtureMd);
    child = result.child;

    await page.goto(`http://localhost:${result.port}`);
    await expect(page.locator('.el-h1')).toBeVisible();
    await expect(page.locator('.el-h1')).toContainText('Test Plan');
  });

  test('CSP allows feedback POST (connect-src self)', async ({ page }) => {
    const result = await startCli(fixtureMd);
    child = result.child;
    const stdoutPromise = collectStdout(child);

    await page.goto(`http://localhost:${result.port}`);
    await expect(page.locator('.q-block').first()).toBeVisible();

    // Listen for CSP violations — there should be none
    const cspViolations: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().includes('Content Security Policy')) {
        cspViolations.push(msg.text());
      }
    });

    // Answer the open question
    const textarea = page.locator('.q-textarea').first();
    await textarea.click();
    await textarea.pressSequentially('Looks good');
    await page.locator('.q-submit.active').first().click();
    await expect(page.locator('.q-block.answered')).toBeVisible();

    // Click export/submit — this triggers the POST to /feedback
    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/feedback')),
      page.locator('.panel-export').click(),
    ]);

    expect(response.status()).toBe(200);
    expect(cspViolations).toHaveLength(0);

    // Server should exit and feedback should be on stdout
    const stdout = await stdoutPromise;
    expect(stdout).toContain('# Feedback');
  });

  test('submit shows success toast', async ({ page }) => {
    const result = await startCli(fixtureMd);
    child = result.child;

    await page.goto(`http://localhost:${result.port}`);
    await expect(page.locator('.q-block').first()).toBeVisible();

    // Answer a question and submit
    const textarea = page.locator('.q-textarea').first();
    await textarea.click();
    await textarea.pressSequentially('LGTM');
    await page.locator('.q-submit.active').first().click();
    await expect(page.locator('.q-block.answered')).toBeVisible();

    await Promise.all([
      page.waitForResponse((res) => res.url().includes('/feedback')),
      page.locator('.panel-export').click(),
    ]);

    // Success toast should appear
    await expect(page.locator('body')).toContainText('Feedback posted');
  });

  test('feedback stdout contains answered question', async ({ page }) => {
    const result = await startCli(fixtureMd);
    child = result.child;
    const stdoutPromise = collectStdout(child);

    await page.goto(`http://localhost:${result.port}`);
    await expect(page.locator('.q-block').first()).toBeVisible();

    // Answer the open question
    const textarea = page.locator('.q-textarea').first();
    await textarea.click();
    await textarea.pressSequentially('My detailed feedback here');
    await page.locator('.q-submit.active').first().click();
    await expect(page.locator('.q-block.answered')).toBeVisible();

    await Promise.all([
      page.waitForResponse((res) => res.url().includes('/feedback')),
      page.locator('.panel-export').click(),
    ]);

    const stdout = await stdoutPromise;
    expect(stdout).toContain('My detailed feedback here');
  });

  test('--json flag outputs JSON to stdout', async ({ page }) => {
    const result = await startCli(fixtureMd, ['--json']);
    child = result.child;
    const stdoutPromise = collectStdout(child);

    await page.goto(`http://localhost:${result.port}`);
    await expect(page.locator('.q-block').first()).toBeVisible();

    const textarea = page.locator('.q-textarea').first();
    await textarea.click();
    await textarea.pressSequentially('JSON test');
    await page.locator('.q-submit.active').first().click();
    await expect(page.locator('.q-block.answered')).toBeVisible();

    await Promise.all([
      page.waitForResponse((res) => res.url().includes('/feedback')),
      page.locator('.panel-export').click(),
    ]);

    const stdout = await stdoutPromise;
    const parsed = JSON.parse(stdout);
    expect(parsed).toHaveProperty('feedbackMarkdown');
    expect(parsed.feedbackMarkdown).toContain('JSON test');
  });

  test('-o flag writes feedback to file', async ({ page }) => {
    const tmpDir = mkdtempSync(resolve(tmpdir(), 'review-e2e-'));
    const outputFile = resolve(tmpDir, 'feedback.md');

    const result = await startCli(fixtureMd, ['-o', outputFile]);
    child = result.child;

    await page.goto(`http://localhost:${result.port}`);
    await expect(page.locator('.q-block').first()).toBeVisible();

    const textarea = page.locator('.q-textarea').first();
    await textarea.click();
    await textarea.pressSequentially('File output test');
    await page.locator('.q-submit.active').first().click();
    await expect(page.locator('.q-block.answered')).toBeVisible();

    await Promise.all([
      page.waitForResponse((res) => res.url().includes('/feedback')),
      page.locator('.panel-export').click(),
    ]);

    // Wait for CLI to exit and write the file
    await new Promise<void>((resolve) => {
      child.on('close', () => resolve());
      setTimeout(() => { child.kill(); resolve(); }, 5000);
    });

    expect(existsSync(outputFile)).toBe(true);
    const { readFileSync } = await import('fs');
    const content = readFileSync(outputFile, 'utf-8');
    expect(content).toContain('File output test');

    try { unlinkSync(outputFile); } catch { /* best-effort */ }
  });

  test('server exits after feedback is submitted', async ({ page }) => {
    const result = await startCli(fixtureMd);
    child = result.child;

    await page.goto(`http://localhost:${result.port}`);
    await expect(page.locator('.q-block').first()).toBeVisible();

    const textarea = page.locator('.q-textarea').first();
    await textarea.click();
    await textarea.pressSequentially('Exit test');
    await page.locator('.q-submit.active').first().click();
    await expect(page.locator('.q-block.answered')).toBeVisible();

    await Promise.all([
      page.waitForResponse((res) => res.url().includes('/feedback')),
      page.locator('.panel-export').click(),
    ]);

    // Wait for process to exit
    const exitCode = await new Promise<number | null>((resolve) => {
      child.on('close', (code) => resolve(code));
      setTimeout(() => { child.kill(); resolve(null); }, 5000);
    });

    expect(exitCode).toBe(0);
  });

  test('inline annotation is included in feedback', async ({ page }) => {
    const result = await startCli(fixtureMd);
    child = result.child;
    const stdoutPromise = collectStdout(child);

    await page.goto(`http://localhost:${result.port}`);
    await expect(page.locator('.el-h1')).toBeVisible();
    await page.setViewportSize({ width: 1400, height: 900 });

    // Click a paragraph to open the comment sheet
    await page.locator('.el-p').first().click();
    await expect(page.locator('.sheet.open')).toBeVisible();

    const sheetTextarea = page.locator('.sheet textarea');
    await expect(sheetTextarea).toBeFocused({ timeout: 5000 });
    await sheetTextarea.fill('Needs more detail here');
    await page.locator('.sheet-send.active').click();
    await expect(page.locator('.ann-dot')).toBeVisible({ timeout: 10000 });

    // Submit
    await Promise.all([
      page.waitForResponse((res) => res.url().includes('/feedback')),
      page.locator('.panel-export').click(),
    ]);

    const stdout = await stdoutPromise;
    expect(stdout).toContain('Needs more detail here');
  });
});
