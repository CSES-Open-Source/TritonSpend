import { BACKEND_PORT } from "@env";
import NewTransactionRow from "./NewTransactionRow";
import { useState, useEffect } from "react";
import { YStack } from "tamagui";
import { Alert, Text, StyleSheet } from "react-native";
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

  return (
    <YStack gap="$4">
      {transactions.map((transaction: any) => (
        <NewTransactionRow
          name={transaction.item_name}
          amount={transaction.amount}
          category={transaction.category_name}
          date={transaction.date}
          deleteCallback={() => handleDelete(transaction.id)}
          key={transaction.id}
        />
      ))}
    </YStack>
  );
}
