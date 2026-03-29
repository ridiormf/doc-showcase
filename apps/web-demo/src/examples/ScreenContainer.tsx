import React from 'react';
import { useTheme } from '@component-docs/theme';

export interface ScreenContainerProps {
  /** Title shown in the header bar */
  title?: string;
  /** Introductory text at the top of the scrollable area */
  subtitle?: string;
  /** Header background color (hex string, e.g. "#3B82F6") */
  headerColor?: string;
  /** Number of placeholder list items to render */
  itemCount?: number;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  title = 'My Screen',
  subtitle = 'Welcome! Scroll down to see more content.',
  headerColor = '#3B82F6',
  itemCount = 8,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 400,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          backgroundColor: headerColor,
          padding: '14px 16px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          {title}
        </span>
      </div>

      {/* ── Scrollable content ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          backgroundColor: theme.colors.background,
        }}
      >
        {subtitle && (
          <p
            style={{
              margin: '0 0 16px',
              fontSize: theme.typography.fontSize.sm,
              lineHeight: 1.5,
              color: theme.colors.textSecondary ?? theme.colors.text,
            }}
          >
            {subtitle}
          </p>
        )}

        {Array.from({ length: itemCount }).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              padding: 14,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text,
              }}
            >
              Item {i + 1}
            </div>
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.textDisabled,
                marginTop: 2,
              }}
            >
              Description for item {i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
