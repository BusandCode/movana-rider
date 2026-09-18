import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { DeliveryTimeline } from "@/components/delivery/DeliveryTimeline";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { deliveriesApi } from "@/api/endpoints/deliveries.api";
import { useActiveDelivery } from "@/features/deliveries/useActiveDelivery";
import { formatCurrency, formatDistance } from "@/utils/formatters";
import type { Delivery } from "@/types/delivery";
import { ACTIVE_STATUS_ORDER, type DeliveryStatusType } from "@/constants/deliveryStatus";

export default function DeliveryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { updateStatus, isUpdating } = useActiveDelivery();

  useEffect(() => {
    deliveriesApi
      .getById(id)
      .then(({ data }) => setDelivery(data.data))
      .catch((err) => console.error("Failed to load delivery:", err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading || !delivery) {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  const currentIndex = ACTIVE_STATUS_ORDER.indexOf(delivery.status);
  const nextStatus = ACTIVE_STATUS_ORDER[currentIndex + 1] as DeliveryStatusType | undefined;

  // Determine the label for the next step
  const getNextStepLabel = (status?: DeliveryStatusType): string => {
    switch (status) {
      case "PICKED_UP":
        return "Mark as Picked Up";
      case "IN_TRANSIT":
        return "Start Transit";
      case "OUT_FOR_DELIVERY":
        return "Out for Delivery";
      case "DELIVERED":
        return "Confirm Delivery";
      default:
        return "Advance";
    }
  };

  const handleAdvance = async () => {
    if (!nextStatus) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // ✅ If the next status is DELIVERED, navigate to proof-of-delivery instead
    if (nextStatus === "DELIVERED") {
      router.push({
        pathname: "/delivery/proof-of-delivery",
        params: { deliveryId: delivery.id },
      });
      return;
    }

    try {
      await updateStatus(delivery.id, nextStatus);
      const { data } = await deliveriesApi.getById(id);
      setDelivery(data.data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      Alert.alert("Update failed", err?.message ?? "Please try again.");
    }
  };

  return (
    <Screen scroll={true} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.trackingId}>{delivery.trackingId}</Text>
        <StatusPill status={delivery.status} />
      </View>

      {/* Pickup */}
      <Card style={{ marginTop: 16 }}>
        <Text style={styles.sectionTitle}>Pickup</Text>
        <Text style={styles.name}>{delivery.pickup.name}</Text>
        <Text style={styles.address}>{delivery.pickup.address}</Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL(`tel:${delivery.pickup.phone}`)}
        >
          Call {delivery.pickup.phone}
        </Text>
      </Card>

      {/* Dropoff */}
      <Card style={{ marginTop: 12 }}>
        <Text style={styles.sectionTitle}>Drop-off</Text>
        <Text style={styles.name}>{delivery.dropoff.name}</Text>
        <Text style={styles.address}>{delivery.dropoff.address}</Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL(`tel:${delivery.dropoff.phone}`)}
        >
          Call {delivery.dropoff.phone}
        </Text>
      </Card>

      {/* Package */}
      <Card style={{ marginTop: 12 }}>
        <Text style={styles.sectionTitle}>Package</Text>
        <Text style={styles.address}>{delivery.package.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>Qty: {delivery.package.quantity}</Text>
          <Text style={styles.meta}>{formatDistance(delivery.distanceKm)}</Text>
          <Text style={styles.earnings}>{formatCurrency(delivery.riderEarnings)}</Text>
        </View>
      </Card>

      {/* Timeline */}
      <Card style={{ marginTop: 12 }}>
        <Text style={styles.sectionTitle}>Progress</Text>
        <DeliveryTimeline currentStatus={delivery.status} />
      </Card>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          label="Navigate"
          variant="outline"
          onPress={() => router.push("/delivery/navigate")}
        />

        {nextStatus && (
          <Button
            label={getNextStepLabel(nextStatus)}
            onPress={handleAdvance}
            isLoading={isUpdating}
            style={{ marginTop: 12 }}
          />
        )}

        {delivery.status === "DELIVERED" && (
          <View style={styles.deliveredBanner}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={styles.deliveredText}>Delivery Completed</Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trackingId: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.xs,
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  address: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  link: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.primary,
    marginTop: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 10,
    alignItems: "center",
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  earnings: {
    fontFamily: fonts.bold,
    fontSize: fontSize.sm,
    color: colors.success,
    marginLeft: "auto",
  },
  actionsContainer: {
    marginTop: 24,
  },
  deliveredBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    backgroundColor: `${colors.success}12`,
    borderRadius: 12,
    marginTop: 16,
  },
  deliveredText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.base,
    color: colors.success,
  },
});