import { ScrollView, XStack, YStack } from "tamagui";
import { useState, useCallback, useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { BACKEND_PORT } from "@env";
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
type Range = "1M" | "3M" | "6M" | "1Y";
type PaymentFilter = "ALL" | "DINING_DOLLARS" | "TRITON_CASH" | "CARD";

const RANGE_CONFIG: Record<
  Range,
  { period: "daily" | "weekly"; months: number }
> = {
  "1M": { period: "daily", months: 1 },
  "3M": { period: "weekly", months: 3 },
  "6M": { period: "weekly", months: 6 },
  "1Y": { period: "weekly", months: 12 },
};

export default function Home() {
  const [ThreeTransactions, setThreeTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [updateRecent, setUpdateRecent] = useState(false);
  const [username, setUsername] = useState("");
  const [forceOpenTransaction, setForceOpenTransaction] = useState(false);

  const [chartType, setChartType] = useState<ChartType>("pie");
  const [range, setRange] = useState<Range>("3M");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("ALL");
  const [lineData, setLineData] = useState<{ date: string; total: number }[]>(
    [],
  );
  const [barData, setBarData] = useState<{ name: string; value: number }[]>([]);

  const { userId } = useAuth();
  const screenWidth = useWindowDimensions().width;
  // page px $4 (16) * 2 + card padding $4 (16) * 2 = 64
  const chartCardWidth = screenWidth - 64;

  useFocusEffect(
    useCallback(() => {
      fetch(
        `http://localhost:${BACKEND_PORT}/transactions/getTransactions/${userId}`,
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

      fetch(`http://localhost:${BACKEND_PORT}/users/${userId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setUsername(data.username);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });

      if (chartType === "line") {
        const { period, months } = RANGE_CONFIG[range];
        const paymentParam =
          paymentFilter === "ALL" ? "" : `&payment_source=${paymentFilter}`;
        fetch(
          `http://localhost:${BACKEND_PORT}/transactions/spendingTrend/${userId}?period=${period}&months=${months}${paymentParam}`,
          { method: "GET" },
        )
          .then((res) => res.json())
          .then((data) => setLineData(data))
          .catch((error) => {
            console.error("API Error:", error);
          });
      }

      if (chartType === "bar") {
        const { months } = RANGE_CONFIG[range];
        const paymentParam =
          paymentFilter === "ALL" ? "" : `?payment_source=${paymentFilter}`;
        fetch(
          `http://localhost:${BACKEND_PORT}/transactions/monthly/${userId}${paymentParam}`,
          {
            method: "GET",
          },
        )
          .then((res) => res.json())
          .then((data: { month: string; total: number | string }[]) => {
            const mapped = data.map((d) => ({
              name: d.month,
              value: parseFloat(String(d.total)),
            }));
            setBarData(mapped.slice(-months));
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
      }
    }, [updateRecent, chartType, range, paymentFilter]),
  );

  const paymentFilteredTransactions = useMemo(() => {
    if (paymentFilter === "ALL") return allTransactions;
    return allTransactions.filter((t) => t.payment_source === paymentFilter);
  }, [allTransactions, paymentFilter]);

  const pieData = useMemo(() => {
    const totals = new Map<string, number>();
    for (const transaction of paymentFilteredTransactions) {
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
  }, [paymentFilteredTransactions]);

  const pieTotal = useMemo(
    () => pieData.reduce((sum, category) => sum + category.value, 0),
    [pieData],
  );

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

            {chartType !== "pie" && (
              <YStack marginTop="$3">
                <SegmentedControl
                  value={range}
                  onValueChange={setRange}
                  options={[
                    { label: "1M", value: "1M" },
                    { label: "3M", value: "3M" },
                    { label: "6M", value: "6M" },
                    { label: "1Y", value: "1Y" },
                  ]}
                />
              </YStack>
            )}

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
