import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";

interface WeeklyDeliveriesChartProps {
  data: { day: string; count: number }[];
}

const CHART_HEIGHT = 110;

const BAR_COLORS = [
  "#EF4444", // red
  "#F97316", // orange
  "#EAB308", // yellow
  "#22C55E", // green
  "#3B82F6", // blue
  "#4F46E5", // indigo
  "#8B5CF6", // violet
];

export function WeeklyDeliveriesChart({ data }: WeeklyDeliveriesChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Total :</Text>
        <Text style={styles.total}>{total}</Text>
        <Text style={styles.totalUnit}>deliveries</Text>
      </View>

      <View style={styles.chartRow}>
        {data.map((point, index) => {
          const barHeight = Math.max((point.count / maxCount) * CHART_HEIGHT, 4);
          const isToday = point.day === today;
          const barColor = BAR_COLORS[index % BAR_COLORS.length];
          return (
            <View key={point.day} style={styles.barColumn}>
              <Text style={[styles.countLabel, isToday && styles.countLabelActive]}>{point.count}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: barColor,
                      opacity: isToday ? 1 : 0.55,
                    },
                    isToday && styles.barActive,
                  ]}
                />
              </View>
              <View style={[styles.dayPill, isToday && styles.dayPillActive]}>
                <Text style={[styles.dayLabel, isToday && styles.dayLabelActive]}>{point.day}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    gap: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  total: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  totalUnit: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  barColumn: { alignItems: "center", flex: 1, gap: 8 },
  countLabel: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  countLabelActive: {
    color: colors.primary,
  },
  barTrack: {
    height: CHART_HEIGHT,
    justifyContent: "flex-end",
    width: 16,
  },
  bar: {
    width: "100%",
    borderRadius: 8,
  },
  barActive: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  dayPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  dayPillActive: {
    backgroundColor: colors.primary + "1A",
  },
  dayLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  dayLabelActive: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
});