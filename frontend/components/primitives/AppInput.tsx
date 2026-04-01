import { Input, styled } from 'tamagui';

export const AppInput = styled(Input, {
  backgroundColor: '$surface',
  borderColor: '$border',
  borderWidth: 1,
  borderRadius: '$3',
  paddingHorizontal: '$3',
  paddingVertical: '$3',
  color: '$text',
  fontFamily: '$body',

  focusStyle: {
    borderColor: '$primary',
    borderWidth: 2,
  },

  variants: {
    size: {
      small: {
        height: 36,
        fontSize: '$2',
      },
      medium: {
        height: 48,
        fontSize: '$3',
      },
      large: {
        height: 56,
        fontSize: '$4',
      },
    },
    error: {
      true: {
        borderColor: '$danger',
        focusStyle: {
          borderColor: '$danger',
        }
      }
    }
  } as const,
  defaultVariants: {
    size: 'medium',
  },
});
