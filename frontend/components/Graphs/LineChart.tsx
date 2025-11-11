import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Line, Text, G } from "react-native-svg";

// GET /transactions/spendingTrend/:user_id
// Query Params: ?period=weekly&months=3
// Response: [
//   { date: "2024-01-01", total: 150.00 },
//   { date: "2024-01-08", total: 200.00 },
//   ...
// ]

export default function LineChart(props: {
  data: any[];
  width: number;
  height: number;
}) {
  const padding = 20;
  const chartWidth = props.width - 2 * padding;
  const chartHeight = props.height - 2 * padding;

  function createLine(data: any[]) {
    if (data.length === 0) return "";

    const values = data.map((item) => item.total);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const valueRange = maxValue - minValue || 1;
    const verticalMargin = chartHeight * 0.1; // 10% margin top and bottom

    const pathData = data
      .map((item, index) => {
        const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
        const y =
          padding +
          verticalMargin +
          (chartHeight - 2 * verticalMargin) -
          ((item.total - minValue) / valueRange) *
            (chartHeight - 2 * verticalMargin);

        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(" ");

    return pathData;
  }

  const values = props.data.map((item) => item.total);
  const maxValue = values.length > 0 ? Math.max(...values) : 0;
  const minValue = values.length > 0 ? Math.min(...values) : 0;

  return (
    <View style={styles.LineContainer}>
      <Svg width={props.width} height={props.height}>
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
                <Text
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
                </Text>
              );
            });
          })()}

          {/* X-axis labels */}
          {props.data.length > 0 && (
            <>
              {(() => {
                const numLabels = Math.min(5, props.data.length);
                const labelIndices = [];

                for (let i = 0; i < numLabels; i++) {
                  const index = Math.floor(
                    (i / (numLabels - 1)) * (props.data.length - 1),
                  );
                  labelIndices.push(index);
                }

                return labelIndices.map((index) => {
                  const x =
                    padding +
                    (index / (props.data.length - 1 || 1)) * chartWidth;
                  const date = new Date(props.data[index].date);

                  return (
                    <Text
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
                    </Text>
                  );
                });
              })()}
            </>
          )}

          {/* Line path */}
          <Path
            d={createLine(props.data)}
            stroke="#007AFF"
            strokeWidth={2}
            fill="none"
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  LineContainer: {
    justifyContent: "flex-start",
    width: "100%",
    alignItems: "center",
  },
});
