import React, { useState } from 'react';
import { useTheme } from '@component-docs/theme';
import type { ComponentDocConfig, DocAppConfig, DocRoute } from '@component-docs/core';
import { PropsTable } from './PropsTable';
import { CodePreview } from './CodePreview';
import { CodeModal } from './CodeModal';
import { generateCode } from '@component-docs/core';

interface ComponentDocAreaProps {
  config: ComponentDocConfig;
  currentProps: Record<string, any>;
  onPropChange: (key: string, value: any) => void;
}

export const ComponentDocArea: React.FC<ComponentDocAreaProps> = ({
  config,
  currentProps,
}) => {
  const { theme } = useTheme();
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  const Component = config.component as React.ComponentType<Record<string, unknown>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const NativeComponent = (config as any).nativeComponent as React.ComponentType<Record<string, unknown>> | undefined;
  const code = generateCode(config.title, currentProps);

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
    <div style={{ padding: `${theme.spacing.lg}px`, backgroundColor: theme.colors.background }}>
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
          {config.deprecated && (
            <span
              style={{
                padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
                backgroundColor: theme.colors.warning + '22',
                color: theme.colors.warning,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              deprecated
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
      </div>

      {/* Live Preview */}
      <section style={section}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
          }}
        >
          <h2 style={{ ...h2, marginBottom: 0 }}>Preview</h2>
          <button
            onClick={() => setCodeModalOpen(true)}
            style={{
              padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
              backgroundColor: theme.colors.elevated,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {'</> Show Code'}
          </button>
        </div>

        {NativeComponent ? (
          /* ── Mobile-only preview (react-native-web) ── */
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div>
              {/* Label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 13 }}>📱</span>
                <span style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.textSecondary, fontWeight: theme.typography.fontWeight.semibold, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mobile</span>
              </div>
              {/* Phone shell */}
              <div style={{ background: '#1C1C1E', borderRadius: 36, padding: '14px 8px 18px', display: 'inline-block', boxShadow: '0 0 0 1px rgba(255,255,255,0.12), 0 24px 48px rgba(0,0,0,0.35)' }}>
                <div style={{ width: 220, height: 420, overflow: 'hidden', borderRadius: 20, backgroundColor: '#000', position: 'relative' }}>
                  {/* Decorative notch */}
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 70, height: 20, backgroundColor: '#1C1C1E', borderRadius: '0 0 12px 12px', zIndex: 10 }} />
                  {/* Virtual viewport: 375×667, scaled to fit 220px wide */}
                  <div style={{ width: 375, height: 667, transform: `scale(${220 / 375})`, transformOrigin: 'top left', display: 'flex', flexDirection: 'column' }}>
                    <NativeComponent {...currentProps} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── Single web preview ── */
          <div style={{ border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.lg, overflow: 'hidden' }}>
            <div style={{ padding: theme.spacing.xl, backgroundColor: theme.colors.surface, minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Component {...currentProps} />
            </div>
          </div>
        )}
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
          {config.examples.map((example, index) => (
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
                  margin: 0,
                  marginBottom: theme.spacing.xs,
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSize.md,
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                {example.title}
              </h3>
              {example.description && (
                <p
                  style={{
                    margin: 0,
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: theme.spacing.lg,
                  backgroundColor: theme.colors.background,
                  borderRadius: theme.borderRadius.md,
                }}
              >
                <Component {...(example.props as Record<string, unknown>)} />
              </div>
              {example.code && (
                <div style={{ marginTop: theme.spacing.md }}>
                  <CodePreview code={example.code} language="tsx" />
                </div>
              )}
            </div>
          ))}
        </section>
      )}
      {/* Code modal */}
      {codeModalOpen && (
        <CodeModal
          code={code}
          title={config.title}
          onClose={() => setCodeModalOpen(false)}
        />
      )}
    </div>
  );
};

// Component list screen (shown when previews page but no component selected)
interface ComponentListScreenProps {
  config: DocAppConfig;
  onSelect: (id: string) => void;
  theme: any;
}

export const ComponentListScreen: React.FC<ComponentListScreenProps> = ({
  config,
  onSelect,
  theme,
}) => {
  const grouped: Record<string, ComponentDocConfig[]> = {};
  config.components.forEach((c) => {
    const cat = c.category ?? 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(c);
  });

  return (
    <div
      style={{
        padding: `${theme.spacing.xl}px`,
        backgroundColor: theme.colors.background,
        minHeight: '100%',
      }}
    >
      <h1
        style={{
          margin: 0,
          marginBottom: theme.spacing.xs,
          fontSize: theme.typography.fontSize.xxl,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text,
        }}
      >
        Components
      </h1>
      <p
        style={{
          margin: 0,
          marginBottom: theme.spacing.xl,
          color: theme.colors.textSecondary,
          fontSize: theme.typography.fontSize.md,
        }}
      >
        {config.components.length} component{config.components.length !== 1 ? 's' : ''} available
      </p>

      {Object.entries(grouped).map(([category, components]) => (
        <div key={category} style={{ marginBottom: theme.spacing.xl }}>
          <h2
            style={{
              margin: 0,
              marginBottom: theme.spacing.md,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.textSecondary,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.06em',
              fontSize: theme.typography.fontSize.sm,
            }}
          >
            {category}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: theme.spacing.md,
            }}
          >
            {components.map((comp) => {
              const id = comp.id ?? comp.title;
              return (
                <button
                  key={id}
                  onClick={() => onSelect(id)}
                  style={{
                    padding: `${theme.spacing.lg}px`,
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.lg,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.primary}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: theme.typography.fontSize.md,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text,
                      marginBottom: theme.spacing.xs,
                    }}
                  >
                    {comp.title}
                    {comp.deprecated && (
                      <span
                        style={{
                          marginLeft: theme.spacing.sm,
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.warning,
                          fontWeight: 'normal',
                        }}
                      >
                        deprecated
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.textSecondary,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                    }}
                  >
                    {comp.description}
                  </div>
                  <div
                    style={{
                      marginTop: theme.spacing.md,
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.primary,
                      fontWeight: theme.typography.fontWeight.medium,
                    }}
                  >
                    {Object.keys(comp.props).length} props →
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
