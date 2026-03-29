import React from 'react';
import { useTheme } from '@component-docs/theme';
import type { ComponentDocConfig } from '@component-docs/core';
import { PropControl } from './PropControl';

interface PropsPanelProps {
  config: ComponentDocConfig;
  currentProps: Record<string, any>;
  onPropChange: (key: string, value: any) => void;
}

export const PropsPanel: React.FC<PropsPanelProps> = ({ config, currentProps, onPropChange }) => {
  const { theme } = useTheme();
  const propKeys = Object.keys(config.props);

  return (
    <aside
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colors.surface,
        borderLeft: `1px solid ${theme.colors.border}`,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
          borderBottom: `1px solid ${theme.colors.border}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Props
        </div>
        <div
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.textDisabled,
            marginTop: 2,
          }}
        >
          {config.title}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: `${theme.spacing.md}px`,
        }}
      >
        {propKeys.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: `${theme.spacing.xl}px ${theme.spacing.md}px`,
              color: theme.colors.textDisabled,
              fontSize: theme.typography.fontSize.sm,
            }}
          >
            No controllable props
          </div>
        )}
        {propKeys.map((key) => {
          const propDef = config.props[key as keyof typeof config.props];
          return (
            <div
              key={key}
              style={{
                marginBottom: theme.spacing.md,
                padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                backgroundColor: theme.colors.background,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.xs,
                  marginBottom: theme.spacing.xs,
                }}
              >
                <span
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text,
                    fontFamily: theme.typography.fontFamily.mono,
                  }}
                >
                  {key}
                </span>
                {propDef.required && (
                  <span style={{ color: theme.colors.error, fontSize: 12 }}>*</span>
                )}
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.textDisabled,
                    fontFamily: theme.typography.fontFamily.mono,
                  }}
                >
                  {propDef.type}
                </span>
              </div>
              {propDef.description && (
                <div
                  style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.textSecondary,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {propDef.description}
                </div>
              )}
              <PropControl
                name={key}
                definition={propDef}
                value={currentProps[key]}
                onChange={(value) => onPropChange(key, value)}
              />
            </div>
          );
        })}
      </div>
    </aside>
  );
};
