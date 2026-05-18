export type ColorScheme = "light" | "dark";

export interface AppThemeColors {
  primaryGradient: readonly [string, string, string];
  blob: string;
  onPrimary: string;
  onPrimaryMuted: string;
  subtitlePillBg: string;
  tabBarBg: string;
  tabBarActive: string;
  tabBarInactive: string;
  searchBg: string;
  searchBorder: string;
  searchBorderFocused: string;
  searchIcon: string;
  searchIconFocused: string;
  searchText: string;
  searchPlaceholder: string;
  modalOverlay: string;
  cardBorder: string;
  cardBorderElevated: string;
  segmentedTrack: string;
  segmentedTrackBorder: string;
  accentStatBorder: string;
  accentStatDefault: string;
  accentStatGreen: string;
  accentStatYellow: string;
  pillBg: string;
  pillActiveBg: string;
  pillText: string;
  pillActiveText: string;
  pillUcsdBg: string;
  pillUcsdBorder: string;
  pillUcsdText: string;
  headerOnPrimary: boolean;
}

export const appThemeColors: Record<ColorScheme, AppThemeColors> = {
  light: {
    primaryGradient: ["#4A7A9B", "#395773", "#2D5F7F"],
    blob: "rgba(255, 255, 255, 0.12)",
    onPrimary: "#FFFFFF",
    onPrimaryMuted: "rgba(255, 255, 255, 0.85)",
    subtitlePillBg: "rgba(255, 255, 255, 0.2)",
    tabBarBg: "#FFFFFF",
    tabBarActive: "#395773",
    tabBarInactive: "#9CA3AF",
    searchBg: "#F7F9FA",
    searchBorder: "#C6C6C8",
    searchBorderFocused: "#395773",
    searchIcon: "#7B8A96",
    searchIconFocused: "#395773",
    searchText: "#1C252E",
    searchPlaceholder: "#9CA3AF",
    modalOverlay: "rgba(0, 0, 0, 0.45)",
    cardBorder: "rgba(57, 87, 115, 0.1)",
    cardBorderElevated: "rgba(57, 87, 115, 0.06)",
    segmentedTrack: "rgba(230, 241, 244, 0.95)",
    segmentedTrackBorder: "rgba(57, 87, 115, 0.1)",
    accentStatBorder: "rgba(255, 255, 255, 0.7)",
    accentStatDefault: "#E6F1F4",
    accentStatGreen: "#EAEFE0",
    accentStatYellow: "#F6F3E6",
    pillBg: "#F3F4F6",
    pillActiveBg: "#395773",
    pillText: "#6B7280",
    pillActiveText: "#FFFFFF",
    pillUcsdBg: "#FFFBEB",
    pillUcsdBorder: "#FCD34D",
    pillUcsdText: "#92400E",
    headerOnPrimary: true,
  },
  dark: {
    primaryGradient: ["#0A1219", "#152535", "#1A3347"],
    blob: "rgba(255, 255, 255, 0.05)",
    onPrimary: "#F0F4F8",
    onPrimaryMuted: "rgba(240, 244, 248, 0.75)",
    subtitlePillBg: "rgba(255, 255, 255, 0.1)",
    tabBarBg: "#1C242C",
    tabBarActive: "#8BB4D0",
    tabBarInactive: "#7B8A96",
    searchBg: "#252D36",
    searchBorder: "#3A4550",
    searchBorderFocused: "#8BB4D0",
    searchIcon: "#9BA8B5",
    searchIconFocused: "#8BB4D0",
    searchText: "#F0F4F8",
    searchPlaceholder: "#7B8A96",
    modalOverlay: "rgba(0, 0, 0, 0.65)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    cardBorderElevated: "rgba(255, 255, 255, 0.06)",
    segmentedTrack: "rgba(26, 45, 61, 0.9)",
    segmentedTrackBorder: "rgba(255, 255, 255, 0.08)",
    accentStatBorder: "rgba(255, 255, 255, 0.12)",
    accentStatDefault: "#1A2D3D",
    accentStatGreen: "#1A2E22",
    accentStatYellow: "#2A2818",
    pillBg: "#252D36",
    pillActiveBg: "#5B8FB0",
    pillText: "#9BA8B5",
    pillActiveText: "#F0F4F8",
    pillUcsdBg: "#2A2818",
    pillUcsdBorder: "#B8860B",
    pillUcsdText: "#FCD34D",
    headerOnPrimary: true,
  },
};

export const THEME_STORAGE_KEY = "tritonspend-theme-preference";
