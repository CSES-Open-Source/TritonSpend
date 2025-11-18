import { View, Text, StyleSheet } from "react-native";
import Svg, { G, Rect, Line } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  interpolate,
  SharedValue,
  ReduceMotion,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

type StackedBarData = Record<string, Record<string, number>>;

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
// Prefered number of bars.
const PREFERRED_NUM_COLS = [60, 24, 12, 6, 3, 1] as const;
// Denomination for determining highest chart line. For example:
// value=2.5: highest chart line is at 2.5, 25, 250, 2500 or so on.
// log=Math.log10(2.5): for quick comparison with the log of the maximum bar value.
// subdivisions=5: the chart line divides the chart into 5 sections.
const DENOMINATIONS = [
  {
    value: 1,
    log: 0,
    subdivisions: 5,
  },
  {
    value: 1.2,
    log: Math.log10(1.2),
    subdivisions: 6,
  },
  {
    value: 1.5,
    log: Math.log10(1.5),
    subdivisions: 3,
  },
  {
    value: 2,
    log: Math.log10(2),
    subdivisions: 4,
  },
  {
    value: 2.5,
    log: Math.log10(2.5),
    subdivisions: 5,
  },
  {
    value: 3,
    log: Math.log10(3),
    subdivisions: 6,
  },
  {
    value: 4,
    log: Math.log10(4),
    subdivisions: 4,
  },
  {
    value: 5,
    log: Math.log10(5),
    subdivisions: 5,
  },
  {
    value: 6,
    log: Math.log10(6),
    subdivisions: 6,
  },
  {
    value: 8,
    log: Math.log10(8),
    subdivisions: 4,
  },
  {
    value: 10,
    log: 1,
    subdivisions: 5,
  },
] as const;
const MIN_COL_WIDTH = 40; // Including gap between columns.
const HALF_GAP_WIDTH = 8;

const AnimatedG = Animated.createAnimatedComponent(G);

function range(n: number) {
  return [...Array(n).keys()];
}

function first<T>(
  array: readonly T[],
  test: (value: T, index: number) => boolean,
): T {
  for (let i = 0; i < array.length; i++) {
    if (test(array[i], i)) return array[i];
  }

  return array[array.length - 1];
}

class YearAndMonth {
  public year: number;
  public month: number;

  constructor(year: number, month: number) {
    this.year = year;
    this.month = month;
  }

  clone() {
    return new YearAndMonth(this.year, this.month);
  }

  addMonth(numMonths: number) {
    this.year += Math.trunc(numMonths / 12);
    this.month += numMonths % 12;

    if (this.month > 12) {
      this.month -= 12;
      this.year++;
    } else if (this.month < 1) {
      this.month += 12;
      this.year--;
    }

    return this;
  }

  toString() {
    return (
      this.year.toString().padStart(4, "0") +
      "-" +
      this.month.toString().padStart(2, "0") +
      "-01"
    );
  }
}

class MonthIter implements Iterator<YearAndMonth>, Iterable<YearAndMonth> {
  private currentMonth: YearAndMonth;
  private numIter: number;
  private step: number;
  private i = 0;

  constructor(currentMonth: YearAndMonth, numIter: number, step: number) {
    this.currentMonth = currentMonth;
    this.numIter = numIter;
    this.step = step;
  }

  next(): IteratorResult<YearAndMonth> {
    const monthBeforeUpdate = this.currentMonth.clone();

    this.currentMonth.addMonth(this.step);

    return this.i++ < this.numIter
      ? {
          value: monthBeforeUpdate,
          done: false,
        }
      : { value: undefined, done: true };
  }

  *map<T>(callback: (value: YearAndMonth, index: number) => T): Iterable<T> {
    let i = 0;
    for (const yearAndMonth of this) {
      yield callback(yearAndMonth, i++);
    }
  }

  [Symbol.iterator]() {
    return this;
  }
}

function StackedBar(props: {
  monthData: Record<string, number>;
  monthString: string;
  index: number;
  animatedVar: SharedValue<number>;
  colors: Map<string, string>;
  barWidth: number;
  height: number;
  maxYValue: number;
  width: number;
  columnWidth: number;
}) {
  const scale = props.monthData.Total / props.maxYValue;

  const animatedProps = useAnimatedProps(() => ({
    transform: [
      {
        translateX:
          props.width - props.columnWidth * (props.index + 1) + HALF_GAP_WIDTH,
      },
      {
        translateY: interpolate(
          props.animatedVar.value,
          [0, 1],
          [(1 - scale) * props.height, 1],
        ),
      },
      { scaleX: props.barWidth },
      {
        scaleY: interpolate(
          props.animatedVar.value,
          [0, 1],
          [scale * props.height, props.height],
        ),
      },
    ],
  }));

  let startY = 1;
  return (
    <AnimatedG animatedProps={animatedProps}>
      {Array.from(props.colors)
        .filter(([category, _]) => category in props.monthData)
        .map(([category, color]) => ({
          key: category,
          startY: (startY -= props.monthData[category] / props.monthData.Total),
          height: props.monthData[category] / props.monthData.Total,
          color,
        }))
        .map(({ key, startY, height, color }) => (
          <Rect
            key={key}
            x={0}
            y={startY}
            width={1}
            height={height}
            fill={color}
          />
        ))}
    </AnimatedG>
  );
}

export default function StackedBarChart(props: {
  width: number;
  height: number;
  data: StackedBarData;
  colors: Map<string, string>;
  numCols: number;
  isRelative: boolean;
}) {
  const current_date = new Date();
  const current_year = current_date.getFullYear();
  const current_month = current_date.getMonth() + 1;
  const currentYearAndMonth = new YearAndMonth(current_year, current_month);

  // Compute max monthly expense for this duration, and the height of the chart line needed.
  const maxExpense = Object.values(props.data).reduce(
    (max, row) => (row.Total > max ? row.Total : max),
    0,
  );
  const logMaxExpense = Math.max(Math.log10(maxExpense), Math.log10(0.05));
  const intPart = Math.floor(logMaxExpense);
  const fracPart = logMaxExpense - intPart;
  const denomObj = first(DENOMINATIONS, (item) => fracPart < item.log);
  const maxYValue = Math.pow(10, intPart) * denomObj.value;
  const numSubdivisions = props.isRelative ? 5 : denomObj.subdivisions;
  const subdivisionGap = maxYValue / numSubdivisions;

  const numCols = first(
    PREFERRED_NUM_COLS,
    (value) => props.width / value >= MIN_COL_WIDTH,
  );
  const columnWidth = props.width / numCols;
  const barWidth = columnWidth - 2 * HALF_GAP_WIDTH;

  const animatedVar = useSharedValue(0);
  useEffect(() => {
    animatedVar.value = withTiming(+props.isRelative, {
      duration: 800,
      easing: Easing.inOut(Easing.quad),
      reduceMotion: ReduceMotion.System,
    });
  }, [props.isRelative]);

  return (
    <View style={styles.stackedBarChartView}>
      <View>
        <View style={styles.lineLabelsView}>
          {range(numSubdivisions + 1)
            .map((index) => {
              if (props.isRelative) {
                return (100 * (1 - index / numSubdivisions)).toFixed(0) + "%";
              }

              const value = maxYValue - index * subdivisionGap;
              return value < 1 && value > 0
                ? (value * 100).toFixed(0) + "¢"
                : "$" + value.toFixed(0);
            })
            .map((lineLabel) => (
              <Text key={lineLabel} style={styles.lineLabelText}>
                {lineLabel}
              </Text>
            ))}
        </View>
        <Text style={styles.lineLabelText}> </Text>
      </View>
      <View>
        <Text style={{ fontSize: styles.lineLabelText.fontSize / 2 }}> </Text>
        <Svg width={props.width} height={props.height}>
          <G>
            {range(numSubdivisions).map((index) => {
              const gap = (index / numSubdivisions) * props.height;
              return (
                <Line
                  key={gap}
                  x1={0}
                  x2={props.width}
                  y1={gap + 0.5}
                  y2={gap + 0.5}
                  strokeWidth={1}
                  stroke={"#cccccc"}
                />
              );
            })}
          </G>
          <G>
            {[
              ...new MonthIter(currentYearAndMonth.clone(), numCols, -1).map(
                (yearAndMonth, index) => {
                  const monthString = yearAndMonth.toString();
                  return (
                    <StackedBar
                      key={monthString}
                      monthData={props.data[monthString] ?? {}}
                      monthString={monthString}
                      index={index}
                      animatedVar={animatedVar}
                      width={props.width}
                      height={props.height}
                      barWidth={barWidth}
                      columnWidth={columnWidth}
                      maxYValue={maxYValue}
                      colors={props.colors}
                    />
                  );
                },
              ),
            ]}
          </G>
          <Line
            x1={0}
            x2={props.width}
            y1={props.height - 0.5}
            y2={props.height - 0.5}
            strokeWidth={1}
            stroke={"#000000"}
          />
        </Svg>
        <Text style={{ fontSize: styles.lineLabelText.fontSize / 2 }}> </Text>
        <View style={styles.columnLabelsView}>
          {[
            ...new MonthIter(
              currentYearAndMonth.clone().addMonth(-numCols + 1),
              numCols,
              1,
            ).map((yearAndMonth) => (
              <Text
                key={yearAndMonth.toString()}
                style={[styles.columnLabelText, { width: columnWidth }]}
              >
                {MONTH_NAMES[yearAndMonth.month - 1]}
              </Text>
            )),
          ]}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stackedBarChartView: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "stretch",
    gap: 5,
    width: "100%",
  },
  lineLabelsView: {
    minWidth: 50,
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
  },
  lineLabelText: {
    textAlign: "right",
    fontSize: 16,
    color: "black",
  },
  columnLabelsView: {
    flexDirection: "row",
  },
  columnLabelText: {
    textAlign: "center",
    fontSize: 16,
  },
});
