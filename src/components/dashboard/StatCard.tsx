import { StyleSheet, Text } from "react-native";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";

interface StatCardProps {
  value: string | number;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <Card style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  statCard: { width: "47%", alignItems: "center", gap: 4 },
  statValue: { fontFamily: fonts.bold, fontSize: fontSize.lg, color: colors.textPrimary },
  statLabel: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.textSecondary },
});