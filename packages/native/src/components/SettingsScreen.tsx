import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useTheme } from '@component-docs/theme';
import { lightTheme, darkTheme } from '@component-docs/theme';
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
  const { theme, setTheme } = useTheme();

  // Built-in: dark mode
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

  const handleChange = (key: string, value: any) => {
    if (key === '__theme') {
      setTheme(value ? darkTheme : lightTheme);
      return;
    }
    onChange(key, value);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: theme.spacing.xl }}
    >
      <Text
        style={{
          fontSize: theme.typography.fontSize.xxl,
          fontWeight: 'bold',
          color: theme.colors.text,
          marginBottom: theme.spacing.xs,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: theme.typography.fontSize.md,
          color: theme.colors.textSecondary,
          marginBottom: theme.spacing.xl,
        }}
      >
        Customize the documentation viewer
      </Text>

      {allSettings.map((setting) => (
        <View
          key={setting.key}
          style={[
            styles.settingCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.borderRadius.lg,
              marginBottom: theme.spacing.md,
            },
          ]}
        >
          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: theme.spacing.md }}>
              <Text
                style={{
                  fontSize: theme.typography.fontSize.md,
                  fontWeight: 'bold',
                  color: theme.colors.text,
                  marginBottom: setting.description ? 2 : 0,
                }}
              >
                {setting.label}
              </Text>
              {setting.description ? (
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {setting.description}
                </Text>
              ) : null}
            </View>

            {/* Control */}
            {setting.type === 'toggle' && (
              <Switch
                value={!!currentValues[setting.key]}
                onValueChange={(v) => handleChange(setting.key, v)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor="#fff"
              />
            )}
            {setting.type === 'select' && setting.options && (
              <View
                style={[
                  styles.selectBox,
                  {
                    backgroundColor: theme.colors.elevated,
                    borderColor: theme.colors.border,
                    borderRadius: theme.borderRadius.md,
                  },
                ]}
              >
                {setting.options.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => handleChange(setting.key, opt.value)}
                    style={[
                      styles.selectOption,
                      {
                        backgroundColor:
                          currentValues[setting.key] === opt.value
                            ? theme.colors.primary + '22'
                            : 'transparent',
                        borderRadius: theme.borderRadius.sm,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: theme.typography.fontSize.sm,
                        color:
                          currentValues[setting.key] === opt.value
                            ? theme.colors.primary
                            : theme.colors.text,
                        fontWeight:
                          currentValues[setting.key] === opt.value ? 'bold' : 'normal',
                      }}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {setting.type === 'text' && (
              <TextInput
                value={String(currentValues[setting.key] ?? '')}
                onChangeText={(v) => handleChange(setting.key, v)}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.colors.elevated,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    borderRadius: theme.borderRadius.md,
                  },
                ]}
              />
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  settingCard: {
    padding: 16,
    borderWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectBox: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderWidth: 1,
  },
  selectOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 120,
    fontSize: 14,
  },
});
