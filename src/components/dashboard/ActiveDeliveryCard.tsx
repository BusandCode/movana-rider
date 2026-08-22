import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/components/ui/Card";
import { DeliveryCard } from "@/components/delivery/DeliveryCard";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import type { Delivery } from "@/types/delivery";

interface ActiveDeliveryCardProps {
  delivery: Delivery;
}

export function ActiveDeliveryCard({ delivery }: ActiveDeliveryCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.pulseDot} />
          <Text style={styles.label}>Active Delivery</Text>
        </View>
        <View style={styles.iconWrap}>
          <Ionicons name="bicycle-outline" size={16} color={colors.primary} />
        </View>
      </View>

      <DeliveryCard
        delivery={delivery}
        actionLabel="View"
        onActionPress={() => router.push(`/delivery/${delivery.id}`)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: colors.background,
    borderStyle: "dashed",
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.xs,
    color: colors.primary,
    textTransform: "uppercase",
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});