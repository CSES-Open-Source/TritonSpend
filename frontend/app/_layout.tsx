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
import Toast from "react-native-toast-message";
import { AuthProvider } from "@/context/authContext";
import { useAuth } from "@/context/authContext";

SplashScreen.preventAutoHideAsync();

function AuthCheck() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();

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
