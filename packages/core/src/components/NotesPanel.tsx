import {
  elements,
  annotations,
  generalNotes,
  questionAnswers,
  dismissed,
  editing,
  panelOpen,
  sheetTarget,
  sheetOpen,
  editingGeneralIdx,
  questionEls,
  feedbackMode,
  postUrl,
  onFeedbackCallback,
  fileName,
  showToast,
  isDesktop,
} from '../state';
import type { QuestionElement, CodeElement } from '../types';

const CopilotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M7.998 15.035c-4.562 0-7.873-2.914-7.998-3.749V9.338c.085-.628.677-1.686 1.588-2.065.013-.07.024-.143.036-.218.029-.183.06-.384.126-.612-.201-.508-.254-1.084-.254-1.656 0-.87.128-1.769.693-2.484.579-.733 1.494-1.124 2.724-1.261 1.206-.134 2.262.034 2.944.765.05.053.096.108.139.165.044-.057.094-.112.143-.165.682-.731 1.738-.899 2.944-.765 1.23.137 2.145.528 2.724 1.261.566.715.693 1.614.693 2.484 0 .572-.053 1.148-.254 1.656.066.228.098.429.126.612.012.076.024.148.037.218.924.385 1.522 1.471 1.591 2.095v1.872c0 .766-3.351 3.795-8.002 3.795Zm0-1.485c2.28 0 4.584-1.11 5.002-1.433V7.862l-.023-.116c-.49.21-1.075.291-1.727.291-1.146 0-2.059-.327-2.71-.991A3.222 3.222 0 0 1 8 6.303a3.24 3.24 0 0 1-.544.743c-.65.664-1.563.991-2.71.991-.652 0-1.236-.081-1.727-.291l-.023.116v4.255c.419.323 2.722 1.433 5.002 1.433ZM6.762 2.83c-.193-.206-.637-.413-1.682-.297-1.019.113-1.479.404-1.713.7-.247.312-.369.789-.369 1.554 0 .793.129 1.171.308 1.371.162.181.519.379 1.442.379.853 0 1.339-.235 1.638-.54.315-.322.527-.827.617-1.553.117-.935-.037-1.395-.241-1.614Zm4.155-.297c-1.044-.116-1.488.091-1.681.297-.204.219-.359.679-.242 1.614.091.726.303 1.231.618 1.553.299.305.784.54 1.638.54.922 0 1.28-.198 1.442-.379.179-.2.308-.578.308-1.371 0-.765-.123-1.242-.37-1.554-.233-.296-.693-.587-1.713-.7Z" />
    <path d="M6.25 9.037a.75.75 0 0 1 .75.75v1.501a.75.75 0 0 1-1.5 0V9.787a.75.75 0 0 1 .75-.75Zm4.25.75v1.501a.75.75 0 0 1-1.5 0V9.787a.75.75 0 0 1 1.5 0Z" />
  </svg>
);

function togglePanel() {
  if (isDesktop()) return;
  panelOpen.value = !panelOpen.value;
}

function deleteAnswer(id: string) {
  const { [id]: _, ...rest } = questionAnswers.value;
  questionAnswers.value = rest;
  showToast('Answer removed');
}

function deleteAnnotation(idx: number) {
  const { [idx]: _, ...rest } = annotations.value;
  annotations.value = rest;
  showToast('Comment removed');
}

function deleteGeneralNote(idx: number) {
  const updated = [...generalNotes.value];
  updated.splice(idx, 1);
  generalNotes.value = updated;
  showToast('Note removed');
}

function editQFromPanel(id: string) {
  editing.value = { ...editing.value, [id]: true };
  setTimeout(() => {
    const qBlocks = document.querySelectorAll('.q-block');
    for (const qb of qBlocks) {
      if (qb.innerHTML.includes(id)) {
        qb.scrollIntoView({ behavior: 'smooth', block: 'center' });
        qb.classList.add('block-flash');
        setTimeout(() => qb.classList.remove('block-flash'), 900);
        break;
      }
    }
  }, 50);
}

function editAnnotation(idx: number) {
  sheetTarget.value = idx;
  editingGeneralIdx.value = undefined;
  sheetOpen.value = true;
}

function editGeneralNote(idx: number) {
  sheetTarget.value = null;
  editingGeneralIdx.value = idx;
  sheetOpen.value = true;
}

function buildFeedbackMarkdown(): string {
  const qEls = questionEls.value;
  const answeredCt = qEls.filter((q) => questionAnswers.value[q.id]).length;
  const annCount = Object.keys(annotations.value).length;

  let md = `# Feedback: ${fileName.value}\n\n`;
  md += `- **File:** \`${fileName.value}\`\n`;
  md += `- **Generated:** ${new Date().toISOString()}\n`;
  md += `- **Questions answered:** ${answeredCt} / ${qEls.length}\n`;
  md += `- **Inline comments:** ${annCount}\n`;
  md += `- **General notes:** ${generalNotes.value.length}\n\n---\n\n`;

  if (qEls.length) {
    md += `## Question Responses\n\n`;
    qEls.forEach((el) => {
      md += `### ${el.question}\n\`\`\`\nfile:  ${fileName.value}\nlines: L${el.lineStart}-L${el.lineEnd}\ntype:  question:${el.qtype}\nid:    ${el.id}\n\`\`\`\n`;
      const ans = questionAnswers.value[el.id];
      if (!ans) { md += `*No answer provided*\n\n`; return; }
      if (el.qtype === 'open') md += `**Answer:**\n\n${ans.text}\n\n`;
      else if (el.qtype === 'choice') {
        md += `**Selection:**\n\n- ${ans.choice}`;
        if (ans.otherText) md += `: ${ans.otherText}`;
        md += `\n\n`;
      } else {
        md += `**Selection:**\n\n`;
        (ans.checked || []).forEach((c) => { md += `- ${c}\n`; });
        if (ans.otherText) md += `- Other: ${ans.otherText}\n`;
        md += `\n`;
      }
    });
    md += `---\n\n`;
  }

  if (generalNotes.value.length) {
    md += `## General Feedback\n\n`;
    generalNotes.value.forEach((g, i) => {
      md += `### [General ${i + 1}]\n\n${g.note}\n\n`;
    });
    md += `---\n\n`;
  }

  if (annCount) {
    md += `## Inline Annotations\n\n`;
    Object.keys(annotations.value).map(Number).sort((a, b) => a - b).forEach((idx) => {
      const el = elements.value[idx];
      const ann = annotations.value[idx];
      md += `### ${fileName.value}:L${el.lineStart}-L${el.lineEnd}\n\`\`\`\nfile:  ${fileName.value}\nlines: L${el.lineStart}-L${el.lineEnd}\ntype:  ${el.type}${(el as CodeElement).lang ? ' (' + (el as CodeElement).lang + ')' : ''}\n\`\`\`\n`;
      if (el.type === 'code') {
        const codeEl = el as CodeElement;
        md += `**Snippet**\n\`\`\`${codeEl.lang || ''}\n${codeEl.content.split('\n').slice(0, 3).join('\n')}\n\`\`\`\n\n`;
      }
      md += `**Comment**\n\n${ann.note}\n\n`;
    });
  }

  return md;
}

function downloadFeedback() {
  const md = buildFeedbackMarkdown();
  const mode = feedbackMode.value;

  if (mode === 'post') {
    const url = postUrl.value;
    if (url) {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackMarkdown: md }),
      }).then(() => showToast('Feedback posted ✓')).catch(() => showToast('Post failed'));
    }
    return;
  }

  if (mode === 'vscode') {
    const cb = onFeedbackCallback.value;
    if (cb) cb(md);
    return;
  }

  // Default: download
  const blob = new Blob([md], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${fileName.value.replace(/\.md$/i, '')}-feedback.md`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function getAnswerSummary(el: QuestionElement): string {
  const ans = questionAnswers.value[el.id];
  if (!ans) return '';
  if (el.qtype === 'open') return ans.text || '';
  if (el.qtype === 'choice') return (ans.choice || '') + (ans.otherText ? ' — ' + ans.otherText : '');
  const parts = [...(ans.checked || [])];
  if (ans.otherText) parts.push('Other: ' + ans.otherText);
  return parts.join(', ');
}

export function NotesPanel() {
  const open = panelOpen.value;
  const answeredQs = elements.value.filter(
    (e) => {
      if (e.type !== 'question') return false;
      const qe = e as QuestionElement;
      const ans = questionAnswers.value[qe.id];
      return ans && !ans._draft && !dismissed.value[qe.id];
    }
  ) as QuestionElement[];
  const annKeys = Object.keys(annotations.value).map(Number).sort((a, b) => annotations.value[b].time - annotations.value[a].time);
  const gNotes = [...generalNotes.value].reverse();

  const hasContent = answeredQs.length > 0 || annKeys.length > 0 || gNotes.length > 0;

  // Merge comments for display sorted by time desc
  type CommentItem = { kind: 'ann'; idx: number; note: string; time: number } | { kind: 'gen'; idx: number; note: string; time: number };
  const commentItems: CommentItem[] = [];
  annKeys.forEach((k) => { commentItems.push({ kind: 'ann', idx: k, ...annotations.value[k] }); });
  gNotes.forEach((g, i) => { commentItems.push({ kind: 'gen', idx: generalNotes.value.length - 1 - i, ...g }); });
  commentItems.sort((a, b) => b.time - a.time);

  return (
    <div>
      <div
        class={`panel-overlay ${open ? 'open' : ''}`}
        onClick={togglePanel}
      ></div>
      <div class={`panel ${open ? 'open' : ''}`}>
        <div class="panel-head">
          <span class="panel-title">Notes & Answers</span>
          <div class="panel-actions">
            <button class={`panel-export${feedbackMode.value === 'vscode' ? (hasContent ? ' copilot-active' : ' copilot-dim') : ''}`} onClick={downloadFeedback}>{feedbackMode.value === 'vscode' ? <><CopilotIcon /> Send to Copilot</> : '↓ Export'}</button>
            <button class="panel-close" onClick={togglePanel}>×</button>
          </div>
        </div>

        {!hasContent ? (
          <div class="panel-empty">
            No notes or answers yet.<br />
            Tap any section to comment, or answer the embedded questions.
          </div>
        ) : (
          <div>
            {answeredQs.length > 0 && (
              <div class="panel-section">
                <div class="panel-label">Questions</div>
                {answeredQs.map((el) => (
                  <div
                    key={el.id}
                    class="panel-q-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => editQFromPanel(el.id)}
                  >
                    <button
                      class="panel-delete"
                      onClick={(e: Event) => { e.stopPropagation(); deleteAnswer(el.id); }}
                    >×</button>
                    <div class="panel-q-question">{el.question}</div>
                    <div class="panel-q-answer">{getAnswerSummary(el)}</div>
                  </div>
                ))}
              </div>
            )}

            {commentItems.length > 0 && (
              <div class="panel-section">
                <div class="panel-label">Comments</div>
                {commentItems.map((it, i) => {
                  if (it.kind === 'ann') {
                    const el = elements.value[it.idx];
                    const ctx = el.type === 'code'
                      ? (el as CodeElement).lang + ' (L' + el.lineStart + '-L' + el.lineEnd + ')'
                      : el.content.slice(0, 80);
                    return (
                      <div
                        key={`ann-${it.idx}-${i}`}
                        class="panel-c-item"
                        style={{ cursor: 'pointer' }}
                        onClick={() => editAnnotation(it.idx)}
                      >
                        <button
                          class="panel-delete"
                          onClick={(e: Event) => { e.stopPropagation(); deleteAnnotation(it.idx); }}
                        >×</button>
                        <div class="panel-c-ctx">{ctx}</div>
                        <div class="panel-c-note">{it.note}</div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={`gen-${it.idx}-${i}`}
                      class="panel-c-item"
                      style={{ cursor: 'pointer' }}
                      onClick={() => editGeneralNote(it.idx)}
                    >
                      <button
                        class="panel-delete"
                        onClick={(e: Event) => { e.stopPropagation(); deleteGeneralNote(it.idx); }}
                      >×</button>
                      <div class="panel-c-label">GENERAL</div>
                      <div class="panel-c-note">{it.note}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {hasContent && (
          <div class="panel-footer">
            <button class={`panel-dl${feedbackMode.value === 'vscode' ? ' copilot-active' : ''}`} onClick={downloadFeedback}>{feedbackMode.value === 'vscode' ? <><CopilotIcon /> Send to Copilot</> : `↓ Download ${fileName.value.replace(/\.md$/i, '')}-feedback.md`}</button>
            <div class="panel-dl-cap">Markdown · questions, snippets & comments</div>
          </div>
        )}
      </div>
    </div>
  );
}
