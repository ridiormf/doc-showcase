import React, { useState, useReducer } from 'react';
import { useTheme } from '@component-docs/theme';
import type { ComponentDocConfig } from '@component-docs/core';
import { playgroundReducer, generateInitialProps, generateCode } from '@component-docs/core';
import { PropControl } from './PropControl';
import { CodePreview } from './CodePreview';

interface PlaygroundProps {
  config: ComponentDocConfig;
}

export const Playground: React.FC<PlaygroundProps> = ({ config }) => {
  const { theme } = useTheme();
  const [showCode, setShowCode] = useState(false);

  const [state, dispatch] = useReducer(playgroundReducer, {
    props: generateInitialProps(config.props),
    showCode: false,
    theme: theme.mode,
  });

  const Component = config.component as React.ComponentType<Record<string, unknown>>;

  return (
    <div
      style={{
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
      }}
    >
      {/* Preview */}
      <div
        style={{
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.surface,
          borderBottom: `1px solid ${theme.colors.border}`,
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Component {...state.props} />
      </div>

      {/* Controls panel */}
      <div
        style={{
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
          }}
        >
          <span
            style={{
              color: theme.colors.text,
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
            }}
          >
            Props
          </span>
          <button
            onClick={() => setShowCode(!showCode)}
            style={{
              padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
              backgroundColor: theme.colors.primary,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: 'pointer',
            }}
          >
            {showCode ? 'Hide Code' : 'View Code'}
          </button>
        </div>

        {showCode && (
          <div style={{ marginBottom: theme.spacing.md }}>
            <CodePreview code={generateCode(config.title, state.props)} />
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gap: theme.spacing.sm,
          }}
        >
          {Object.entries(config.props).map(([name, definition]) => (
            <PropControl
              key={name}
              name={name}
              definition={definition}
              value={state.props[name]}
              onChange={(value) =>
                dispatch({ type: 'UPDATE_PROP', key: name, value })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
