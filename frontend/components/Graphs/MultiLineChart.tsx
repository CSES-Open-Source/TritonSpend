import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, {
  Path,
  Line,
  Text as SvgText,
  G,
  Circle,
  ClipPath,
  Defs,
} from "react-native-svg";

// GET /transactions/multiTrend/:user_id
// Query Params: ?period=weekly&months=3
// Response: [
//   { date: "2024-01-01", category: "Food", total: 150.00 },
//   { date: "2024-01-01", category: "Shopping", total: 75.00 },
//   { date: "2024-01-08", category: "Food", total: 200.00 },
//   ... 
// Each data point represents the total spending for that category in that time period.

export default function MultiLineChart(props: {
  data: { date: string; category: string; total: number }[];
  width: number;
  height: number;
}) {
  const padding = 20;
  const chartWidth = props.width - 2 * padding;
  const chartHeight = props.height - 2 * padding;

  // Group data by category and get all unique dates
  const categoryMap = new Map<string, Map<string, number>>();
  const dateSet = new Set<string>();

  props.data.forEach((item) => {
    if (!categoryMap.has(item.category)) {
      categoryMap.set(item.category, new Map());
    }
    categoryMap.get(item.category)!.set(item.date, item.total);
    dateSet.add(item.date);
  });

  // Sort dates
  const sortedDates = Array.from(dateSet).sort();

  // Category colors
  const colors = [
    "#007AFF",
    "#FF3B30",
    "#34C759",
    "#FF9500",
    "#AF52DE",
    "#FF2D55",
    "#5AC8FA",
  ];

  const categories = Array.from(categoryMap.keys());
  const categoryData = categories.map((category, index) => ({
    category,
    color: colors[index % colors.length],
    points: sortedDates.map((date) => ({
      date,
      total: categoryMap.get(category)?.get(date) || 0,
    })),
  }));

  // Get all values for min/max calculation
  // Ensure minValue is at least 0 so x-axis represents $0
  const allValues = props.data.map((item) => item.total);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  const minValue = Math.max(
    0,
    allValues.length > 0 ? Math.min(...allValues) : 0,
  );
  const valueRange = maxValue - minValue || 1;
  const verticalMargin = chartHeight * 0.1; // 10% margin top and bottom

  function getPointCoordinates(data: { date: string; total: number }[]) {
    if (data.length === 0) return [];

    const xAxisY = props.height - padding;

    return data.map((item, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
      // Calculate y position, but ensure it doesn't go below x-axis
      let y =
        padding +
        verticalMargin +
        (chartHeight - 2 * verticalMargin) -
        ((item.total - minValue) / valueRange) *
          (chartHeight - 2 * verticalMargin);

      // Clamp y to not go below x-axis (which represents $0)
      y = Math.min(y, xAxisY);

      return { x, y, total: item.total, date: item.date };
    });
  }

  function createLine(data: { date: string; total: number }[]) {
    if (data.length === 0) return "";

    const coordinates = getPointCoordinates(data);
    const pathData = coordinates
      .map((coord, index) => {
        return index === 0
          ? `M ${coord.x} ${coord.y}`
          : `L ${coord.x} ${coord.y}`;
      })
      .join(" ");

    return pathData;
  }

  // Define clip path to prevent lines from going below x-axis
  const clipPathId = "chartClip";

  return (
    <View style={styles.LineContainer}>
      <Svg width={props.width} height={props.height}>
        <Defs>
          <ClipPath id={clipPathId}>
            <rect
              x={padding}
              y={padding}
              width={chartWidth}
              height={chartHeight}
            />
          </ClipPath>
        </Defs>
        <G>
          {/* Y-axis */}
          <Line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={props.height - padding}
            stroke="#333"
            strokeWidth={2}
          />
          {/* X-axis */}
          <Line
            x1={padding}
            y1={props.height - padding}
            x2={props.width - padding}
            y2={props.height - padding}
            stroke="#333"
            strokeWidth={2}
          />

          {/* Y-axis labels */}
          {(() => {
            const numYLabels = 5;
            const yLabelIndices = [];

            for (let i = 0; i < numYLabels; i++) {
              yLabelIndices.push(i);
            }

            return yLabelIndices.map((i) => {
              const value =
                maxValue - (i / (numYLabels - 1)) * (maxValue - minValue);
              const y =
                padding + (i / (numYLabels - 1)) * (props.height - 2 * padding);

              return (
                <SvgText
                  key={i}
                  x={padding - 5}
                  y={y + 5}
                  fontSize={10}
                  fill="#333"
                  textAnchor="end"
                  fontFamily="Open Sans"
                  fontWeight="600"
                >
                  ${value.toFixed(0)}
                </SvgText>
              );
            });
          })()}

          {/* X-axis labels */}
          {sortedDates.length > 0 && (
            <>
              {(() => {
                const numLabels = Math.min(5, sortedDates.length);
                const labelIndices = [];

                for (let i = 0; i < numLabels; i++) {
                  const index = Math.floor(
                    (i / (numLabels - 1)) * (sortedDates.length - 1),
                  );
                  labelIndices.push(index);
                }

                return labelIndices.map((index) => {
                  const x =
                    padding +
                    (index / (sortedDates.length - 1 || 1)) * chartWidth;
                  const date = new Date(sortedDates[index]);

                  return (
                    <SvgText
                      key={index}
                      x={x}
                      y={props.height - padding + 15}
                      fontSize={9}
                      fill="#333"
                      textAnchor="middle"
                      fontFamily="Open Sans"
                      fontWeight="600"
                    >
                      {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </SvgText>
                  );
                });
              })()}
            </>
          )}

          {/* Multiple category lines with clipping */}
          <G clipPath={`url(#${clipPathId})`}>
            {categoryData.map((cat) => (
              <Path
                key={cat.category}
                d={createLine(cat.points)}
                stroke={cat.color}
                strokeWidth={2}
                fill="none"
              />
            ))}
          </G>

          {/* Data point dots */}
          {categoryData.map((cat) => {
            const coordinates = getPointCoordinates(cat.points);
            return coordinates.map((coord, index) => (
              <Circle
                key={`${cat.category}-${index}`}
                cx={coord.x}
                cy={coord.y}
                r={4}
                fill={cat.color}
                stroke="#FFFFFF"
                strokeWidth={1}
              />
            ));
          })}
        </G>
      </Svg>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {categoryData.map((cat) => (
          <View key={cat.category} style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: cat.color }]}
            />
            <Text style={styles.legendText}>{cat.category}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  LineContainer: {
    justifyContent: "flex-start",
    width: "100%",
    alignItems: "center",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 15,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
});
