import { h } from 'preact';
import { useState, useRef, useCallback } from 'preact/hooks';

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export interface UploadResult {
  name: string;
  content: string;
}

interface UploadProps {
  onFile: (result: UploadResult) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export function Upload({ onFile, theme = 'dark', onToggleTheme }: UploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);
      if (!file.name.endsWith('.md')) {
        setError('Only .md files are accepted.');
        return;
      }
      if (file.size > MAX_SIZE) {
        setError('File is too large (max 2 MB).');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => onFile({ name: file.name, content: reader.result as string });
      reader.onerror = () => setError('Failed to read file.');
      reader.readAsText(file);
    },
    [onFile],
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer?.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  const onPick = useCallback(
    (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--pr-bg)',
      position: 'relative',
    }}>
      {onToggleTheme && (
        <div style={{ position: 'absolute', top: '16px', right: '20px' }}>
          <button
            onClick={onToggleTheme}
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
      )}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        style={{
          border: `2px dashed ${dragging ? 'var(--pr-accent)' : 'var(--pr-border)'}`,
          borderRadius: '8px',
          padding: '48px 64px',
          textAlign: 'center',
          transition: 'border-color 0.15s, background 0.15s',
          maxWidth: '480px',
          width: '100%',
          background: dragging ? 'var(--pr-hover)' : 'transparent',
        }}
      >
        <p style={{ color: 'var(--pr-fg-2)', fontSize: '18px', margin: '0 0 8px' }}>
          Drop your .md file here
        </p>
        <p style={{ color: 'var(--pr-fg-3)', fontSize: '14px', margin: '0 0 16px' }}>or</p>
        <button
          style={{
            background: 'var(--pr-btn-bg)',
            color: 'var(--pr-btn-fg)',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 20px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
          onClick={() => inputRef.current?.click()}
        >
          Choose file
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".md"
          style={{ display: 'none' }}
          onChange={onPick}
        />
      </div>
      {error && (
        <p style={{ color: 'var(--pr-error)', marginTop: '16px', fontSize: '14px' }}>{error}</p>
      )}
    </div>
  );
}
