import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { deliveriesApi } from "@/api/endpoints/deliveries.api";
import { useActiveDelivery } from "@/features/deliveries/useActiveDelivery";
import { locationService } from "@/services/location.service";

export default function ProofOfDeliveryScreen() {
  const params = useLocalSearchParams<{ deliveryId?: string }>();
  const { activeDeliveries, updateStatus, refetch } = useActiveDelivery();

  const [otpCode, setOtpCode] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [delivery, setDelivery] = useState<any>(null);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (params.deliveryId) {
      const found = activeDeliveries?.find((d) => d.id === params.deliveryId);
      if (found) {
        setDelivery(found);
      } else {
        fetchDeliveryById(params.deliveryId);
      }
    } else if (activeDeliveries && activeDeliveries.length > 0) {
      setDelivery(activeDeliveries[0]);
    }
  }, [activeDeliveries, params.deliveryId]);

  const fetchDeliveryById = async (deliveryId: string) => {
    setIsLoading(true);
    try {
      const response = await deliveriesApi.getById(deliveryId);
      setDelivery(response.data.data);
    } catch (error) {
      console.error("Failed to fetch delivery:", error);
      if (activeDeliveries?.length > 0) {
        setDelivery(activeDeliveries[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Camera permission needed", "Enable camera access to capture proof of delivery.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const otpValid = otpCode.length >= 4;
  const photoValid = !!photoUri;
  const canSubmit = otpValid && photoValid;

  const handleSubmit = async () => {
    if (!delivery) return;

    // ✅ BOTH required
    if (!otpValid) {
      Alert.alert("Enter OTP", "Ask the customer for their delivery confirmation code.");
      return;
    }
    if (!photoValid) {
      Alert.alert("Photo required", "Take a photo of the delivered package.");
      return;
    }

    setIsSubmitting(true);
    try {
      const position = await locationService.getCurrentPosition().catch(() => null);

      await deliveriesApi.submitProofOfDelivery({
        deliveryId: delivery.id,
        proof: {
          method: "otp",
          otpCode,
          photoUri,
          recipientName: recipientName || undefined,
          coordinates: position
            ? { latitude: position.coords.latitude, longitude: position.coords.longitude }
            : undefined,
          timestamp: new Date().toISOString(),
        },
      });

      await updateStatus(delivery.id, "DELIVERED");

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert("Delivered!", "This delivery has been marked as completed.", [
        { text: "Done", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (err: any) {
      Alert.alert("Submission failed", err?.response?.data?.message ?? "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Loading delivery details...</Text>
        </View>
      </Screen>
    );
  }

  if (!delivery) {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <Ionicons name="cube-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No active delivery found.</Text>
          <Button label="Go Back" variant="outline" onPress={() => router.back()} style={{ marginTop: 16 }} />
        </View>
      </Screen>
    );
  }

  const canConfirmDelivery =
    delivery.status === "OUT_FOR_DELIVERY" ||
    delivery.status === "IN_TRANSIT" ||
    delivery.status === "PICKED_UP" ||
    delivery.status === "RIDER_ASSIGNED" ||
    delivery.status === "ACCEPTED";

  if (!canConfirmDelivery) {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.warning} />
          <Text style={styles.emptyText}>This delivery cannot be confirmed yet.</Text>
          <Text style={styles.emptySubtext}>Current status: {delivery.status}</Text>
          <Button label="Go Back" variant="outline" onPress={() => router.back()} style={{ marginTop: 16 }} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={true} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Confirm Delivery</Text>
        <Text style={styles.subtitle}>{delivery.trackingId}</Text>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{delivery.status.replace(/_/g, " ")}</Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.instructionsText}>
          Both OTP and Photo are required to complete this delivery.
        </Text>
      </View>

      {/* Step 1 — OTP */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionNumber, !otpValid && styles.sectionNumberActive]}>
            <Text style={styles.sectionNumberText}>1</Text>
          </View>
          <Text style={styles.sectionTitle}>Enter OTP from Customer</Text>
          {otpValid && (
            <Ionicons name="checkmark-circle" size={20} color={colors.success} style={{ marginLeft: "auto" }} />
          )}
        </View>

        <TextInput
          style={[styles.input, styles.otpInput]}
          value={otpCode}
          onChangeText={setOtpCode}
          placeholder="123456"
          keyboardType="number-pad"
          maxLength={6}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Step 2 — Photo */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionNumber, !photoValid && styles.sectionNumberActive]}>
            <Text style={styles.sectionNumberText}>2</Text>
          </View>
          <Text style={styles.sectionTitle}>Take Photo of Package</Text>
          {photoValid && (
            <Ionicons name="checkmark-circle" size={20} color={colors.success} style={{ marginLeft: "auto" }} />
          )}
        </View>

        {photoUri ? (
          <>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            <TouchableOpacity style={styles.retakeButton} onPress={pickPhoto} activeOpacity={0.7}>
              <Ionicons name="refresh-outline" size={16} color={colors.primary} />
              <Text style={styles.retakeButtonText}>Retake Photo</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.photoPlaceholder} onPress={pickPhoto} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={32} color={colors.primary} />
            <Text style={styles.photoPlaceholderText}>Tap to take a photo</Text>
            <Text style={styles.photoPlaceholderHint}>Photo must clearly show the delivered package</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Step 3 — Recipient Name */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionNumber, styles.sectionNumberOptional]}>
            <Text style={styles.sectionNumberText}>3</Text>
          </View>
          <Text style={styles.sectionTitle}>Recipient Name (optional)</Text>
        </View>

        <TextInput
          style={styles.input}
          value={recipientName}
          onChangeText={setRecipientName}
          placeholder="Who received the package?"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Submit */}
      <Button
        label="Confirm Delivery"
        onPress={handleSubmit}
        isLoading={isSubmitting}
        disabled={!canSubmit}
        style={{ marginTop: 24 }}
      />

      {!canSubmit && (
        <Text style={styles.helperText}>
          Complete both steps above to enable confirmation.
        </Text>
      )}
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: 12,
    padding: 20,
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    textAlign: "center",
  },
  emptySubtext: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: `${colors.primary}12`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primary,
    textTransform: "capitalize",
  },
  instructionsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: `${colors.primary}08`,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
    marginBottom: 20,
  },
  instructionsText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.primary,
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionNumberActive: {
    backgroundColor: colors.primary,
  },
  sectionNumberOptional: {
    backgroundColor: colors.border,
  },
  sectionNumberText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
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
  otpInput: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.xl,
    letterSpacing: 8,
    textAlign: "center",
  },
  photoPlaceholder: {
    height: 180,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: `${colors.primary}05`,
  },
  photoPlaceholderText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  photoPlaceholderHint: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  photoPreview: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 8,
  },
  retakeButtonText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  helperText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 12,
  },
});