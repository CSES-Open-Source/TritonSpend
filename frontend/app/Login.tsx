// src/LoginPage.tsx
import { useAuth } from "@/context/authContext";
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { BACKEND_PORT } from "@env";
// import { useRouter } from "expo-router";

const LoginPage = () => {
  // const router = useRouter();
  const [isRedirected, setIsRedirected] = useState(false);
  const { login } = useAuth();
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth URL
    window.location.href = `http://localhost:${BACKEND_PORT}/auth/google`;
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `http://localhost:${BACKEND_PORT}/auth/me`,
          {
            credentials: "include",
          },
        );

        if (response.ok) {
          const userData = await response.json();
          localStorage.setItem("userId", userData.id);
          await login(userData);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    // Check if we've been redirected back from OAuth
    // You can also check for specific query parameters from your OAuth callback
    if (window.location.pathname === "/Login" && !isRedirected) {
      setIsRedirected(true);
      checkAuth();
    }
  }, [isRedirected]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>
      <Text style={styles.message}>Sign in to access your account.</Text>
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
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
  },
});

export default LoginPage;
