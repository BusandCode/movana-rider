import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { useEarnings } from "@/features/earnings/useEarnings";
import { formatCurrency } from "@/utils/formatters";

export default function EarningsScreen() {
  const { summary, isLoading } = useEarnings();

  if (isLoading || !summary) {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Earnings</Text>

      <Card style={styles.heroCard}>
        <Text style={styles.heroLabel}>Available Balance</Text>
        <Text style={styles.heroValue}>{formatCurrency(summary.today, summary.currency)}</Text>
        <Text style={styles.heroSub}>Earned today</Text>
      </Card>

      <View style={styles.grid}>
        <Card style={styles.gridCard}>
          <Text style={styles.gridValue}>{formatCurrency(summary.thisWeek, summary.currency)}</Text>
          <Text style={styles.gridLabel}>This Week</Text>
        </Card>
        <Card style={styles.gridCard}>
          <Text style={styles.gridValue}>{formatCurrency(summary.thisMonth, summary.currency)}</Text>
          <Text style={styles.gridLabel}>This Month</Text>
        </Card>
      </View>

      <Card style={{ marginTop: 12 }}>
        <Text style={styles.gridValue}>{formatCurrency(summary.lifetime, summary.currency)}</Text>
        <Text style={styles.gridLabel}>Lifetime Earnings</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 16 },
  heroCard: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark, gap: 4, marginBottom: 16 },
  heroLabel: { fontFamily: fonts.medium, fontSize: fontSize.sm, color: colors.border },
  heroValue: { fontFamily: fonts.bold, fontSize: fontSize["3xl"], color: colors.surface, marginTop: 4 },
  heroSub: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.border },
  grid: { flexDirection: "row", gap: 12 },
  gridCard: { flex: 1, gap: 4 },
  gridValue: { fontFamily: fonts.bold, fontSize: fontSize.lg, color: colors.textPrimary },
  gridLabel: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
});