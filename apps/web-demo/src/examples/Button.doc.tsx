import { ComponentDoc } from '@component-docs/core';
import { Button } from './Button';

export const ButtonDoc = ComponentDoc({
  title: 'Button',
  description: 'Um botão customizável com múltiplas variantes e tamanhos.',
  category: 'Buttons',
  component: Button,
  props: {
    label: {
      type: 'string',
      description: 'Texto exibido no botão',
      required: true,
      control: 'text',
      defaultValue: 'Clique aqui',
    },
    variant: {
      type: "'primary' | 'secondary' | 'outline'",
      description: 'Variante visual do botão',
      control: 'select',
      options: ['primary', 'secondary', 'outline'] as const,
      defaultValue: 'primary',
    },
    size: {
      type: "'small' | 'medium' | 'large'",
      description: 'Tamanho do botão',
      control: 'select',
      options: ['small', 'medium', 'large'] as const,
      defaultValue: 'medium',
    },
    disabled: {
      type: 'boolean',
      description: 'Se o botão está desabilitado',
      control: 'boolean',
      defaultValue: false,
    },
    fullWidth: {
      type: 'boolean',
      description: 'Se o botão ocupa toda a largura disponível',
      control: 'boolean',
      defaultValue: false,
    },
    onPress: {
      type: '() => void',
      description: 'Callback executado ao clicar no botão',
      required: false,
    },
  },
  examples: [
    {
      title: 'Botão Primary',
      description: 'Botão primário padrão',
      props: {
        label: 'Primary Button',
        variant: 'primary',
        size: 'medium',
      },
    },
    {
      title: 'Botão Secondary',
      description: 'Botão secundário',
      props: {
        label: 'Secondary Button',
        variant: 'secondary',
        size: 'medium',
      },
    },
    {
      title: 'Botão Outline',
      description: 'Botão com borda',
      props: {
        label: 'Outline Button',
        variant: 'outline',
        size: 'medium',
      },
    },
    {
      title: 'Botões de Diferentes Tamanhos',
      description: 'Exemplos de todos os tamanhos disponíveis',
      props: {
        label: 'Large Button',
        variant: 'primary',
        size: 'large',
      },
    },
    {
      title: 'Botão Desabilitado',
      description: 'Estado desabilitado',
      props: {
        label: 'Disabled Button',
        variant: 'primary',
        size: 'medium',
        disabled: true,
      },
    },
  ],
  tags: ['button', 'action', 'interactive'],
});
