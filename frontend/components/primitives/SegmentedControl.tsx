import React from "react";
import { XStack, YStack } from "tamagui";
import { AppText } from "./AppText";

interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  // eslint-disable-next-line no-unused-vars
  onValueChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
}: SegmentedControlProps<T>) {
  return (
    <XStack
      backgroundColor="$surfaceTintBlue"
      borderRadius="$7"
      padding="$1"
      width="100%"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <YStack
            key={option.value}
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingVertical="$2"
            borderRadius="$7"
            backgroundColor={isActive ? "$primary" : "transparent"}
            onPress={() => onValueChange(option.value)}
          >
            <AppText
              fontWeight={isActive ? "bold" : "normal"}
              color={isActive ? "$white" : "$textMuted"}
              fontSize="$2"
            >
              {option.label}
            </AppText>
          </YStack>
        );
      })}
    </XStack>
  );
}
