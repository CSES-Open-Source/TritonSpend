import { useAppTheme } from "@/context/themeContext";

export function useColorScheme(): "light" | "dark" {
  return useAppTheme().colorScheme;
}
