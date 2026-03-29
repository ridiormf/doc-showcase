# 🎨 Component Docs

Uma biblioteca moderna e unificada para documentação de componentes React e React-Native com interface interativa e customização completa de temas.

## ✨ Características

- 🔄 **Interface Unificada**: Mesma API para documentar componentes web e mobile
- 🎮 **Playground Interativo**: Teste props dinamicamente em tempo real
- 🎨 **Temas Customizáveis**: Sistema completo de temas com suporte a dark/light mode
- 📱 **Cross-Platform**: React-Native-Web permite componentes mobile na web
- 🔷 **TypeScript First**: Totalmente tipado para melhor DX
- 🏗️ **Monorepo**: Estrutura organizada com pnpm workspaces
- ⚡ **Vite**: Build rápido para web
- 📲 **Expo**: Desenvolvimento mobile simplificado

## 🚀 Quick Start

```bash
# Clonar/acessar o projeto
cd component-docs

# Instalar dependências
pnpm install

# Compilar pacotes core
cd packages/core && pnpm build
cd ../theme && pnpm build

# Iniciar web
pnpm web

# OU iniciar mobile
pnpm mobile
```

## 📖 Documentar um Componente

```tsx
import { ComponentDoc } from '@component-docs/core';
import { Button } from './Button';

export const ButtonDoc = ComponentDoc({
  title: 'Button',
  description: 'Um botão customizável',
  category: 'Buttons',
  component: Button,
  props: {
    label: {
      type: 'string',
      description: 'Texto do botão',
      required: true,
      control: 'text',
      defaultValue: 'Clique aqui',
    },
    variant: {
      type: "'primary' | 'secondary'",
      description: 'Variante visual',
      control: 'select',
      options: ['primary', 'secondary'],
      defaultValue: 'primary',
    },
  },
  examples: [
    {
      title: 'Botão Primary',
      props: { label: 'Primary', variant: 'primary' },
    },
  ],
});
```

**É isso!** O playground, tabela de props e exemplos são gerados automaticamente.

## 🏗️ Estrutura do Projeto

```
component-docs/
├── packages/
│   ├── core/           # Sistema de documentação
│   │   ├── types.ts              # Tipos compartilhados
│   │   ├── registry.ts           # Registro de componentes
│   │   ├── componentDoc.ts       # API de documentação
│   │   └── utils.ts              # Utilitários
│   └── theme/          # Sistema de temas
│       ├── types.ts              # Tipos de tema
│       ├── defaultThemes.ts      # Temas light/dark
│       ├── createTheme.ts        # Criador de temas
│       └── ThemeProvider.tsx     # Provider do tema
├── apps/
│   ├── web/            # App web (Vite + React)
│   │   ├── components/           # Componentes de UI
│   │   └── examples/             # Componentes documentados
│   └── mobile/         # App mobile (Expo)
│       ├── components/           # Componentes de UI
│       └── examples/             # Componentes documentados
```

## 🎨 Sistema de Temas

### Usar Tema Padrão

```tsx
import { ThemeProvider } from '@component-docs/theme';

function App() {
  return (
    <ThemeProvider defaultMode="light" persistMode>
      {/* Seu app */}
    </ThemeProvider>
  );
}
```

### Criar Tema Customizado

```tsx
import { createTheme, ThemeProvider } from '@component-docs/theme';

const myTheme = createTheme({
  mode: 'light',
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
});

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      {/* Seu app */}
    </ThemeProvider>
  );
}
```

### Usar o Tema

```tsx
import { useTheme } from '@component-docs/theme';

function MyComponent() {
  const { theme, toggleMode, setTheme } = useTheme();
  
  return (
    <div style={{
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      padding: theme.spacing.md,
    }}>
      Mode: {theme.mode}
      <button onClick={toggleMode}>Toggle Theme</button>
    </div>
  );
}
```

## 🎮 Controles Interativos

A biblioteca suporta diversos tipos de controles para props:

| Control | Tipo | Uso |
|---------|------|-----|
| `text` | string | Campos de texto |
| `number` | number | Campos numéricos |
| `boolean` | boolean | Switch/Checkbox |
| `select` | enum | Dropdown de opções |
| `radio` | enum | Botões de rádio |
| `color` | string | Seletor de cor |
| `range` | number | Slider numérico |

## 📦 Pacotes

### @component-docs/core

Fornece a lógica central de documentação:

- `ComponentDoc()`: API para documentar componentes
- `useComponentDoc()`: Hook para acessar documentação
- `playgroundReducer`: Gerenciador de estado do playground
- `generateCode()`: Gerador de código JSX

### @component-docs/theme

Sistema completo de temas:

- `ThemeProvider`: Provider do contexto de tema
- `useTheme()`: Hook para acessar o tema
- `createTheme()`: Criar temas customizados
- Temas light/dark padrão inclusos

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm web              # Inicia servidor de desenvolvimento web
pnpm mobile           # Inicia Expo dev server

# Build
pnpm build            # Compila todos os pacotes

# Type Checking
pnpm type-check       # Verifica tipos TypeScript

# Limpeza
pnpm clean            # Remove arquivos de build
```

## 💡 Casos de Uso

1. **Design Systems**: Documente seu design system
2. **Component Libraries**: Crie documentação interativa
3. **Protótipos**: Teste variações rapidamente
4. **Onboarding**: Ensine desenvolvedores a usar componentes
5. **Style Guides**: Mantenha guias de estilo atualizados

## 🤝 Contribuindo

1. Adicione novos tipos de controle em `packages/core/src/types.ts`
2. Crie componentes de UI em `apps/web/src/components/` ou `apps/mobile/components/`
3. Documente componentes de exemplo em `examples/`
4. Customize temas em `packages/theme/src/`

## 📄 Licença

MIT

## 🎯 Roadmap

- [ ] Mais tipos de controles
- [ ] Suporte a MDX para documentação rica
- [ ] Geração automática de documentação a partir de tipos
- [ ] Integração com Figma
- [ ] Busca e navegação entre componentes
- [ ] Exportação de tema para código
- [ ] Testes visuais automatizados

---

Criado com ❤️ para simplificar a documentação de componentes React/React-Native
