import React from 'react';
import { XStack } from 'tamagui';
import { AppText } from './AppText';

interface SectionTitleProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, actionText, onAction }) => {
  return (
    <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
      <AppText variant="title" fontSize="$6">{title}</AppText>
      {actionText && (
        <AppText 
          color="$primary" 
          fontWeight="bold" 
          onPress={onAction}
          pressStyle={{ opacity: 0.7 }}
        >
          {actionText}
        </AppText>
      )}
    </XStack>
  );
};
