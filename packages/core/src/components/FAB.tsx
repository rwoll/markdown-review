import {
  totalCount,
  panelOpen,
  sheetOpen,
  sheetTarget,
  editingGeneralIdx,
  isDesktop,
} from '../state';

function togglePanel() {
  if (isDesktop()) return;
  panelOpen.value = !panelOpen.value;
}

function openGeneralSheet() {
  sheetTarget.value = null;
  editingGeneralIdx.value = undefined;
  sheetOpen.value = true;
}

export function FAB() {
  const count = totalCount.value;

  return (
    <div class="fab-stack">
      <button class="fab-notes" onClick={togglePanel}>
        ☰
        {count > 0 && <span class="fab-badge">{count}</span>}
      </button>
      <button class="fab-write" onClick={openGeneralSheet}>✎</button>
    </div>
  );
}
