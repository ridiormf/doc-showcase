import type { Theme, ThemeConfig } from './types';
import { lightTheme, darkTheme } from './defaultThemes';

/**
 * Faz merge profundo de objetos
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key as keyof T];
    const targetValue = target[key as keyof T];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object'
    ) {
      result[key as keyof T] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key as keyof T] = sourceValue as T[keyof T];
    }
  });

  return result;
}

/**
 * Cria um tema customizado
 */
export function createTheme(config: ThemeConfig = {}): Theme {
  const baseTheme = config.mode === 'dark' ? darkTheme : lightTheme;
  return deepMerge(baseTheme, config);
}

/**
 * Obtém o tema baseado no modo
 */
export function getTheme(mode: 'light' | 'dark'): Theme {
  return mode === 'dark' ? darkTheme : lightTheme;
}
