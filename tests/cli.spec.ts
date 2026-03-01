import { test, expect } from '@playwright/test';
import { execSync, spawn } from 'child_process';
import { resolve } from 'path';
import { readFileSync, unlinkSync, existsSync, mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import http from 'http';

const root = resolve(__dirname, '..');
const cliBin = resolve(root, 'packages/markdown-review/bin/markdown-review.js');
const fixtureMd = resolve(root, 'packages/core/tests/fixtures/basic.md');

// -- Bug 5: CLI argument parsing bounds checking ----------------------------

test.describe('CLI argument validation', () => {
  test('--output without value exits with error', () => {
    try {
      execSync(`node ${cliBin} ${fixtureMd} --output`, {
        encoding: 'utf-8',
        timeout: 5000,
      });
      throw new Error('Expected command to fail');
    } catch (err: any) {
      if (err.message === 'Expected command to fail') throw err;
      expect(err.status).not.toBe(0);
      expect(err.stderr).toContain('--output requires a file path argument');
    }
  });

  test('--port without value exits with error', () => {
    try {
      execSync(`node ${cliBin} ${fixtureMd} --port`, {
        encoding: 'utf-8',
        timeout: 5000,
      });
      throw new Error('Expected command to fail');
    } catch (err: any) {
      if (err.message === 'Expected command to fail') throw err;
      expect(err.status).not.toBe(0);
      expect(err.stderr).toContain('--port requires a number argument');
    }
  });

  test('--port with non-numeric value exits with error', () => {
    try {
      execSync(`node ${cliBin} ${fixtureMd} --port abc`, {
        encoding: 'utf-8',
        timeout: 5000,
      });
      throw new Error('Expected command to fail');
    } catch (err: any) {
      if (err.message === 'Expected command to fail') throw err;
      expect(err.status).not.toBe(0);
      expect(err.stderr).toContain('--port value must be a number');
    }
  });
});

// -- Bug 2: Feedback fallback on JSON parse error ---------------------------

test.describe('CLI feedback handling', () => {
  test('server writes raw body as fallback when JSON parse fails', async () => {
    const tmpDir = mkdtempSync(resolve(tmpdir(), 'review-md-'));
    const outputFile = resolve(tmpDir, 'feedback-output.md');

    // Start the CLI server on a random port with --no-open
    const child = spawn('node', [cliBin, fixtureMd, '-o', outputFile, '--no-open'], {
      cwd: root,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Wait for server to start and capture the port
    const port = await new Promise<number>((resolve, reject) => {
      let stderr = '';
      child.stderr!.on('data', (chunk) => {
        stderr += chunk.toString();
        const match = stderr.match(/http:\/\/localhost:(\d+)/);
        if (match) resolve(parseInt(match[1], 10));
      });
      setTimeout(() => reject(new Error(`Server did not start. stderr: ${stderr}`)), 10000);
    });

    // POST raw markdown (non-JSON) to /feedback to test the fallback
    const rawMarkdown = '# Test Feedback\n\nSome feedback content';
    await new Promise<void>((resolve, reject) => {
      const req = http.request(
        { hostname: 'localhost', port, path: '/feedback', method: 'POST',
          headers: { 'Content-Type': 'text/markdown' } },
        (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            expect(res.statusCode).toBe(200);
            resolve();
          });
        },
      );
      req.on('error', reject);
      req.write(rawMarkdown);
      req.end();
    });

    // Wait for the CLI to exit and write the output
    await new Promise<void>((resolve) => {
      child.on('close', () => resolve());
      setTimeout(() => { child.kill(); resolve(); }, 5000);
    });

    // The fallback should have written the raw body
    expect(existsSync(outputFile)).toBe(true);
    const written = readFileSync(outputFile, 'utf-8');
    expect(written).toBe(rawMarkdown);

    // Cleanup — ignore errors if file was already removed
    try { unlinkSync(outputFile); } catch { /* best-effort */ }
  });

  test('server writes JSON feedbackMarkdown when valid JSON is posted', async () => {
    const tmpDir = mkdtempSync(resolve(tmpdir(), 'review-md-'));
    const outputFile = resolve(tmpDir, 'feedback-output.md');

    const child = spawn('node', [cliBin, fixtureMd, '-o', outputFile, '--no-open'], {
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
      setTimeout(() => reject(new Error(`Server did not start. stderr: ${stderr}`)), 10000);
    });

    // POST valid JSON to /feedback
    const feedbackMd = '# Feedback\n\nLooks good!';
    await new Promise<void>((resolve, reject) => {
      const req = http.request(
        { hostname: 'localhost', port, path: '/feedback', method: 'POST',
          headers: { 'Content-Type': 'application/json' } },
        (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            expect(res.statusCode).toBe(200);
            resolve();
          });
        },
      );
      req.on('error', reject);
      req.write(JSON.stringify({ feedbackMarkdown: feedbackMd }));
      req.end();
    });

    await new Promise<void>((resolve) => {
      child.on('close', () => resolve());
      setTimeout(() => { child.kill(); resolve(); }, 5000);
    });

    expect(existsSync(outputFile)).toBe(true);
    const written = readFileSync(outputFile, 'utf-8');
    expect(written).toBe(feedbackMd);

    // Cleanup — ignore errors if file was already removed
    try { unlinkSync(outputFile); } catch { /* best-effort */ }
  });
});
