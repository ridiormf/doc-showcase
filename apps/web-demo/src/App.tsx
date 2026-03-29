import React from 'react';
import { DocApp } from '@component-docs/web';
import type { DocAppConfig } from '@component-docs/web';
import { ButtonDoc } from './examples/Button.doc';
import { ScreenContainerDoc } from './examples/ScreenContainer.doc';
import './App.css';

const appConfig: DocAppConfig = {
  title: 'Component Docs',
  version: '1.0.0',
  description: 'Biblioteca de documentação unificada para componentes React e React Native.',
  components: [ButtonDoc, ScreenContainerDoc],
  welcome: {
    title: 'Component Docs',
    subtitle: 'Documentação de componentes React',
    description:
      'Explore e teste componentes interativos com controle de props em tempo real. Compatible com Web e Mobile.',
    badges: [
      { label: 'Version', value: '1.0.0' },
      { label: 'Platform', value: 'Web' },
      { label: 'React', value: '19' },
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

function App() {
  return <DocApp config={appConfig} />;
}

export default App;
