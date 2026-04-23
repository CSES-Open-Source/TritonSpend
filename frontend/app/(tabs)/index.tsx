import { ScrollView, XStack, YStack } from "tamagui";
import { useState, useCallback } from "react";
import { useWindowDimensions } from "react-native";
import { BACKEND_PORT } from "@env";
import { useAuth } from "@/context/authContext";
import { useFocusEffect } from "@react-navigation/native";
import { Screen } from "@/components/primitives/Screen";
import { AppText } from "@/components/primitives/AppText";
import { Card } from "@/components/primitives/Card";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { SegmentedControl } from "@/components/primitives/SegmentedControl";
import { QuickActionsSection } from "@/components/Home/QuickActionsSection";
import { WeeklySpendingSection } from "@/components/Home/WeeklySpendingSection";
import NewTransactionButton from "@/components/NewTransaction/NewTransactionButton";
import TransactionHistory from "@/components/TransactionHistory/TransactionHistory";
import CustomPieChart from "@/components/Graphs/PieChart";
import CustomLineChart from "@/components/Graphs/LineChart";
import CustomBarChart from "@/components/Graphs/BarChart";

interface Category {
  id: number;
  category_name: string;
  category_expense: string;
  max_category_budget: string;
  user_id: number;
}

interface Transaction {
  id: number;
  item_name: string;
  amount: string;
  category_name: string;
  date: string;
}

type ChartType = "pie" | "line" | "bar";
type Range = "1M" | "3M" | "6M" | "1Y";

const RANGE_CONFIG: Record<
  Range,
  { period: "daily" | "weekly"; months: number }
> = {
  "1M": { period: "daily", months: 1 },
  "3M": { period: "weekly", months: 3 },
  "6M": { period: "weekly", months: 6 },
  "1Y": { period: "weekly", months: 12 },
};

const categoryColors = new Map<string, string>([
  ["Food", "#b8b8ff"],
  ["Shopping", "#fff3b0"],
  ["Transportation", "#588157"],
  ["Subscriptions", "#ff9b85"],
  ["Other", "#2b2d42"],
]);

export default function Home() {
  const [ThreeTransactions, setThreeTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [updateRecent, setUpdateRecent] = useState(false);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [username, setUsername] = useState("");
  const [forceOpenTransaction, setForceOpenTransaction] = useState(false);

  const [chartType, setChartType] = useState<ChartType>("pie");
  const [range, setRange] = useState<Range>("3M");
  const [lineData, setLineData] = useState<{ date: string; total: number }[]>(
    []
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
        }
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

      fetch(`http://localhost:${BACKEND_PORT}/users/category/${userId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
          setTotal(
            data.reduce(
              (sum: number, category: { category_expense: string }) =>
                sum + parseFloat(category.category_expense),
              0
            )
          );
        })
        .catch((error) => {
          console.error("API Error:", error);
        });

      if (chartType === "line") {
        const { period, months } = RANGE_CONFIG[range];
        fetch(
          `http://localhost:${BACKEND_PORT}/transactions/spendingTrend/${userId}?period=${period}&months=${months}`,
          { method: "GET" }
        )
          .then((res) => res.json())
          .then((data) => setLineData(data))
          .catch((error) => {
            console.error("API Error:", error);
          });
      }

      if (chartType === "bar") {
        const { months } = RANGE_CONFIG[range];
        fetch(
          `http://localhost:${BACKEND_PORT}/transactions/monthly/${userId}`,
          {
            method: "GET",
          }
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
    }, [updateRecent, chartType, range])
  );

  const pieData = categories.map((category) => ({
    value: parseFloat(category.category_expense),
    color: categoryColors.get(category.category_name) || "#cccccc",
    name: category.category_name,
    id: category.id,
  }));

  return (
    <Screen backgroundColor="$primary">
      <ScrollView>
        <YStack px="$4" py="$4" gap="$4">
          <AppText variant="title" fontSize="$7" color="white">
            Hello {username}
          </AppText>

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
                <CustomPieChart data={pieData} size={250} total={total} />
              )}
              {chartType === "line" && (
                <CustomLineChart
                  data={lineData}
                  width={chartCardWidth}
                  height={260}
                  total={total}
                />
              )}
              {chartType === "bar" && (
                <CustomBarChart
                  data={barData}
                  width={chartCardWidth}
                  height={260}
                  total={total}
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
    </Screen>
  );
}
