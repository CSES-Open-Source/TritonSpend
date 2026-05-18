import { useAuth } from "@/context/authContext";
import React, { useEffect, useState } from "react";
import { BACKEND_PORT } from "@env";
import { Screen } from "@/components/primitives/Screen";
import { Card } from "@/components/primitives/Card";
import { AppText } from "@/components/primitives/AppText";
import { AppButton } from "@/components/primitives/AppButton";
import { YStack } from "tamagui";

const LoginPage = () => {
  const [isRedirected, setIsRedirected] = useState(false);
  const { login } = useAuth();

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:${BACKEND_PORT}/auth/google`;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `http://localhost:${BACKEND_PORT}/auth/me`,
          { credentials: "include" },
        );

        if (response.ok) {
          const userData = await response.json();
          await login(userData);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    if (window.location.pathname === "/Login" && !isRedirected) {
      setIsRedirected(true);
      checkAuth();
    }
  }, [isRedirected, login]);

  return (
    <Screen
      backgroundColor="$primary"
      justifyContent="center"
      alignItems="center"
    >
      <Card width="90%" maxWidth={400} gap="$4" padding="$5">
        <YStack gap="$2" alignItems="center">
          <AppText variant="title" fontSize="$7" color="$primary">
            TritonSpend
          </AppText>
          <AppText variant="subtitle" textAlign="center">
            Sign in to access your account
          </AppText>
        </YStack>
        <AppButton onPress={handleGoogleLogin}>Sign in with Google</AppButton>
      </Card>
    </Screen>
  );
};

export default LoginPage;
