import { elements, outlineOpen } from '../state';

function toggleOutline() {
  outlineOpen.value = !outlineOpen.value;
}

function scrollToEl(i: number) {
  const target = document.getElementById('el-' + i);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Close outline on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 1100) {
    outlineOpen.value = false;
  }
}

interface OutlineProps {
  activeHeadingIdx: number;
}

export function Outline({ activeHeadingIdx }: OutlineProps) {
  const open = outlineOpen.value;
  const headings = elements.value
    .map((el, i) => ({ el, i }))
    .filter(({ el }) => el.type === 'h1' || el.type === 'h2' || el.type === 'h3');

  return (
    <div>
      <button class="outline-toggle" onClick={toggleOutline}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M4 6h16M4 12h10M4 18h14" />
        </svg>
      </button>
      <div
        class={`outline-overlay ${open ? 'open' : ''}`}
        onClick={toggleOutline}
      ></div>
      <div class={`outline ${open ? 'open' : ''}`}>
        {headings.map(({ el, i }, j) => (
          <a
            key={i}
            class={`outline-item level-${el.type} ${j === activeHeadingIdx ? 'active' : ''}`}
            onClick={() => scrollToEl(i)}
          >
            {el.content}
          </a>
        ))}
      </div>
    </div>
  );
}
