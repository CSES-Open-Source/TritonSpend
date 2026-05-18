import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { YStack } from "tamagui";
import { useAppTheme } from "@/context/themeContext";

interface PrimaryScreenProps {
  children: React.ReactNode;
  tabBarInset?: boolean;
}

export function PrimaryScreen({
  children,
  tabBarInset = true,
}: PrimaryScreenProps) {
  const { colors } = useAppTheme();

  return (
    <YStack flex={1}>
      <LinearGradient
        colors={[...colors.primaryGradient]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[styles.blob, styles.blobTop, { backgroundColor: colors.blob }]}
        pointerEvents="none"
      />
      <View
        style={[
          styles.blob,
          styles.blobBottom,
          { backgroundColor: colors.blob },
        ]}
        pointerEvents="none"
      />
      <YStack flex={1} paddingBottom={tabBarInset ? 88 : 0}>
        {children}
      </YStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: "absolute",
    borderRadius: 999,
  },
  blobTop: {
    width: 220,
    height: 220,
    top: -60,
    right: -50,
  },
  blobBottom: {
    width: 160,
    height: 160,
    bottom: 120,
    left: -40,
  },
});
