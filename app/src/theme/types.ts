export type ThemeTokens = {
  colors: {
    background: string;
    surface: string;
    surfaceElevated: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentSoft: string;
    border: string;
    success: string;
    warning: string;
  };
  spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>;
  typography: Record<'title' | 'subtitle' | 'body' | 'caption', number>;
  radius: Record<'sm' | 'md' | 'lg' | 'xl', number>;
};
