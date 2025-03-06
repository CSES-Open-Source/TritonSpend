import { View, StyleSheet, Text } from "react-native";
import BudgetChart from "@/components/HistoryBudget/BudgetChart";
import FullTransactionHistory from "@/components/TransactionHistory/FullTransactionHistory";

//page for showing full Expense Hisotry along with the users budget and how much they spent compared to their budget
export default function History() {
  //place holder array for transaction history
  const AllTransactions = [
    { id: 1, name: "Spotify", date: "1/11/2025", amount: 10 },
    { id: 2, name: "Spotify", date: "1/11/2025", amount: 10 },
    { id: 3, name: "Spotify", date: "1/11/2025", amount: 10 },
    { id: 4, name: "Spotify", date: "1/12/2025", amount: 10 },
    { id: 5, name: "Spotify", date: "1/12/2025", amount: 10 },
    { id: 6, name: "Spotify", date: "1/12/2025", amount: 10 },
    { id: 7, name: "Spotify", date: "1/13/2025", amount: 10 },
    { id: 8, name: "Spotify", date: "1/13/2025", amount: 10 },
    { id: 9, name: "Spotify", date: "1/14/2025", amount: 10 },
    { id: 10, name: "Spotify", date: "1/14/2025", amount: 10 },
    { id: 11, name: "Spotify", date: "1/15/2025", amount: 10 },
    { id: 12, name: "Spotify", date: "1/15/2025", amount: 10 },
  ];

  const Budget = 3500;
  const current = 2300;
  
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.Title}>History</Text>
      <BudgetChart length={current/Budget* 100} Current={current} Budget={Budget} />
      <FullTransactionHistory list={AllTransactions} />
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
  },
  graphContainer: {
    height: 270,
    width: "100%",
    backgroundColor: "#8d82be",
    borderRadius: 15,
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  graph: {
    width: "100%",
    height: 180,
    backgroundColor: "white",
    borderRadius: 15,
  },
});
