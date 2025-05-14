import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import TransactionRow from "./TransactionRow";
import { useState, useEffect } from "react";
import { BACKEND_PORT } from "@env";
import { useAuth } from "@/context/authContext";

export default function FullTransactionHistory(props: any) {
  const { userId } = useAuth();
  const [transactions, setTransactions] = useState(props.list);

  // Sync with props.list in case it updates externally
  useEffect(() => {
    setTransactions(props.list);
  }, [props.list]);

  const handleDelete = async (transactionId: number) => {
    try {
      const res = await fetch(
        `http://localhost:${BACKEND_PORT}/transactions/${userId}/${transactionId}`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setTransactions((prev: any) =>
        prev.filter((t: any) => t.id !== transactionId),
      );
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Error", "Could not delete transaction.");
    }
  };

  const groupedByDate = transactions.reduce((acc: any, transaction: any) => {
    const dateKey = transaction.date.slice(0, 10);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(transaction);
    return acc;
  }, {});

  return (
    <View style={styles.HistoryContainer}>
      <Text style={styles.title}>Transactions</Text>
      <ScrollView>
        <View style={styles.recentTranactions}>
          {Object.entries(groupedByDate).map(([date, trans]: any) => (
            <View style={styles.row} key={date}>
              <Text style={styles.dates}>{date}</Text>
              {trans.map((transaction: any, index: number) => (
                <View key={transaction.id}>
                  <View style={styles.transactionContainer}>
                    <View style={{ flex: 1 }}>
                      <TransactionRow
                        name={transaction.item_name}
                        date={transaction.date}
                        amount={transaction.amount}
                        icon={transaction.category_id}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDelete(transaction.id)}
                    >
                      <Text style={styles.deleteButton}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  {index < trans.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  HistoryContainer: {
    backgroundColor: "white",
    width: "100%",
    flex: 1,
    borderRadius: 15,
    padding: 15,
    gap: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  recentTranactions: {
    flexDirection: "column",
    gap: 20,
  },
  row: {
    flexDirection: "column",
  },
  dates: {
    fontSize: 18,
    fontWeight: "500",
    opacity: 0.4,
  },
  transactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  deleteButton: {
    fontSize: 18,
    color: "red",
    paddingHorizontal: 10,
    fontWeight: "bold",
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
    opacity: 0.2,
    borderRadius: 2,
  },
});
