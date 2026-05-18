import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import Header from "@/components/Header/Header";
import Toast from "react-native-toast-message";
import { AuthProvider } from "@/context/authContext";
import { useAuth } from "@/context/authContext";
import { ThemeProvider as AppThemeProvider } from "@/context/themeContext";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { BACKEND_PORT } from "@env";
import { TamaguiProvider, Theme } from "tamagui";
import tamaguiConfig from "../tamagui.config";
import { useAppTheme } from "@/context/themeContext";

SplashScreen.preventAutoHideAsync();

function AuthCheck() {
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `http://localhost:${BACKEND_PORT}/auth/me`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          setChecking(false);
          return;
        }

        setChecking(false);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#395773" />
      </View>
    );
  }
  return (
    <>
      <NavigationThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Header />
        {!user ? (
          <Stack>
            <Stack.Screen name="Login" options={{ headerShown: false }} />
            <Stack.Screen
              name="NotAuthorized"
              options={{ title: "Not Authorized", headerShown: false }}
            />
          </Stack>
        ) : (
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        )}
      </NavigationThemeProvider>
      <Toast />
    </>
  );
}

function ThemedApp() {
  const { colorScheme, isReady } = useAppTheme();

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#395773" />
      </View>
    );
  }

  return (
    <Theme name={colorScheme}>
      <AuthProvider>
        <AuthCheck />
      </AuthProvider>
    </Theme>
  );
}

export default function RootLayout() {
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
    <TamaguiProvider config={tamaguiConfig}>
      <AppThemeProvider>
        <ThemedApp />
      </AppThemeProvider>
    </TamaguiProvider>
  );
}
