import { View, StyleSheet, Text } from "react-native";
import { useState } from "react";

//Budget Chart that shows bar to show how much money spent, can increase or decrease bar progress with props.length (as percentage)
export default function BudgetChart(props: any) {
  const [chartBackgroundWidth, setChartBackgroundWidth] = useState(0);

  // Calculate the actual bar width based on percentage of chart background width
  const barWidth = chartBackgroundWidth * props.length;

  return (
    <View style={styles.ChartContainer}>
      <View
        style={[styles.chartBackground, styles.shadow]}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setChartBackgroundWidth(width);
        }}
      >
        <View
          style={{
            width: barWidth,
            height: 40,
            backgroundColor: "#00629B",
            borderRadius: 10,
          }}
        ></View>
      </View>
      <View style={styles.informationContainer}>
        <View style={styles.column}>
          <Text style={[styles.title, { color: "#00629B" }]}>Current</Text>
          <Text style={styles.title}>${props.Current}</Text>
        </View>
        <View style={styles.column}>
          <Text style={[styles.title, { color: "#00629B" }]}>Budget</Text>
          <Text style={styles.title}>${props.Budget}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ChartContainer: {
    backgroundColor: "#E6E6E6",
    width: "100%",
    height: 130,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    shadowRadius: 12,
    shadowOpacity: 0.4,
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
