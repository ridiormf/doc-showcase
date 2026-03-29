import React from 'react';

/**
 * Tipos de controles disponíveis para props interativas
 */
export type ControlType = 
  | 'text' 
  | 'number' 
  | 'boolean' 
  | 'select' 
  | 'radio' 
  | 'color' 
  | 'date' 
  | 'range'
  | 'function';

/**
 * Definição de uma prop de componente
 */
export interface PropDefinition {
  /** Tipo da prop */
  type: string;
  /** Descrição da prop */
  description: string;
  /** Se a prop é obrigatória */
  required?: boolean;
  /** Valor padrão */
  defaultValue?: any;
  /** Tipo de controle para o playground */
  control?: ControlType;
  /** Opções para controles select/radio */
  options?: readonly any[];
  /** Valor mínimo (para number/range) */
  min?: number;
  /** Valor máximo (para number/range) */
  max?: number;
  /** Passo (para number/range) */
  step?: number;
}

/**
 * Exemplo de uso de um componente
 */
export interface ComponentExample {
  /** Título do exemplo */
  title: string;
  /** Descrição do exemplo */
  description?: string;
  /** Props para o exemplo */
  props: Record<string, any>;
  /** Código do exemplo (opcional) */
  code?: string;
}

/**
 * Categoria de componente
 */
export type ComponentCategory = 
  | 'Buttons'
  | 'Inputs'
  | 'Layout'
  | 'Navigation'
  | 'Feedback'
  | 'Data Display'
  | 'Typography'
  | 'Other';

/**
 * Configuração completa da documentação de um componente
 */
export interface ComponentDocConfig<P = any> {
  /** Identificador único do componente */
  id?: string;
  /** Título/nome do componente */
  title: string;
  /** Descrição do componente */
  description: string;
  /** Categoria do componente */
  category?: ComponentCategory;
  /** O componente React */
  component: React.ComponentType<P>;
  /** Versão nativa do componente (usado pelo playground web para renderizar via react-native-web) */
  nativeComponent?: React.ComponentType<P>;
  /** Definições das props */
  props: Record<keyof P, PropDefinition>;
  /** Exemplos de uso */
  examples?: ComponentExample[];
  /** Tags para busca */
  tags?: string[];
  /** Se está deprecated */
  deprecated?: boolean;
  /** Mensagem de deprecação */
  deprecatedMessage?: string;
}

/**
 * Estado do playground
 */
export interface PlaygroundState {
  /** Props atuais do componente */
  props: Record<string, any>;
  /** Se está mostrando o código */
  showCode: boolean;
  /** Tema atual (light/dark) */
  theme: 'light' | 'dark';
}

/**
 * Ação do playground
 */
export type PlaygroundAction =
  | { type: 'UPDATE_PROP'; key: string; value: any }
  | { type: 'TOGGLE_CODE' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'RESET' };

// ─── DocApp Navigation System ────────────────────────────────────────────────

/**
 * Labels de navegação (internacionalizáveis)
 */
export interface DocNavLabels {
  welcome?: string;
  previews?: string;
  settings?: string;
}

/**
 * Configuração da tela de boas-vindas
 */
export interface WelcomeConfig {
  /** Título principal (padrão: config.title) */
  title?: string;
  /** Subtítulo */
  subtitle?: string;
  /** Descrição longa */
  description?: string;
  /** Badges informativos (ex: versão, plataforma) */
  badges?: Array<{ label: string; value: string }>;
}

/**
 * Definição de um item de configuração customizável
 */
export interface SettingDefinition {
  /** Chave única */
  key: string;
  /** Label exibido */
  label: string;
  /** Descrição opcional */
  description?: string;
  /** Tipo do controle */
  type: 'toggle' | 'select' | 'text';
  /** Opções para tipo 'select' */
  options?: Array<{ label: string; value: string }>;
  /** Valor padrão */
  defaultValue: boolean | string | number;
}

/**
 * Configuração principal do DocApp
 */
export interface DocAppConfig {
  /** Título da aplicação de documentação */
  title: string;
  /** Versão */
  version?: string;
  /** Descrição geral */
  description?: string;
  /** Lista de documentações de componentes */
  components: ComponentDocConfig[];
  /** Configuração da tela de boas-vindas */
  welcome?: WelcomeConfig;
  /** Configurações customizáveis (aparecem na tela de Settings) */
  settings?: SettingDefinition[];
  /** Labels de navegação (para i18n) */
  navLabels?: DocNavLabels;
  /** Rota inicial */
  defaultRoute?: 'welcome' | 'previews' | 'settings';
  /** Tema inicial */
  initialTheme?: 'light' | 'dark';
}

/**
 * Rota interna do DocApp
 */
export type DocRoute =
  | { page: 'welcome' }
  | { page: 'previews'; selectedId?: string }
  | { page: 'settings' };
