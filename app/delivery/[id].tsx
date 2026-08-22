import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Linking } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { DeliveryTimeline } from "@/components/delivery/DeliveryTimeline";
import { Button } from "@/components/ui/Button";
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
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading || !delivery) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const currentIndex = ACTIVE_STATUS_ORDER.indexOf(delivery.status);
  const nextStatus = ACTIVE_STATUS_ORDER[currentIndex + 1] as DeliveryStatusType | undefined;

  const handleAdvance = async () => {
    if (!nextStatus) return;
    await updateStatus(delivery.id, nextStatus);
    if (nextStatus === "OUT_FOR_DELIVERY") {
      router.push("/delivery/proof-of-delivery");
    } else {
      const { data } = await deliveriesApi.getById(id);
      setDelivery(data.data);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.headerRow}>
        <Text style={styles.trackingId}>{delivery.trackingId}</Text>
        <StatusPill status={delivery.status} />
      </View>

      <Card style={{ marginTop: 16 }}>
        <Text style={styles.sectionTitle}>Pickup</Text>
        <Text style={styles.name}>{delivery.pickup.name}</Text>
        <Text style={styles.address}>{delivery.pickup.address}</Text>
        <Text style={styles.link} onPress={() => Linking.openURL(`tel:${delivery.pickup.phone}`)}>
          Call {delivery.pickup.phone}
        </Text>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Text style={styles.sectionTitle}>Drop-off</Text>
        <Text style={styles.name}>{delivery.dropoff.name}</Text>
        <Text style={styles.address}>{delivery.dropoff.address}</Text>
        <Text style={styles.link} onPress={() => Linking.openURL(`tel:${delivery.dropoff.phone}`)}>
          Call {delivery.dropoff.phone}
        </Text>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Text style={styles.sectionTitle}>Package</Text>
        <Text style={styles.address}>{delivery.package.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>Qty: {delivery.package.quantity}</Text>
          <Text style={styles.meta}>{formatDistance(delivery.distanceKm)}</Text>
          <Text style={styles.earnings}>{formatCurrency(delivery.riderEarnings)}</Text>
        </View>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Text style={styles.sectionTitle}>Progress</Text>
        <DeliveryTimeline currentStatus={delivery.status} />
      </Card>

      <View style={{ marginTop: 20, gap: 12 }}>
        <Button label="Navigate" variant="outline" onPress={() => router.push("/delivery/navigate")} />
        {nextStatus && (
          <Button
            label={`Mark as ${nextStatus.replace(/_/g, " ")}`}
            onPress={handleAdvance}
            isLoading={isUpdating}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  trackingId: { fontFamily: fonts.bold, fontSize: fontSize.lg, color: colors.textPrimary },
  sectionTitle: { fontFamily: fonts.semiBold, fontSize: fontSize.xs, color: colors.primary, textTransform: "uppercase", marginBottom: 6 },
  name: { fontFamily: fonts.semiBold, fontSize: fontSize.base, color: colors.textPrimary },
  address: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  link: { fontFamily: fonts.medium, fontSize: fontSize.sm, color: colors.primary, marginTop: 8 },
  metaRow: { flexDirection: "row", gap: 16, marginTop: 10 },
  meta: { fontFamily: fonts.regular, fontSize: fontSize.xs, color: colors.textSecondary },
  earnings: { fontFamily: fonts.bold, fontSize: fontSize.sm, color: colors.success, marginLeft: "auto" },
});
