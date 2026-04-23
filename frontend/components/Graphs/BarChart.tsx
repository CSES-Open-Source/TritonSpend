import React from "react";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { YStack, useTheme } from "tamagui";
import { AppText } from "@/components/primitives/AppText";

interface BarChartDatum {
  name: string;
  value: number;
}

export default function BarChart({
  data,
  width,
  height,
  total,
}: {
  data: BarChartDatum[];
  width: number;
  height: number;
  total: number;
}) {
  const theme = useTheme();
  const primary = theme.primary?.val ?? "#395773";
  const mutedColor = theme.textMuted?.val ?? "#7B8A96";
  const textColor = theme.color?.val ?? "#1C252E";

  const topPadding = 28;
  const bottomPadding = 32;
  const barSpacing = 16;
  const count = Math.max(data.length, 1);
  const barWidth = (width - barSpacing * (count + 1)) / count;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const drawableHeight = height - topPadding - bottomPadding;

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-").map(Number);
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "short" });
  };

  return (
    <YStack width="100%" alignItems="center" gap="$2">
      <Svg height={height} width={width}>
        {data.map((item, index) => {
          const x = barSpacing + index * (barWidth + barSpacing);
          const barHeight = (item.value / maxValue) * drawableHeight;
          const y = topPadding + (drawableHeight - barHeight);

          return (
            <React.Fragment key={`${item.name}-${index}`}>
              <SvgText
                x={x + barWidth / 2}
                y={y - 8}
                fontSize={11}
                fill={textColor}
                textAnchor="middle"
                fontFamily="Inter"
                fontWeight="600"
              >
                ${item.value.toFixed(0)}
              </SvgText>

              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={primary}
                rx={8}
                ry={8}
              />

              <SvgText
                x={x + barWidth / 2}
                y={height - 10}
                fontSize={11}
                fill={mutedColor}
                textAnchor="middle"
                fontFamily="Inter"
                fontWeight="600"
              >
                {formatMonth(item.name)}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      <AppText variant="title" fontSize="$7">
        ${total.toFixed(2)}
      </AppText>
    </YStack>
  );
}
