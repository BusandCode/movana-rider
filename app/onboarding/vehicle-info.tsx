import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { ridersApi } from "@/api/endpoints/riders.api";

const VEHICLE_TYPES = ["bike", "motorcycle", "car", "van"] as const;
type VehicleType = typeof VEHICLE_TYPES[number];

export default function VehicleInfoScreen() {
  const rider = useAuthStore((s) => s.rider);
  const setRider = useAuthStore((s) => s.setRider);

  const [vehicleType, setVehicleType] = useState<VehicleType>(
    (rider?.vehicle?.type as VehicleType) || "motorcycle"
  );
  const [plateNumber, setPlateNumber] = useState(rider?.vehicle?.plateNumber || "");
  const [capacityKg, setCapacityKg] = useState(
    rider?.vehicle?.capacityKg?.toString() || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleSave = async () => {
    if (!plateNumber.trim()) {
      Alert.alert("Plate Number Required", "Please enter your vehicle plate number.");
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ Update backend
      await ridersApi.updateVehicle({
        vehicleType,
        plateNumber: plateNumber.trim(),
        capacityKg: capacityKg ? parseInt(capacityKg) : 25,
      });

      // ✅ Update local store
      const updatedRider = {
        ...rider!,
        vehicle: {
          type: vehicleType,
          plateNumber: plateNumber.trim(),
          capacityKg: capacityKg ? parseInt(capacityKg) : 25,
        },
      };
      setRider(updatedRider);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Vehicle information saved successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to save vehicle info. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={true} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Vehicle Information</Text>
      <Text style={styles.subtitle}>
        Update your vehicle details. This information helps match you with the right deliveries.
      </Text>

      <Text style={styles.label}>Vehicle Type</Text>
      <View style={styles.vehicleRow}>
        {VEHICLE_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setVehicleType(type)}
            style={[
              styles.vehicleChip,
              vehicleType === type && styles.vehicleChipActive,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.vehicleChipText,
                vehicleType === type && styles.vehicleChipTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Plate Number</Text>
      <TextInput
        style={styles.input}
        value={plateNumber}
        onChangeText={setPlateNumber}
        placeholder="e.g., LND-234-XY"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Load Capacity (kg)</Text>
      <TextInput
        style={styles.input}
        value={capacityKg}
        onChangeText={setCapacityKg}
        placeholder="e.g., 25"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
      />

      <Button
        label="Save Changes"
        onPress={handleSave}
        isLoading={isSubmitting}
        style={{ marginTop: 24 }}
      />

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
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
  vehicleRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  vehicleChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  vehicleChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  vehicleChipText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
  vehicleChipTextActive: {
    color: "#FFFFFF",
  },
  cancelButton: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});