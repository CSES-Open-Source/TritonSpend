import { Card } from "@/components/primitives/Card";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { AppText } from "@/components/primitives/AppText";
import { SegmentedControl } from "@/components/primitives/SegmentedControl";
import { useAppTheme } from "@/context/themeContext";
import { YStack } from "tamagui";

export default function ThemeToggle() {
  const { colorScheme, setColorScheme } = useAppTheme();

  return (
    <Card gap="$3">
      <SectionTitle title="Appearance" />
      <YStack gap="$2">
        <AppText variant="caption" color="$textMuted">
          Choose light or dark mode across the app.
        </AppText>
        <SegmentedControl
          value={colorScheme}
          onValueChange={setColorScheme}
          options={[
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
          ]}
        />
      </YStack>
    </Card>
  );
}
