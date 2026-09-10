import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { formatCurrency, formatDistance } from "@/utils/formatters";
import type { Delivery } from "@/types/delivery";

interface DeliveryCardProps {
  delivery: Delivery;
  onPress?: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
  variant?: "default" | "active";
  badge?: string;
}

export function DeliveryCard({
  delivery,
  onPress,
  actionLabel,
  onActionPress,
  variant = "default",
  badge,
}: DeliveryCardProps) {
  const isActive = variant === "active";

  const innerContent = (
    <>
      {isActive && badge ? (
        <View style={styles.badgeRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.badgeText}>{badge}</Text>
          <View style={styles.badgeIconWrap}>
            <Ionicons name="bicycle-outline" size={14} color="#FFFFFF" />
          </View>
        </View>
      ) : null}

      <View style={styles.header}>
        <Text style={[styles.trackingId, isActive && styles.textOnBlue]}>{delivery.trackingId}</Text>
        <StatusPill status={delivery.status} />
      </View>

      <Text style={[styles.address, isActive && styles.addressOnBlue]} numberOfLines={1}>
        {delivery.pickup.address} → {delivery.dropoff.address}
      </Text>

      <View style={[styles.divider, isActive && styles.dividerOnBlue]} />

      <View style={styles.footer}>
        <Text style={[styles.meta, isActive && styles.addressOnBlue]}>{formatDistance(delivery.distanceKm)}</Text>
        <View style={styles.earningsRow}>
          <Text style={[styles.earningsLabel, isActive && styles.addressOnBlue]}>You earn</Text>
          <Text style={[styles.earnings, isActive && styles.earningsOnBlue]}>
            {formatCurrency(delivery.riderEarnings)}
          </Text>
        </View>
      </View>

      {actionLabel && onActionPress ? (
        <View style={styles.actionRow}>
          <Button
            label={actionLabel}
            onPress={onActionPress}
            size="small"
            style={[styles.actionButton, isActive ? styles.actionButtonOnBlue : undefined]}
            textStyle={isActive ? styles.actionButtonTextOnBlue : undefined}
          />
        </View>
      ) : null}
    </>
  );

  const content = isActive ? (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, styles.cardActive]}
    >
      {innerContent}
    </LinearGradient>
  ) : (
    <Card style={styles.card}>{innerContent}</Card>
  );

  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}

const styles = StyleSheet.create({
  card: { gap: 8, marginBottom: 12 },
  cardActive: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.primary,
    marginBottom: 20,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FFFFFF" },
  badgeText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: fontSize.xs,
    color: "rgba(255,255,255,0.85)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  badgeIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  trackingId: { fontFamily: fonts.semiBold, fontSize: fontSize.sm, color: colors.textPrimary },
  textOnBlue: { color: "#FFFFFF" },
  address: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  addressOnBlue: { color: "rgba(255,255,255,0.75)" },
  divider: { height: 0 },
  dividerOnBlue: { height: StyleSheet.hairlineWidth, backgroundColor: "rgba(255,255,255,0.25)", marginVertical: 2 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  meta: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.textSecondary },
  earningsRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  earningsLabel: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.textSecondary },
  earnings: { fontFamily: fonts.bold, fontSize: fontSize.base, color: colors.success },
  earningsOnBlue: { color: "#FFFFFF" },
  actionRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  actionButton: { paddingHorizontal: 16 },
  actionButtonOnBlue: { backgroundColor: "#FFFFFF", borderWidth: 0 },
  actionButtonTextOnBlue: { color: colors.primary },
});