import { useAuth } from "@/context/authContext";
import { router } from "expo-router";
import {StyleSheet, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

/*
  Logout button component, I made this because I felt like we would need this button again

 */
export default function LogOutButton(props: any) {
  const { logout } = useAuth();
  const logoutUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "GET",
        credentials: "include", // Include cookies for session-based authentication
      });

      if (response.ok) {
        console.log("User logged out successfully");
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
    <TouchableOpacity style={styles.ButtonContainer} onPress={logoutUser}>
      <Text style={styles.logoutText}>
        Sign Out
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ButtonContainer: {
    width: "50%",
    backgroundColor: "#f5f1e7",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  logoutText: {
    color: "black",
    fontWeight: "500",
    fontSize: 20,
  },
});
