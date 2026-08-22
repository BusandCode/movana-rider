import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Button } from "@/components/ui/Button";
import { deliveriesApi } from "@/api/endpoints/deliveries.api";
import { useActiveDelivery } from "@/features/deliveries/useActiveDelivery";
import { locationService } from "@/services/location.service";

const METHODS = ["otp", "photo", "signature"] as const;

export default function ProofOfDeliveryScreen() {
  const { activeDelivery, updateStatus } = useActiveDelivery();
  const [method, setMethod] = useState<(typeof METHODS)[number]>("otp");
  const [otpCode, setOtpCode] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Camera permission needed", "Enable camera access to capture proof of delivery.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!activeDelivery) return;
    if (method === "otp" && otpCode.length < 4) {
      Alert.alert("Enter OTP", "Ask the customer for their delivery confirmation code.");
      return;
    }
    if (method === "photo" && !photoUri) {
      Alert.alert("Photo required", "Take a photo of the delivered package.");
      return;
    }

    setIsSubmitting(true);
    try {
      const position = await locationService.getCurrentPosition().catch(() => null);
      await deliveriesApi.submitProofOfDelivery({
        deliveryId: activeDelivery.id,
        proof: {
          method,
          otpCode: method === "otp" ? otpCode : undefined,
          photoUri: method === "photo" ? photoUri ?? undefined : undefined,
          recipientName: recipientName || undefined,
          coordinates: position
            ? { latitude: position.coords.latitude, longitude: position.coords.longitude }
            : undefined,
          timestamp: new Date().toISOString(),
        },
      });
      await updateStatus(activeDelivery.id, "DELIVERED");
      Alert.alert("Delivered!", "This delivery has been marked as completed.", [
        { text: "Done", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (err: any) {
      Alert.alert("Submission failed", err?.response?.data?.message ?? "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activeDelivery) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No active delivery.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Delivery</Text>
      <Text style={styles.subtitle}>{activeDelivery.trackingId}</Text>

      <View style={styles.methodRow}>
        {METHODS.map((m) => (
          <Text
            key={m}
            onPress={() => setMethod(m)}
            style={[styles.methodChip, method === m && styles.methodChipActive]}
          >
            {m}
          </Text>
        ))}
      </View>

      <Text style={styles.label}>Recipient Name</Text>
      <TextInput
        style={styles.input}
        value={recipientName}
        onChangeText={setRecipientName}
        placeholder="Who received the package?"
        placeholderTextColor={colors.textSecondary}
      />

      {method === "otp" && (
        <>
          <Text style={styles.label}>OTP Code</Text>
          <TextInput
            style={[styles.input, styles.otpInput]}
            value={otpCode}
            onChangeText={setOtpCode}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor={colors.textSecondary}
          />
        </>
      )}

      {method === "photo" && (
        <View style={{ marginTop: 8 }}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          ) : (
            <Button label="Take Photo" variant="outline" onPress={pickPhoto} />
          )}
        </View>
      )}

      {method === "signature" && (
        <Text style={styles.note}>Signature capture — recipient signs on handoff (pad UI to be added).</Text>
      )}

      {isSubmitting ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
      ) : (
        <Button label="Confirm Delivery" onPress={handleSubmit} style={{ marginTop: 24 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  emptyText: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  title: { fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary },
  subtitle: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2, marginBottom: 20 },
  methodRow: { flexDirection: "row", gap: 8 },
  methodChip: {
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
  methodChipActive: { backgroundColor: colors.primary, borderColor: colors.primary, color: colors.surface },
  label: { fontFamily: fonts.medium, fontSize: fontSize.sm, color: colors.textPrimary, marginTop: 20, marginBottom: 6 },
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
  otpInput: { fontFamily: fonts.semiBold, letterSpacing: 6, textAlign: "center" },
  photoPreview: { width: "100%", height: 200, borderRadius: 12 },
  note: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 16, fontStyle: "italic" },
});
