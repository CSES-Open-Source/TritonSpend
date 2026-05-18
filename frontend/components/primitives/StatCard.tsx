import React from "react";
import { Card } from "./Card";
import { AppText } from "./AppText";
import { YStack, XStack, GetProps } from "tamagui";
import { shadows } from "@/constants/shadows";

type CardProps = GetProps<typeof Card>;

interface StatCardProps extends CardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  ...props
}) => {
  return (
    <Card
      flex={1}
      padding="$4"
      backgroundColor="$surfaceTintBlue"
      borderRadius="$5"
      space="$2"
      style={shadows.sm}
      {...props}
    >
      <XStack justifyContent="space-between" alignItems="center">
        <AppText variant="caption" color="$textMuted" fontWeight="600">
          {title}
        </AppText>
        {icon}
      </XStack>
      <YStack space="$1" marginTop="$1">
        <AppText
          variant="title"
          fontSize="$8"
          letterSpacing={-0.5}
          color="$color"
        >
          {value}
        </AppText>
        {subtitle && (
          <AppText variant="caption" color="$textMuted">
            {subtitle}
          </AppText>
        )}
      </YStack>
    </Card>
  );
};
