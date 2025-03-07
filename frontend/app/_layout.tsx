import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import Header from "@/components/Header/Header";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* Custom header (optional) */}
      <Header />

      {/* Stack navigator */}
      <Stack>
        {/* Tab-based navigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Standalone screens */}
        <Stack.Screen
          name="Dashboard"
          options={{ title: "Dashboard", headerShown: false }}
        />
        <Stack.Screen
          name="NotAuthorized"
          options={{ title: "Not Authorized", headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
