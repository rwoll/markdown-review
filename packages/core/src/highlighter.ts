import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import themeDarkPlus from 'shiki/themes/dark-plus.mjs';
import themeLightPlus from 'shiki/themes/light-plus.mjs';
import langTypescript from 'shiki/langs/typescript.mjs';
import langPython from 'shiki/langs/python.mjs';
import langJavascript from 'shiki/langs/javascript.mjs';
import langJson from 'shiki/langs/json.mjs';
import langBash from 'shiki/langs/bash.mjs';
import langHtml from 'shiki/langs/html.mjs';
import langCss from 'shiki/langs/css.mjs';

let highlighter: HighlighterCore | null = null;

const DARK_THEME = 'dark-plus';
const LIGHT_THEME = 'light-plus';

export async function initHighlighter(): Promise<void> {
  highlighter = await createHighlighterCore({
    themes: [themeDarkPlus, themeLightPlus],
    langs: [langTypescript, langPython, langJavascript, langJson, langBash, langHtml, langCss],
    engine: createJavaScriptRegexEngine(),
  });
}

export function highlightCode(code: string, lang: string, theme: 'dark' | 'light' = 'dark'): string | null {
  if (!highlighter) {
    return null;
  }

  const loadedLangs = highlighter.getLoadedLanguages();
  const effectiveLang = loadedLangs.includes(lang) ? lang : 'text';

  return highlighter.codeToHtml(code, {
    lang: effectiveLang,
    theme: theme === 'light' ? LIGHT_THEME : DARK_THEME,
  });
}
