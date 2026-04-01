import React from 'react';
import { Card } from './Card';
import { AppText } from './AppText';
import { YStack, GetProps } from 'tamagui';

type CardProps = GetProps<typeof Card>;

interface QuickActionCardProps extends CardProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, label, onPress, ...props }) => {
  return (
    <Card 
      alignItems="center" 
      justifyContent="center" 
      padding="$4" 
      flex={1}
      onPress={onPress}
      pressStyle={{ opacity: 0.8, scale: 0.98 }}
      backgroundColor="$surfaceTintYellow"
      borderRadius="$5"
      {...props}
    >
      <YStack alignItems="center" space="$2">
        {icon}
        <AppText variant="caption" fontWeight="bold" color="$text" textAlign="center">{label}</AppText>
      </YStack>
    </Card>
  );
};
