// src/LoginPage.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";

const LoginPage = () => {
  // const router = useRouter();

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth URL
    window.location.href = "http://localhost:5000/auth/google";
  };

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
