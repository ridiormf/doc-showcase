import React from 'react';
import { useTheme } from '@component-docs/theme';
import type { PropDefinition } from '@component-docs/core';
import { useCallbackToast } from './CallbackToast';

interface PropControlProps {
  name: string;
  definition: PropDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export const PropControl: React.FC<PropControlProps> = ({
  name,
  definition,
  value,
  onChange,
}) => {
  const { theme } = useTheme();
  const { notify } = useCallbackToast();

  const baseInputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.sm}px`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    boxSizing: 'border-box',
  };

  const renderControl = () => {
    switch (definition.control) {
      case 'text':
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            style={baseInputStyle}
          />
        );

      case 'number':
      case 'range':
        return (
          <input
            type={definition.control}
            value={(value as number) ?? definition.min ?? 0}
            min={definition.min}
            max={definition.max}
            step={definition.step ?? 1}
            onChange={(e) => onChange(Number(e.target.value))}
            style={baseInputStyle}
          />
        );

      case 'boolean':
        return (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={(value as boolean) || false}
              onChange={(e) => onChange(e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <span
              style={{
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              {value ? 'True' : 'False'}
            </span>
          </label>
        );

      case 'select':
        return (
          <select
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            style={baseInputStyle}
          >
            {definition.options?.map((option) => (
              <option key={String(option)} value={String(option)}>
                {String(option)}
              </option>
            ))}
          </select>
        );

      case 'color':
        return (
          <input
            type="color"
            value={(value as string) || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            style={{
              ...baseInputStyle,
              height: 40,
              padding: theme.spacing.xs,
            }}
          />
        );

      default:
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            style={baseInputStyle}
          />
        );
    }
  };

  // Function prop: render a trigger button
  if (
    (definition.control as string) === 'function' ||
    (definition.type?.includes('=>') && definition.control == null)
  ) {
    return (
      <div style={{ marginBottom: theme.spacing.md }}>
        <label
          style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            color: theme.colors.text,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
          }}
        >
          {name}
          {definition.required && (
            <span style={{ color: theme.colors.error, marginLeft: 4 }}>*</span>
          )}
        </label>
        {definition.description && (
          <p
            style={{
              margin: 0,
              marginBottom: theme.spacing.xs,
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.xs,
            }}
          >
            {definition.description}
          </p>
        )}
        <button
          onClick={() => {
            if (typeof value === 'function') {
              (value as () => void)();
            }
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
            padding: '10px 14px',
            border: `1px solid ${theme.colors.primary}`,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.primary + '14',
            cursor: 'pointer',
            transition: 'background 0.15s',
            gap: 2,
          }}
        >
          <span
            style={{
              fontFamily: theme.typography.fontFamily.mono,
              fontSize: 13,
              fontWeight: 600,
              color: theme.colors.primary,
            }}
          >
            ƒ {name}()
          </span>
          <span
            style={{
              fontSize: 11,
              color: theme.colors.textSecondary,
            }}
          >
            click to fire callback
          </span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: theme.spacing.md }}>
      <label
        style={{
          display: 'block',
          marginBottom: theme.spacing.xs,
          color: theme.colors.text,
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
        }}
      >
        {name}
        {definition.required && (
          <span style={{ color: theme.colors.error, marginLeft: 4 }}>*</span>
        )}
      </label>
      {definition.description && (
        <p
          style={{
            margin: 0,
            marginBottom: theme.spacing.xs,
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSize.xs,
          }}
        >
          {definition.description}
        </p>
      )}
      {renderControl()}
    </div>
  );
};
