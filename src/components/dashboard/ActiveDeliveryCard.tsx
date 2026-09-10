import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { formatCurrency, formatDistance } from "@/utils/formatters";
import type { Delivery } from "@/types/delivery";

interface ActiveDeliveryCardProps {
  delivery: Delivery;
  badge?: string;
}

export function ActiveDeliveryCard({ delivery, badge = "Active delivery" }: ActiveDeliveryCardProps) {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.badgeRow}>
        <View style={styles.pulseDot} />
        <Text style={styles.badgeText}>{badge}</Text>
        <View style={styles.statusChip}>
          <Text style={styles.statusChipText}>{delivery.status.replace(/_/g, " ")}</Text>
        </View>
      </View>

      <Text style={styles.trackingId}>{delivery.trackingId}</Text>

      <View style={styles.routeRow}>
        <View style={styles.routeMarkers}>
          <View style={styles.pickupDot} />
          <View style={styles.routeLine} />
          <Ionicons name="location" size={12} color="#FFFFFF" />
        </View>
        <View style={styles.routeText}>
          <Text style={styles.addressText} numberOfLines={1}>{delivery.pickup.address}</Text>
          <Text style={styles.addressText} numberOfLines={1}>{delivery.dropoff.address}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text style={styles.metaLabel}>Distance</Text>
          <Text style={styles.metaValue}>{formatDistance(delivery.distanceKm)}</Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.metaLabel}>You earn</Text>
          <Text style={styles.earnings}>{formatCurrency(delivery.riderEarnings)}</Text>
        </View>
        <Pressable style={styles.actionButton} onPress={() => router.push(`/delivery/${delivery.id}`)}>
          <Text style={styles.actionButtonText}>View</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.primary} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    gap: 14,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
    minHeight: 200,
  },
  badgeRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8 
  },
  pulseDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: "#FFFFFF",
    opacity: 0.9,
  },
  badgeText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: fontSize.xs,
    color: "rgba(255,255,255,0.85)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusChip: { 
    backgroundColor: "rgba(255,255,255,0.18)", 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    paddingVertical: 4 
  },
  statusChipText: { 
    fontFamily: fonts.semiBold, 
    fontSize: 10, 
    color: "#FFFFFF", 
    textTransform: "capitalize" 
  },
  trackingId: { 
    fontFamily: fonts.bold, 
    fontSize: fontSize.lg, 
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  routeRow: { 
    flexDirection: "row", 
    gap: 12 
  },
  routeMarkers: { 
    alignItems: "center", 
    width: 12, 
    paddingTop: 2 
  },
  pickupDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: "#FFFFFF" 
  },
  routeLine: { 
    width: 2, 
    flex: 1, 
    minHeight: 20, 
    backgroundColor: "rgba(255,255,255,0.3)", 
    marginVertical: 4 
  },
  routeText: { 
    flex: 1, 
    justifyContent: "space-between", 
    gap: 12 
  },
  addressText: { 
    fontFamily: fonts.medium, 
    fontSize: fontSize.sm, 
    color: "rgba(255,255,255,0.9)" 
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  footerItem: {
    flex: 1,
  },
  metaLabel: { 
    fontFamily: fonts.regular, 
    fontSize: 10, 
    color: "rgba(255,255,255,0.65)" 
  },
  metaValue: { 
    fontFamily: fonts.semiBold, 
    fontSize: fontSize.sm, 
    color: "#FFFFFF", 
    marginTop: 2 
  },
  earnings: { 
    fontFamily: fonts.extraBold, 
    fontSize: fontSize.base, 
    color: "#FFFFFF", 
    marginTop: 2 
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginLeft: 8,
  },
  actionButtonText: { 
    fontFamily: fonts.semiBold, 
    // fontSize: fontSize.lg,
    fontSize:14,
    fontWeight:300, 
    color: colors.primary 
  },
});