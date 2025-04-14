import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Linking } from "react-native";
import LogOutButton from "@/components/LogoutButton/LogOutButton"; // Assuming this is your custom logout button component

const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Use null for loading state
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Set a random user initially
  useEffect(() => {
    const randomUsername = `Guest_${Math.floor(Math.random() * 1000)}`;
    const initialGuestUser = {
      username: randomUsername,
      profile_picture: null,
      total_budget: 0,
    };
    setUser(initialGuestUser);
    setIsLoggedIn(false); // Initially treat as not fully logged in
  }, []);

  // Check login status when page loads (after the initial random user is set)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/user/status", {
          method: "GET",
          credentials: "include", // Include credentials like cookies
        });

        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(data.loggedIn);
          if (data.loggedIn) {
            setUser(data.user); // Update user with authenticated data
          } else {
            // Optionally, keep the initial guest user or reset to null
            // setUser(null);
          }
        } else {
          console.log("Not logged in or session expired");
          setIsLoggedIn(false);
          // Optionally, keep the initial guest user or reset to null
          // setUser(null);
        }
      } catch (err) {
        console.error("Error checking login status", err);
        setIsLoggedIn(false);
        // Optionally, keep the initial guest user or reset to null
        // setUser(null);
      }
    };

    checkLoginStatus();
  }, []);

  const handleGoogleLogin = () => {
    Linking.openURL("http://localhost:5000/auth/google");
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setIsLoggedIn(false);
        setUser(null);
        console.log("Logged out successfully");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  if (isLoggedIn === null) {
    return <Text>Loading...</Text>;
  }

  if (isLoggedIn && user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Welcome to your Dashboard, {user.username}!
        </Text>
        <Text style={styles.message}>Here are your details:</Text>
        <Text style={styles.details}>
          Profile Picture: {user.profile_picture || "No picture set"}
        </Text>
        <Text style={styles.details}>Total Budget: ${user.total_budget}</Text>
        <Button
          title="Go to Settings"
          onPress={() => router.push("/Account")}
        />
        <LogOutButton onLogout={handleLogout} />
      </View>
    );
  }

  // Show a "guest" view with the random user before authentication
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>
      {user && !isLoggedIn && (
        <Text style={styles.message}>Welcome, {user.username} (Guest)</Text>
      )}
      <Text style={styles.message}>Sign in to access your full account.</Text>
      <Button title="Sign in with Google" onPress={handleGoogleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default LoginPage;

