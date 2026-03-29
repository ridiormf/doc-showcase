import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@component-docs/theme';

interface CodeModalProps {
  code: string;
  title?: string;
  onClose: () => void;
}

// ── Very lightweight syntax highlighter (VS Code Dark+ palette) ──────────────

interface TokenMatch {
  start: number;
  end: number;
  color: string;
}

const PATTERNS: Array<{ re: RegExp; color: string }> = [
  { re: /\/\/.*/g,                                                                          color: '#6A9955' }, // line comment
  { re: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`/g,                                   color: '#CE9178' }, // strings
  { re: /<\/?[A-Z][A-Za-z0-9.]*/g,                                                          color: '#4EC9B0' }, // JSX components
  { re: /\b(import|export|from|const|let|var|function|return|type|interface|default|extends|class|new|true|false|null|undefined|if|else|for|while|do|switch|case|async|await|of|in|as|React)\b/g, color: '#569CD6' }, // keywords
  { re: /\b\d+(\.\d+)?\b/g,                                                                color: '#B5CEA8' }, // numbers
];

function highlightLine(line: string, lineKey: number): React.ReactNode {
  const matches: TokenMatch[] = [];

  for (const { re, color } of PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, color });
    }
  }

  // Sort by start position; first-match wins on overlap
  matches.sort((a, b) => a.start - b.start || b.end - a.end);
  const filtered: TokenMatch[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.start >= cursor) {
      filtered.push(m);
      cursor = m.end;
    }
  }

  if (filtered.length === 0) {
    return <span key={lineKey} style={{ color: '#D4D4D4' }}>{line}</span>;
  }

  const spans: React.ReactNode[] = [];
  let pos = 0;
  filtered.forEach((m, i) => {
    if (m.start > pos) {
      spans.push(<span key={`p${i}`} style={{ color: '#D4D4D4' }}>{line.slice(pos, m.start)}</span>);
    }
    spans.push(<span key={`t${i}`} style={{ color: m.color }}>{line.slice(m.start, m.end)}</span>);
    pos = m.end;
  });
  if (pos < line.length) {
    spans.push(<span key="tail" style={{ color: '#D4D4D4' }}>{line.slice(pos)}</span>);
  }

  return spans;
}

function renderHighlighted(code: string): React.ReactNode {
  const lines = code.split('\n');
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {highlightLine(line, i)}
      {i < lines.length - 1 && '\n'}
    </React.Fragment>
  ));
}

// ── Component ────────────────────────────────────────────────────────────────

export const CodeModal: React.FC<CodeModalProps> = ({
  code,
  title = 'Component',
  onClose,
}) => {
  useTheme(); // keep theme context warm
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    /* Backdrop */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 24,
      }}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        style={{
          backgroundColor: '#1E1E1E',
          borderRadius: 12,
          width: '100%',
          maxWidth: 860,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.08), 0 32px 64px rgba(0,0,0,0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar — macOS style */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            flexShrink: 0,
            backgroundColor: '#252526',
          }}
        >
          {/* Traffic lights + filename */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FF5F57', display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FEBC2E', display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#28C840', display: 'inline-block' }} />
            <span
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: 12,
                marginLeft: 8,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {title}.tsx
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleCopy}
              style={{
                padding: '4px 14px',
                backgroundColor: copied ? '#28C840' : 'rgba(255,255,255,0.08)',
                color: copied ? '#fff' : 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif',
                transition: 'background-color 0.15s',
              }}
            >
              {copied ? '✓  Copied!' : '⎘  Copy'}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '4px 10px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.45)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                fontSize: 14,
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Code area */}
        <div
          style={{
            overflowY: 'auto',
            overflowX: 'auto',
            flex: 1,
            padding: '20px 24px',
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily:
                '"Fira Code", "Cascadia Code", "JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, monospace',
              fontSize: 13.5,
              lineHeight: 1.75,
              whiteSpace: 'pre',
              color: '#D4D4D4',
            }}
          >
            <code>{renderHighlighted(code)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
