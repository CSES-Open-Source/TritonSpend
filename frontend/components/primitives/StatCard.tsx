import React from 'react';
import { Card } from './Card';
import { AppText } from './AppText';
import { YStack, XStack, GetProps } from 'tamagui';

type CardProps = GetProps<typeof Card>;

interface StatCardProps extends CardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, trend, icon, ...props }) => {
  return (
    <Card 
      flex={1} 
      padding="$4" 
      backgroundColor="$surfaceTintBlue" 
      borderRadius="$5"
      space="$2"
      {...props}
    >
      <XStack justifyContent="space-between" alignItems="center">
        <AppText variant="caption" color="$textMuted">{title}</AppText>
        {icon}
      </XStack>
      <YStack space="$1" marginTop="$1">
        <AppText variant="title" fontSize="$8">{value}</AppText>
        {subtitle && (
          <AppText 
            variant="caption" 
            color="$textMuted" // In the reference, it's just muted grey
          >
            {subtitle}
          </AppText>
        )}
      </YStack>
    </Card>
  );
};
