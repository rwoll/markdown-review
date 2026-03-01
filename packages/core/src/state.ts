import { signal, computed } from '@preact/signals';
import type { Element, QuestionElement } from './types';

// Types
export interface QuestionAnswer {
  text?: string;
  choice?: string;
  checked?: string[];
  showOther?: boolean;
  otherText?: string;
  _draft?: boolean;
}

export interface Annotation {
  note: string;
  time: number;
}

export interface GeneralNote {
  note: string;
  time: number;
}

// State signals
export const markdownSource = signal('');
export const elements = signal<Element[]>([]);
export const annotations = signal<Record<number, Annotation>>({});
export const generalNotes = signal<GeneralNote[]>([]);
export const questionAnswers = signal<Record<string, QuestionAnswer>>({});
export const dismissed = signal<Record<string, boolean>>({});
export const editing = signal<Record<string, boolean>>({});

// Config
export const feedbackMode = signal<'download' | 'post' | 'vscode'>('download');
export const postUrl = signal<string>('');
export const onFeedbackCallback = signal<((feedback: unknown) => void) | null>(null);
export const fileName = signal<string>('PLAN.md');

// Sheet state
export const sheetOpen = signal(false);
export const sheetTarget = signal<number | null>(null); // null = general
export const editingGeneralIdx = signal<number | undefined>(undefined);

// Panel state (for mobile)
export const panelOpen = signal(false);

// Outline state (for mobile/tablet)
export const outlineOpen = signal(false);

// Toast
export const toastMessage = signal('');
export const toastVisible = signal(false);

// Computed
export const questionEls = computed(() =>
  elements.value.filter(
    (e): e is QuestionElement => e.type === 'question' && !dismissed.value[(e as QuestionElement).id]
  )
);

export const answeredCount = computed(() =>
  questionEls.value.filter((q) => {
    const ans = questionAnswers.value[q.id];
    return ans && !ans._draft;
  }).length
);

export const noteCount = computed(() =>
  Object.keys(annotations.value).length + generalNotes.value.length
);

export const totalCount = computed(() => noteCount.value + answeredCount.value);

// Layout breakpoint
export const DESKTOP_BREAKPOINT = 800;

// Helper functions
export function showToast(msg: string) {
  toastMessage.value = msg;
  toastVisible.value = true;
  setTimeout(() => {
    toastVisible.value = false;
  }, 2000);
}

export function isDesktop(): boolean {
  return typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT;
}

export function resetState() {
  markdownSource.value = '';
  annotations.value = {};
  generalNotes.value = [];
  questionAnswers.value = {};
  dismissed.value = {};
  editing.value = {};
  sheetOpen.value = false;
  sheetTarget.value = null;
  editingGeneralIdx.value = undefined;
  panelOpen.value = false;
  outlineOpen.value = false;
  fileName.value = 'PLAN.md';
}
