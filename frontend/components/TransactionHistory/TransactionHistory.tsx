import { View, StyleSheet, Text } from "react-native";
import TransactionRow from "./TransactionRow";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
//container for the recent transaction history.
export default function TransactionHistory(props: any) {
  console.log(props);
  return (
    <View style={styles.HistoryContainer}>
      {/* Link that re routes user to History */}
      <Link href={"/History"}>
        <View style={styles.header}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Recent Transactions
          </Text>
          <FontAwesome name="angle-right" size={20} />
        </View>
      </Link>
      <View style={styles.recentTranactions}>
        {props.list.map((row: any, index: any) => {
          return (
            <View key={row.id}>
              <TransactionRow
                name={row.item_name}
                date={row.date}
                amount={row.amount}
                key={row.id}
                icon={row.category_name}
              />
              {/* Put a separater between elements excpet for the last one */}
              {index < props.list.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  HistoryContainer: {
    backgroundColor: "#E6E6E6",
    width: "100%",
    height: 390,
    borderRadius: 15,
    padding: 15,
    gap: 5,
    shadowRadius: 12,
    shadowOpacity: 0.4,
  },
  header: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
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
