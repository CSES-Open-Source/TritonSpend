import React from "react";
import { YStack } from "tamagui";
import { AppText } from "./AppText";
import { shadows } from "@/constants/shadows";
import { useAppTheme } from "@/context/themeContext";

interface AccentStatProps {
  value: string;
  label: string;
  backgroundColor?: string;
}

export const AccentStat: React.FC<AccentStatProps> = ({
  value,
  label,
  backgroundColor,
}) => {
  const { colors } = useAppTheme();
  const bg = backgroundColor ?? colors.accentStatDefault;

  return (
    <YStack
      flex={1}
      backgroundColor={bg}
      borderRadius={16}
      padding="$3"
      alignItems="center"
      gap="$1"
      borderWidth={1}
      borderColor={colors.accentStatBorder}
      style={shadows.sm}
    >
      <AppText variant="title" fontSize="$5" color="$primary">
        {value}
      </AppText>
      <AppText variant="caption" color="$textMuted" textAlign="center">
        {label}
      </AppText>
    </YStack>
  );
};
