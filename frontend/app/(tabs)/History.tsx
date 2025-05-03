import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useEffect, useState } from "react";
import BudgetChart from "@/components/HistoryBudget/BudgetChart";
import FullTransactionHistory from "@/components/TransactionHistory/FullTransactionHistory";
import { useFocusEffect } from "@react-navigation/native";
import { BACKEND_PORT } from '@env';

// Page for showing full Expense History along with the user's budget and how much they spent compared to their budget
export default function History() {
  // Sorting State
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"
  const [AllTransactions, setAllTransactions] = useState<any[]>([]);
  const userId = localStorage.getItem('userId');
  //our app only loads once and does not load again even if we change tabs. This is why we cant use useEffect
  //we use useFocusEffect to detect if our tab is in focus rather than using useEffect
  useFocusEffect(
    useCallback(() => {
      fetch(`http://localhost:${BACKEND_PORT}/transactions/getTransactions/${userId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAllTransactions(data);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }, []),
  );
  // Sorting Logic
  const sortedTransactions = [...AllTransactions].sort((a, b) => {
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
