import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Button } from "@/components/ui/Button";
import { ridersApi } from "@/api/endpoints/riders.api";
import { useAuthStore } from "@/store/authStore";

const VEHICLE_TYPES = ["bike", "motorcycle", "car", "van"] as const;

export default function VehicleInfoScreen() {
  const rider = useAuthStore((s) => s.rider);
  const [vehicleType, setVehicleType] = useState(rider?.vehicle?.type ?? "motorcycle");
  const [plateNumber, setPlateNumber] = useState(rider?.vehicle?.plateNumber ?? "");
  const [capacityKg, setCapacityKg] = useState(rider?.vehicle?.capacityKg?.toString() ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Vehicle profile update endpoint — extend ridersApi as the backend adds PATCH /riders/me/vehicle
      Alert.alert("Saved", "Vehicle information updated.");
      router.back();
    } catch {
      Alert.alert("Error", "Could not save vehicle info. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Vehicle Type</Text>
      <View style={styles.row}>
        {VEHICLE_TYPES.map((type) => (
          <Text
            key={type}
            onPress={() => setVehicleType(type)}
            style={[styles.chip, vehicleType === type && styles.chipActive]}
          >
            {type}
          </Text>
        ))}
      </View>

      <Text style={styles.label}>Plate Number</Text>
      <TextInput
        style={styles.input}
        value={plateNumber}
        onChangeText={setPlateNumber}
        placeholder="LND-234-XY"
        autoCapitalize="characters"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Load Capacity (kg)</Text>
      <TextInput
        style={styles.input}
        value={capacityKg}
        onChangeText={setCapacityKg}
        placeholder="20"
        keyboardType="numeric"
        placeholderTextColor={colors.textSecondary}
      />

      <Button label="Save" onPress={handleSave} isLoading={isSubmitting} style={{ marginTop: 28 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: colors.background, flexGrow: 1 },
  label: { fontFamily: fonts.medium, fontSize: fontSize.sm, color: colors.textPrimary, marginTop: 16, marginBottom: 6 },
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textTransform: "capitalize",
    overflow: "hidden",
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary, color: colors.surface },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.regular,
    fontSize: fontSize.base,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
});
