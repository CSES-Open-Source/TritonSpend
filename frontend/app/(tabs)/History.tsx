import { TouchableOpacity } from "react-native";
import { useCallback, useMemo, useState } from "react";
import FullTransactionHistory from "@/components/TransactionHistory/FullTransactionHistory";
import { useFocusEffect } from "@react-navigation/native";
import { BACKEND_PORT } from "@env";
import { useAuth } from "@/context/authContext";
import { ScrollView } from "react-native-gesture-handler";
import CustomLineChart from "@/components/Graphs/LineChart";
import CustomBarChart from "@/components/Graphs/BarChart";
import CustomPieChart from "@/components/Graphs/PieChart";
import { SegmentedControl } from "@/components/primitives/SegmentedControl";
import { useWindowDimensions } from "react-native";
import { PrimaryScreen } from "@/components/primitives/PrimaryScreen";
import Transaction, { Category } from "@/types/transaction";
import { AppText } from "@/components/primitives/AppText";
import { StatCard } from "@/components/primitives/StatCard";
import { Card } from "@/components/primitives/Card";
import { PageHeader } from "@/components/primitives/PageHeader";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { Ionicons } from "@expo/vector-icons";
import { XStack, YStack } from "tamagui";
import { AppSelect } from "@/components/primitives/AppSelect";
import { AppSwitch } from "@/components/primitives/AppSwitch";
import { AppButton } from "@/components/primitives/AppButton";
import { categoryColors } from "@/constants/categoryColors";
import { useAppTheme } from "@/context/themeContext";

type SortOption = "Date" | "Amount" | "Name";
type FilterOption = "All" | "Month" | "Category";
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

interface ChartCategory {
  id: number;
  category_name: string;
  category_expense: string;
  max_category_budget: string;
  user_id: number;
}

export default function History() {
  const currentMonth = new Date().toISOString().substring(0, 7);

  const [sortBy, setSortBy] = useState<SortOption>("Date");
  const [sortIsAscending, setSortIsAscending] = useState(false);
  const [AllTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const { userId } = useAuth();

  const [filterType, setFilterType] = useState<FilterOption>("All");
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedCategory, setSelectedCategory] = useState<string>("Food");

  const [chartType, setChartType] = useState<ChartType>("pie");
  const [range, setRange] = useState<Range>("3M");
  const [lineData, setLineData] = useState<{ date: string; total: number }[]>(
    [],
  );
  const [barData, setBarData] = useState<{ name: string; value: number }[]>([]);
  const [chartCategories, setChartCategories] = useState<ChartCategory[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const { colors } = useAppTheme();

  const screenWidth = useWindowDimensions().width;
  const chartCardWidth = screenWidth - 64;

  const categoryIconMapping: Map<
    Category,
    | "fast-food-outline"
    | "pricetag-outline"
    | "bus-outline"
    | "calendar-outline"
    | "planet-outline"
  > = new Map([
    ["Food", "fast-food-outline"],
    ["Shopping", "pricetag-outline"],
    ["Transportation", "bus-outline"],
    ["Subscriptions", "calendar-outline"],
    ["Other", "planet-outline"],
  ]);

  const categories: Category[] = [
    "Food",
    "Shopping",
    "Subscriptions",
    "Transportation",
    "Other",
  ];

  const months = useMemo(() => {
    const months = [
      ...new Set(
        AllTransactions.map((trans) =>
          new Date(trans.date).toISOString().substring(0, 7),
        ),
      ),
    ]
      .sort()
      .reverse();

    if (months.length == 0 || months[0] !== currentMonth) {
      return [currentMonth, ...months];
    }

    return months;
  }, [AllTransactions, currentMonth]);

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
        .then((data) => setAllTransactions(data))
        .catch((error) => console.error("API Error:", error));

      fetch(`http://localhost:${BACKEND_PORT}/users/category/${userId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setChartCategories(data))
        .catch((error) => console.error("API Error:", error));

      if (chartType === "line") {
        const { period, months } = RANGE_CONFIG[range];
        fetch(
          `http://localhost:${BACKEND_PORT}/transactions/spendingTrend/${userId}?period=${period}&months=${months}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        )
          .then((res) => res.json())
          .then((data) => setLineData(data))
          .catch((error) => console.error("API Error:", error));
      }

      if (chartType === "bar") {
        const { months } = RANGE_CONFIG[range];
        fetch(
          `http://localhost:${BACKEND_PORT}/transactions/monthly/${userId}`,
          { method: "GET" },
        )
          .then((res) => res.json())
          .then((data: { month: string; total: number | string }[]) => {
            const mapped = data.map((d) => ({
              name: d.month,
              value: parseFloat(String(d.total)),
            }));
            setBarData(mapped.slice(-months));
          })
          .catch((error) => console.error("API Error:", error));
      }
    }, [chartType, range, userId]),
  );

  const pieData = chartCategories.map((category) => ({
    value: parseFloat(category.category_expense),
    color: categoryColors.get(category.category_name) || "#cccccc",
    name: category.category_name,
    id: category.id,
  }));
  const pieTotal = pieData.reduce((sum, d) => sum + d.value, 0);

  const resetFiltersAndSort = () => {
    setFilterType("All");
    setSortBy("Date");
    setSortIsAscending(false);
  };

  const filteredTransactions = AllTransactions.filter((transaction) => {
    if (filterType === "All") return true;
    if (filterType === "Month") {
      const transactionDate = new Date(transaction.date)
        .toISOString()
        .substring(0, 7);
      return transactionDate === selectedMonth;
    }
    if (filterType === "Category") {
      return (transaction.category_name || "") === selectedCategory;
    }
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let result = 0;
    if (sortBy === "Date") {
      result = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "Amount") {
      result = parseFloat(a.amount) - parseFloat(b.amount);
    } else {
      result = a.item_name.localeCompare(b.item_name);
    }
    return sortIsAscending ? result : -result;
  });

  const totalAmount = useMemo(() => {
    return (
      filterType == "Month" ? filteredTransactions : AllTransactions
    ).reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
  }, [filterType, filteredTransactions, AllTransactions]);

  const categoryTotals = useMemo(() => {
    const initialTotals = categories.reduce(
      (map, category) => map.set(category, 0),
      new Map<Category, number>(),
    );
    const totals = [
      ...(filterType == "Month"
        ? filteredTransactions
        : AllTransactions
      ).reduce(
        (currentTotals, transaction) =>
          currentTotals.set(
            transaction.category_name,
            (currentTotals.get(transaction.category_name) as number) +
              parseFloat(transaction.amount),
          ),
        initialTotals,
      ),
    ];
    totals.sort((a, b) => b[1] - a[1]);
    return totals.filter(([, amount]) => amount > 0);
  }, [filterType, filteredTransactions, AllTransactions, categories]);

  return (
    <PrimaryScreen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack px="$4" py="$4" gap="$4">
          <PageHeader
            title="Spending"
            subtitle="Track trends and transactions"
            action={
              <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
                <Ionicons
                  name="settings-outline"
                  size={25}
                  color={colors.onPrimary}
                />
              </TouchableOpacity>
            }
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

          {showSettings && (
            <Card>
              <SectionTitle title="Filter & Sort" />
              <YStack gap="$4">
                <AppText variant="subtitle">Filter</AppText>
                <AppSelect
                  options={["All", "Month", "Category"]}
                  value={filterType}
                  onValueChange={(newValue) =>
                    setFilterType(newValue as FilterOption)
                  }
                />
                {filterType === "Month" && (
                  <AppSelect
                    options={months}
                    value={selectedMonth}
                    onValueChange={setSelectedMonth}
                  />
                )}
                {filterType === "Category" && (
                  <AppSelect
                    options={categories}
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  />
                )}
                <XStack justifyContent="space-between" alignItems="center">
                  <AppText variant="subtitle">Sort</AppText>
                  <XStack gap="$2" width={148} justifyContent="space-between">
                    <AppSwitch
                      checked={sortIsAscending}
                      onCheckedChange={setSortIsAscending}
                    />
                    <AppText alignSelf="center">
                      {sortIsAscending ? "Ascending" : "Descending"}
                    </AppText>
                  </XStack>
                </XStack>
                <AppSelect
                  options={["Date", "Amount", "Name"]}
                  value={sortBy}
                  onValueChange={(newValue) =>
                    setSortBy(newValue as SortOption)
                  }
                />
                <AppButton onPress={resetFiltersAndSort}>Reset</AppButton>
              </YStack>
            </Card>
          )}

          <Card>
            <SectionTitle title="Top Categories" />
            <XStack gap="$3">
              {categoryTotals.slice(0, 2).map((category) => (
                <StatCard
                  key={category[0]}
                  title={category[0]}
                  subtitle={`${totalAmount > 0 ? ((category[1] / totalAmount) * 100).toFixed(0) : 0}% of total`}
                  value={`$${category[1].toFixed(0)}`}
                  icon={
                    <Ionicons
                      name={categoryIconMapping.get(category[0])!}
                      size={16}
                      color="$primary"
                    />
                  }
                  flexBasis={0}
                />
              ))}
            </XStack>
          </Card>

          <Card>
            <SectionTitle title="All Transactions" />
            <FullTransactionHistory list={sortedTransactions} />
          </Card>
        </YStack>
      </ScrollView>
    </PrimaryScreen>
  );
}
