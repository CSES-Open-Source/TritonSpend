import { Button, styled } from "tamagui";
import { shadows } from "@/constants/shadows";

export const AppButton = styled(Button, {
  backgroundColor: "$primary",
  color: "white",
  borderRadius: "$7",
  paddingHorizontal: "$5",
  paddingVertical: "$3",
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 0,
  fontWeight: "600",
  ...shadows.sm,

  hoverStyle: {
    opacity: 0.92,
  },
  pressStyle: {
    opacity: 0.85,
    scale: 0.98,
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: "$primary",
        color: "white",
      },
      secondary: {
        backgroundColor: "$secondary",
        color: "white",
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: "$primary",
        color: "$primary",
        ...shadows.sm,
        shadowOpacity: 0,
        elevation: 0,
      },
    },
  } as const,
  defaultVariants: {
    variant: "primary",
  },
});
