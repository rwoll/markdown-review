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
  fileName,
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
  showUpload?: boolean;
}

export const PlanReview = {
  async init(options: PlanReviewOptions): Promise<void> {
    resetState();
    await initHighlighter();
    // Initialize bundled mermaid
    mermaid.initialize({ startOnLoad: false, theme: 'dark' });
    const tree = unified().use(remarkParse).use(remarkGfm).parse(options.markdown);
    elements.value = extractElements(tree);
    markdownSource.value = options.markdown;
    feedbackMode.value = options.feedbackMode ?? 'download';
    if (options.fileName) fileName.value = options.fileName;
    if (options.postUrl) postUrl.value = options.postUrl;
    if (options.onFeedback) onFeedbackCallback.value = options.onFeedback;
    render(<App />, options.container);
  },
};

// Expose on window for IIFE usage
if (typeof window !== 'undefined') {
  (window as any).PlanReview = PlanReview;
}
