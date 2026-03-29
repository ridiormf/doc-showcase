import React from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@component-docs/theme';
import type { PropDefinition } from '@component-docs/core';
import { useCallbackToast } from './CallbackToast';

// ---------------------------------------------------------------------------
// Optional peer: @react-native-picker/picker
// Loaded at runtime so the library works even if not installed.
// ---------------------------------------------------------------------------
interface PickerProps {
  selectedValue: unknown;
  onValueChange: (v: unknown) => void;
  style?: object;
  children?: React.ReactNode;
}
interface PickerItemProps {
  label: string;
  value: unknown;
}

let PickerComponent: React.ComponentType<PickerProps> | null = null;
let PickerItemComponent: React.ComponentType<PickerItemProps> | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const m: any = require('@react-native-picker/picker'); // eslint-disable-line @typescript-eslint/no-require-imports
  PickerComponent = m.Picker as React.ComponentType<PickerProps>;
  PickerItemComponent = m.Picker.Item as React.ComponentType<PickerItemProps>;
} catch {
  // Not installed — select falls back to TextInput
}

// ---------------------------------------------------------------------------

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

  const inputStyle = [
    styles.input,
    {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderRadius: theme.borderRadius.md,
    },
  ];

  const renderControl = (): React.ReactNode => {
    switch (definition.control) {
      case 'text':
        return (
          <TextInput
            value={(value as string) || ''}
            onChangeText={onChange}
            style={inputStyle}
            placeholderTextColor={theme.colors.textSecondary}
          />
        );

      case 'number':
      case 'range':
        return (
          <TextInput
            value={String((value as number) ?? definition.min ?? 0)}
            onChangeText={(text: string) => onChange(Number(text) || 0)}
            keyboardType="numeric"
            style={inputStyle}
            placeholderTextColor={theme.colors.textSecondary}
          />
        );

      case 'boolean':
        return (
          <View style={styles.switchRow}>
            <Switch
              value={(value as boolean) || false}
              onValueChange={onChange}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={(value as boolean) ? '#FFFFFF' : theme.colors.textSecondary}
            />
            <Text
              style={{
                color: theme.colors.text,
                marginLeft: theme.spacing.sm,
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              {(value as boolean) ? 'True' : 'False'}
            </Text>
          </View>
        );

      case 'select': {
        const PC = PickerComponent;
        const PIC = PickerItemComponent;
        if (PC && PIC) {
          return (
            <View
              style={[
                styles.pickerWrapper,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.md,
                },
              ]}
            >
              <PC
                selectedValue={value}
                onValueChange={onChange}
                style={{ color: theme.colors.text }}
              >
                {definition.options?.map((option: unknown) => (
                  <PIC
                    key={String(option)}
                    label={String(option)}
                    value={option}
                  />
                ))}
              </PC>
            </View>
          );
        }
        // Fallback
        return (
          <TextInput
            value={String(value || '')}
            onChangeText={onChange}
            style={inputStyle}
            placeholder={`Options: ${definition.options?.join(', ')}`}
            placeholderTextColor={theme.colors.textSecondary}
          />
        );
      }

      default:
        return (
          <TextInput
            value={(value as string) || ''}
            onChangeText={onChange}
            style={inputStyle}
            placeholderTextColor={theme.colors.textSecondary}
          />
        );
    }
  };

  // Function prop: render a trigger button instead of an input
  if (
    (definition.control as string) === 'function' ||
    (definition.type && definition.type.includes('=>') && definition.control == null)
  ) {
    return (
      <View style={{ marginBottom: theme.spacing.md }}>
        <Text
          style={{
            marginBottom: theme.spacing.xs,
            color: theme.colors.text,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium as 'bold' | 'normal',
          }}
        >
          {name}
          {definition.required && (
            <Text style={{ color: theme.colors.error }}> *</Text>
          )}
        </Text>
        {definition.description && (
          <Text
            style={{
              marginBottom: theme.spacing.xs,
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.xs,
            }}
          >
            {definition.description}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            if (typeof value === 'function') {
              (value as () => void)();
            }
          }}
          style={[
            styles.fnButton,
            {
              borderColor: theme.colors.primary,
              backgroundColor: theme.colors.primary + '14',
              borderRadius: theme.borderRadius.md,
            },
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: 'bold',
              fontFamily: theme.typography.fontFamily.mono,
            }}
          >
            ƒ {name}()
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.xs,
              marginTop: 2,
            }}
          >
            tap to fire callback
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text
        style={{
          marginBottom: theme.spacing.xs,
          color: theme.colors.text,
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium as 'bold' | 'normal',
        }}
      >
        {name}
        {definition.required && (
          <Text style={{ color: theme.colors.error }}> *</Text>
        )}
      </Text>
      {definition.description && (
        <Text
          style={{
            marginBottom: theme.spacing.xs,
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSize.xs,
          }}
        >
          {definition.description}
        </Text>
      )}
      {renderControl()}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderWidth: 1,
    fontSize: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerWrapper: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  fnButton: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
});
