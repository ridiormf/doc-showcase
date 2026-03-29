# Component Docs - Guia de Uso

## 📝 Visão Geral

Este projeto é uma biblioteca de documentação unificada para componentes React e React-Native. A interface e a API são **idênticas** tanto para web quanto para mobile, proporcionando uma experiência consistente de desenvolvimento.

## 🏗️ Arquitetura

```
component-docs/
├── packages/
│   ├── core/           # Lógica compartilhada, tipos e utilitários
│   └── theme/          # Sistema de temas customizáveis
├── apps/
│   ├── web/            # Aplicação web (Vite + React + React-Native-Web)
│   └── mobile/         # Aplicação mobile (Expo + React-Native)
```

## 🚀 Como Iniciar

### Instalação

```bash
# Na raiz do projeto
pnpm install

# Compilar os pacotes compartilhados
cd packages/core && pnpm build
cd ../theme && pnpm build
```

### Executar Aplicações

```bash
# Aplicação Web
pnpm web
# Acesse: http://localhost:5173

# Aplicação Mobile
pnpm mobile
# Use o Expo Go no seu celular ou emulador
```

## 📖 Como Documentar um Componente

### 1. Criar o Componente

**Web (`apps/web/src/examples/MyComponent.tsx`):**
```tsx
import React from 'react';
import { useTheme } from '@component-docs/theme';

export interface MyComponentProps {
  title: string;
  variant?: 'default' | 'primary';
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, variant = 'default' }) => {
  const { theme } = useTheme();
  
  return (
    <div style={{ color: theme.colors.text }}>
      {title}
    </div>
  );
};
```

**Mobile (`apps/mobile/examples/MyComponent.tsx`):**
```tsx
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@component-docs/theme';

export interface MyComponentProps {
  title: string;
  variant?: 'default' | 'primary';
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, variant = 'default' }) => {
  const { theme } = useTheme();
  
  return (
    <View>
      <Text style={{ color: theme.colors.text }}>
        {title}
      </Text>
    </View>
  );
};
```

### 2. Criar a Documentação

**A documentação é IDÊNTICA para web e mobile!**

```tsx
// MyComponent.doc.tsx (mesmo arquivo para web e mobile)
import { ComponentDoc } from '@component-docs/core';
import { MyComponent } from './MyComponent';

export const MyComponentDoc = ComponentDoc({
  title: 'MyComponent',
  description: 'Descrição do componente',
  category: 'Data Display',
  component: MyComponent,
  
  props: {
    title: {
      type: 'string',
      description: 'Título do componente',
      required: true,
      control: 'text',
      defaultValue: 'Hello World',
    },
    variant: {
      type: "'default' | 'primary'",
      description: 'Variante visual',
      control: 'select',
      options: ['default', 'primary'],
      defaultValue: 'default',
    },
  },
  
  examples: [
    {
      title: 'Exemplo Básico',
      description: 'Uso padrão do componente',
      props: {
        title: 'Hello',
        variant: 'default',
      },
    },
  ],
  
  tags: ['display', 'text'],
});
```

### 3. Usar na Aplicação

**Web:**
```tsx
import { ComponentDocView } from './components/ComponentDocView';
import { MyComponentDoc } from './examples/MyComponent.doc';

function App() {
  return <ComponentDocView config={MyComponentDoc} />;
}
```

**Mobile:**
```tsx
import { Playground } from './components/Playground';
import { MyComponentDoc } from './examples/MyComponent.doc';

function App() {
  return <Playground config={MyComponentDoc} />;
}
```

## 🎨 Customização de Temas

### Criar Tema Customizado

```tsx
import { createTheme, ThemeProvider } from '@component-docs/theme';

const myTheme = createTheme({
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    background: '#FFFFFF',
    text: '#000000',
    // ... outras cores
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    // ...
  },
});

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      {/* Seu app */}
    </ThemeProvider>
  );
}
```

### Usar o Tema nos Componentes

```tsx
import { useTheme } from '@component-docs/theme';

function MyComponent() {
  const { theme, toggleMode } = useTheme();
  
  return (
    <div style={{
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    }}>
      <button onClick={toggleMode}>
        Toggle {theme.mode}
      </button>
    </div>
  );
}
```

## 🎮 Controles Disponíveis

Os controles são gerados automaticamente baseado no tipo especificado:

- `text`: Campo de texto
- `number`: Campo numérico
- `boolean`: Switch/Checkbox
- `select`: Dropdown com opções
- `radio`: Botões de rádio
- `color`: Seletor de cor
- `range`: Slider numérico

## 📋 Tipos de Propriedades

```tsx
props: {
  propName: {
    type: 'string',                    // Tipo TypeScript
    description: 'Descrição da prop',  // Aparece na documentação
    required: true,                    // Se é obrigatória
    control: 'text',                   // Tipo de controle
    defaultValue: 'valor',             // Valor padrão
    options: ['opt1', 'opt2'],         // Para select/radio
    min: 0,                            // Para number/range
    max: 100,                          // Para number/range
    step: 5,                           // Para number/range
  },
}
```

## 🔄 Fluxo de Trabalho

1. **Desenvolver o componente** (web ou mobile)
2. **Criar a documentação** usando `ComponentDoc()`
3. **O sistema automaticamente**:
   - Gera playground interativo
   - Cria tabela de props
   - Renderiza exemplos
   - Gera código JSX
   - Aplica o tema

## 🌈 Categorias Disponíveis

- `Buttons` - Botões e ações
- `Inputs` - Campos de entrada
- `Layout` - Componentes de layout
- `Navigation` - Navegação
- `Feedback` - Mensagens e alertas
- `Data Display` - Exibição de dados
- `Typography` - Textos e tipografia
- `Other` - Outros

## 💡 Dicas

1. **Props idênticas**: Mantenha as props iguais entre web e mobile para máxima consistência
2. **useTheme**: Sempre use o hook `useTheme` para acessar cores e espaçamentos
3. **Responsividade**: O tema se adapta automaticamente ao tamanho da tela
4. **TypeScript**: Aproveite a tipagem completa para evitar erros

## 🔧 Scripts Úteis

```bash
# Desenvolvimento
pnpm web              # Inicia web dev server
pnpm mobile           # Inicia Expo dev server

# Build
pnpm build            # Compila todos os pacotes

# Type checking
pnpm type-check       # Verifica tipos em todo o projeto

# Limpeza
pnpm clean            # Remove builds
```

## 📦 Adicionando Novos Componentes

1. Crie o arquivo do componente em `examples/`
2. Crie o arquivo `.doc.tsx` com a documentação
3. Importe e use na aplicação principal
4. **Pronto!** O playground e documentação são gerados automaticamente

## 🎯 Benefícios

✅ **API Unificada**: Mesma forma de documentar para web e mobile  
✅ **Playground Interativo**: Teste props em tempo real  
✅ **Temas Customizáveis**: Adapte ao seu design system  
✅ **TypeScript**: Totalmente tipado  
✅ **Zero Config**: Funciona out of the box  
✅ **Produtivo**: Foco no componente, não na documentação
