import React, { useState } from 'react';
import { XStack, YStack } from 'tamagui';
import { AppText } from './AppText';

const PERIODS = ['1D', '1W', '1M', '1Y'] as const;
type Period = typeof PERIODS[number];

interface SegmentedControlProps {
  onValueChange?: (value: Period) => void;
  defaultValue?: Period;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ 
  onValueChange, 
  defaultValue = '1M' 
}) => {
  const [active, setActive] = useState<Period>(defaultValue);

  const handlePress = (period: Period) => {
    setActive(period);
    onValueChange?.(period);
  };

  return (
    <XStack 
      backgroundColor="$surfaceTintBlue" // light grayish blue container
      borderRadius="$7" // Pill shape container
      padding="$1"
      width="100%"
    >
      {PERIODS.map((period) => {
        const isActive = active === period;
        return (
          <YStack
            key={period}
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingVertical="$2"
            borderRadius="$7" // Pill shaped items
            backgroundColor={isActive ? '$primary' : 'transparent'}
            onPress={() => handlePress(period)}
          >
            <AppText 
              fontWeight={isActive ? 'bold' : 'normal'}
              color={isActive ? '$white' : '$textMuted'}
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
