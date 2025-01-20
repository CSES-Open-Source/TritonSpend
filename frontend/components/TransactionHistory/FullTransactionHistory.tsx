import { View, StyleSheet, Text, ScrollView } from "react-native";
import TransactionRow from "./TransactionRow";
import { FontAwesome } from "@expo/vector-icons";

//container for the recent transaction history.
export default function FullTransactionHistory(props: any) {
  const groupedByDate = props.list.reduce(
    (acc: { [x: string]: any[] }, transaction: { date: string | number }) => {
      if (!acc[transaction.date]) {
        acc[transaction.date] = [];
      }
      acc[transaction.date].push(transaction);
      return acc;
    },
    {},
  );
  console.log(groupedByDate);
  return (
    <View style={styles.HistoryContainer}>
      <Text style={{ fontSize: 20, fontWeight: 500 }}>Transactions</Text>
      <ScrollView>
        <View style={styles.recentTranactions}>
          {Object.entries(groupedByDate).map(([date, transactions]: any) => (
            <View style={styles.row}>
              <Text style={styles.dates}>{date}</Text>
              {transactions.map(
                (
                  transaction: { name: any; date: any; amount: any; id: any },
                  index: any,
                ) => (
                  <View>
                    <TransactionRow
                      name={transaction.name}
                      date={transaction.date}
                      amount={transaction.amount}
                      key={transaction.id}
                    />
                    {index < transactions.length - 1 && (
                      <View style={styles.separator} />
                    )}
                  </View>
                ),
              )}
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
    height: 450,
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
    gap: 20,
  },
  row: {
    height: "auto",
    flexDirection: "column",
  },
  dates: {
    fontSize: 18,
    fontWeight: 500,
    opacity: 0.4,
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
    opacity: 0.2,
    borderRadius: 2,
  },
});
