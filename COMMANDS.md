# 🛠️ Comandos Úteis - Component Docs

## 📦 Gerenciamento de Dependências

### Instalar Dependências
```bash
# Instalar todas as dependências do workspace
pnpm install

# Instalar em um pacote específico
pnpm --filter @component-docs/web add react-icons
pnpm --filter @component-docs/mobile add react-native-vector-icons
```

### Atualizar Dependências
```bash
# Atualizar todas as dependências
pnpm update

# Atualizar dependência específica
pnpm update react

# Verificar dependências desatualizadas
pnpm outdated
```

### Remover Dependências
```bash
# Remover de um pacote específico
pnpm --filter @component-docs/web remove react-icons
```

## 🔨 Build e Desenvolvimento

### Desenvolvimento
```bash
# Web (porta padrão 5173)
pnpm web
# ou
cd apps/web && pnpm dev

# Web em porta customizada
cd apps/web && pnpm dev -- --port 3000

# Mobile
pnpm mobile
# ou
cd apps/mobile && pnpm start

# Mobile com clear cache
cd apps/mobile && pnpm start --clear

# Mobile para plataforma específica
cd apps/mobile && pnpm ios
cd apps/mobile && pnpm android
```

### Build de Produção
```bash
# Build de todos os pacotes
pnpm build

# Build de pacote específico
cd packages/core && pnpm build
cd packages/theme && pnpm build

# Build da aplicação web
cd apps/web && pnpm build

# Preview do build web
cd apps/web && pnpm preview
```

### Limpeza
```bash
# Limpar todos os builds
pnpm clean

# Limpar node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Limpar e reinstalar
rm -rf node_modules apps/*/node_modules packages/*/node_modules && pnpm install
```

## 🔍 Type Checking e Linting

### Type Checking
```bash
# Todos os pacotes
pnpm type-check

# Pacote específico
cd packages/core && pnpm type-check
cd apps/web && pnpm type-check
```

### Linting
```bash
# Web
cd apps/web && pnpm lint
```

## 🧪 Testes (quando implementados)

```bash
# Rodar todos os testes
pnpm test

# Testes com coverage
pnpm test:coverage

# Testes em watch mode
pnpm test:watch
```

## 📝 Criando Novos Componentes

### Web
```bash
# Criar arquivos do componente
cat > apps/web/src/examples/Card.tsx << 'EOF'
import React from 'react';
import { useTheme } from '@component-docs/theme';

export interface CardProps {
  title: string;
}

export const Card: React.FC<CardProps> = ({ title }) => {
  const { theme } = useTheme();
  return <div style={{ color: theme.colors.text }}>{title}</div>;
};
EOF

# Criar documentação
cat > apps/web/src/examples/Card.doc.tsx << 'EOF'
import { ComponentDoc } from '@component-docs/core';
import { Card } from './Card';

export const CardDoc = ComponentDoc({
  title: 'Card',
  description: 'Um componente Card',
  component: Card,
  props: {
    title: {
      type: 'string',
      description: 'Título do card',
      required: true,
      control: 'text',
      defaultValue: 'Meu Card',
    },
  },
});
EOF
```

### Mobile
```bash
# Similar para mobile
cat > apps/mobile/examples/Card.tsx << 'EOF'
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@component-docs/theme';

export interface CardProps {
  title: string;
}

export const Card: React.FC<CardProps> = ({ title }) => {
  const { theme } = useTheme();
  return (
    <View>
      <Text style={{ color: theme.colors.text }}>{title}</Text>
    </View>
  );
};
EOF
```

## 🎨 Trabalhando com Temas

### Criar Tema Customizado
```bash
# Criar arquivo de tema
cat > packages/theme/src/customThemes.ts << 'EOF'
import type { Theme } from './types';

export const draculaTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#BD93F9',
    secondary: '#FF79C6',
    accent: '#50FA7B',
    background: '#282A36',
    surface: '#44475A',
    text: '#F8F8F2',
    // ... outras cores
  },
  // ... outras configurações
};
EOF
```

## 🔧 Troubleshooting

### Problemas Comuns

#### TypeScript não reconhece os pacotes
```bash
# Recompilar os pacotes
cd packages/core && pnpm build
cd ../theme && pnpm build
```

#### Erro de porta em uso (Web)
```bash
# Encontrar processo na porta
lsof -ti:5173

# Matar processo
kill -9 $(lsof -ti:5173)

# Ou usar outra porta
cd apps/web && pnpm dev -- --port 3000
```

#### Expo não conecta
```bash
# Limpar cache
cd apps/mobile
rm -rf .expo
pnpm start --clear

# Resetar completamente
rm -rf node_modules .expo
pnpm install
pnpm start
```

#### Erros de TypeScript no editor
```bash
# Recarregar workspace do VS Code
# CMD/CTRL + Shift + P -> "Reload Window"

# Ou reiniciar o servidor TypeScript
# CMD/CTRL + Shift + P -> "TypeScript: Restart TS Server"
```

## 🚀 Deploy

### Web (Vercel/Netlify)
```bash
# Build para produção
cd apps/web
pnpm build

# Pasta de output: apps/web/dist
```

### Mobile (EAS Build)
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Build iOS
cd apps/mobile
eas build --platform ios

# Build Android
eas build --platform android
```

## 📊 Monitoramento

### Bundle Size (Web)
```bash
cd apps/web
pnpm build
# Verificar tamanho em dist/

# Com análise detalhada (adicionar plugin primeiro)
pnpm add -D rollup-plugin-visualizer
# Configurar no vite.config.ts
```

### Performance
```bash
# Lighthouse (Web)
cd apps/web
pnpm build
pnpm preview
# Abrir DevTools -> Lighthouse
```

## 🔄 Git Workflow

### Commits
```bash
# Adicionar todos os arquivos
git add .

# Commit com mensagem descritiva
git commit -m "feat: adicionar componente Card"

# Push
git push origin main
```

### Branches
```bash
# Criar nova feature branch
git checkout -b feature/novo-componente

# Voltar para main
git checkout main

# Merge
git merge feature/novo-componente
```

## 📦 Publicação (NPM)

### Preparar para publicação
```bash
# Build de todos os pacotes
pnpm build

# Publicar (quando pronto)
cd packages/core
npm publish --access public

cd ../theme
npm publish --access public
```

## 🎯 Scripts Personalizados

### Adicionar no package.json root
```json
{
  "scripts": {
    "dev": "concurrently \"pnpm web\" \"pnpm mobile\"",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "update-deps": "pnpm update --latest --recursive"
  }
}
```

## 💡 Dicas Pro

### Desenvolvimento Simultâneo
```bash
# Terminal 1: Web
pnpm web

# Terminal 2: Mobile
pnpm mobile

# Terminal 3: Watch nos pacotes
cd packages/core && pnpm build --watch
```

### Hot Reload nos Pacotes
```bash
# Modificar tsconfig.json para usar path aliases
# Em apps/web/tsconfig.json:
{
  "compilerOptions": {
    "paths": {
      "@component-docs/core": ["../../packages/core/src"],
      "@component-docs/theme": ["../../packages/theme/src"]
    }
  }
}
```

## 📚 Recursos Adicionais

- [Vite Documentation](https://vitejs.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Native Documentation](https://reactnative.dev/)

---

💡 **Dica**: Salve este arquivo como referência rápida!
