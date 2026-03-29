# ⚡ Início Rápido - 5 Minutos

## 🎯 Objetivo

Ter sua primeira documentação de componente rodando em **menos de 5 minutos**.

## 📋 Pré-requisitos

- Node.js 18+
- pnpm (ou npm/yarn)

## 🚀 Passos

### 1. Setup Inicial (2 min)

```bash
# Entre no diretório do projeto
cd /Users/ridioricardo/workspace/projetos/component-docs

# Instale as dependências
pnpm install

# Compile os pacotes compartilhados
cd packages/core && pnpm build
cd ../theme && pnpm build
cd ../..
```

### 2. Inicie a Aplicação (30 seg)

**Para Web:**
```bash
pnpm web
# Acesse: http://localhost:5173
```

**Para Mobile:**
```bash
pnpm mobile
# Escaneie o QR code com Expo Go
```

### 3. Veja o Resultado! (30 seg)

Você verá:
- ✅ Um botão interativo no playground
- ✅ Controles para modificar props em tempo real
- ✅ Botão para alternar dark/light mode
- ✅ Código JSX gerado automaticamente
- ✅ Tabela de props documentada

## 🎨 Customize (2 min)

### Mudar Tema

**Web:** Edite `apps/web/src/App.tsx`
```tsx
<ThemeProvider defaultMode="dark" persistMode>
  {/* ... */}
</ThemeProvider>
```

**Mobile:** Edite `apps/mobile/App.tsx`
```tsx
<ThemeProvider defaultMode="dark" persistMode>
  {/* ... */}
</ThemeProvider>
```

### Adicionar um Novo Componente

1. **Crie o componente** em `examples/`:

```tsx
// apps/web/src/examples/Card.tsx
import React from 'react';
import { useTheme } from '@component-docs/theme';

export interface CardProps {
  title: string;
  content: string;
}

export const Card: React.FC<CardProps> = ({ title, content }) => {
  const { theme } = useTheme();
  
  return (
    <div style={{
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.border}`,
    }}>
      <h3 style={{ color: theme.colors.text, margin: 0 }}>
        {title}
      </h3>
      <p style={{ color: theme.colors.textSecondary }}>
        {content}
      </p>
    </div>
  );
};
```

2. **Documente o componente**:

```tsx
// apps/web/src/examples/Card.doc.tsx
import { ComponentDoc } from '@component-docs/core';
import { Card } from './Card';

export const CardDoc = ComponentDoc({
  title: 'Card',
  description: 'Um cartão para exibir conteúdo',
  category: 'Data Display',
  component: Card,
  props: {
    title: {
      type: 'string',
      description: 'Título do card',
      required: true,
      control: 'text',
      defaultValue: 'Meu Card',
    },
    content: {
      type: 'string',
      description: 'Conteúdo do card',
      required: true,
      control: 'text',
      defaultValue: 'Este é o conteúdo',
    },
  },
});
```

3. **Use na aplicação**:

```tsx
// apps/web/src/App.tsx
import { CardDoc } from './examples/Card.doc';

// Substitua ButtonDoc por CardDoc
<ComponentDocView config={CardDoc} />
```

## ✅ Pronto!

Agora você tem:
- ✨ Um playground interativo
- 📖 Documentação automática
- 🎨 Temas dark/light
- 🎮 Controles para testar props

## 🔥 Próximos Passos

1. Leia o [USAGE_GUIDE.md](./USAGE_GUIDE.md) para detalhes completos
2. Veja o [ROADMAP.md](./ROADMAP.md) para features futuras
3. Customize o tema em `packages/theme/src/`
4. Adicione mais componentes!

## 🆘 Problemas Comuns

### Erro de TypeScript
```bash
# Recompile os pacotes
cd packages/core && pnpm build
cd ../theme && pnpm build
```

### Porta 5173 em uso
```bash
# Mate o processo ou use outra porta
pnpm web -- --port 3000
```

### Expo não conecta
```bash
# Limpe o cache
cd apps/mobile
pnpm start --clear
```

## 📞 Ajuda

- Veja os exemplos em `apps/web/src/examples/` ou `apps/mobile/examples/`
- Leia a documentação completa no [README.md](./README.md)
- Consulte o guia de uso em [USAGE_GUIDE.md](./USAGE_GUIDE.md)

---

🎉 **Divirta-se documentando seus componentes!**
