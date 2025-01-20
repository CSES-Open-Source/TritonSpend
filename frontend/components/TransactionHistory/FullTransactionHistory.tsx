import { View, StyleSheet, Text, ScrollView } from "react-native";
import TransactionRow from "./TransactionRow";
import { FontAwesome } from "@expo/vector-icons";

//container for the recent transaction history.
export default function FullTransactionHistory(props: any) {
    //Constant array that groups the props list by their dates
    const groupedByDate = props.list.reduce((acc: any, transaction: any) => {
        //if the date does not exist, add a new hashmap for it
        if (!acc[transaction.date]) {
        acc[transaction.date] = [];
        }
        //if it exists, push new element to the date
        acc[transaction.date].push(transaction);
        return acc;
    },{});
  return (
    <View style={styles.HistoryContainer}>
      <Text style={{ fontSize: 20, fontWeight: '500' }}>Transactions</Text>
      {/* Scrollview for scrolling */}
      <ScrollView>
        <View style={styles.recentTranactions}>
        {/* mapping through the different date categories */}
          {Object.entries(groupedByDate).map(([date, transactions]: any) => (
            <View style={styles.row}  key = {date}>
              <Text style={styles.dates}>{date}</Text>
              {/* for Each date category, we map the elements(transactions) that are associated with that date */}
              {transactions.map(
                (
                  transaction: { name: any; date: any; amount: any; id: any },
                  index: any,
                ) => (
                  <View key = {transaction.id}>
                    <TransactionRow
                      name={transaction.name}
                      date={transaction.date}
                      amount={transaction.amount}
                    //   key={transaction.id}
                    />
                    {/* Put a separater between elements excpet for the last one */}
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
    fontWeight: '500',
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
