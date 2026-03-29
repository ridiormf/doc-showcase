import React from 'react';
import { useTheme } from '@component-docs/theme';
import type { SettingDefinition } from '@component-docs/core';

interface SettingsScreenProps {
  settings: SettingDefinition[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  title: string;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  values,
  onChange,
  title,
}) => {
  const { theme } = useTheme();

  // Built-in theme setting (always present)
  const allSettings: SettingDefinition[] = [
    {
      key: '__theme',
      label: 'Dark Mode',
      description: 'Toggle between light and dark theme',
      type: 'toggle',
      defaultValue: theme.mode === 'dark',
    },
    ...settings,
  ];

  const currentValues: Record<string, any> = {
    __theme: theme.mode === 'dark',
    ...values,
  };

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
        {title}
      </h1>
      <p
        style={{
          margin: 0,
          marginBottom: theme.spacing.xl,
          fontSize: theme.typography.fontSize.md,
          color: theme.colors.textSecondary,
        }}
      >
        Customize the documentation viewer behavior
      </p>

      <div style={{ maxWidth: 560 }}>
        {allSettings.map((setting) => (
          <div
            key={setting.key}
            style={{
              padding: `${theme.spacing.lg}px`,
              marginBottom: theme.spacing.md,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: theme.spacing.md,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: theme.typography.fontSize.md,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text,
                    marginBottom: setting.description ? theme.spacing.xs : 0,
                  }}
                >
                  {setting.label}
                </div>
                {setting.description && (
                  <div
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {setting.description}
                  </div>
                )}
              </div>

              {/* Control */}
              {setting.type === 'toggle' && (
                <ToggleSwitch
                  value={!!currentValues[setting.key]}
                  onChange={(v) => onChange(setting.key, v)}
                />
              )}
              {setting.type === 'select' && setting.options && (
                <select
                  value={String(currentValues[setting.key] ?? '')}
                  onChange={(e) => onChange(setting.key, e.target.value)}
                  style={{
                    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                    backgroundColor: theme.colors.elevated,
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    cursor: 'pointer',
                  }}
                >
                  {setting.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
              {setting.type === 'text' && (
                <input
                  type="text"
                  value={String(currentValues[setting.key] ?? '')}
                  onChange={(e) => onChange(setting.key, e.target.value)}
                  style={{
                    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                    backgroundColor: theme.colors.elevated,
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    width: 180,
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ToggleSwitchProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onChange }) => {
  const { theme } = useTheme();
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      style={{
        position: 'relative',
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        backgroundColor: value ? theme.colors.primary : theme.colors.border,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: value ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          backgroundColor: '#fff',
          transition: 'left 0.2s',
          display: 'block',
        }}
      />
    </button>
  );
};
