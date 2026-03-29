import { ComponentDoc } from '@component-docs/core';
import { Button } from '../components/Button';

export const ButtonDoc = ComponentDoc({
  title: 'Button',
  description: 'A customizable button with multiple variants and sizes.',
  category: 'Buttons',
  component: Button,
  props: {
    label: {
      type: 'string',
      description: 'Text displayed on the button',
      required: true,
      control: 'text',
      defaultValue: 'Press me',
    },
    variant: {
      type: "'primary' | 'secondary' | 'outline'",
      description: 'Visual variant',
      control: 'select',
      options: ['primary', 'secondary', 'outline'] as const,
      defaultValue: 'primary',
    },
    size: {
      type: "'small' | 'medium' | 'large'",
      description: 'Button size',
      control: 'select',
      options: ['small', 'medium', 'large'] as const,
      defaultValue: 'medium',
    },
    disabled: {
      type: 'boolean',
      description: 'Whether the button is disabled',
      control: 'boolean',
      defaultValue: false,
    },
    fullWidth: {
      type: 'boolean',
      description: 'Stretch to full container width',
      control: 'boolean',
      defaultValue: false,
    },
    onPress: {
      type: '() => void',
      description: 'Callback fired when the button is pressed',
      required: false,
    },
  },
});
