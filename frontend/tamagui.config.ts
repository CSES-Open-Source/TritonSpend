import { createTamagui, createFont } from "tamagui";
import { tokens } from "./constants/tamagui-tokens";

const interFont = createFont({
  family: "Inter, Helvetica, Arial, sans-serif",
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
    4: "400",
    7: "700",
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
      background: "#F7F9FA",
      color: tokens.color.text,
      primary: tokens.color.primary,
      tint: tokens.color.primary,
      icon: tokens.color.lightIcon,
      borderColor: tokens.color.border,
      border: tokens.color.border,
      shadowColor: tokens.color.black,
      textMuted: tokens.color.textMuted,

      surface: tokens.color.surfaceDefault,
      surfaceDefault: tokens.color.surfaceDefault,
      surfaceTintBlue: tokens.color.surfaceTintBlue,
      surfaceTintGreen: tokens.color.surfaceTintGreen,
      surfaceTintYellow: tokens.color.surfaceTintYellow,
    },
    dark: {
      background: "#0D1218",
      color: "#F0F4F8",
      primary: "#6B9DB8",
      tint: "#8BB4D0",
      icon: "#9BA8B5",
      borderColor: "#3A4550",
      border: "#3A4550",
      shadowColor: tokens.color.black,
      textMuted: "#9BA8B5",

      surface: "#1C242C",
      surfaceDefault: "#1C242C",
      surfaceTintBlue: "#1A2D3D",
      surfaceTintGreen: "#1A2E22",
      surfaceTintYellow: "#2A2818",
    },
  },
  shorthands: {
    px: "paddingHorizontal",
    py: "paddingVertical",
    mx: "marginHorizontal",
    my: "marginVertical",
  } as const,
});

export type AppConfig = typeof tamaguiConfig;

declare module "tamagui" {
  // eslint-disable-next-line no-unused-vars
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
