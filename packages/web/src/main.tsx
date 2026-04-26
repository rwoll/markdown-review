import { h, render } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { PlanReview } from '@plan-review/core';
import { Upload, UploadResult } from './Upload';

type Theme = 'dark' | 'light';

function App() {
  const [file, setFile] = useState<UploadResult | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const reviewRef = useRef<HTMLDivElement>(null);

  // Apply data-theme to <html> so CSS custom properties cascade everywhere
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (file && reviewRef.current) {
      reviewRef.current.innerHTML = '';
      PlanReview.init({
        container: reviewRef.current,
        markdown: file.content,
        fileName: file.name,
        feedbackMode: 'download',
        theme,
      });
    }
  }, [file, theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  if (!file) return <Upload onFile={setFile} theme={theme} onToggleTheme={toggleTheme} />;

  const isDark = theme === 'dark';

  return (
    <div style={{ background: isDark ? 'var(--pr-bg, #1f1f1f)' : 'var(--pr-bg, #ffffff)', minHeight: '100vh' }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 20px',
        borderBottom: '1px solid var(--pr-border-subtle)',
        background: 'var(--pr-bg-2)',
      }}>
        <span style={{ color: 'var(--pr-fg-2)', fontSize: '13px' }}>{file.name}</span>
        <a
          href="#"
          style={{ color: 'var(--pr-accent)', fontSize: '13px', textDecoration: 'none', cursor: 'pointer' }}
          onClick={(e) => { e.preventDefault(); setFile(null); }}
        >
          ← Change file
        </a>
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light 2026' : 'Dark 2026'} theme`}
            style={{
              background: 'none',
              border: '1px solid var(--pr-border-subtle)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              cursor: 'pointer',
              color: 'var(--pr-fg-2)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            {theme === 'dark' ? '☀ Light 2026' : '🌙 Dark 2026'}
          </button>
        </div>
      </header>
      <div ref={reviewRef} />
    </div>
  );
}

const app = document.getElementById('app');
if (app) render(<App />, app);
