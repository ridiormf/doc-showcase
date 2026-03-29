import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-native',
    '@react-native-picker/picker',
    '@component-docs/core',
    '@component-docs/theme',
  ],
  sourcemap: true,
  treeshake: true,
  // React Native usa JSX clássico em muitos casos; jsx: preserve garante compatibilidade
  jsx: 'react-jsx',
});
