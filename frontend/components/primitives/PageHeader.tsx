import React from "react";
import { XStack, YStack } from "tamagui";
import { AppText } from "./AppText";
import { useAppTheme } from "@/context/themeContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
}) => {
  const { colors } = useAppTheme();

  return (
    <XStack justifyContent="space-between" alignItems="flex-start" width="100%">
      <YStack gap="$2" flex={1}>
        <AppText
          variant="title"
          fontSize="$8"
          color={colors.onPrimary}
          letterSpacing={-0.5}
        >
          {title}
        </AppText>
        {subtitle && (
          <YStack
            alignSelf="flex-start"
            backgroundColor={colors.subtitlePillBg}
            paddingHorizontal="$3"
            paddingVertical="$1"
            borderRadius="$7"
          >
            <AppText fontSize="$2" color={colors.onPrimaryMuted}>
              {subtitle}
            </AppText>
          </YStack>
        )}
      </YStack>
      {action}
    </XStack>
  );
};
