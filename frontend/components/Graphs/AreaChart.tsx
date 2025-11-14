import React, { useState, useMemo } from "react";
import { CategoryType } from "@/utils/FrontendTypes";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Svg, { Path, G, Line, Text as SvgText } from "react-native-svg";

interface Transaction {
  id: number;
  user_id: number;
  item_name: string;
  amount: string;
  category_name: string;
  date: string;
}

const AreaChart = (props: {
  categories: CategoryType[];
  totalBudget: number;
  transactions?: Transaction[];
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().substring(0, 7)
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [useTotalOrCategory, setUseTotalOrCategory] = useState<
    "total" | "category"
  >("total");

  const chartWidth = 280;
  const chartHeight = 180;
  const padding = 20;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  // Calculate cumulative spending data from transactions
  const chartData = useMemo(() => {
    if (!props.transactions || props.transactions.length === 0) {
      // If no transactions, return empty or flat line
      return [];
    }

    // Filter transactions by selected month/year
    const filteredTransactions = props.transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.toISOString().substring(0, 7);
      const transactionYear = transactionDate.getFullYear().toString();

      // Filter by category if in category mode
      if (useTotalOrCategory === "category") {
        if (!selectedCategory) {
          return false;
        }
        const matchesCategory =
          transaction.category_name === selectedCategory.category_name;
        const matchesMonth = transactionMonth === selectedMonth;
        const matchesYear = transactionYear === selectedYear;
        return matchesCategory && matchesMonth && matchesYear;
      } else {
        // Total mode - filter by month/year only
        const matchesMonth = transactionMonth === selectedMonth;
        const matchesYear = transactionYear === selectedYear;
        return matchesMonth && matchesYear;
      }
    });

    if (filteredTransactions.length === 0) return [];

    // Sort transactions by date
    const sortedTransactions = [...filteredTransactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Get the date range for the selected month
    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    // Create daily cumulative data
    const dailyData: { date: Date; cumulative: number }[] = [];
    let cumulative = 0;

    // Process each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);

      // Add transactions for this day
      const dayTransactions = sortedTransactions.filter((t) => {
        const tDate = new Date(t.date);
        return (
          tDate.getDate() === day &&
          tDate.getMonth() === month - 1 &&
          tDate.getFullYear() === year
        );
      });

      // Add amounts for this day
      dayTransactions.forEach((t) => {
        cumulative += parseFloat(t.amount);
      });

      dailyData.push({
        date: currentDate,
        cumulative: cumulative,
      });
    }

    // Get budget for scaling
    const budget =
      useTotalOrCategory === "total"
        ? parseFloat(String(props.totalBudget)) || 1
        : selectedCategory
          ? parseFloat(selectedCategory.max_category_budget) || 1
          : 1;

    const maxCumulative = Math.max(
      ...dailyData.map((d) => d.cumulative),
      budget
    );

    // Convert to chart coordinates
    return dailyData.map((data, index) => {
      const x = (index / (daysInMonth - 1)) * graphWidth;
      const y = graphHeight - (data.cumulative / maxCumulative) * graphHeight;
      return {
        x,
        y,
        value: data.cumulative,
        date: data.date,
      };
    });
  }, [
    useTotalOrCategory,
    selectedCategory,
    selectedMonth,
    selectedYear,
    props.transactions,
    props.categories,
    props.totalBudget,
    graphWidth,
    graphHeight,
  ]);

  // Create area path
  const areaPath = useMemo(() => {
    if (chartData.length === 0) return "";
    if (chartData.length === 1) {
      // Single point - draw a line from bottom to the point
      const point = chartData[0];
      const bottomY = graphHeight + padding;
      return `M ${point.x + padding} ${bottomY} L ${point.x + padding} ${point.y + padding} L ${point.x + padding} ${bottomY} Z`;
    }
    const points = chartData.map((d) => `${d.x + padding},${d.y + padding}`);
    const firstX = chartData[0].x + padding;
    const lastX = chartData[chartData.length - 1].x + padding;
    const bottomY = graphHeight + padding;

    return `M ${firstX} ${bottomY} L ${points.join(" L ")} L ${lastX} ${bottomY} Z`;
  }, [chartData, padding, graphHeight]);

  const currentValue = useMemo(() => {
    if (chartData.length === 0) {
      // Fallback to category totals if no transaction data
      if (useTotalOrCategory === "total") {
        return props.categories.reduce(
          (sum, cat) => sum + parseFloat(cat.category_expense),
          0
        );
      } else {
        return selectedCategory
          ? parseFloat(selectedCategory.category_expense)
          : 0;
      }
    }
    // Return the last cumulative value (total for the month)
    return chartData[chartData.length - 1]?.value || 0;
  }, [chartData, useTotalOrCategory, selectedCategory, props.categories]);

  const currentBudget = useMemo(() => {
    if (useTotalOrCategory === "total") {
      return parseFloat(String(props.totalBudget));
    } else {
      return selectedCategory
        ? parseFloat(selectedCategory.max_category_budget)
        : 0;
    }
  }, [useTotalOrCategory, selectedCategory, props.totalBudget]);

  return (
    <View style={styles.AreaContainer}>
      {/* Controls */}
      <View style={styles.controlsContainer}>
        {/* Combined Category/Total Picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={
              useTotalOrCategory === "total"
                ? "total"
                : selectedCategory?.category_name || ""
            }
            onValueChange={(itemValue) => {
              if (itemValue === "total") {
                setUseTotalOrCategory("total");
                setSelectedCategory(null);
              } else {
                setUseTotalOrCategory("category");
                const category = props.categories.find(
                  (c) => c.category_name === itemValue
                );
                setSelectedCategory(category || null);
              }
            }}
            style={styles.categoryPicker}
          >
            <Picker.Item label="All Categories (Total)" value="total" />
            {props.categories.map((cat) => (
              <Picker.Item
                key={cat.category_name}
                label={cat.category_name}
                value={cat.category_name}
              />
            ))}
          </Picker>
        </View>

        {/* Month/Year Selectors */}
        <View style={styles.dateRow}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.dateLabel}>Month:</Text>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(monthStr) => {
                // Ensure the month uses the currently selected year
                const [year, month] = monthStr.split("-");
                const newMonthStr = `${selectedYear}-${month}`;
                setSelectedMonth(newMonthStr);
              }}
              style={styles.datePicker}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const year = parseInt(selectedYear);
                const month = new Date(year, i, 1);
                const monthStr = month.toISOString().substring(0, 7);
                return (
                  <Picker.Item
                    key={monthStr}
                    label={month.toLocaleString("default", { month: "short" })}
                    value={monthStr}
                  />
                );
              })}
            </Picker>
          </View>
          <View style={styles.datePickerContainer}>
            <Text style={styles.dateLabel}>Year:</Text>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(year) => {
                setSelectedYear(year);
                // Update month to use new year but keep same month number
                const currentMonth = selectedMonth.split("-")[1];
                setSelectedMonth(`${year}-${currentMonth}`);
              }}
              style={styles.datePicker}
            >
              {Array.from({ length: 3 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <Picker.Item
                    key={year}
                    label={year.toString()}
                    value={year.toString()}
                  />
                );
              })}
            </Picker>
          </View>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          <G>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding + graphHeight - ratio * graphHeight;
              return (
                <Line
                  key={ratio}
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#E0E0E0"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              );
            })}

            {/* Area */}
            {areaPath && areaPath !== "" && chartData.length > 0 && (
              <Path
                key={`area-${selectedMonth}-${selectedYear}-${selectedCategory?.id || "total"}-${useTotalOrCategory}`}
                d={areaPath}
                fill="#00629B"
                fillOpacity="0.3"
                stroke="#00629B"
                strokeWidth="2"
              />
            )}

            {/* No data message */}
            {chartData.length === 0 && (
              <SvgText
                x={chartWidth / 2}
                y={chartHeight / 2}
                textAnchor="middle"
                fontSize="14"
                fill="#999"
              >
                No data for this period
              </SvgText>
            )}
          </G>
        </Svg>

        {/* Budget/Spending Info - Moved outside chart */}
        {chartData.length > 0 && (
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Spent:</Text>
              <Text style={styles.infoValue}>${currentValue.toFixed(2)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Budget:</Text>
              <Text style={styles.infoValue}>${currentBudget.toFixed(2)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Remaining:</Text>
              <Text
                style={[
                  styles.infoValue,
                  currentValue > currentBudget && styles.infoValueOver,
                ]}
              >
                ${(currentBudget - currentValue).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default AreaChart;

const styles = StyleSheet.create({
  AreaContainer: {
    justifyContent: "flex-start",
    width: "100%",
    alignItems: "center",
    gap: 15,
  },
  controlsContainer: {
    width: "100%",
    gap: 10,
  },
  pickerContainer: {
    width: "100%",
  },
  categoryPicker: {
    width: "100%",
    height: 45,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0D0D0",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  infoContainer: {
    marginTop: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  infoRow: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  infoValueOver: {
    color: "#D32F2F",
  },
  dateRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  datePickerContainer: {
    flex: 1,
    gap: 5,
  },
  dateLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  datePicker: {
    height: 40,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0D0D0",
  },
});
