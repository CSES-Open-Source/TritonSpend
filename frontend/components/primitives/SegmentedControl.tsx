import React, { useState } from "react";
import { XStack, YStack } from "tamagui";
import { AppText } from "./AppText";

interface SegmentedControlProps {
  value?: string;
  onValueChange?: (value: string) => void;
  periods?: string[];
  defaultValue?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  value,
  onValueChange,
  periods = ["1D", "1W", "1M", "1Y"],
  defaultValue = "1M",
}) => {
  const [isActive, setActive] = useState(defaultValue);
  if (!value) {
    value = isActive;
  }

  const handlePress = (period: string) => {
    setActive(period);
    onValueChange?.(period);
  };

  return (
    <XStack
      backgroundColor="$surfaceTintBlue" // light grayish blue container
      borderRadius="$7" // Pill shape container
      padding="$1"
      width="100%"
      flex={1}
    >
      {periods.map((period) => {
        const isActive = value === period;
        return (
          <YStack
            key={period}
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingVertical="$2"
            borderRadius="$7" // Pill shaped items
            backgroundColor={isActive ? "$primary" : "transparent"}
            onPress={() => handlePress(period)}
          >
            <AppText
              fontWeight={isActive ? "bold" : "normal"}
              color={isActive ? "$white" : "$textMuted"}
              fontSize="$2"
            >
              {period}
            </AppText>
          </YStack>
        );
      })}
    </XStack>
  );
};
