// src/LoginPage.tsx
import { useAuth } from "@/context/authContext";
import { View, Text, Button, StyleSheet } from "react-native";
import { BACKEND_PORT } from "@env";
import { Redirect, useRouter } from "expo-router";
import Checking from "@/components/Checking";

const LoginPage = () => {
  const router = useRouter();
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <Checking />;
  }

  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>
      <Text style={styles.message}>Sign in to access your account.</Text>
      <Button
        title="Sign in with Google"
        onPress={() => {
          router.replace(`http://localhost:${BACKEND_PORT}/auth/google`);
        }}
      />
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
