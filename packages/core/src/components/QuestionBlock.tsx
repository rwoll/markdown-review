import { useRef, useState } from 'preact/hooks';
import {
  elements,
  questionAnswers,
  dismissed,
  editing,
  showToast,
  type QuestionAnswer,
} from '../state';
import type { QuestionElement } from '../types';

function scrollToNextQuestion(justAnsweredId: string) {
  const next = elements.value.find(
    (e) => e.type === 'question' && !dismissed.value[(e as QuestionElement).id] && !questionAnswers.value[(e as QuestionElement).id] && (e as QuestionElement).id !== justAnsweredId
  );
  if (!next) return;
  setTimeout(() => {
    const qBlocks = document.querySelectorAll('.q-block.unanswered');
    if (qBlocks.length) qBlocks[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

function dismissQ(id: string) {
  dismissed.value = { ...dismissed.value, [id]: true };
}

function editQ(id: string) {
  editing.value = { ...editing.value, [id]: true };
}

function toggleOption(id: string, qtype: string, optIdx: number, isOther: boolean, options: string[]) {
  const opts = [...options, 'Other'];
  const opt = opts[optIdx];
  const prev = questionAnswers.value[id] || {};
  const ans: QuestionAnswer = { ...prev, _draft: true };

  if (qtype === 'choice') {
    if (isOther) { ans.choice = undefined; ans.showOther = true; }
    else { ans.choice = opt; ans.showOther = false; ans.otherText = ''; }
  } else {
    if (!ans.checked) ans.checked = [];
    else ans.checked = [...ans.checked];
    if (isOther) {
      ans.showOther = !ans.showOther;
      if (!ans.showOther) ans.otherText = '';
    } else {
      const idx = ans.checked.indexOf(opt);
      if (idx >= 0) ans.checked.splice(idx, 1);
      else ans.checked.push(opt);
    }
  }
  questionAnswers.value = { ...questionAnswers.value, [id]: ans };
}

function submitOpen(id: string, text: string) {
  if (!text.trim()) return;
  questionAnswers.value = { ...questionAnswers.value, [id]: { text: text.trim() } };
  const { [id]: _, ...rest } = editing.value;
  editing.value = rest;
  showToast('Answer saved ✓');
  scrollToNextQuestion(id);
}

function submitOptions(id: string, qtype: string, otherText?: string) {
  const ans = questionAnswers.value[id];
  if (!ans) return;
  const updated: QuestionAnswer = { ...ans };
  if (otherText !== undefined) updated.otherText = otherText;
  delete updated._draft;

  if (qtype === 'choice' && !updated.choice && !(updated.showOther && (updated.otherText || '').trim())) return;
  if (qtype === 'checkbox' && (updated.checked || []).length === 0 && !(updated.showOther && (updated.otherText || '').trim())) return;
  if (updated.showOther && !updated.choice) updated.choice = 'Other';

  questionAnswers.value = { ...questionAnswers.value, [id]: updated };
  const { [id]: _, ...rest } = editing.value;
  editing.value = rest;
  showToast('Answer saved ✓');
  scrollToNextQuestion(id);
}

// Sub-component for question input
function QuestionInput({ el }: { el: QuestionElement }) {
  const ans = questionAnswers.value[el.id] || {};
  const taRef = useRef<HTMLTextAreaElement>(null);
  const otherRef = useRef<HTMLInputElement>(null);
  const [openActive, setOpenActive] = useState(false);

  if (el.qtype === 'open') {
    const defaultVal = ans.text || '';
    return (
      <div>
        <textarea
          class="q-textarea"
          rows={3}
          ref={taRef}
          placeholder="Type your answer…"
          defaultValue={defaultVal}
          onInput={() => {
            if (taRef.current) {
              setOpenActive(taRef.current.value.trim().length > 0);
            }
          }}
        />
        <button
          class={`q-submit ${openActive || defaultVal.trim().length > 0 ? 'active' : 'inactive'}`}
          onClick={() => submitOpen(el.id, taRef.current?.value || '')}
        >
          Submit
        </button>
        <div style={{ clear: 'both' }}></div>
      </div>
    );
  }

  // Choice or checkbox
  const opts = [...(el.options || []), 'Other'];
  const isChoice = el.qtype === 'choice';
  const canSubmit = isChoice
    ? (ans.choice || (ans.showOther && (ans.otherText || '').trim()))
    : ((ans.checked || []).length > 0 || (ans.showOther && (ans.otherText || '').trim()));

  return (
    <div>
      {opts.map((opt, oi) => {
        const isOther = opt === 'Other';
        let selected = false;
        if (isChoice) selected = ans.choice === opt || (isOther && !!ans.showOther);
        else selected = (ans.checked || []).includes(opt) || (isOther && !!ans.showOther);

        return (
          <div key={oi}>
            <div
              class={`q-option ${selected ? 'selected' : ''}`}
              onClick={() => toggleOption(el.id, el.qtype, oi, isOther, el.options || [])}
            >
              {isChoice ? (
                <div class="q-radio"><div class="q-radio-inner"></div></div>
              ) : (
                <div class="q-check">{selected ? '✓' : ''}</div>
              )}
              <span>{opt}</span>
            </div>
            {isOther && selected && (
              <input
                class="q-other-input"
                ref={otherRef}
                placeholder="Specify…"
                value={ans.otherText || ''}
                onClick={(e: Event) => e.stopPropagation()}
                onInput={() => {
                  if (otherRef.current) {
                    const text = otherRef.current.value;
                    questionAnswers.value = {
                      ...questionAnswers.value,
                      [el.id]: { ...questionAnswers.value[el.id], otherText: text },
                    };
                  }
                }}
              />
            )}
          </div>
        );
      })}
      <button
        class={`q-submit ${canSubmit ? 'active' : 'inactive'}`}
        onClick={() => submitOptions(el.id, el.qtype, otherRef.current?.value)}
      >
        Submit
      </button>
      <div style={{ clear: 'both' }}></div>
    </div>
  );
}

interface QuestionBlockProps {
  el: QuestionElement;
  index: number;
}

export function QuestionBlock({ el }: QuestionBlockProps) {
  const ans = questionAnswers.value[el.id];
  const isAnswered = !!ans && !ans._draft && !editing.value[el.id];
  const cls = isAnswered ? 'answered' : 'unanswered';
  const icon = el.qtype === 'open' ? 'Q' : el.qtype === 'choice' ? '◉' : '☑';

  let summary = '';
  if (isAnswered) {
    if (el.qtype === 'open') summary = ans.text || '';
    else if (el.qtype === 'choice') summary = (ans.choice || '') + (ans.otherText ? ' — ' + ans.otherText : '');
    else {
      const parts = [...(ans.checked || [])];
      if (ans.otherText) parts.push('Other: ' + ans.otherText);
      summary = parts.join(', ');
    }
  }

  return (
    <div
      class={`q-block ${cls}`}
      style={isAnswered ? { cursor: 'pointer' } : undefined}
      onClick={isAnswered ? () => editQ(el.id) : undefined}
    >
      <div class="q-header">
        <span class="q-icon">{icon}</span>
        <span class="q-text">{el.question}</span>
        {!isAnswered && (
          <button class="q-dismiss" onClick={(e: Event) => { e.stopPropagation(); dismissQ(el.id); }}>×</button>
        )}
      </div>
      {isAnswered ? (
        <div class="q-answer-row">
          <span class="q-answer-text">{summary}</span>
          <span class="q-edit-btn">Edit</span>
        </div>
      ) : (
        <div class="q-body">
          <QuestionInput el={el} />
        </div>
      )}
    </div>
  );
}
