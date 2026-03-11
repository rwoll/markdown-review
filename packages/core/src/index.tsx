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
  themeMode,
} from './state.js';
import { App } from './components/App.js';

export type { Element, BaseElement, CodeElement, QuestionElement } from './types.js';
export type { ThemeMode } from './state.js';
export { extractElements } from './extract-elements.js';
export { highlightCode } from './highlighter.js';
export { resetState } from './state.js';
export { CSS_VARS } from './styles.js';

export interface PlanReviewOptions {
  container: HTMLElement;
  markdown: string;
  fileName?: string;
  feedbackMode?: 'download' | 'post' | 'vscode';
  postUrl?: string;
  onFeedback?: (feedback: unknown) => void;
  showUpload?: boolean;
  /** 'system' = follow OS prefers-color-scheme; 'light'/'dark' = forced */
  themeMode?: 'system' | 'light' | 'dark';
}

/** Resolve effective light/dark given themeMode */
function isLightTheme(mode: 'system' | 'light' | 'dark'): boolean {
  if (mode === 'light') return true;
  if (mode === 'dark') return false;
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-color-scheme: light)').matches;
}

export const PlanReview = {
  async init(options: PlanReviewOptions): Promise<void> {
    resetState();
    await initHighlighter();

    const mode = options.themeMode ?? 'system';
    themeMode.value = mode;

    // Initialize bundled mermaid with resolved theme
    mermaid.initialize({ startOnLoad: false, theme: isLightTheme(mode) ? 'default' : 'dark' });

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
