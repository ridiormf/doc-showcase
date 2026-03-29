import React from 'react';
import { useTheme } from '@component-docs/theme';

interface CodePreviewProps {
  code: string;
  language?: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  language = 'jsx',
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.mode === 'dark' ? '#1E1E1E' : '#F5F5F5',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        overflow: 'auto',
        border: `1px solid ${theme.colors.border}`,
      }}
      data-language={language}
    >
      <pre
        style={{
          margin: 0,
          fontFamily: theme.typography.fontFamily.mono,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text,
          lineHeight: theme.typography.lineHeight.relaxed,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};
