import React from "react";
import { ColorValue, View, StyleSheet } from "react-native";
import Svg, { Path, G, Text } from "react-native-svg";

export default function DoughnutChart(props: {
  total: number;
  size: number;
  data: any[];
}) {
  const radius = props.size / 2;
  const innerRadius = radius * 0.65;
  const total = props.data.reduce(
    (acc: any, item: { value: any }) => acc + item.value,
    0,
  );
  let startAngle = 0;

  function createArc(value: number, color?: ColorValue) {
    const angle = (value / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;

    const x1 = radius + radius * Math.sin(startAngle);
    const y1 = radius - radius * Math.cos(startAngle);
    const x2 = radius + radius * Math.sin(endAngle);
    const y2 = radius - radius * Math.cos(endAngle);

    const largeArc = angle > Math.PI ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${radius + innerRadius * Math.sin(endAngle)} ${radius - innerRadius * Math.cos(endAngle)}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${radius + innerRadius * Math.sin(startAngle)} ${radius - innerRadius * Math.cos(startAngle)}`,
      "Z",
    ].join(" ");

    startAngle = endAngle;
    const textX = radius + radius * 0.5 * Math.sin(startAngle + angle / 2); // Mid-point of the arc
    const textY = radius - radius * 0.5 * Math.cos(startAngle + angle / 2); // Mid-point of the arc

    return <Path key={Math.random()} d={pathData} fill={color} />;
  }

  return (
    <View style={styles.PieContainer}>
      <Svg width={props.size} height={props.size}>
        <G>{props.data.map((item) => createArc(item.value, item.color))}</G>
        <Text
          x={radius}
          y={radius}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={27}
          fontFamily="Open Sans"
          fontWeight="bold"
          fill="#333"
        >
          ${props.total}
        </Text>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  PieContainer: {
    justifyContent: "flex-start",
    width: "100%",
    alignItems: "center",
  },
});
