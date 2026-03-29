import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@component-docs/theme';

// ─── Context ─────────────────────────────────────────────────────────────────

interface CallbackToastContextValue {
  notify: (propName: string, args: unknown[]) => void;
}

export const CallbackToastContext =
  React.createContext<CallbackToastContextValue>({ notify: () => {} });

export function useCallbackToast() {
  return React.useContext(CallbackToastContext);
}

// ─── Single Toast ─────────────────────────────────────────────────────────────

interface ToastEntry {
  id: number;
  propName: string;
  args: unknown[];
  visible: boolean;
}

const VISIBLE_DURATION = 2200; // ms before fade-out starts
const FADE_DURATION = 220; // css transition duration

const ToastItem: React.FC<{ entry: ToastEntry }> = ({ entry }) => {
  const { theme } = useTheme();

  const argsText =
    entry.args.length === 0
      ? 'no arguments'
      : entry.args
          .map((a) => {
            if (typeof a === 'function') return '[Function]';
            if (typeof a === 'object' && a !== null) return '[Object]';
            return String(a).slice(0, 50);
          })
          .join(', ');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '10px 14px',
        borderRadius: 10,
        border: `1px solid ${theme.colors.primary}`,
        backgroundColor: theme.colors.surface,
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        maxWidth: 320,
        opacity: entry.visible ? 1 : 0,
        transform: entry.visible ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity ${FADE_DURATION}ms ease, transform ${FADE_DURATION}ms ease`,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: 6,
            backgroundColor: theme.colors.primary + '22',
            fontSize: 13,
            fontWeight: 'bold',
            color: theme.colors.primary,
            lineHeight: 1,
            fontFamily: theme.typography.fontFamily.mono,
          }}
        >
          ƒ
        </span>
        <span
          style={{
            fontFamily: theme.typography.fontFamily.mono,
            fontSize: 13,
            fontWeight: 600,
            color: theme.colors.primary,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {entry.propName}()
        </span>
        <span
          style={{
            fontSize: 11,
            color: theme.colors.textSecondary,
            whiteSpace: 'nowrap',
          }}
        >
          called
        </span>
      </div>

      {/* Args */}
      <div
        style={{
          fontFamily: theme.typography.fontFamily.mono,
          fontSize: 11,
          color: theme.colors.textSecondary,
          lineHeight: 1.5,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {argsText}
      </div>
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────

let _nextId = 1;

export const CallbackToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const notify = useCallback((propName: string, args: unknown[]) => {
    const id = _nextId++;

    // Add with visible=false (triggers CSS enter transition)
    setToasts((prev) => [
      ...prev.slice(-3),
      { id, propName, args, visible: false },
    ]);

    // Next frame: set visible=true for enter animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, visible: true } : t)),
        );
      });
    });

    // After duration: fade out
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: false } : t)),
      );
      // After fade transition: remove
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, FADE_DURATION + 50);
    }, VISIBLE_DURATION);
  }, []);

  return (
    <CallbackToastContext.Provider value={{ notify }}>
      {children}
      {/* Fixed bottom-right stack */}
      <div
        style={{
          position: 'fixed',
          bottom: 32,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8,
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((entry) => (
          <ToastItem key={entry.id} entry={entry} />
        ))}
      </div>
    </CallbackToastContext.Provider>
  );
};
