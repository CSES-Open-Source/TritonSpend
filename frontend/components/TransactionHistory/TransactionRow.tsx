import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { AppText } from "@/components/primitives/AppText";
import { useAppTheme } from "@/context/themeContext";

/*
  this is the container for every row in the transaction history, which includes the icon for the transaction,
  name of transaction, date of transaction, and the amount.

  props - this component takes props for the name, date, amount of the transactions

 */
interface TransactionRowProps {
  name: string;
  amount: number | string;
  date?: string;
  icon?: string | number;
  darkText?: boolean;
}

export default function TransactionRow(props: TransactionRowProps) {
  const [icon, setIcon] = useState<any>("");
  const { colors } = useAppTheme();
  const primaryTextColor = props.darkText ? "#111111" : colors.searchText;
  const categoryIconMapping: { [key: string]: string } = {
    Food: "fast-food-outline",
    Shopping: "pricetag-outline",
    Transportation: "bus-outline",
    Subscriptions: "calendar-outline",
  };

  useEffect(() => {
    const iconName: string =
      categoryIconMapping[String(props.icon)] || "card-outline";
    setIcon(iconName);
  }, []);
  const formattedDate =
    typeof props.date === "string" ? props.date.substring(0, 10) : "";
  return (
    <View style={styles.NewTransaction}>
      <View style={styles.iconAndInfo}>
        {/* place holder for transaction icon */}
        <Ionicons name={icon} size={25} color={colors.tabBarActive} />
        <View>
          <AppText
            variant="title"
            fontSize="$4"
            color={primaryTextColor}
            paddingBottom="$1"
          >
            {props.name}
          </AppText>
          <AppText variant="caption" color={colors.searchPlaceholder}>
            {formattedDate}
          </AppText>
        </View>
      </View>
      <AppText variant="title" fontSize="$4" color={primaryTextColor}>
        ${props.amount}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  NewTransaction: {
    width: "100%",
    height: 64,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
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
