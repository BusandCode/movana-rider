import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Linking, Platform } from "react-native";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { RouteMap } from "@/components/map/RouteMap";
import { Button } from "@/components/ui/Button";
import { useActiveDelivery } from "@/features/deliveries/useActiveDelivery";
import { locationService } from "@/services/location.service";
import type { Coordinates } from "@/types/delivery";

export default function NavigateScreen() {
  const { activeDelivery } = useActiveDelivery();
  const [riderPosition, setRiderPosition] = useState<Coordinates | undefined>();

  useEffect(() => {
    locationService
      .getCurrentPosition()
      .then((pos) => setRiderPosition({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }))
      .catch(() => null);
  }, []);

  if (!activeDelivery) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No active delivery to navigate.</Text>
      </View>
    );
  }

  const destination =
    activeDelivery.status === "PICKED_UP" || activeDelivery.status === "IN_TRANSIT" || activeDelivery.status === "OUT_FOR_DELIVERY"
      ? activeDelivery.dropoff
      : activeDelivery.pickup;

  const openExternalNav = () => {
    const { latitude, longitude } = destination.coordinates;
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}`,
      android: `google.navigation:q=${latitude},${longitude}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.destinationBanner}>
        <Text style={styles.destinationLabel}>Heading to</Text>
        <Text style={styles.destinationName}>{destination.name}</Text>
        <Text style={styles.destinationAddress}>{destination.address}</Text>
      </View>

      <RouteMap
        origin={activeDelivery.pickup.coordinates}
        destination={activeDelivery.dropoff.coordinates}
        riderPosition={riderPosition}
      />

      <View style={styles.footer}>
        <Button label="Open in Maps App" onPress={openExternalNav} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  emptyText: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  destinationBanner: { marginBottom: 12 },
  destinationLabel: { fontFamily: fonts.medium, fontSize: fontSize.xs, color: colors.primary, textTransform: "uppercase" },
  destinationName: { fontFamily: fonts.semiBold, fontSize: fontSize.base, color: colors.textPrimary, marginTop: 2 },
  destinationAddress: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  footer: { marginTop: 16 },
});
