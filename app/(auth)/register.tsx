import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { router, Link } from "expo-router";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Screen } from "@/components/ui/Screen";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/api/endpoints/auth.api";
import { useAuthStore } from "@/store/authStore";
import type { RiderProfile, VehicleType } from "@/types/rider";

const VEHICLE_TYPES = ["bike", "motorcycle", "car", "van"] as const;

interface RiderRegistrationPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  vehicleType: string;
}

export default function RegisterScreen() {
  const [form, setForm] = useState<RiderRegistrationPayload>({
    name: "",
    email: "",
    phone: "",
    password: "",
    vehicleType: "motorcycle",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const setRider = useAuthStore((state) => state.setRider);
  const setTokens = useAuthStore((state) => state.setTokens);

  const update = (key: keyof RiderRegistrationPayload, value: string) => {
    if (formError) setFormError(null);
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleRegister = async () => {
    if (!form.name.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!form.email.trim()) {
      setFormError("Please enter your email address.");
      return;
    }
    if (!form.phone.trim()) {
      setFormError("Please enter your phone number.");
      return;
    }
    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const response = await authApi.register(form);
      const authData = response.data.data;

      const vehicleType = (authData.user.rider?.vehicleType || form.vehicleType || "motorcycle") as VehicleType;

      const riderProfile: RiderProfile = {
        id: authData.user.id,
        name: authData.user.rider?.name || form.name,
        email: authData.user.email,
        phone: authData.user.phone,
        photoUrl: authData.user.rider?.photoUrl || "",
        address: authData.user.rider?.address || "",
        vehicle: {
          type: vehicleType,
          plateNumber: authData.user.rider?.plateNumber || "",
          capacityKg: authData.user.rider?.vehicleCapacityKg || 25,
        },
        isVerified: authData.user.rider?.isVerified || false,
        isAvailable: authData.user.rider?.isAvailable || false,
        successRate: authData.user.rider?.successRate || 0,
        activeDeliveriesCount: authData.user.rider?.activeDeliveriesCount || 0,
        totalDeliveriesCompleted: authData.user.rider?.totalDeliveries || 0,
      };

      await setTokens(authData.token, authData.token);
      setRider(riderProfile);

      router.replace("/(tabs)");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Registration failed. Please try again.";

      if (errorMessage.toLowerCase().includes("already exists")) {
        setFormError("An account with this email or phone number already exists. Please login instead.");
      } else {
        setFormError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen scroll={true} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/movana.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Create Rider Account</Text>
        <Text style={styles.subtitle}>Start earning on your own schedule.</Text>
      </View>

      {formError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{formError}</Text>
        </View>
      )}

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(v) => update("name", v)}
        placeholder="Chidinma Okafor"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={(v) => update("email", v)}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={form.phone}
        onChangeText={(v) => update("phone", v)}
        placeholder="08012345678"
        keyboardType="phone-pad"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={form.password}
        onChangeText={(v) => update("password", v)}
        placeholder="••••••••"
        secureTextEntry
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Vehicle Type</Text>
      <View style={styles.vehicleRow}>
        {VEHICLE_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => update("vehicleType", type)}
            style={[
              styles.vehicleChip,
              form.vehicleType === type && styles.vehicleChipActive,
            ]}
          >
            <Text
              style={[
                styles.vehicleChipText,
                form.vehicleType === type && styles.vehicleChipTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        label="Continue"
        onPress={handleRegister}
        isLoading={isSubmitting}
        style={{ marginTop: 28 }}
      />

      <Link href="/(auth)/login" style={styles.loginLink}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginHighlight}>Sign in</Text>
        </Text>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 32,
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    gap: 6,
    marginBottom: 26,
  },
  logo: {
    width: 140,
    height: 80,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
  errorBanner: {
    backgroundColor: "#FDECEC",
    borderWidth: 1,
    borderColor: "#F5B5B5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: "#C0392B",
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 6,
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
    marginTop: 4,
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
  loginLink: {
    marginTop: 28,
    alignSelf: "center",
    paddingVertical: 10,
  },
  loginText: {
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    fontSize: fontSize.base,
  },
  loginHighlight: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
});