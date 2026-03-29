import React from 'react';
import { useTheme } from '@component-docs/theme';
import type { ComponentDocConfig } from '@component-docs/core';
import { Playground } from './Playground';
import { PropsTable } from './PropsTable';

interface ComponentDocViewProps {
  config: ComponentDocConfig;
}

export const ComponentDocView: React.FC<ComponentDocViewProps> = ({ config }) => {
  const { theme } = useTheme();

  const section: React.CSSProperties = {
    marginBottom: theme.spacing.xl,
  };

  const h2: React.CSSProperties = {
    marginTop: 0,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
  };

  return (
    <div style={{ padding: `${theme.spacing.lg}px` }}>
      {/* Header */}
      <div style={section}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.sm,
          }}
        >
          <h1
            style={{
              margin: 0,
              color: theme.colors.text,
              fontSize: theme.typography.fontSize.xxl,
              fontWeight: theme.typography.fontWeight.bold,
            }}
          >
            {config.title}
          </h1>
          {config.category && (
            <span
              style={{
                padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
                backgroundColor: theme.colors.primary + '22',
                color: theme.colors.primary,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              {config.category}
            </span>
          )}
        </div>
        <p
          style={{
            margin: 0,
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSize.md,
            lineHeight: theme.typography.lineHeight.relaxed,
          }}
        >
          {config.description}
        </p>
        {config.deprecated && (
          <div
            style={{
              marginTop: theme.spacing.md,
              padding: `${theme.spacing.md}px`,
              backgroundColor: theme.colors.warning + '22',
              border: `1px solid ${theme.colors.warning}`,
              borderRadius: theme.borderRadius.md,
            }}
          >
            <strong style={{ color: theme.colors.warning }}>⚠️ Deprecated: </strong>
            <span style={{ color: theme.colors.text }}>
              {config.deprecatedMessage ?? 'This component is deprecated.'}
            </span>
          </div>
        )}
      </div>

      {/* Playground */}
      <section style={section}>
        <h2 style={h2}>Playground</h2>
        <Playground config={config} />
      </section>

      {/* Props Table */}
      <section style={section}>
        <h2 style={h2}>Props</h2>
        <PropsTable props={config.props} />
      </section>

      {/* Examples */}
      {config.examples && config.examples.length > 0 && (
        <section style={section}>
          <h2 style={h2}>Examples</h2>
          {config.examples.map((example, index) => {
            const Component = config.component as React.ComponentType<Record<string, unknown>>;
            return (
              <div
                key={index}
                style={{
                  marginBottom: theme.spacing.lg,
                  padding: `${theme.spacing.lg}px`,
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: theme.spacing.sm,
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}
                >
                  {example.title}
                </h3>
                {example.description && (
                  <p
                    style={{
                      marginTop: 0,
                      marginBottom: theme.spacing.md,
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.fontSize.sm,
                    }}
                  >
                    {example.description}
                  </p>
                )}
                <div
                  style={{
                    padding: `${theme.spacing.md}px`,
                    backgroundColor: theme.colors.background,
                    borderRadius: theme.borderRadius.md,
                  }}
                >
                  <Component {...(example.props as Record<string, unknown>)} />
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
};
