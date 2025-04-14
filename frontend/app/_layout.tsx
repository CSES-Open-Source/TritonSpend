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
import { useRouter } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const router = useRouter();
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
  // useEffect(() => {
  //   // If the user is not logged in, navigate to the login screen
  //   console.log("user" + user)
  //   if (!user) {
  //     router.replace("/Login");
  //   }
  // }, [user, router]);
  return (
    <>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          {/* Custom header (optional) */}
          <Header />

          {/* Stack navigator */}
          <Stack>
            {/* Tab-based navigation */}
            <Stack.Screen name="Login" options={{ headerShown: false }} />
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="Dashboard"
                options={{ title: "Dashboard", headerShown: false }}
              />
              <Stack.Screen
                name="NotAuthorized"
                options={{ title: "Not Authorized", headerShown: false }}
              />
            </>
          </Stack>
        </ThemeProvider>
        <Toast />
      </AuthProvider>
    </>
  );
}
