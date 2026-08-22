import { StyleSheet, Text, View, Switch, RefreshControl, ActivityIndicator } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActiveDeliveryCard } from "@/components/dashboard/ActiveDeliveryCard";
import { DeliveryCard } from "@/components/delivery/DeliveryCard";
import { WeeklyDeliveriesChart } from "@/components/dashboard/WeeklyDeliveriesChart";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useDeliveries } from "@/features/deliveries/useDeliveries";
import { useActiveDelivery } from "@/features/deliveries/useActiveDelivery";
import { ridersApi } from "@/api/endpoints/riders.api";

export default function DashboardScreen() {
  const rider = useAuthStore((s) => s.rider);
  const { availableOffers, isLoading, fetchOffers } = useDeliveries();
  const { activeDelivery, accept, reject, isUpdating } = useActiveDelivery();
  const [isAvailable, setIsAvailable] = useState(rider?.isAvailable ?? false);
  const [avgDeliveryTime, setAvgDeliveryTime] = useState<number | null>(null);
  const [weeklyData, setWeeklyData] = useState<{ day: string; count: number }[]>([]);

  useEffect(() => {
    ridersApi.getPerformance().then(({ data }) => setAvgDeliveryTime(data.data.averageDeliveryTimeMinutes));
    ridersApi.getWeeklyDeliveries().then(({ data }) => setWeeklyData(data.data));
  }, []);

  const toggleAvailability = async (value: boolean) => {
    setIsAvailable(value);
    await ridersApi.updateAvailability({ isAvailable: value }).catch(() => setIsAvailable(!value));
  };

  const onRefresh = useCallback(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <Screen refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={colors.primary} />}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Avatar
            name={rider?.name ?? "Rider"}
            photoUrl={rider?.photoUrl}
            size={44}
            onPress={() => router.push("/(tabs)/profile")}
          />
          <View>
            <Text style={styles.greeting}>Hi, {rider?.name?.split(" ")[0] ?? "Rider"}</Text>
            <Text style={styles.subGreeting}>{isAvailable ? "You're online" : "You're offline"}</Text>
          </View>
        </View>
        <Switch
          value={isAvailable}
          onValueChange={toggleAvailability}
          trackColor={{ false: colors.border, true: colors.primary }}
        />
      </View>

      {activeDelivery ? <ActiveDeliveryCard delivery={activeDelivery} /> : null}

      <View style={styles.statsGrid}>
        <StatCard value={rider?.totalDeliveriesCompleted ?? 0} label="Completed" />
        <StatCard value={`${rider?.successRate ?? 0}%`} label="Success Rate" />
        <StatCard value={rider?.activeDeliveriesCount ?? 0} label="Active" />
        <StatCard value={`${avgDeliveryTime ?? "—"}${avgDeliveryTime ? "m" : ""}`} label="Avg. Time" />
      </View>

      <Card style={{ marginBottom: 24 }}>
        <Text style={styles.sectionTitle}>This Week</Text>
        {weeklyData.length > 0 ? (
          <WeeklyDeliveriesChart data={weeklyData} />
        ) : (
          <ActivityIndicator color={colors.primary} style={{ paddingVertical: 20 }} />
        )}
      </Card>

      <Text style={styles.sectionTitle}>Available Deliveries</Text>

      {isLoading && availableOffers.length === 0 ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
      ) : availableOffers.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>No delivery requests nearby right now.</Text>
        </Card>
      ) : (
        availableOffers.map((offer) => (
          <Card key={offer.id} style={{ marginBottom: 12 }}>
            <DeliveryCard delivery={offer} />
            <View style={styles.offerActions}>
              <Button label="Reject" variant="outline" onPress={() => reject(offer.id)} disabled={isUpdating} style={{ flex: 1 }} />
              <Button label="Accept" onPress={() => accept(offer.id)} disabled={isUpdating} style={{ flex: 1 }} />
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  greeting: { fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary },
  subGreeting: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  sectionTitle: { fontFamily: fonts.semiBold, fontSize: fontSize.base, color: colors.textPrimary, marginBottom: 12 },
  emptyText: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", paddingVertical: 12 },
  offerActions: { flexDirection: "row", gap: 8, marginTop: 12 },
});