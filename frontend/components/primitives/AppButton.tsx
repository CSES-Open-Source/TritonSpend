import { Button, styled } from 'tamagui';

export const AppButton = styled(Button, {
  backgroundColor: '$primary',
  color: 'white',
  borderRadius: '$7', // Pill shape
  paddingHorizontal: '$5',
  paddingVertical: '$3',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 0,

  hoverStyle: {
    opacity: 0.9,
  },
  pressStyle: {
    opacity: 0.8,
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
      },
      secondary: {
        backgroundColor: '$secondary',
        color: 'white',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$primary',
        color: '$primary',
      },
    },
  } as const,
  defaultVariants: {
    variant: 'primary',
  },
});
