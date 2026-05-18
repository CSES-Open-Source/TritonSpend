import React from "react";
import { XStack, YStack } from "tamagui";
import { AppText } from "./AppText";

interface SectionTitleProps {
  title: string;
  eyebrow?: string;
  actionText?: string;
  onAction?: () => void;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  eyebrow,
  actionText,
  onAction,
}) => {
  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      marginBottom="$3"
    >
      <YStack gap={eyebrow ? "$1" : 0}>
        {eyebrow && (
          <AppText
            variant="caption"
            textTransform="uppercase"
            letterSpacing={1.2}
            fontSize={11}
            color="$textMuted"
            fontWeight="600"
          >
            {eyebrow}
          </AppText>
        )}
        <AppText variant="title" fontSize="$6" fontWeight="700">
          {title}
        </AppText>
      </YStack>
      {actionText && (
        <YStack
          backgroundColor="$surfaceTintBlue"
          paddingHorizontal="$3"
          paddingVertical="$1"
          borderRadius="$7"
        >
          <AppText
            color="$primary"
            fontWeight="700"
            fontSize="$2"
            onPress={onAction}
            pressStyle={{ opacity: 0.7 }}
          >
            {actionText}
          </AppText>
        </YStack>
      )}
    </XStack>
  );
};
