import React, { useState, useMemo } from "react";
import { YStack } from "tamagui";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { SegmentedControl } from "@/components/primitives/SegmentedControl";
import { StatCard } from "@/components/primitives/StatCard";

type Period = "1D" | "1W" | "1M" | "1Y";

interface Transaction {
  id: number;
  item_name: string;
  amount: string;
  category_name: string;
  date: string;
}

interface WeeklySpendingSectionProps {
  transactions: Transaction[];
}

const PERIOD_LABELS: Record<Period, string> = {
  "1D": "today",
  "1W": "this week",
  "1M": "this month",
  "1Y": "this year",
};

function getCutoff(period: Period): Date {
  const now = new Date();
  switch (period) {
    case "1D":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case "1W":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "1M":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "1Y":
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }
}

export const WeeklySpendingSection: React.FC<WeeklySpendingSectionProps> = ({
  transactions,
}) => {
  const [period, setPeriod] = useState<Period>("1M");

  const filteredTotal = useMemo(() => {
    const cutoff = getCutoff(period);
    return transactions
      .filter((t) => new Date(t.date) >= cutoff)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }, [transactions, period]);

  return (
    <YStack gap="$3">
      <SectionTitle title="Spending Overview" />
      <SegmentedControl
        defaultValue="1M"
        onValueChange={(val) => setPeriod(val)}
      />
      <StatCard
        title="Total Spent"
        value={`$${filteredTotal.toFixed(2)}`}
        subtitle={PERIOD_LABELS[period]}
        backgroundColor="$surfaceTintBlue"
      />
    </YStack>
  );
};
