/**
 * Espaçamentos do tema
 */
export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

/**
 * Cores do tema
 */
export interface ThemeColors {
  // Cores principais
  primary: string;
  secondary: string;
  accent: string;

  // Cores de feedback
  success: string;
  warning: string;
  error: string;
  info: string;

  // Cores de fundo
  background: string;
  surface: string;
  elevated: string;

  // Cores de texto
  text: string;
  textSecondary: string;
  textDisabled: string;

  // Cores de borda
  border: string;
  divider: string;

  // Overlay
  overlay: string;
}

/**
 * Tipografia do tema
 */
export interface ThemeTypography {
  fontFamily: {
    regular: string;
    mono: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  fontWeight: {
    light: string;
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

/**
 * Border radius do tema
 */
export interface ThemeBorderRadius {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

/**
 * Sombras do tema
 */
export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

/**
 * Tema completo
 */
export interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
}

/**
 * Configuração parcial para criar tema customizado
 */
export type ThemeConfig = Partial<Omit<Theme, 'mode'>> & {
  mode?: 'light' | 'dark';
};
