import { Input, styled } from "tamagui";

export const AppInput = styled(Input, {
  backgroundColor: "$surfaceDefault",
  borderColor: "$borderColor",
  borderWidth: 1,
  borderRadius: "$3",
  paddingHorizontal: "$3",
  paddingVertical: "$3",
  color: "$color",
  fontFamily: "$body",
  placeholderTextColor: "$textMuted",

  focusStyle: {
    borderColor: "$primary",
    borderWidth: 2,
    backgroundColor: "$surfaceDefault",
  },

  variants: {
    size: {
      small: {
        height: 36,
        fontSize: "$2",
      },
      medium: {
        height: 48,
        fontSize: "$3",
      },
      large: {
        height: 56,
        fontSize: "$4",
      },
    },
    multiline: {
      true: {
        minHeight: 88,
        textAlignVertical: "top",
        paddingVertical: "$3",
      },
    },
    error: {
      true: {
        borderColor: "$danger",
        focusStyle: {
          borderColor: "$danger",
        },
      },
    },
  } as const,
  defaultVariants: {
    size: "medium",
  },
});
