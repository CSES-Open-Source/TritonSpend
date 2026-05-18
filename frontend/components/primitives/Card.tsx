import { YStack, styled } from "tamagui";
import { shadows } from "@/constants/shadows";

export const Card = styled(YStack, {
  backgroundColor: "$surfaceDefault",
  borderRadius: "$5",
  padding: "$4",
  borderWidth: 1,
  borderColor: "$borderColor",
  ...shadows.sm,

  variants: {
    padded: {
      true: {
        padding: "$5",
      },
    },
    elevated: {
      true: {
        ...shadows.md,
      },
    },
  } as const,
});
