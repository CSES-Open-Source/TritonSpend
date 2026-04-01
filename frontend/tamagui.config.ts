import { createTamagui, createFont } from 'tamagui';
import { tokens } from './constants/tamagui-tokens';

const interFont = createFont({
  family: 'Inter, Helvetica, Arial, sans-serif',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 32,
    8: 40,
    9: 48,
    true: 16,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 28,
    5: 32,
    6: 36,
    7: 42,
    8: 52,
    9: 60,
  },
  weight: {
    4: '400',
    7: '700',
  },
  letterSpacing: {
    4: 0,
    7: -0.5,
  },
});

export const tamaguiConfig = createTamagui({
  tokens,
  fonts: {
    heading: interFont,
    body: interFont,
  },
  themes: {
    light: {
      background: '#F7F9FA', // soft off-white from design
      color: tokens.color.text,
      primary: tokens.color.primary,
      tint: tokens.color.primary,
      icon: tokens.color.lightIcon,
      borderColor: tokens.color.border,
      shadowColor: tokens.color.black,
      textMuted: tokens.color.textMuted,

      surfaceDefault: tokens.color.surfaceDefault,
      surfaceTintBlue: tokens.color.surfaceTintBlue,
      surfaceTintGreen: tokens.color.surfaceTintGreen,
      surfaceTintYellow: tokens.color.surfaceTintYellow,
    },
    dark: {
      background: tokens.color.darkBackground,
      color: tokens.color.darkText,
      primary: tokens.color.primary,
      tint: tokens.color.darkTint,
      icon: tokens.color.darkIcon,
      borderColor: tokens.color.textMuted,
      shadowColor: tokens.color.white,
      textMuted: tokens.color.textMuted,

      surfaceDefault: tokens.color.darkSurfaceDefault,
      surfaceTintBlue: tokens.color.darkSurfaceTintBlue,
      surfaceTintGreen: tokens.color.darkSurfaceTintGreen,
      surfaceTintYellow: tokens.color.darkSurfaceTintGreen, // fallback
    },
  },
  shorthands: {
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    mx: 'marginHorizontal',
    my: 'marginVertical',
  } as const,
});

export type AppConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
