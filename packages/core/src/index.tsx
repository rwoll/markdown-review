import { render } from 'preact';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { extractElements } from './extract-elements.js';
import { initHighlighter } from './highlighter.js';
import {
  elements,
  feedbackMode,
  postUrl,
  onFeedbackCallback,
  onTerminalCallback,
  fileName,
  theme,
  markdownSource,
  resetState,
} from './state.js';
import { App } from './components/App.js';

export type { Element, BaseElement, CodeElement, QuestionElement } from './types.js';
export { extractElements } from './extract-elements.js';
export { highlightCode } from './highlighter.js';
export { resetState } from './state.js';

export interface PlanReviewOptions {
  container: HTMLElement;
  markdown: string;
  fileName?: string;
  feedbackMode?: 'download' | 'post' | 'vscode';
  postUrl?: string;
  onFeedback?: (feedback: unknown) => void;
  onTerminal?: (feedback: unknown) => void;
  showUpload?: boolean;
  /** Visual theme: 'dark' for VS Code Dark 2026 (default), 'light' for VS Code Light 2026 */
  theme?: 'dark' | 'light';
}

export const PlanReview = {
  async init(options: PlanReviewOptions): Promise<void> {
    resetState();
    await initHighlighter();
    const resolvedTheme = options.theme ?? 'dark';
    theme.value = resolvedTheme;
    // Initialize bundled mermaid with the appropriate theme
    mermaid.initialize({ startOnLoad: false, theme: resolvedTheme === 'light' ? 'default' : 'dark' });
    const tree = unified().use(remarkParse).use(remarkGfm).parse(options.markdown);
    elements.value = extractElements(tree);
    markdownSource.value = options.markdown;
    feedbackMode.value = options.feedbackMode ?? 'download';
    if (options.fileName) fileName.value = options.fileName;
    if (options.postUrl) postUrl.value = options.postUrl;
    if (options.onFeedback) onFeedbackCallback.value = options.onFeedback;
    if (options.onTerminal) onTerminalCallback.value = options.onTerminal;
    render(<App />, options.container);
  },
};

// Expose on window for IIFE usage
if (typeof window !== 'undefined') {
  (window as any).PlanReview = PlanReview;
}
