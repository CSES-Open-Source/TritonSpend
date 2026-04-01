import { YStack, styled } from 'tamagui';

export const Card = styled(YStack, {
  backgroundColor: '$surfaceDefault',
  borderRadius: '$5', // 24px radius
  padding: '$4',
  
  // By default cards are flat in the new design. 
  // We can override with elevated variant if needed.
  variants: {
    padded: {
      true: {
        padding: '$5',
      },
    },
    elevated: {
      true: {
        shadowOpacity: 0.2,
        elevation: 6,
      },
    }
  } as const,
});
