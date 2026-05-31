import { ScrollView, XStack, YStack } from "tamagui";
import { useState, useCallback, useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { BACKEND_URL } from "@env";
import { useAuth } from "@/context/authContext";
import { useFocusEffect } from "@react-navigation/native";
import { PrimaryScreen } from "@/components/primitives/PrimaryScreen";
import { AppText } from "@/components/primitives/AppText";
import { PageHeader } from "@/components/primitives/PageHeader";
import { Card } from "@/components/primitives/Card";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { categoryColors } from "@/constants/categoryColors";
import { SegmentedControl } from "@/components/primitives/SegmentedControl";
import { QuickActionsSection } from "@/components/Home/QuickActionsSection";
import { WeeklySpendingSection } from "@/components/Home/WeeklySpendingSection";
import NewTransactionButton from "@/components/NewTransaction/NewTransactionButton";
import TransactionHistory from "@/components/TransactionHistory/TransactionHistory";
import CustomPieChart from "@/components/Graphs/PieChart";
import CustomLineChart from "@/components/Graphs/LineChart";
import CustomBarChart from "@/components/Graphs/BarChart";

interface Transaction {
  id: number;
  item_name: string;
  amount: string;
  category_name: string;
  payment_source?: "DINING_DOLLARS" | "TRITON_CASH" | "CARD";
  date: string;
}

type ChartType = "pie" | "line" | "bar";
type Period = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
type PaymentFilter = "ALL" | "DINING_DOLLARS" | "TRITON_CASH" | "CARD";

export default function Home() {
  const [ThreeTransactions, setThreeTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [updateRecent, setUpdateRecent] = useState(false);
  const [username, setUsername] = useState("");
  const [forceOpenTransaction, setForceOpenTransaction] = useState(false);

  const [chartType, setChartType] = useState<ChartType>("pie");
  const [period, setPeriod] = useState<Period>("YEARLY");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("ALL");

  const { userId } = useAuth();
  const screenWidth = useWindowDimensions().width;
  // page px $4 (16) * 2 + card padding $4 (16) * 2 = 64
  const chartCardWidth = screenWidth - 64;

  useFocusEffect(
    useCallback(() => {
      fetch(
        `${BACKEND_URL}/transactions/getTransactions/${userId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          setThreeTransactions(data.slice(0, 5));
          setAllTransactions(data);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });

      fetch(`${BACKEND_URL}/users/${userId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setUsername(data.username);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }, [updateRecent, userId]),
  );

  const paymentFilteredTransactions = useMemo(() => {
    if (paymentFilter === "ALL") return allTransactions;
    return allTransactions.filter((t) => t.payment_source === paymentFilter);
  }, [allTransactions, paymentFilter]);

  const pieTransactions = useMemo(() => {
    const now = Date.now();
    if (period === "YEARLY") {
      return paymentFilteredTransactions;
    }
    const msByPeriod: Record<Exclude<Period, "YEARLY">, number> = {
      DAILY: 24 * 60 * 60 * 1000,
      WEEKLY: 7 * 24 * 60 * 60 * 1000,
      MONTHLY: 30 * 24 * 60 * 60 * 1000,
    };
    const cutoff = now - msByPeriod[period];
    return paymentFilteredTransactions.filter(
      (t) => new Date(t.date).getTime() >= cutoff,
    );
  }, [paymentFilteredTransactions, period]);

  const pieData = useMemo(() => {
    const totals = new Map<string, number>();
    for (const transaction of pieTransactions) {
      totals.set(
        transaction.category_name,
        (totals.get(transaction.category_name) || 0) +
          parseFloat(transaction.amount),
      );
    }
    return [...totals.entries()]
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        value,
        color: categoryColors.get(name) || "#cccccc",
        name,
        id: name,
      }));
  }, [pieTransactions]);

  const pieTotal = useMemo(
    () => pieData.reduce((sum, category) => sum + category.value, 0),
    [pieData],
  );

  const lineData = useMemo(() => {
    const totalsByBucket = new Map<string, number>();
    for (const transaction of paymentFilteredTransactions) {
      const date = new Date(transaction.date);
      let bucket = "";
      if (period === "YEARLY") {
        bucket = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      } else if (period === "MONTHLY") {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        bucket = startOfWeek.toISOString().split("T")[0];
      } else {
        bucket = date.toISOString().split("T")[0];
      }
      totalsByBucket.set(
        bucket,
        (totalsByBucket.get(bucket) || 0) + parseFloat(transaction.amount),
      );
    }
    return [...totalsByBucket.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, total]) => ({ date, total }));
  }, [paymentFilteredTransactions, period]);

  const barData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (period === "DAILY") {
      const byDate = new Map<string, number>();
      for (const transaction of paymentFilteredTransactions) {
        const d = new Date(transaction.date);
        d.setHours(0, 0, 0, 0);
        const key = d.toISOString().split("T")[0];
        byDate.set(
          key,
          (byDate.get(key) || 0) + parseFloat(transaction.amount),
        );
      }

      return Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (29 - i));
        const key = d.toISOString().split("T")[0];
        return { name: key, value: byDate.get(key) || 0 };
      });
    }

    if (period === "WEEKLY") {
      return Array.from({ length: 4 }, (_, i) => {
        const end = new Date(today);
        end.setDate(today.getDate() - (3 - i) * 7);
        const start = new Date(end);
        start.setDate(end.getDate() - 6);

        let total = 0;
        for (const transaction of paymentFilteredTransactions) {
          const d = new Date(transaction.date);
          d.setHours(0, 0, 0, 0);
          if (d >= start && d <= end) {
            total += parseFloat(transaction.amount);
          }
        }

        const startLabel = start.toLocaleString("default", {
          month: "short",
          day: "numeric",
        });
        const endLabel = end.toLocaleString("default", {
          month: "short",
          day: "numeric",
        });
        return { name: `${startLabel}-${endLabel}`, value: total };
      });
    }

    if (period === "MONTHLY") {
      const monthlyTotals = new Map<string, number>();
      for (const transaction of paymentFilteredTransactions) {
        const date = new Date(transaction.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        monthlyTotals.set(
          key,
          (monthlyTotals.get(key) || 0) + parseFloat(transaction.amount),
        );
      }
      return Array.from({ length: 6 }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return { name: key, value: monthlyTotals.get(key) || 0 };
      });
    }

    return lineData.map((d) => ({ name: d.date, value: d.total }));
  }, [lineData, period, paymentFilteredTransactions]);

  return (
    <PrimaryScreen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack px="$4" py="$4" gap="$4">
          <PageHeader
            title={`Hello ${username}`}
            subtitle="Your spending overview"
          />

          <Card elevated>
            <SectionTitle title="Total Spending" />

            <SegmentedControl
              value={chartType}
              onValueChange={setChartType}
              options={[
                { label: "Pie", value: "pie" },
                { label: "Line", value: "line" },
                { label: "Bar", value: "bar" },
              ]}
            />
            <YStack marginTop="$3">
              <SegmentedControl
                value={paymentFilter}
                onValueChange={setPaymentFilter}
                options={[
                  { label: "All", value: "ALL" },
                  { label: "Dining", value: "DINING_DOLLARS" },
                  { label: "Triton", value: "TRITON_CASH" },
                  { label: "Card", value: "CARD" },
                ]}
              />
            </YStack>
            <YStack marginTop="$3">
              <SegmentedControl
                value={period}
                onValueChange={setPeriod}
                options={[
                  { label: "Daily", value: "DAILY" },
                  { label: "Weekly", value: "WEEKLY" },
                  { label: "Monthly", value: "MONTHLY" },
                  { label: "Total", value: "YEARLY" },
                ]}
              />
            </YStack>

            <YStack marginTop="$3" alignItems="center">
              {chartType === "pie" && (
                <CustomPieChart data={pieData} size={250} total={pieTotal} />
              )}
              {chartType === "line" && (
                <CustomLineChart
                  data={lineData}
                  width={chartCardWidth}
                  height={260}
                  total={lineData.reduce((sum, d) => sum + d.total, 0)}
                />
              )}
              {chartType === "bar" && (
                <CustomBarChart
                  data={barData}
                  width={chartCardWidth}
                  height={260}
                  total={barData.reduce((sum, d) => sum + d.value, 0)}
                />
              )}
            </YStack>

            {chartType === "pie" && (
              <XStack flexWrap="wrap" gap="$2" marginTop="$2">
                {pieData.map((category) => (
                  <XStack key={category.id} alignItems="center" gap="$2">
                    <YStack
                      width={16}
                      height={16}
                      borderRadius="$1"
                      backgroundColor={category.color}
                    />
                    <AppText variant="caption">{category.name}</AppText>
                  </XStack>
                ))}
              </XStack>
            )}
          </Card>

          <Card>
            <WeeklySpendingSection transactions={allTransactions} />
          </Card>

          <Card>
            <QuickActionsSection
              onAddExpense={() => setForceOpenTransaction(true)}
            />
          </Card>

          <NewTransactionButton
            setUpdateRecent={setUpdateRecent}
            updateRecent={updateRecent}
            forceOpen={forceOpenTransaction}
            onForceOpenHandled={() => setForceOpenTransaction(false)}
          />

          <Card>
            <SectionTitle title="Recent Transactions" />
            <TransactionHistory list={ThreeTransactions} />
          </Card>
        </YStack>
      </ScrollView>
    </PrimaryScreen>
  );
}
