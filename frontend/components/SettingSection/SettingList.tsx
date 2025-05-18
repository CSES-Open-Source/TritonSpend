import { View, StyleSheet, Text } from "react-native";
import TransactionRow from "../TransactionHistory/TransactionRow";

/*
  this is the container for the different Categories of budgets in the settings page. The name is weird
  because I meant this to be something else

  props - this component takes props for the total budget and the list of categories

 */
export default function SettingList(props: any) {
  return (
    <View style={styles.settingList}>
      <View style={styles.header}>
        <Text style={styles.Title}>Total Budget</Text>
        <Text style={styles.Title}>${props.totalBudget}</Text>
      </View>
      <Text style={styles.Title}>Budget per Cateogry</Text>
      <View>
        {props.list.map(
          (
            section: {
              category_name: string;
              max_category_budget: number;
              id: number;
              icon: number;
            },
            index: any,
          ) => (
            <View key={section.id}>
              <TransactionRow
                name={section.category_name}
                amount={section.max_category_budget}
                icon={section.id}
              />
              {/* Put a separater between elements excpet for the last one */}
              {index < props.list.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ),
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingList: {
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    padding: 25,
    gap: 20,
    shadowRadius: 12,
    shadowOpacity: 0.4
  },

  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
    opacity: 0.2,
    borderRadius: 2,
  },
  Title: {
    fontSize: 20,
    fontWeight: "400",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
