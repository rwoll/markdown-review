import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let cachedFeedback: any = null;

function loadCoreBundle(): string {
  let coreBundle = '// core bundle not found';
  const candidates = [
    path.resolve(__dirname, 'plan-review-core.iife.js'),
    path.resolve(__dirname, '../../core/dist/plan-review-core.iife.js'),
    path.resolve(__dirname, '../../../packages/core/dist/plan-review-core.iife.js'),
  ];
  for (const bundlePath of candidates) {
    try {
      coreBundle = fs.readFileSync(bundlePath, 'utf-8');
      return coreBundle;
    } catch { /* try next */ }
  }
  vscode.window.showErrorMessage('Plan Review: Core bundle not found. Run npm run build first.');
  return coreBundle;
}

function buildWebviewHtml(webview: vscode.Webview, markdown: string, fileName: string, documentUri?: vscode.Uri): string {
  const coreBundle = loadCoreBundle();
  const nonce = getNonce();
  const escapedMarkdown = JSON.stringify(markdown);

  const cspSource = webview.cspSource;
  const baseTag = documentUri
    ? `<base href="${webview.asWebviewUri(vscode.Uri.joinPath(documentUri, '..'))}/"`+ '>'
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; img-src 'self' ${cspSource} https: data:;">
  ${baseTag}
  <title>Plan Review: ${escapeHtml(fileName)}</title>
</head>
<body>
  <div id="app"></div>
  <script nonce="${nonce}">${coreBundle}</script>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    PlanReview.init({
      container: document.getElementById('app'),
      markdown: ${escapedMarkdown},
      fileName: ${JSON.stringify(fileName)},
      feedbackMode: 'vscode',
      onFeedback: function(payload) {
        vscode.postMessage({ type: 'feedback', payload: payload });
      },
    }).catch(function(e) { console.error(e); });
  </script>
</body>
</html>`;
}

function setupMessageListener(
  webview: vscode.Webview,
  context: vscode.ExtensionContext,
) {
  webview.onDidReceiveMessage(
    (message: any) => {
      if (message.type === 'feedback') {
        cachedFeedback = message.payload;
        sendFeedbackToChat(message.payload);
      }
    },
    undefined,
    context.subscriptions,
  );
}

class PlanReviewEditorProvider implements vscode.CustomTextEditorProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(document.uri, '..')],
    };

    const updateWebview = () => {
      const markdown = document.getText();
      const fileName = path.basename(document.uri.fsPath);
      webviewPanel.webview.html = buildWebviewHtml(webviewPanel.webview, markdown, fileName, document.uri);
    };

    updateWebview();
    setupMessageListener(webviewPanel.webview, this.context);

    const changeSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview();
      }
    });

    webviewPanel.onDidDispose(() => {
      changeSubscription.dispose();
      if (cachedFeedback) {
        sendFeedbackToChat(cachedFeedback);
        cachedFeedback = null;
      }
    });
  }
}

export function activate(context: vscode.ExtensionContext) {
  // Register custom editor for .md files
  const provider = new PlanReviewEditorProvider(context);
  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      'planReview.markdownEditor',
      provider,
      { supportsMultipleEditorsPerDocument: false },
    ),
  );

  // Keep the command for manual invocation
  const disposable = vscode.commands.registerCommand('planReview.open', async (uri?: vscode.Uri) => {
    let filePath: string | undefined;

    if (uri) {
      filePath = uri.fsPath;
    } else {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === 'markdown') {
        filePath = editor.document.uri.fsPath;
      } else {
        const files = await vscode.window.showOpenDialog({
          canSelectMany: false,
          filters: { 'Markdown': ['md'] },
        });
        if (files && files.length > 0) {
          filePath = files[0].fsPath;
        }
      }
    }

    if (!filePath) {
      vscode.window.showWarningMessage('No markdown file selected.');
      return;
    }

    const markdown = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const fileUri = vscode.Uri.file(filePath);

    const panel = vscode.window.createWebviewPanel(
      'planReview',
      `Plan Review: ${fileName}`,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(fileUri, '..')],
      },
    );

    panel.webview.html = buildWebviewHtml(panel.webview, markdown, fileName, fileUri);
    setupMessageListener(panel.webview, context);

    panel.onDidDispose(() => {
      if (cachedFeedback) {
        sendFeedbackToChat(cachedFeedback);
        cachedFeedback = null;
      }
    });
  });

  context.subscriptions.push(disposable);
}

async function sendFeedbackToChat(feedback: any) {
  const feedbackMd = typeof feedback === 'string' ? feedback : (feedback.feedbackMarkdown || JSON.stringify(feedback, null, 2));
  try {
    await vscode.commands.executeCommand('workbench.action.chat.open', {
      query: `Here is my feedback on the plan:\n\n${feedbackMd}`,
    });
  } catch {
    const channel = vscode.window.createOutputChannel('Plan Review Feedback');
    channel.appendLine(feedbackMd);
    channel.show();
  }
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function deactivate() {}
