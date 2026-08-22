import { Pressable, StyleSheet, Text, View } from "react-native";
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
}

export function DeliveryCard({ delivery, onPress, actionLabel, onActionPress }: DeliveryCardProps) {
  const content = (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.trackingId}>{delivery.trackingId}</Text>
        <StatusPill status={delivery.status} />
      </View>

      <Text style={styles.address} numberOfLines={1}>
        {delivery.pickup.address} → {delivery.dropoff.address}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.meta}>{formatDistance(delivery.distanceKm)}</Text>
        <View style={styles.earningsBlock}>
          <Text style={styles.earningsLabel}>You earn</Text>
          <Text style={styles.earnings}>{formatCurrency(delivery.riderEarnings)}</Text>
        </View>
      </View>

      {actionLabel && onActionPress ? (
        <Button label={actionLabel} onPress={onActionPress} style={styles.actionButton} />
      ) : null}
    </Card>
  );

  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}

const styles = StyleSheet.create({
  card: { gap: 8, marginBottom: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  trackingId: { fontFamily: fonts.semiBold, fontSize: fontSize.sm, color: colors.textPrimary },
  address: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 4 },
  meta: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.textSecondary },
  earningsBlock: { alignItems: "flex-end", gap: 2 },
  earningsLabel: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.textSecondary },
  earnings: { fontFamily: fonts.bold, fontSize: fontSize.base, color: colors.success },
  actionButton: { marginTop: 8 },
});