import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";

export default function BarChart({
  data,
  size,
  total,
}: {
  data: any[];
  size: number;
  total: number;
}) {
  const chartHeight = size;
  const chartWidth = size * 1.2;

  const barSpacing = 25; // consistent spacing
  const barWidth = (chartWidth - barSpacing * (data.length + 1)) / data.length;

  const maxValue = Math.max(...data.map((d: any) => d.value), 1);

  // Convert "YYYY-MM" to "Mon"
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-").map(Number);
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "short" });
  };

  // Pastel colors for each month
  const monthColors: Record<string, string> = {
    "01": "#FFD1DC", // Jan
    "02": "#FFE4B5", // Feb
    "03": "#BFFCC6", // Mar
    "04": "#C1F0F6", // Apr
    "05": "#D8B4E2", // May
    "06": "#FFFACD", // Jun
    "07": "#FFB347", // Jul
    "08": "#AEC6CF", // Aug
    "09": "#FF6961", // Sep
    "10": "#77DD77", // Oct
    "11": "#CBAACB", // Nov
    "12": "#FDFD96", // Dec
  };

  return (
    <View style={styles.container}>
      <Svg height={chartHeight} width={chartWidth}>
        {data.map((item: any, index: number) => {
          const x = barSpacing + index * (barWidth + barSpacing);
          const barHeight = (item.value / maxValue) * (chartHeight - 90);
          const y = chartHeight - barHeight - 50; // padding from bottom

          // Assign color based on month if color not already set
          const month = item.name.split("-")[1];
          const fillColor = item.color || monthColors[month] || "#ccc";

          return (
            <React.Fragment key={index}>
              {/* Value label */}
              <SvgText
                x={x + barWidth / 2}
                y={y - 10}
                fontSize="14"
                fill="#333"
                textAnchor="middle"
              >
                {item.value}
              </SvgText>

              {/* Bar */}
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={fillColor}
                rx={8}
                ry={8}
              />

              {/* Category label */}
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight - 20}
                fontSize="14"
                fill="#000"
                textAnchor="middle"
              >
                {formatMonth(item.name)}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  totalText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
  },
});
