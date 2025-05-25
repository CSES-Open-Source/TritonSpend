import { View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

/*
  this is the container for every row in the transaction history, which includes the icon for the transaction,
  name of transaction, date of transaction, and the amount.

  props - this component takes props for the name, date, amount of the transactions

 */
export default function TransactionRow(props: any) {
  const [icon, setIcon] = useState<any>("");
  const categoryIconMapping: { [key: number]: string } = {
    6: "fast-food-outline",
    7: "pricetag-outline",
    8: "bus-outline",
    9: "calendar-outline",
  };

  useEffect(() => {
    const iconName: string = categoryIconMapping[props.icon] || "card-outline";
    setIcon(iconName);
  }, []);
  const formattedDate =
    typeof props.date === "string" ? props.date.substring(0, 10) : "";
  return (
    <View style={styles.NewTransaction}>
      <View style={styles.iconAndInfo}>
        {/* place holder for transaction icon */}
        <Ionicons name={icon} size={30} color={"#black"} />
        <View>
          <Text>{props.name}</Text>
          <Text>{formattedDate}</Text>
        </View>
      </View>
      <Text>${props.amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  NewTransaction: {
    width: "100%",
    height: 50,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  iconAndInfo: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
});
