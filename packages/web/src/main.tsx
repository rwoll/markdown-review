import { h, render } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { PlanReview, CSS_VARS } from '@plan-review/core';
import { Upload, UploadResult } from './Upload';

// Inject theme variables immediately so Upload screen can use them
const _style = document.createElement('style');
_style.textContent = CSS_VARS;
document.head.appendChild(_style);

function App() {
  const [file, setFile] = useState<UploadResult | null>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (file && reviewRef.current) {
      reviewRef.current.innerHTML = '';
      PlanReview.init({
        container: reviewRef.current,
        markdown: file.content,
        fileName: file.name,
        feedbackMode: 'download',
      });
    }
  }, [file]);

  if (!file) return <Upload onFile={setFile} />;

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <span style={styles.fileName}>{file.name}</span>
        <a
          href="#"
          style={styles.changeLink}
          onClick={(e) => {
            e.preventDefault();
            setFile(null);
          }}
        >
          ← Change file
        </a>
      </header>
      <div ref={reviewRef} />
    </div>
  );
}

const styles: Record<string, h.JSX.CSSProperties> = {
  root: {
    background: 'var(--bg-body)',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 20px',
    borderBottom: '1px solid var(--bg-hover)',
  },
  fileName: {
    color: 'var(--text-muted)',
    fontSize: '13px',
  },
  changeLink: {
    color: 'var(--accent-link)',
    fontSize: '13px',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};

const app = document.getElementById('app');
if (app) render(<App />, app);
