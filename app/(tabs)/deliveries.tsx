import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Screen } from "@/components/ui/Screen";
import { DeliveryCard } from "@/components/delivery/DeliveryCard";
import { useDeliveries } from "@/features/deliveries/useDeliveries";

export default function DeliveriesScreen() {
  const { history, fetchHistory, isLoading } = useDeliveries();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  return (
    <Screen scroll={false}>
      <Text style={styles.title}>Delivery History</Text>

      {isLoading && history.length === 0 ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => (
            <DeliveryCard delivery={item} onPress={() => router.push(`/delivery/${item.id}`)} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>You haven't completed any deliveries yet.</Text>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, paddingHorizontal: 20, paddingTop: 20, marginBottom: 16 },
  emptyText: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, textAlign: "center", marginTop: 40 },
});