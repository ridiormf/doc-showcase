import React from 'react';
import { DocApp } from '@component-docs/native';
import type { DocAppConfig } from '@component-docs/native';
import { ButtonDoc } from './docs/Button.doc';
import { ScreenContainerDoc } from './docs/ScreenContainer.doc';

const appConfig: DocAppConfig = {
  title: 'Component Docs',
  version: '1.0.0',
  description: 'Biblioteca de documentação unificada para React Native.',
  components: [ButtonDoc, ScreenContainerDoc],
  welcome: {
    title: 'Component Docs',
    subtitle: 'Documentação de componentes Native',
    description:
      'Explore e teste componentes com controle de props em tempo real. Menu lateral esquerdo para navegar, direito para props.',
    badges: [
      { label: 'Version', value: '1.0.0' },
      { label: 'Platform', value: 'Native' },
    ],
  },
  navLabels: {
    welcome: 'Início',
    previews: 'Componentes',
    settings: 'Configurações',
  },
  settings: [
    {
      key: 'language',
      label: 'Language',
      description: 'Interface language',
      type: 'select',
      options: [
        { label: 'Português', value: 'pt' },
        { label: 'English', value: 'en' },
        { label: 'Español', value: 'es' },
      ],
      defaultValue: 'pt',
    },
  ],
  defaultRoute: 'welcome',
};

function App(): React.JSX.Element {
  return <DocApp config={appConfig} />;
}

export default App;
