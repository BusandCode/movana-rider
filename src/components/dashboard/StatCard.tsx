import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: string | number;
  label: string;
  caption?: string;
  progress?: number;
  pulse?: boolean;
}

export function StatCard({ icon, iconColor, value, label, caption, progress, pulse }: StatCardProps) {
  return (
    <Card style={styles.card}>
      <View style={[styles.iconChip, { backgroundColor: `${iconColor}17` }]}>
        <Ionicons name={icon} size={16} color={iconColor} />
      </View>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>

      {typeof progress === "number" ? (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, progress))}%`, backgroundColor: iconColor }]} />
        </View>
      ) : caption ? (
        <View style={styles.captionRow}>
          {pulse ? <View style={[styles.dot, { backgroundColor: iconColor }]} /> : null}
          <Text style={styles.caption} numberOfLines={1}>{caption}</Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 132,
    gap: 8,
    padding: 14,
    marginRight: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1.5,
  },
  iconChip: { width: 30, height: 30, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  value: { fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginTop: 2 },
  label: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 },
  progressTrack: { height: 4, borderRadius: 2, backgroundColor: colors.border, overflow: "hidden", marginTop: 2 },
  progressFill: { height: 4, borderRadius: 2 },
  captionRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  caption: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.textSecondary },
});