import React from 'react';
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

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.textDisabled;
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'outline':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.background;
    if (variant === 'outline') return theme.colors.primary;
    return '#FFFFFF';
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return `${theme.spacing.xs}px ${theme.spacing.sm}px`;
      case 'medium':
        return `${theme.spacing.sm}px ${theme.spacing.md}px`;
      case 'large':
        return `${theme.spacing.md}px ${theme.spacing.lg}px`;
      default:
        return `${theme.spacing.sm}px ${theme.spacing.md}px`;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return theme.typography.fontSize.sm;
      case 'medium':
        return theme.typography.fontSize.md;
      case 'large':
        return theme.typography.fontSize.lg;
      default:
        return theme.typography.fontSize.md;
    }
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      style={{
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        padding: getPadding(),
        fontSize: getFontSize(),
        fontWeight: theme.typography.fontWeight.medium,
        border: variant === 'outline' ? `2px solid ${theme.colors.primary}` : 'none',
        borderRadius: theme.borderRadius.md,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        fontFamily: theme.typography.fontFamily.regular,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '0.9';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {label}
    </button>
  );
};
