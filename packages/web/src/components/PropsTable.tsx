import React from 'react';
import { useTheme } from '@component-docs/theme';
import type { PropDefinition } from '@component-docs/core';

interface PropsTableProps {
  props: Record<string, PropDefinition>;
}

const CELL: React.CSSProperties = {
  padding: '10px 14px',
  textAlign: 'left',
  verticalAlign: 'top',
};

export const PropsTable: React.FC<PropsTableProps> = ({ props }) => {
  const { theme } = useTheme();

  const headerStyle: React.CSSProperties = {
    ...CELL,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    backgroundColor: theme.colors.surface,
    borderBottom: `1px solid ${theme.colors.border}`,
  };

  const cellStyle: React.CSSProperties = {
    ...CELL,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    borderBottom: `1px solid ${theme.colors.border}`,
  };

  const codeStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.xs,
    backgroundColor: theme.colors.elevated,
    padding: '2px 6px',
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.primary,
  };

  return (
    <div
      style={{
        overflowX: 'auto',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.md,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: theme.typography.fontFamily.regular,
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Prop</th>
            <th style={headerStyle}>Type</th>
            <th style={headerStyle}>Default</th>
            <th style={headerStyle}>Required</th>
            <th style={headerStyle}>Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(props).map(([name, def]) => (
            <tr key={name}>
              <td style={cellStyle}>
                <code style={codeStyle}>{name}</code>
              </td>
              <td style={cellStyle}>
                <code style={{ ...codeStyle, color: theme.colors.secondary }}>
                  {def.type}
                </code>
              </td>
              <td style={cellStyle}>
                {def.defaultValue !== undefined ? (
                  <code style={codeStyle}>{String(def.defaultValue)}</code>
                ) : (
                  <span style={{ color: theme.colors.textSecondary }}>—</span>
                )}
              </td>
              <td style={{ ...cellStyle, textAlign: 'center' }}>
                {def.required ? (
                  <span style={{ color: theme.colors.error }}>✓</span>
                ) : (
                  <span style={{ color: theme.colors.textSecondary }}>—</span>
                )}
              </td>
              <td style={{ ...cellStyle, color: theme.colors.textSecondary }}>
                {def.description ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
