import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Theme } from './types';
import { lightTheme, darkTheme } from './defaultThemes';

/**
 * Contexto do tema
 */
interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Props do ThemeProvider
 */
interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: Theme;
  defaultMode?: 'light' | 'dark';
  persistMode?: boolean;
  storageKey?: string;
}

/**
 * Provider do tema
 */
export function ThemeProvider({
  children,
  theme: customTheme,
  defaultMode = 'light',
  persistMode = true,
  storageKey = 'component-docs-theme-mode',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (customTheme) return customTheme;

    // Tenta recuperar modo salvo
    if (persistMode && typeof localStorage !== 'undefined') {
      const savedMode = localStorage.getItem(storageKey) as 'light' | 'dark' | null;
      if (savedMode) {
        return savedMode === 'dark' ? darkTheme : lightTheme;
      }
    }

    return defaultMode === 'dark' ? darkTheme : lightTheme;
  });

  // Persiste o modo quando muda
  useEffect(() => {
    if (persistMode && typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, theme.mode);
    }
  }, [theme.mode, persistMode, storageKey]);

  const toggleMode = () => {
    setTheme((current) => (current.mode === 'light' ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook para acessar o tema
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
