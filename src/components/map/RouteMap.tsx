import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { colors } from "@/constants/colors";
import type { Coordinates } from "@/types/delivery";

interface RouteMapProps {
  origin: Coordinates;
  destination: Coordinates;
  riderPosition?: Coordinates;
}

export function RouteMap({ origin, destination, riderPosition }: RouteMapProps) {
  const midLat = (origin.latitude + destination.latitude) / 2;
  const midLng = (origin.longitude + destination.longitude) / 2;

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: midLat,
          longitude: midLng,
          latitudeDelta: Math.abs(origin.latitude - destination.latitude) * 2 + 0.02,
          longitudeDelta: Math.abs(origin.longitude - destination.longitude) * 2 + 0.02,
        }}
      >
        <Marker coordinate={origin} title="Pickup" pinColor={colors.primary} />
        <Marker coordinate={destination} title="Drop-off" pinColor={colors.error} />
        {riderPosition && <Marker coordinate={riderPosition} title="You" pinColor={colors.success} />}
        <Polyline
          coordinates={[origin, destination]}
          strokeColor={colors.primary}
          strokeWidth={3}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, borderRadius: 16, overflow: "hidden" },
});
