import React from 'react';
import { Card } from './Card';
import { AppText } from './AppText';
import { YStack, Circle } from 'tamagui';

// Placeholder for an actual Donut chart which would typically use react-native-svg
// or a charting library
export const DonutCard: React.FC<{ title: string; centerMetric: string }> = ({ title, centerMetric }) => {
  return (
    <Card padding="$5" backgroundColor="$surfaceTintGreen">
      <AppText variant="subtitle" marginBottom="$5" color="$textMuted">{title}</AppText>
      
      <YStack alignItems="center" justifyContent="center">
        {/* Simple visual placeholder for a donut chart */}
        <Circle size={140} borderWidth={18} borderColor="$primary" backgroundColor="transparent">
          <YStack alignItems="center" justifyContent="center">
            <AppText fontWeight="bold" fontSize="$7">{centerMetric}</AppText>
            <AppText variant="caption" color="$textMuted">of budget</AppText>
          </YStack>
        </Circle>
      </YStack>
    </Card>
  );
};
