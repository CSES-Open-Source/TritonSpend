import Svg, { Path, G } from "react-native-svg";
import { YStack } from "tamagui";
import { AppText } from "@/components/primitives/AppText";

interface PieChartDatum {
  value: number;
  color: string;
  name?: string;
  id?: number;
}

export default function DoughnutChart(props: {
  total: number;
  size: number;
  data: PieChartDatum[];
}) {
  const radius = props.size / 2;
  const innerRadius = radius * 0.65;
  const total = props.data.reduce((acc, item) => acc + item.value, 0);
  let startAngle = 0;

  function createArc(value: number, color: string, key: number) {
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

    return <Path key={key} d={pathData} fill={color} />;
  }

  return (
    <YStack justifyContent="flex-start" width="100%" alignItems="center">
      <YStack
        width={props.size}
        height={props.size}
        alignItems="center"
        justifyContent="center"
      >
        <Svg
          width={props.size}
          height={props.size}
          style={{ position: "absolute" }}
        >
          <G>
            {props.data.map((item, index) =>
              createArc(item.value, item.color, index)
            )}
          </G>
        </Svg>
        <AppText variant="title" fontSize={27} color="$color">
          ${props.total.toFixed(2)}
        </AppText>
      </YStack>
    </YStack>
  );
}
