import { h, render } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { PlanReview } from '@plan-review/core';
import { Upload, UploadResult } from './Upload';

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
    background: '#111',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 20px',
    borderBottom: '1px solid #222',
  },
  fileName: {
    color: '#666',
    fontSize: '13px',
  },
  changeLink: {
    color: '#6cf',
    fontSize: '13px',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};

const app = document.getElementById('app');
if (app) render(<App />, app);
