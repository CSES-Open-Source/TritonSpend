import { View, StyleSheet, Text } from "react-native";
import TransactionRow from "./TransactionRow";
import { FontAwesome } from "@expo/vector-icons";

//container for the recent transaction history.
export default function TransactionHistory(props: any) {
  return (
    <View style={styles.HistoryContainer}>
      <View style={styles.header}>
        <Text style={{ fontWeight: "bold" }}>Recent Transactions</Text>
        <FontAwesome name="angle-right" size={20} />
      </View>
      <View style={styles.recentTranactions}>
        {props.list.map((row: any, index: any) => (
          <View key={row.id}>
            <TransactionRow
              name={row.name}
              date={row.date}
              amount={row.amount}
              key={row.id}
            />
            {index < props.list.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  HistoryContainer: {
    backgroundColor: "white",
    width: "100%",
    height: 200,
    borderRadius: 15,
    padding: 15,
    gap: 5,
  },
  header: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  recentTranactions: {
    flexDirection: "column",
    height: "100%",
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
    opacity: 0.2,
    borderRadius: 2,
  },
});
