import React from 'react';
import { useTheme } from '@component-docs/theme';
import type { DocAppConfig, DocNavLabels } from '@component-docs/core';

interface WelcomeScreenProps {
  config: DocAppConfig;
  navLabels: Required<DocNavLabels>;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ config, navLabels, onStart }) => {
  const { theme } = useTheme();
  const w = config.welcome;

  const title = w?.title ?? config.title;
  const subtitle = w?.subtitle ?? config.description ?? '';
  const description = w?.description ?? '';
  const badges = w?.badges ?? (config.version ? [{ label: 'Version', value: config.version }] : []);

  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${theme.spacing.xxl}px`,
        backgroundColor: theme.colors.background,
      }}
    >
      <div style={{ maxWidth: 640, width: '100%', textAlign: 'center' }}>
        {/* Logo / Icon area */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: theme.colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            marginBottom: theme.spacing.xl,
            fontSize: 36,
          }}
        >
          📦
        </div>

        {/* Title */}
        <h1
          style={{
            margin: 0,
            marginBottom: theme.spacing.md,
            fontSize: 40,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              margin: 0,
              marginBottom: theme.spacing.md,
              fontSize: theme.typography.fontSize.xl,
              color: theme.colors.textSecondary,
              fontWeight: theme.typography.fontWeight.medium,
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: theme.spacing.sm,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: theme.spacing.xl,
            }}
          >
            {badges.map((badge, i) => (
              <span
                key={i}
                style={{
                  padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
                  backgroundColor: theme.colors.primary + '22',
                  color: theme.colors.primary,
                  borderRadius: theme.borderRadius.full ?? 9999,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  border: `1px solid ${theme.colors.primary}44`,
                }}
              >
                {badge.label}: <strong>{badge.value}</strong>
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {description && (
          <p
            style={{
              margin: 0,
              marginBottom: theme.spacing.xl,
              fontSize: theme.typography.fontSize.md,
              color: theme.colors.textSecondary,
              lineHeight: theme.typography.lineHeight.relaxed,
            }}
          >
            {description}
          </p>
        )}

        {/* CTA button */}
        <button
          onClick={onStart}
          style={{
            padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
            backgroundColor: theme.colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: theme.borderRadius.lg,
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {navLabels.previews} →
        </button>

        {/* Stats */}
        {config.components.length > 0 && (
          <p
            style={{
              marginTop: theme.spacing.lg,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textDisabled,
            }}
          >
            {config.components.length} component{config.components.length !== 1 ? 's' : ''} documented
          </p>
        )}
      </div>
    </div>
  );
};
