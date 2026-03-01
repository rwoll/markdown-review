import { useRef, useEffect } from 'preact/hooks';
import {
  sheetOpen,
  sheetTarget,
  editingGeneralIdx,
  annotations,
  generalNotes,
  elements,
  isDesktop,
  showToast,
} from '../state';
import type { CodeElement } from '../types';

function closeSheet() {
  sheetOpen.value = false;
}

function submitSheet(text: string) {
  if (!text.trim()) return;
  const note = text.trim();
  const time = Date.now();
  const target = sheetTarget.value;
  const genIdx = editingGeneralIdx.value;
  const isEdit = target !== null && !!annotations.value[target];
  const isGenEdit = genIdx !== undefined;

  if (target !== null) {
    annotations.value = { ...annotations.value, [target]: { note, time } };
  } else if (isGenEdit) {
    const updated = [...generalNotes.value];
    updated[genIdx] = { note, time };
    generalNotes.value = updated;
    editingGeneralIdx.value = undefined;
  } else {
    generalNotes.value = [...generalNotes.value, { note, time }];
  }
  closeSheet();
  showToast(isEdit || isGenEdit ? 'Comment updated ✓' : 'Comment added ✓');

  // Flash the annotated block
  if (target !== null) {
    setTimeout(() => {
      const dom = document.getElementById(`el-${target}`);
      if (dom) {
        dom.classList.add('block-flash');
        setTimeout(() => dom.classList.remove('block-flash'), 900);
      }
    }, 50);
  }
}

export function Sheet() {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const open = sheetOpen.value;
  const target = sheetTarget.value;

  // Compute context text
  let ctxText = '';
  let showCtx = false;
  if (target !== null) {
    const el = elements.value[target];
    if (el) {
      showCtx = true;
      if (el.type === 'code') {
        const codeEl = el as CodeElement;
        ctxText = codeEl.lang + ' code block (L' + el.lineStart + '–L' + el.lineEnd + ')';
      } else {
        ctxText = el.content.slice(0, 120);
      }
    }
  }

  // Pre-fill textarea value
  let initialValue = '';
  if (target !== null) {
    initialValue = annotations.value[target]?.note || '';
  } else if (editingGeneralIdx.value !== undefined) {
    initialValue = generalNotes.value[editingGeneralIdx.value]?.note || '';
  }

  const placeholder = target !== null ? 'Comment on this section…' : 'General feedback on this plan…';
  const hint = isDesktop() ? 'Enter to send · Shift+Enter for newline' : '⌘+Enter to send';

  // Focus textarea when sheet opens
  useEffect(() => {
    if (open && taRef.current) {
      taRef.current.value = initialValue;
      setTimeout(() => taRef.current?.focus(), 280);
    }
  }, [open, target, editingGeneralIdx.value]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isDesktop() && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        submitSheet(taRef.current?.value || '');
      } else if ((e.metaKey || e.ctrlKey) && !isDesktop()) {
        submitSheet(taRef.current?.value || '');
      }
    }
  };

  return (
    <div>
      <div class={`overlay ${open ? 'open' : ''}`} onClick={closeSheet}></div>
      <div class={`sheet ${open ? 'open' : ''}`}>
        <div class="sheet-handle"></div>
        {showCtx && <div class="sheet-ctx">{ctxText}</div>}
        <textarea
          ref={taRef}
          rows={4}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
        <button
          class="sheet-send active"
          onClick={() => submitSheet(taRef.current?.value || '')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
        </button>
        <div style={{ clear: 'both' }}></div>
        <div class="sheet-hint">{hint}</div>
      </div>
    </div>
  );
}
