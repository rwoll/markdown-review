import type { Root, Heading, Code, List } from 'mdast';
import { toString } from 'mdast-util-to-string';
import type { Element, CodeElement, QuestionElement } from './types';

export function extractElements(tree: Root): Element[] {
  const elements: Element[] = [];

  for (const child of tree.children) {
    // Lines are 1-indexed in MDAST, 0-indexed in our model
    const lineStart = (child.position?.start?.line ?? 1) - 1;
    const lineEnd = (child.position?.end?.line ?? 1) - 1;

    switch (child.type) {
      case 'heading': {
        const h = child as Heading;
        const type = `h${h.depth}`;
        elements.push({ type, content: toString(h), lineStart, lineEnd });
        break;
      }
      case 'paragraph': {
        elements.push({ type: 'p', content: toString(child), lineStart, lineEnd });
        break;
      }
      case 'code': {
        const c = child as Code;
        const lang = c.lang || '';
        if (lang.startsWith('question:')) {
          const rawQtype = lang.split(':')[1];
          if (rawQtype !== 'open' && rawQtype !== 'choice' && rawQtype !== 'checkbox') {
            elements.push({
              type: 'code',
              lang,
              content: c.value || '',
              lineStart,
              lineEnd,
            } as CodeElement);
            break;
          }
          const qtype = rawQtype as QuestionElement['qtype'];
          const fields: Record<string, string> = {};
          for (const line of (c.value || '').split('\n')) {
            const m = line.match(/^(\w+):\s*(.*)/);
            if (m) fields[m[1]] = m[2].trim();
          }
          const qEl: QuestionElement = {
            type: 'question',
            qtype,
            id: fields['id'] ?? '',
            question: fields['question'] ?? '',
            content: c.value || '',
            lineStart,
            lineEnd,
          };
          if (fields['options']) {
            qEl.options = fields['options'].split('|').map((o) => o.trim());
          }
          elements.push(qEl);
        } else {
          elements.push({
            type: 'code',
            lang,
            content: c.value || '',
            lineStart,
            lineEnd,
          } as CodeElement);
        }
        break;
      }
      case 'list': {
        const list = child as List;
        for (const item of list.children) {
          const itemLineStart = (item.position?.start?.line ?? 1) - 1;
          const itemLineEnd = (item.position?.end?.line ?? 1) - 1;
          const type = list.ordered ? 'ol' : 'li';
          elements.push({ type, content: toString(item), lineStart: itemLineStart, lineEnd: itemLineEnd });
        }
        break;
      }
      case 'blockquote': {
        elements.push({ type: 'quote', content: toString(child), lineStart, lineEnd });
        break;
      }
      case 'table': {
        elements.push({ type: 'table', content: toString(child), lineStart, lineEnd });
        break;
      }
      case 'thematicBreak': {
        elements.push({ type: 'hr', content: '', lineStart, lineEnd });
        break;
      }
      default:
        // Other node types (html, definition, etc.) treated as paragraphs
        elements.push({ type: 'p', content: toString(child), lineStart, lineEnd });
        break;
    }
  }

  return elements;
}
