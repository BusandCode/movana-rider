import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Rect,
  Line,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";

interface WeeklyDeliveriesChartProps {
  data: {
    day: string;
    count: number;
  }[];
}

const CHART_HEIGHT = 120;
const CHART_WIDTH = 300;

export function WeeklyDeliveriesChart({
  data,
}: WeeklyDeliveriesChartProps) {
  const maxCount = Math.max(
    ...data.map((item) => item.count),
    1
  );

  const total = data.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
  });

  const barWidth = 20;

  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryLabel}>
            Weekly activity
          </Text>

          <View style={styles.totalRow}>
            <Text style={styles.total}>
              {total}
            </Text>

            <Text style={styles.totalUnit}>
              deliveries
            </Text>
          </View>
        </View>

        <View style={styles.activityBadge}>
          <View style={styles.activityDot} />
          <Text style={styles.activityText}>
            This week
          </Text>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartWrapper}>
        <Svg
          width="100%"
          height={CHART_HEIGHT + 15}
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT + 15}`}
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient
              id="barGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <Stop
                offset="0"
                stopColor={colors.primary}
                stopOpacity="1"
              />
              <Stop
                offset="1"
                stopColor={colors.primary}
                stopOpacity="0.65"
              />
            </LinearGradient>
          </Defs>

          {/* Chart grid */}
          {[0.25, 0.5, 0.75, 1].map(
            (position) => {
              const y =
                CHART_HEIGHT -
                position * CHART_HEIGHT;

              return (
                <Line
                  key={position}
                  x1="0"
                  y1={y}
                  x2={CHART_WIDTH}
                  y2={y}
                  stroke={colors.border}
                  strokeWidth="0.7"
                  strokeOpacity="0.6"
                />
              );
            }
          )}

          {data.map((point, index) => {
            const isToday = point.day === today;

            const barHeight =
              point.count === 0
                ? 4
                : Math.max(
                    (point.count / maxCount) *
                      (CHART_HEIGHT - 12),
                    8
                  );

            const spacing =
              CHART_WIDTH / data.length;

            const x =
              index * spacing +
              spacing / 2 -
              barWidth / 2;

            const y =
              CHART_HEIGHT - barHeight;

            return (
              <Rect
                key={point.day}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={10}
                fill={
                  isToday
                    ? "url(#barGradient)"
                    : `${colors.primary}28`
                }
              />
            );
          })}
        </Svg>

        {/* Labels */}
        <View style={styles.labelsRow}>
          {data.map((point) => {
            const isToday = point.day === today;

            return (
              <View
                key={point.day}
                style={styles.labelColumn}
              >
                <Text
                  style={[
                    styles.count,
                    isToday && styles.countActive,
                  ]}
                >
                  {point.count}
                </Text>

                <Text
                  style={[
                    styles.day,
                    isToday && styles.dayActive,
                  ]}
                >
                  {point.day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },

  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  summaryLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },

  totalRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
  },

  total: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.textPrimary,
  },

  totalUnit: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },

  activityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: `${colors.primary}0D`,
  },

  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },

  activityText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.primary,
  },

  chartWrapper: {
    width: "100%",
  },

  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -3,
  },

  labelColumn: {
    flex: 1,
    alignItems: "center",
  },

  count: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 5,
  },

  countActive: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },

  day: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textSecondary,
  },

  dayActive: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
});