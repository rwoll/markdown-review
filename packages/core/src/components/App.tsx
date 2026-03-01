import { useEffect, useRef } from 'preact/hooks';
import { signal } from '@preact/signals';
import {
  elements,
  dismissed,
  sheetOpen,
  sheetTarget,
  editingGeneralIdx,
  outlineOpen,
  panelOpen,
  isDesktop,
  questionEls,
  answeredCount,
  markdownSource,
} from '../state';
import { CSS } from '../styles';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Sheet } from './Sheet';
import { NotesPanel } from './NotesPanel';
import { Outline } from './Outline';
import { FAB } from './FAB';
import { Toast } from './Toast';
import { ScrollProgress } from './ScrollProgress';

// Local signals for scroll-derived state
const scrollProgress = signal(0);
const activeHeadingIdx = signal(0);

export function App() {
  const docRef = useRef<HTMLDivElement>(null);
  const els = elements.value;
  const qEls = questionEls.value;
  const answered = answeredCount.value;

  // Scroll-spy + progress bar
  useEffect(() => {
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        // Progress bar
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const pct = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0;
        scrollProgress.value = pct;

        // Outline spy
        const headings = els
          .map((el, i) => ({ el, i }))
          .filter(({ el }) => el.type === 'h1' || el.type === 'h2' || el.type === 'h3');
        let active = 0;
        for (let j = 0; j < headings.length; j++) {
          const dom = document.getElementById('el-' + headings[j].i);
          if (dom && dom.getBoundingClientRect().top <= 100) active = j;
        }
        activeHeadingIdx.value = active;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [els]);

  // Keyboard events
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Escape closes overlays
      if (e.key === 'Escape') {
        if (sheetOpen.value) { sheetOpen.value = false; return; }
        if (outlineOpen.value) { outlineOpen.value = false; return; }
        if (panelOpen.value) { panelOpen.value = false; return; }
        return;
      }

      // Type-to-comment: ignore if in input, sheet open, or modifier keys
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return;
      if (sheetOpen.value) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Tab' || e.key.startsWith('Arrow') || e.key === 'Shift') return;

      // Single printable character triggers general comment sheet
      if (e.key.length === 1) {
        sheetTarget.value = null;
        editingGeneralIdx.value = undefined;
        sheetOpen.value = true;
        // The sheet's textarea will auto-focus; queue the character
        setTimeout(() => {
          const ta = document.querySelector('.sheet textarea') as HTMLTextAreaElement | null;
          if (ta) {
            ta.value = e.key;
          }
        }, 300);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Responsive: close mobile panel on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (isDesktop()) {
        panelOpen.value = false;
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Nudge bar
  const showNudge = qEls.length > 0;
  const nudgePct = qEls.length > 0 ? Math.round((answered / qEls.length) * 100) : 0;
  const allAnswered = qEls.length > 0 && answered === qEls.length;

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <ScrollProgress progress={scrollProgress.value} />
      <Outline activeHeadingIdx={activeHeadingIdx.value} />

      <div class="doc" ref={docRef}>
        <MarkdownRenderer markdown={markdownSource.value} />

        {showNudge && (
          <div class="nudge">
            {allAnswered
              ? '✓ All questions answered'
              : `${answered} of ${qEls.length} questions answered`}
            <div class="nudge-bar">
              <div class="nudge-bar-fill" style={{ width: nudgePct + '%' }}></div>
            </div>
          </div>
        )}
      </div>

      <FAB />
      <Sheet />
      <NotesPanel />
      <Toast />
    </div>
  );
}
