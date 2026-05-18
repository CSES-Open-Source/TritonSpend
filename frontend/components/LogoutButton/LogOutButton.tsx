import { useAuth } from "@/context/authContext";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { BACKEND_PORT } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppButton } from "@/components/primitives/AppButton";

export default function LogOutButton() {
  const { logout } = useAuth();

  const logoutUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:${BACKEND_PORT}/auth/logout`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (response.ok) {
        await AsyncStorage.clear();
        Toast.show({
          type: "success",
          text1: "Logged Out",
          text2: "You have been logged out successfully.",
        });
        logout();
        router.push("/Login");
      } else {
        throw new Error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout error:", error);
      Toast.show({
        type: "error",
        text1: "Logout Error",
        text2: "An error occurred while logging out.",
      });
    }
  };

  return (
    <AppButton variant="outline" onPress={logoutUser} alignSelf="center">
      Sign Out
    </AppButton>
  );
}
