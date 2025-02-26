import { View, StyleSheet, Text, Picker, TouchableOpacity } from "react-native";
import { useState } from "react";
import BudgetChart from "@/components/HistoryBudget/BudgetChart";
import FullTransactionHistory from "@/components/TransactionHistory/FullTransactionHistory";

// Page for showing full Expense History along with the user's budget and how much they spent compared to their budget
export default function History() {
  // Sorting State
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"

  // Placeholder array for transaction history
  const AllTransactions = [
    {
      id: 1,
      name: "Spotify",
      date: "1/11/2025",
      amount: 10,
      icon: "logo-tiktok",
    },
    {
      id: 2,
      name: "Spotify",
      date: "1/11/2025",
      amount: 10,
      icon: "logo-tiktok",
    },
    {
      id: 3,
      name: "Spotify",
      date: "1/11/2025",
      amount: 10,
      icon: "logo-tiktok",
    },
    {
      id: 4,
      name: "Spotify",
      date: "1/12/2025",
      amount: 10,
      icon: "logo-tiktok",
    },
    {
      id: 5,
      name: "Spotify",
      date: "1/12/2025",
      amount: 10,
      icon: "logo-tiktok",
    },
    {
      id: 6,
      name: "Spotify",
      date: "1/12/2025",
      amount: 10,
      icon: "logo-tiktok",
    },
    {
      id: 7,
      name: "Spotify",
      date: "1/13/2025",
      amount: 10,
      icon: "logo-tiktok",
    },
    {
      id: 8,
      name: "Spotify",
      date: "1/13/2025",
      amount: 10,
      icon: "logo-tiktok",
    },
    {
      id: 9,
      name: "Spotify",
      date: "1/14/2025",
      amount: 10,
      icon: "logo-tiktok",
    },
    {
      id: 10,
      name: "Spotify",
      date: "1/14/2025",
      amount: 10,
      icon: "logo-tiktok",
    },
    {
      id: 11,
      name: "Spotify",
      date: "1/15/2025",
      amount: 10,
      icon: "logo-tiktok",
    },
    {
      id: 12,
      name: "Spotify",
      date: "1/15/2025",
      amount: 10,
      icon: "logo-tiktok",
    },
  ];

  // Sorting Logic
  const sortedTransactions = [...AllTransactions].sort((a, b) => {
    let result = 0;

    if (sortBy === "date") {
      result = new Date(a.date) - new Date(b.date);
    } else if (sortBy === "amount") {
      result = a.amount - b.amount;
    } else if (sortBy === "name") {
      result = a.name.localeCompare(b.name);
    }

    return sortOrder === "asc" ? result : -result;
  });

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.Title}>History</Text>
      <BudgetChart length={150} Current={2300} Budget={3500} />

      {/* Sorting Dropdown */}
      <Picker
        selectedValue={sortBy}
        onValueChange={(itemValue) => setSortBy(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Sort by Date" value="date" />
        <Picker.Item label="Sort by Amount" value="amount" />
        <Picker.Item label="Sort by Name" value="name" />
      </Picker>

      {/* Toggle Ascending/Descending Button */}
      <TouchableOpacity
        onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        style={styles.sortButton}
      >
        <Text style={styles.sortButtonText}>
          {sortOrder === "asc" ? "Ascending 🔼" : "Descending 🔽"}
        </Text>
      </TouchableOpacity>

      <FullTransactionHistory list={sortedTransactions} />
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: "#bbadff",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 50,
    flexDirection: "column",
    gap: 17,
  },
  Title: {
    fontWeight: "bold",
    fontSize: 30,
    width: "100%",
    textAlign: "center",
  },
  picker: {
    height: 50,
    width: 200,
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10,
  },
  sortButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  sortButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default History;
