import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@component-docs/theme';

export interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onPress,
}) => {
  const { theme } = useTheme();

  const bgColor = disabled
    ? theme.colors.textDisabled
    : variant === 'primary'
    ? theme.colors.primary
    : variant === 'secondary'
    ? theme.colors.secondary
    : 'transparent';

  const textColor = disabled
    ? theme.colors.background
    : variant === 'outline'
    ? theme.colors.primary
    : '#FFFFFF';

  const padding =
    size === 'small'
      ? { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.sm }
      : size === 'large'
      ? { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.lg }
      : { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md };

  const fontSize =
    size === 'small'
      ? theme.typography.fontSize.sm
      : size === 'large'
      ? theme.typography.fontSize.lg
      : theme.typography.fontSize.md;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: bgColor,
          borderRadius: theme.borderRadius.md,
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: variant === 'outline' ? theme.colors.primary : 'transparent',
          opacity: disabled ? 0.6 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        padding,
      ]}
    >
      <Text
        style={{
          color: textColor,
          fontSize,
          fontWeight: theme.typography.fontWeight.medium as 'bold' | 'normal',
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
