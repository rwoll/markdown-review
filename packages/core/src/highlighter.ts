import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import themeDarker from 'shiki/themes/material-theme-darker.mjs';
import langTypescript from 'shiki/langs/typescript.mjs';
import langPython from 'shiki/langs/python.mjs';
import langJavascript from 'shiki/langs/javascript.mjs';
import langJson from 'shiki/langs/json.mjs';
import langBash from 'shiki/langs/bash.mjs';
import langHtml from 'shiki/langs/html.mjs';
import langCss from 'shiki/langs/css.mjs';

let highlighter: HighlighterCore | null = null;

const THEME = 'material-theme-darker';

export async function initHighlighter(): Promise<void> {
  highlighter = await createHighlighterCore({
    themes: [themeDarker],
    langs: [langTypescript, langPython, langJavascript, langJson, langBash, langHtml, langCss],
    engine: createJavaScriptRegexEngine(),
  });
}

export function highlightCode(code: string, lang: string): string | null {
  if (!highlighter) {
    return null;
  }

  const loadedLangs = highlighter.getLoadedLanguages();
  const effectiveLang = loadedLangs.includes(lang) ? lang : 'text';

  return highlighter.codeToHtml(code, {
    lang: effectiveLang,
    theme: THEME,
  });
}
