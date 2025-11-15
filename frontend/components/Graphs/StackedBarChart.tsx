import { View, Text, StyleSheet } from "react-native";
import Svg, { G, Rect, Line } from "react-native-svg";

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
const PREFERRED_NUM_COLS = [60, 24, 12, 6, 3, 1] as const;
// Denomination for determining chart line.
const DENOMINATIONS = [
  {
    value: 2,
    log: Math.log10(2),
    subdivisions: 4,
  },
  {
    value: 5,
    log: Math.log10(5),
    subdivisions: 5,
  },
  {
    value: 10,
    log: 1,
    subdivisions: 5,
  },
] as const;
const MIN_COL_WIDTH = 40; // Including gap between columns.
const HALF_GAP_WIDTH = 8;

function hash(input: string) {
  let hash = 0;
  for (const char of input) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return hash;
}

function range(n: number) {
  return [...Array(n).keys()];
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

  let maxYValue = 100;
  let numSubdivisions = 5;
  if (!props.isRelative) {
    // Compute max monthly expense for this duration, and the height of the chart line needed.
    const maxExpense = Object.values(props.data).reduce(
      (acc, row) => (row.Total > acc ? row.Total : acc),
      0,
    );
    const logMaxExpense = Math.max(Math.log10(maxExpense), 0);
    const intPart = Math.floor(logMaxExpense);
    const fracPart = logMaxExpense % 1;
    maxYValue = Math.pow(10, intPart);
    for (const item of DENOMINATIONS) {
      if (fracPart <= item.log) {
        maxYValue *= item.value;
        numSubdivisions = item.subdivisions;
        break;
      }
    }
  }
  const subdivisionGap = maxYValue / numSubdivisions;

  let numCols = 1;
  for (const val of PREFERRED_NUM_COLS) {
    if (props.width / val >= MIN_COL_WIDTH) {
      numCols = val;
      break;
    }
  }
  const columnWidth = props.width / numCols;
  const barWidth = columnWidth - 2 * HALF_GAP_WIDTH;
  let startY = props.height;

  function createSection(
    key: number,
    monthData: Record<string, number>,
    category: string,
    color: string,
  ) {
    const sectionHeight =
      category in monthData
        ? (monthData[category] / monthData.Total) * props.height
        : 0;

    return (
      <Rect
        key={key}
        x={0}
        y={(startY -= sectionHeight)}
        width={barWidth}
        height={sectionHeight}
        fill={color}
      />
    );
  }

  function createStackedBar(
    monthData: Record<string, number> | undefined,
    monthString: string,
    index: number,
  ) {
    startY = props.height;
    const key = hash(monthString);

    if (monthData === undefined) {
      return <G key={key}></G>;
    }

    const heightScale = monthData.Total / maxYValue;

    return (
      <G
        key={key}
        style={{
          transformOrigin: "bottom left",
          transform: [
            {
              translateX:
                props.width - columnWidth * (index + 1) + HALF_GAP_WIDTH,
            },
            {
              scaleY: props.isRelative ? 1 : heightScale,
            },
          ],
        }}
      >
        {Array.from(props.colors).map((row) =>
          createSection(hash(monthString + row[0]), monthData, row[0], row[1]),
        )}
      </G>
    );
  }

  return (
    <View style={styles.stackedBarChartView}>
      <View>
        <View style={styles.lineLabelsView}>
          {range(numSubdivisions + 1).map((index) => {
            const labelValue = maxYValue - index * subdivisionGap;
            let lineLabel: string = labelValue.toFixed(0);
            if (props.isRelative) {
              lineLabel = labelValue.toFixed(0) + "%";
            } else if (labelValue < 1 && labelValue > 0) {
              lineLabel = (labelValue * 100).toFixed(0) + "¢";
            } else {
              lineLabel = "$" + labelValue.toFixed(0);
            }

            return (
              <Text key={labelValue} style={styles.lineLabelText}>
                {lineLabel}
              </Text>
            );
          })}
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
                  return createStackedBar(
                    props.data[monthString],
                    monthString,
                    index,
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
            ).map((yearAndMonth) => {
              console.log(yearAndMonth);
              return (
                <Text
                  key={hash(yearAndMonth.toString())}
                  style={[styles.columnLabelText, { width: columnWidth }]}
                >
                  {MONTH_NAMES[yearAndMonth.month - 1]}
                </Text>
              );
            }),
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
  columns: {
    transformOrigin: "bottom left",
  },
  svgView: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});
