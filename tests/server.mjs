import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { resolve, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.md': 'text/markdown',
  '.json': 'application/json',
};

const coreBundlePath = resolve(root, 'packages/core/dist/plan-review-core.iife.js');
if (!existsSync(coreBundlePath)) {
  console.error('Error: Core bundle not found. Run "npm run build" first.');
  process.exit(1);
}

const coreBundle = readFileSync(coreBundlePath, 'utf-8');
const basicMd = readFileSync(resolve(root, 'packages/core/tests/fixtures/basic.md'), 'utf-8');
const questionsMd = readFileSync(resolve(root, 'packages/core/tests/fixtures/with-questions.md'), 'utf-8');
const invalidQtypeMd = readFileSync(resolve(root, 'packages/core/tests/fixtures/invalid-qtype.md'), 'utf-8');
const mermaidMd = readFileSync(resolve(root, 'packages/core/tests/fixtures/with-mermaid.md'), 'utf-8');
const apiSpecMd = readFileSync(resolve(root, 'packages/core/tests/fixtures/api-spec.md'), 'utf-8');

function makeHtml(markdown, title, options = {}) {
  const escapedMd = JSON.stringify(markdown);
  const feedbackMode = options.feedbackMode || 'download';
  const postUrlLine = options.postUrl ? `postUrl: ${JSON.stringify(options.postUrl)},` : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
</head>
<body>
<div id="app"></div>
<script>${coreBundle}</script>
<script>
PlanReview.init({
  container: document.getElementById('app'),
  markdown: ${escapedMd},
  feedbackMode: '${feedbackMode}',
  ${postUrlLine}
}).catch(function(e) { console.error(e); });
</script>
</body>
</html>`;
}

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/basic') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(makeHtml(basicMd, 'Basic Plan'));
    return;
  }

  if (url.pathname === '/questions') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(makeHtml(questionsMd, 'Plan with Questions'));
    return;
  }

  if (url.pathname === '/invalid-qtype') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(makeHtml(invalidQtypeMd, 'Invalid Qtype'));
    return;
  }

  if (url.pathname === '/mermaid') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(makeHtml(mermaidMd, 'Mermaid Diagrams'));
    return;
  }

  if (url.pathname === '/api-spec') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(makeHtml(apiSpecMd, 'API Spec', { feedbackMode: 'vscode' }));
    return;
  }

  if (url.pathname === '/post-feedback') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(makeHtml(questionsMd, 'Post Feedback', { feedbackMode: 'post', postUrl: '/feedback' }));
    return;
  }

  // Echo endpoint for testing feedback POST
  if (req.method === 'POST' && url.pathname === '/feedback') {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: true, contentType: req.headers['content-type'], body }));
    });
    return;
  }

  // Serve static files from root
  const filePath = resolve(root, '.' + url.pathname);
  if (existsSync(filePath)) {
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(readFileSync(filePath));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(4200, () => {
  console.log('Test server listening on http://localhost:4200');
});
