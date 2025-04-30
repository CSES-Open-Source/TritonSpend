import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import Header from "@/components/Header/Header";
import Toast from "react-native-toast-message";
import { AuthProvider } from "@/context/authContext";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

SplashScreen.preventAutoHideAsync();

function AuthCheck() {
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/me", {
          credentials: "include",
        });

        if (!response.ok) {
          setChecking(false);
          return;
        }

        setChecking(false);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setChecking(false); // Even if failed, stop loading
      }
    };
    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
          <>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              {/* <Stack.Screen
                  name="Dashboard"
                  options={{ title: "Dashboard", headerShown: false }}
                /> */}
            </Stack>
          </>
        )}
      </ThemeProvider>
      <Toast />
    </>
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
    <AuthProvider>
      <AuthCheck />
    </AuthProvider>
  );
}
