import { View, StyleSheet, Text } from "react-native";

export default function BudgetChart(props: any) {
  return (
    <View style={styles.ChartContainer}>
      <View style={[styles.chartBackground, styles.shadow]}>
        <View
          style={{
            width: props.length,
            height: 40,
            backgroundColor: "#8d82be",
            borderRadius: 10,
          }}
        ></View>
      </View>
      <View style={styles.informationContainer}>
        <View style={styles.column}>
          <Text style={[styles.title, { color: "#bbadff" }]}>Current</Text>
          <Text style={styles.title}>${props.Current}</Text>
        </View>
        <View style={styles.column}>
          <Text style={[styles.title, { color: "#bbadff" }]}>Budget</Text>
          <Text style={styles.title}>${props.Budget}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ChartContainer: {
    backgroundColor: "white",
    width: "100%",
    height: 130,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  chartBackground: {
    width: "90%",
    height: 40,
    borderRadius: 10,
  },
  informationContainer: {
    width: "100%",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "500",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
});
