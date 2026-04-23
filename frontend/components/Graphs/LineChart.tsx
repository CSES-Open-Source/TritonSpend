import React from "react";
import Svg, { Path, Line, Text, G } from "react-native-svg";
import { YStack, useTheme } from "tamagui";
import { AppText } from "@/components/primitives/AppText";

interface LineChartDatum {
  date: string;
  total: number;
}

export default function LineChart(props: {
  data: LineChartDatum[];
  width: number;
  height: number;
  total?: number;
}) {
  const theme = useTheme();
  const primary = theme.primary?.val ?? "#395773";
  const mutedColor = theme.textMuted?.val ?? "#7B8A96";

  const padding = 28;
  const chartWidth = props.width - 2 * padding;
  const chartHeight = props.height - 2 * padding;

  const values = props.data.map((item) => item.total);
  const maxValue = values.length > 0 ? Math.max(...values) : 0;
  const minValue = values.length > 0 ? Math.min(...values) : 0;

  function createLine(data: LineChartDatum[]) {
    if (data.length === 0) return "";

    const valueRange = maxValue - minValue || 1;
    const verticalMargin = chartHeight * 0.1;

    return data
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
  }

  const numYLabels = 5;
  const numXLabels = Math.min(5, props.data.length);

  return (
    <YStack width="100%" alignItems="center" gap="$2">
      <Svg width={props.width} height={props.height}>
        <G>
          {/* Y-axis */}
          <Line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={props.height - padding}
            stroke={mutedColor}
            strokeWidth={1}
          />
          {/* X-axis */}
          <Line
            x1={padding}
            y1={props.height - padding}
            x2={props.width - padding}
            y2={props.height - padding}
            stroke={mutedColor}
            strokeWidth={1}
          />

          {/* Y-axis labels */}
          {Array.from({ length: numYLabels }, (_, i) => {
            const value =
              maxValue - (i / (numYLabels - 1)) * (maxValue - minValue);
            const y =
              padding + (i / (numYLabels - 1)) * (props.height - 2 * padding);

            return (
              <Text
                key={`y-${i}`}
                x={padding - 6}
                y={y + 4}
                fontSize={10}
                fill={mutedColor}
                textAnchor="end"
                fontFamily="Inter, Helvetica, Arial, sans-serif"
                fontWeight="600"
              >
                ${value.toFixed(0)}
              </Text>
            );
          })}

          {/* X-axis labels */}
          {props.data.length > 0 &&
            Array.from({ length: numXLabels }, (_, i) => {
              const index = Math.floor(
                (i / (numXLabels - 1 || 1)) * (props.data.length - 1)
              );
              const x =
                padding + (index / (props.data.length - 1 || 1)) * chartWidth;
              const date = new Date(props.data[index].date);

              return (
                <Text
                  key={`x-${index}`}
                  x={x}
                  y={props.height - padding + 16}
                  fontSize={10}
                  fill={mutedColor}
                  textAnchor="middle"
                  fontFamily="Inter, Helvetica, Arial, sans-serif"
                  fontWeight="600"
                >
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              );
            })}

          {/* Line path */}
          <Path
            d={createLine(props.data)}
            stroke={primary}
            strokeWidth={2.5}
            fill="none"
          />
        </G>
      </Svg>

      {props.total !== undefined && (
        <AppText variant="title" fontSize="$7">
          ${props.total.toFixed(2)}
        </AppText>
      )}
    </YStack>
  );
}
