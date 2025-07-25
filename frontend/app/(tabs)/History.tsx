import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useState } from "react";
import BudgetChart from "@/components/HistoryBudget/BudgetChart";
import FullTransactionHistory from "@/components/TransactionHistory/FullTransactionHistory";
import { StackRouter, useFocusEffect } from "@react-navigation/native";
import { BACKEND_PORT } from "@env";
import { useAuth } from "@/context/authContext";
import { ScrollView } from "react-native-gesture-handler";

// Page for showing full Expense History along with the user's budget and how much they spent compared to their budget
export default function History() {
  // Sorting State
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"
  const [AllTransactions, setAllTransactions] = useState<any[]>([]);
  const { userId } = useAuth();
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [budget, setBudget] = useState(0);

  // Filter State
  const [filterType, setFilterType] = useState("none"); // "none", "month", "category"
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().substring(0, 7),
  ); // YYYY-MM format
  const [selectedCategory, setSelectedCategory] = useState<string>("Food");
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  // Get unique categories from transactions
  const getUniqueCategories = () => {
    const uniqueCategories = [
      ...new Set(AllTransactions.map((trans) => trans.category_name)),
    ].filter(Boolean);

    // If no categories found in transactions or they're unexpected, use default categories
    if (uniqueCategories.length === 0) {
      return ["Food", "Shopping", "Subscriptions", "Transportation", "Other"];
    }

    return uniqueCategories;
  };

  const categories = getUniqueCategories();

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
        })
        .catch((error) => {
          console.error("API Error:", error);
        });

      fetch(`http://localhost:${BACKEND_PORT}/users/${userId}`, {
        method: "GET",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setBudget(data.total_budget);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }, []),
  );

  // Toggle filter options visibility
  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  // Reset filters
  const resetFilters = () => {
    setFilterType("none");
    setSelectedCategory("Food");
    setShowFilterOptions(false);
  };

  // Filtering Logic
  const filteredTransactions = AllTransactions.filter((transaction) => {
    if (filterType === "none") return true;

    if (filterType === "month") {
      const transactionDate = new Date(transaction.date)
        .toISOString()
        .substring(0, 7);
      return transactionDate === selectedMonth;
    }

    if (filterType === "category") {
      // Handle case where transaction might not have a category
      const transactionCategory = transaction.category_name || "";
      return transactionCategory === selectedCategory;
    }

    return true;
  });

  // Sorting Logic
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let result = 0;
    if (sortBy === "date") {
      result = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "amount") {
      result = a.amount - b.amount;
    } else if (sortBy === "name") {
      result = a.item_name.localeCompare(b.item_name);
    }
    return sortOrder === "asc" ? result : -result;
  });

  // Calculate total from filtered transactions
  const totalAmount = filteredTransactions.reduce((sum, transaction) => {
    return sum + parseFloat(transaction.amount || 0);
  }, 0);

  // Format month for display
  const formatMonth = (dateString: string) => {
    const [year, month] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  // Get unique months from transactions
  const getAvailableMonths = () => {
    const months = [
      ...new Set(
        AllTransactions.map((trans) =>
          new Date(trans.date).toISOString().substring(0, 7),
        ),
      ),
    ]
      .sort()
      .reverse(); // Sort in descending order

    return months;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.homeContainer}>
        <Text style={styles.Title}>History</Text>
        {/* Pass the calculated total to BudgetChart */}
        <BudgetChart
          length={totalAmount / budget}
          Current={totalAmount}
          Budget={budget}
        />

        <View style={styles.filterSortContainer}>
          {/* Sorting Controls */}
          <View style={styles.sortingSection}>
            <TouchableOpacity
              onPress={() => setShowSortOptions(!showSortOptions)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Sort</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Controls */}
          <View style={styles.filterSection}>
            <TouchableOpacity
              onPress={toggleFilterOptions}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Filter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Selection UI */}
        {showFilterOptions && (
          <View style={styles.filterOptions}>
            <Text style={styles.filterTitle}>Filter by:</Text>

            <View style={styles.filterTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.filterTypeButton,
                  filterType === "month" && styles.selectedFilterType,
                ]}
                onPress={() => setFilterType("month")}
              >
                <Text style={styles.filterTypeText}>Month</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterTypeButton,
                  filterType === "category" && styles.selectedFilterType,
                ]}
                onPress={() => setFilterType("category")}
              >
                <Text style={styles.filterTypeText}>Category</Text>
              </TouchableOpacity>
            </View>

            {filterType === "month" && (
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                style={styles.filterPicker}
              >
                {getAvailableMonths().map((month) => (
                  <Picker.Item
                    key={`month-${month}`}
                    label={formatMonth(month)}
                    value={month}
                  />
                ))}
              </Picker>
            )}

            {filterType === "category" && (
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={styles.filterPicker}
              >
                {categories.map((category) => (
                  <Picker.Item
                    key={`category-${category}`}
                    label={category || "Uncategorized"}
                    value={category}
                  />
                ))}
              </Picker>
            )}
            <View style={styles.filterButtonsContainer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilterOptions(false)}
              >
                <Text style={styles.buttonText}>Apply Filter</Text>
              </TouchableOpacity>

              {filterType !== "none" && (
                <TouchableOpacity
                  onPress={resetFilters}
                  style={[styles.button, styles.resetButton]}
                >
                  <Text style={styles.buttonText}>Clear Filter</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {showSortOptions && (
          <View style={styles.filterOptions}>
            <Text style={styles.filterTitle}>Sort by:</Text>

            <Picker
              selectedValue={sortBy}
              onValueChange={(itemValue) => setSortBy(itemValue)}
              style={styles.filterPicker}
            >
              <Picker.Item label="Date" value="date" />
              <Picker.Item label="Amount" value="amount" />
              <Picker.Item label="Name" value="name" />
            </Picker>

            <TouchableOpacity
              onPress={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              style={styles.applyButton}
            >
              <Text style={styles.buttonText}>
                {sortOrder === "asc" ? "Ascending 🔼" : "Descending 🔽"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Display filter information */}
        {filterType !== "none" && (
          <View style={styles.activeFilterContainer}>
            <Text style={styles.activeFilterText}>
              Filtering by:{" "}
              {filterType === "month"
                ? `Month: ${formatMonth(selectedMonth)}`
                : `Category: ${selectedCategory}`}
            </Text>
            <Text style={styles.activeFilterText}>
              Total: ${totalAmount.toFixed(2)}
            </Text>
          </View>
        )}

        <FullTransactionHistory list={sortedTransactions} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  homeContainer: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "#00629B",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "column",
    gap: 10,
  },
  Title: {
    fontWeight: "bold",
    fontSize: 30,
    width: "100%",
    color: "#FFFFFF",
    paddingVertical: 10,
    textAlign: "center",
  },
  filterSortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16, // optional
    width: "50%",
  },
  filterButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16, // optional
  },
  sortingSection: {
    alignItems: "center",
  },
  filterSection: {
    alignItems: "center",
    flexDirection: "row",
  },
  picker: {
    height: 50,
    width: 150,
    backgroundColor: "#E6E6E6",
    borderRadius: 5,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#E6E6E6",
    fontWeight: "bold",
  },
  filterOptions: {
    backgroundColor: "#E6E6E6",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginVertical: 10,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterTypeButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 15,
  },
  filterTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  selectedFilterType: {
    backgroundColor: "#4CAF50",
  },
  filterTypeText: {
    fontWeight: "bold",
  },
  filterPicker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 5,
  },
  activeFilterContainer: {
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  activeFilterText: {
    fontWeight: "bold",
  },
});
