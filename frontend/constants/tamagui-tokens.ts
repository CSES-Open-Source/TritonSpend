import { createTokens } from 'tamagui';

export const tokens = createTokens({
  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 32,
    8: 40,
    9: 48,
    10: 64,
    true: 16,
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 32,
    8: 40,
    9: 48,
    10: 64,
    true: 16,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
  color: {
    // Light Theme Colors
    lightText: '#11181C',
    lightBackground: '#ffffff',
    lightTint: '#0a7ea4',
    lightIcon: '#687076',
    
    // Dark Theme Colors
    darkText: '#ECEDEE',
    darkBackground: '#151718',
    darkTint: '#ffffff',
    darkIcon: '#9BA1A6',

    // Generic Colors
    white: '#FFFFFF',
    black: '#000000',
    primary: '#395773', // the navy blue from the design
    secondary: '#5856D6',
    
    // Surface variants
    surfaceDefault: '#FFFFFF',
    surfaceTintBlue: '#E6F1F4', // daily spending / goals
    surfaceTintGreen: '#EAEFE0', // weekly spending donut card
    surfaceTintYellow: '#F6F3E6', // quick actions save more
    darkSurfaceDefault: '#212325',
    darkSurfaceTintBlue: '#0A2540',
    darkSurfaceTintGreen: '#0D2916',

    // Semantic
    text: '#1C252E',
    textMuted: '#7B8A96',
    border: '#C6C6C8',
    danger: '#FF3B30',
    success: '#34C759',
    warning: '#FFCC00',
    info: '#5AC8FA',
  },
  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 24, // good for standard cards
    6: 32, // larger rounded cards
    7: 9999, // pill
    true: 24,
  },
});
