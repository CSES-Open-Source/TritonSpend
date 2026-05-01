import { TouchableOpacity } from "react-native";
import { useCallback, useMemo, useState } from "react";
import FullTransactionHistory from "@/components/TransactionHistory/FullTransactionHistory";
import { useFocusEffect } from "@react-navigation/native";
import { BACKEND_PORT } from "@env";
import { useAuth } from "@/context/authContext";
import { ScrollView } from "react-native-gesture-handler";
import CustomLineChart from "@/components/Graphs/LineChart";
import { useWindowDimensions } from "react-native";
import { Screen } from "@/components/primitives/Screen";
import { SegmentedControl } from "@/components/primitives/SegmentedControl";
import Transaction, { Category } from "@/types/transaction";
import { AppText } from "@/components/primitives/AppText";
import { StatCard } from "@/components/primitives/StatCard";
import { Ionicons } from "@expo/vector-icons";
import { XStack, YStack } from "tamagui";
import { AppSelect } from "@/components/primitives/AppSelect";
import { AppSwitch } from "@/components/primitives/AppSwitch";
import { AppButton } from "@/components/primitives/AppButton";

type SortOption = "Date" | "Amount" | "Name";
type FilterOption = "All" | "Month" | "Category";

// Page for showing full Expense History along with the user's budget and how much they spent compared to their budget
export default function History() {
  // YYYY-MM format
  const currentMonth = new Date().toISOString().substring(0, 7);

  // Sorting State
  const [sortBy, setSortBy] = useState<SortOption>("Date");
  const [sortIsAscending, setSortIsAscending] = useState(false);
  const [AllTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const { userId } = useAuth();

  // Filter State
  const [filterType, setFilterType] = useState<FilterOption>("All");
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedCategory, setSelectedCategory] = useState<string>("Food");
  const [lineChartData, setLineChartData] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("1M");

  // Edit State
  const [showSettings, setShowSettings] = useState(false);

  const screenWidth = useWindowDimensions().width;
  const chartWidth = screenWidth * 0.75;

  // Time range configuration
  const timeRangeConfig = {
    "1M": { period: "daily", months: 1, label: "1 Month" },
    "3M": { period: "weekly", months: 3, label: "3 Months" },
    "6M": { period: "weekly", months: 6, label: "6 Months" },
    "1Y": { period: "weekly", months: 12, label: "1 Year" },
  };

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

  // Get unique months from transactions
  const months = useMemo(() => {
    const months = [
      ...new Set(
        AllTransactions.map((trans) =>
          new Date(trans.date).toISOString().substring(0, 7),
        ),
      ),
    ]
      .sort()
      .reverse(); // Sort in descending order

    if (months.length == 0 || months[0] !== currentMonth) {
      return [currentMonth, ...months];
    }

    return months;
  }, [AllTransactions]);

  //our app only loads once and does not load again even if we change tabs. This is why we cant use useEffect
  //we use useFocusEffect to detect if our tab is in focus rather than using useEffect
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
          setAllTransactions(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });

      const config =
        timeRangeConfig[selectedTimeRange as keyof typeof timeRangeConfig];
      fetch(
        `http://localhost:${BACKEND_PORT}/transactions/spendingTrend/${userId}?period=${config.period}&months=${config.months}`,
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
          setLineChartData(data);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }, [selectedTimeRange]),
  );

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Reset filters & sort
  const resetFiltersAndSort = () => {
    setFilterType("All");
    setSortBy("Date");
    setSortIsAscending(false);
  };

  // Filtering Logic
  const filteredTransactions = AllTransactions.filter((transaction) => {
    if (filterType === "All") return true;

    if (filterType === "Month") {
      const transactionDate = new Date(transaction.date)
        .toISOString()
        .substring(0, 7);
      return transactionDate === selectedMonth;
    }

    if (filterType === "Category") {
      // Handle case where transaction might not have a category
      const transactionCategory = transaction.category_name || "";
      return transactionCategory === selectedCategory;
    }

    return true;
  });

  // Sorting Logic
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

  // Calculate total from filtered transactions
  const totalAmount = useMemo(() => {
    return (
      filterType == "Month" ? filteredTransactions : AllTransactions
    ).reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
  }, [filterType, filteredTransactions]);

  // Calculate total for each category, in descending order
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

    return totals.filter(([_, number]) => number > 0);
  }, [filterType, filteredTransactions, categories]);

  return (
    <Screen backgroundColor="$lightBackground" paddingHorizontal="$4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$4">
          <AppText variant="title" fontSize="$6" alignSelf="center">
            Spending
          </AppText>
          <CustomLineChart
            data={lineChartData}
            width={chartWidth}
            height={300}
          />

          <SegmentedControl
            periods={["1M", "3M", "6M", "1Y"]}
            onValueChange={setSelectedTimeRange}
          />

          <XStack alignItems="center" justifyContent="space-between">
            <AppText variant="body" fontSize="$6">
              Top Categories
            </AppText>
            <TouchableOpacity onPress={toggleSettings}>
              <Ionicons name="settings-outline" size={25} color="#395773" />
            </TouchableOpacity>
          </XStack>

          {/* Filter Selection UI */}
          {showSettings && (
            <YStack gap="$4">
              <AppText variant="subtitle">Filter</AppText>
              <XStack justifyContent="space-between" gap="$4">
                <SegmentedControl
                  value={filterType}
                  periods={["All", "Month", "Category"]}
                  defaultValue="All"
                  onValueChange={(newValue) =>
                    setFilterType(newValue as FilterOption)
                  }
                />
              </XStack>

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
                  ></AppSwitch>
                  <AppText alignSelf="center">
                    {sortIsAscending ? "Ascending" : "Descending"}
                  </AppText>
                </XStack>
              </XStack>
              <XStack justifyContent="space-between">
                <SegmentedControl
                  value={sortBy}
                  periods={["Date", "Amount", "Name"]}
                  defaultValue="Date"
                  onValueChange={(newValue) =>
                    setSortBy(newValue as SortOption)
                  }
                />
              </XStack>
              <AppButton onPress={resetFiltersAndSort}>Reset</AppButton>
            </YStack>
          )}

          <XStack gap="$3">
            {categoryTotals.slice(0, 2).map((category) => (
              <StatCard
                key={category[0]}
                title={category[0]}
                subtitle={`${((category[1] / totalAmount) * 100).toFixed(0)}% of total`}
                value={`$${category[1].toFixed(0)}`}
                icon={
                  <Ionicons
                    name={categoryIconMapping.get(category[0])!}
                    size={16}
                    color="#395773"
                  />
                }
                flexBasis={0}
              />
            ))}
          </XStack>
          <FullTransactionHistory list={sortedTransactions} />
        </YStack>
      </ScrollView>
    </Screen>
  );
}
