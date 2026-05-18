import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  appThemeColors,
  ColorScheme,
  THEME_STORAGE_KEY,
  type AppThemeColors,
} from "@/constants/appTheme";

interface ThemeContextValue {
  colorScheme: ColorScheme;
  colors: AppThemeColors;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (stored === "light" || stored === "dark") {
          setColorSchemeState(stored);
        }
      })
      .catch(() => {})
      .finally(() => setIsReady(true));
  }, []);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, scheme).catch(() => {});
  }, []);

  const toggleColorScheme = useCallback(() => {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  }, [colorScheme, setColorScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorScheme,
      colors: appThemeColors[colorScheme],
      setColorScheme,
      toggleColorScheme,
      isReady,
    }),
    [colorScheme, setColorScheme, toggleColorScheme, isReady],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return ctx;
}
