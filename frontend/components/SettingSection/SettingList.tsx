import { YStack } from "tamagui";
import TransactionRow from "../TransactionHistory/TransactionRow";
import { AppText } from "@/components/primitives/AppText";
import { Card } from "@/components/primitives/Card";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { XStack } from "tamagui";

interface CategoryBudget {
  category_name: string;
  max_category_budget: number;
  id: number;
}

interface SettingListProps {
  list: CategoryBudget[];
  totalBudget: string;
}

export default function SettingList({ list, totalBudget }: SettingListProps) {
  return (
    <Card gap="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <AppText variant="subtitle">Total Budget</AppText>
        <AppText variant="title" fontSize="$6" color="$primary">
          ${totalBudget}
        </AppText>
      </XStack>

      <SectionTitle title="Budget per Category" />

      <YStack gap="$2">
        {list.map((section, index) => (
          <YStack key={section.id}>
            <TransactionRow
              name={section.category_name}
              amount={section.max_category_budget}
              icon={section.id}
            />
            {index < list.length - 1 && (
              <YStack
                height={1}
                backgroundColor="$border"
                marginVertical="$2"
                opacity={0.5}
              />
            )}
          </YStack>
        ))}
      </YStack>
    </Card>
  );
}
