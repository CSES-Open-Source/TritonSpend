import { Text, styled } from 'tamagui';

export const AppText = styled(Text, {
  color: '$color',
  fontFamily: '$body',

  variants: {
    variant: {
      title: {
        fontSize: '$7',
        fontWeight: 'bold',
      },
      subtitle: {
        fontSize: '$5',
        color: '$textMuted',
      },
      body: {
        fontSize: '$3',
      },
      caption: {
        fontSize: '$2',
        color: '$textMuted',
      },
    },
  } as const,
  defaultVariants: {
    variant: 'body',
  },
});
