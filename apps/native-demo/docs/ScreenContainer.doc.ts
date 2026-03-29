import { ComponentDoc } from '@component-docs/core';
import { ScreenContainer } from '../components/ScreenContainer';

export const ScreenContainerDoc = ComponentDoc({
  title: 'ScreenContainer',
  description:
    'Full-screen layout with a safe-area-aware header and a scrollable content area. ' +
    'Ideal for top-level screens in a navigation stack.',
  category: 'Layout',
  component: ScreenContainer,
  props: {
    title: {
      type: 'string',
      description: 'Title displayed in the header bar',
      control: 'text',
      defaultValue: 'My Screen',
    },
    subtitle: {
      type: 'string',
      description: 'Introductory text shown at the top of the scrollable area',
      control: 'text',
      defaultValue: 'Welcome! Scroll down to see more content.',
    },
    headerColor: {
      type: 'string',
      description: 'Background color of the header (hex, e.g. #3B82F6)',
      control: 'text',
      defaultValue: '#3B82F6',
    },
    itemCount: {
      type: 'number',
      description: 'Number of placeholder list items to render',
      control: 'range',
      defaultValue: 8,
      min: 1,
      max: 20,
    },
  },
});
