import React from "react";
import { XStack, YStack } from "tamagui";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { QuickActionCard } from "@/components/primitives/QuickActionCard";
import { SectionTitle } from "@/components/primitives/SectionTitle";

interface QuickActionsSectionProps {
  onAddExpense: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onAddExpense,
}) => {
  return (
    <YStack gap="$3">
      <SectionTitle title="Quick Actions" />
      <XStack gap="$3">
        <QuickActionCard
          icon={<MaterialIcons name="add-circle-outline" size={28} color="#395773" />}
          label="Add Expense"
          onPress={onAddExpense}
        />
        <QuickActionCard
          icon={<MaterialIcons name="history" size={28} color="#395773" />}
          label="History"
          onPress={() => router.push("/(tabs)/History")}
        />
        <QuickActionCard
          icon={<MaterialIcons name="flag" size={28} color="#395773" />}
          label="Goals"
          onPress={() => router.push("/(tabs)/Goals")}
        />
      </XStack>
    </YStack>
  );
};
