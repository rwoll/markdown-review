import { h } from 'preact';
import { useState, useRef, useCallback } from 'preact/hooks';

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export interface UploadResult {
  name: string;
  content: string;
}

interface UploadProps {
  onFile: (result: UploadResult) => void;
}

export function Upload({ onFile }: UploadProps) {
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
    <div style={styles.wrapper}>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        style={{
          ...styles.dropZone,
          borderColor: dragging ? '#6cf' : '#333',
          background: dragging ? '#1a1a2e' : '#161616',
        }}
      >
        <p style={styles.heading}>Drop your .md file here</p>
        <p style={styles.or}>or</p>
        <button style={styles.button} onClick={() => inputRef.current?.click()}>
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
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles: Record<string, h.JSX.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#111',
  },
  dropZone: {
    border: '2px dashed #333',
    borderRadius: '12px',
    padding: '48px 64px',
    textAlign: 'center',
    transition: 'border-color 0.15s, background 0.15s',
    maxWidth: '480px',
    width: '100%',
  },
  heading: {
    color: '#999',
    fontSize: '18px',
    margin: '0 0 8px',
  },
  or: {
    color: '#555',
    fontSize: '14px',
    margin: '0 0 16px',
  },
  button: {
    background: '#2a2a2a',
    color: '#ccc',
    border: '1px solid #444',
    borderRadius: '6px',
    padding: '8px 20px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  error: {
    color: '#f55',
    marginTop: '16px',
    fontSize: '14px',
  },
};
