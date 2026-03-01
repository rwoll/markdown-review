import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, basename } from 'path';
import { spawn } from 'child_process';

const TIMEOUT_MS = 30 * 60 * 1000;

// --- Injected at build time by Vite define ---
declare const __CORE_BUNDLE__: string;
const CORE_BUNDLE: string = typeof __CORE_BUNDLE__ !== 'undefined'
  ? __CORE_BUNDLE__
  : '';

// --- Argument parsing ---
interface CliArgs {
  file: string;
  outputFile?: string;
  json: boolean;
  port: number;
  noOpen: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { file: '', json: false, port: 0, noOpen: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-o' || a === '--output') {
      if (i + 1 >= argv.length) {
        process.stderr.write('Error: --output requires a file path argument\n');
        process.exit(1);
      }
      args.outputFile = argv[++i];
      continue;
    }
    if (a === '--json') { args.json = true; continue; }
    if (a === '--port') {
      if (i + 1 >= argv.length) {
        process.stderr.write('Error: --port requires a number argument\n');
        process.exit(1);
      }
      args.port = parseInt(argv[++i], 10);
      if (isNaN(args.port)) {
        process.stderr.write('Error: --port value must be a number\n');
        process.exit(1);
      }
      continue;
    }
    if (a === '--no-open') { args.noOpen = true; continue; }
    if (!a.startsWith('-')) { args.file = a; }
  }
  return args;
}

// --- Open browser cross-platform ---
function openBrowser(url: string): void {
  let cmd: string;
  let args: string[];
  if (process.platform === 'darwin') {
    cmd = 'open';
    args = [url];
  } else if (process.platform === 'win32') {
    cmd = 'cmd';
    args = ['/c', 'start', '', url];
  } else {
    cmd = 'xdg-open';
    args = [url];
  }
  const child = spawn(cmd, args, { stdio: 'ignore', detached: true });
  child.unref();
}

// --- HTML template ---
function buildHtml(markdown: string, mdFileName: string): string {
  const escapedMarkdown = JSON.stringify(markdown);
  const escapedFileName = JSON.stringify(mdFileName);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; img-src https: data:;">
  <title>Plan Review</title>
</head>
<body>
  <div id="app"></div>
  <script>${CORE_BUNDLE}</script>
  <script>
    PlanReview.init({
      container: document.getElementById('app'),
      markdown: ${escapedMarkdown},
      fileName: ${escapedFileName},
      feedbackMode: 'post',
      postUrl: '/feedback',
    });
  </script>
</body>
</html>`;
}

// --- Confirm page ---
const CONFIRM_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feedback Sent</title>
  <style>
    body { background: #111; color: #ccc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0;
      text-align: center; }
    .msg { font-size: 28px; font-weight: 600; color: #fff; }
    .sub { font-size: 15px; color: #666; margin-top: 12px; }
  </style>
</head>
<body>
  <div>
    <div class="msg">Feedback sent! &#10003;</div>
    <div class="sub">You can close this tab</div>
  </div>
</body>
</html>`;

// --- Main ---
const args = parseArgs(process.argv.slice(2));

if (!args.file) {
  process.stderr.write('Usage: markdown-review <file.md> [-o output.md] [--json] [--port N] [--no-open]\n');
  process.exit(1);
}

const filePath = resolve(args.file);
if (!existsSync(filePath)) {
  process.stderr.write(`Error: File not found: ${filePath}\n`);
  process.exit(1);
}

const markdown = readFileSync(filePath, 'utf-8');

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' });
    res.end(buildHtml(markdown, basename(filePath)));
  } else if (req.method === 'POST' && req.url === '/feedback') {
    let body = '';
    req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const feedback = JSON.parse(body);
        const output = args.json
          ? JSON.stringify(feedback, null, 2)
          : (feedback.feedbackMarkdown || JSON.stringify(feedback, null, 2));

        if (args.outputFile) {
          writeFileSync(args.outputFile, output);
          process.stderr.write(`Feedback written to ${args.outputFile}\n`);
        } else {
          process.stdout.write(output);
        }
      } catch {
        process.stderr.write('Warning: Could not parse feedback as JSON, writing raw body\n');
        if (args.outputFile) {
          writeFileSync(args.outputFile, body);
        } else {
          process.stdout.write(body);
        }
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(CONFIRM_HTML);

      // Shut down after a brief delay to ensure response is sent
      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 500);
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(args.port || 0, () => {
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : args.port;
  process.stderr.write(`markdown-review serving on http://localhost:${port}\n`);

  if (!args.noOpen) {
    openBrowser(`http://localhost:${port}`);
  }
});

setTimeout(() => {
  process.stderr.write('markdown-review: timed out after 30 minutes\n');
  server.close();
  process.exit(1);
}, TIMEOUT_MS).unref();
