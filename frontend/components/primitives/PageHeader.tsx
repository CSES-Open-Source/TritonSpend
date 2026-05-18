import React from "react";
import { XStack, YStack } from "tamagui";
import { AppText } from "./AppText";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  light?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  light = true,
}) => {
  const titleColor = light ? "white" : "$color";
  const subtitleColor = light ? "white" : "$textMuted";

  return (
    <XStack justifyContent="space-between" alignItems="flex-start" width="100%">
      <YStack gap="$1" flex={1}>
        <AppText variant="title" fontSize="$7" color={titleColor}>
          {title}
        </AppText>
        {subtitle && (
          <AppText
            fontSize="$3"
            color={subtitleColor}
            opacity={light ? 0.7 : 1}
          >
            {subtitle}
          </AppText>
        )}
      </YStack>
      {action}
    </XStack>
  );
};
