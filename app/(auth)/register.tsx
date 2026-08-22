import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { router, Link } from "expo-router";
import { colors } from "@/constants/colors";
import { Screen } from "@/components/ui/Screen";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/api/endpoints/auth.api";
import type { RiderRegistrationPayload } from "@/api/types/rider.types";

const VEHICLE_TYPES = ["bike", "motorcycle", "car", "van"] as const;

export default function RegisterScreen() {
  const [form, setForm] = useState<RiderRegistrationPayload>({
    name: "",
    email: "",
    phone: "",
    password: "",
    vehicleType: "motorcycle",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key: keyof RiderRegistrationPayload, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.phone || !form.password) {
      Alert.alert("Missing info", "Please fill in every field.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { data } = await authApi.register(form);
      router.push({ pathname: "/(auth)/verify-otp", params: { userId: data.data.userId, phone: form.phone } });
    } catch (err: any) {
      Alert.alert("Registration failed", err?.response?.data?.message ?? "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Rider Account</Text>
      <Text style={styles.subtitle}>Join Movana and start earning on your schedule.</Text>

      <Field label="Full Name" value={form.name} onChangeText={(v) => update("name", v)} placeholder="Chidinma Okafor" />
      <Field label="Email" value={form.email} onChangeText={(v) => update("email", v)} placeholder="you@example.com" keyboardType="email-address" />
      <Field label="Phone Number" value={form.phone} onChangeText={(v) => update("phone", v)} placeholder="08012345678" keyboardType="phone-pad" />
      <Field label="Password" value={form.password} onChangeText={(v) => update("password", v)} placeholder="••••••••" secureTextEntry />

      <Text style={styles.label}>Vehicle Type</Text>
      <View style={styles.vehicleRow}>
        {VEHICLE_TYPES.map((type) => (
          <Text
            key={type}
            onPress={() => update("vehicleType", type)}
            style={[styles.vehicleChip, form.vehicleType === type && styles.vehicleChipActive]}
          >
            {type}
          </Text>
        ))}
      </View>

      <Button label="Continue" onPress={handleRegister} isLoading={isSubmitting} style={{ marginTop: 28 }} />

      <Link href="/(auth)/login" style={styles.loginLink}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginHighlight}>Sign in</Text>
        </Text>
      </Link>
    </Screen>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) {
  return (
    <View>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        style={styles.input}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType ?? "default"}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flexGrow: 1 },
  title: { fontFamily: "Manrope_700Bold", fontSize: 24, color: colors.primaryDark, marginTop: 40 },
  subtitle: { fontFamily: "Manrope_400Regular", fontSize: 14, color: colors.textSecondary, marginTop: 6, marginBottom: 24 },
  label: { fontFamily: "Manrope_500Medium", fontSize: 13, color: colors.textPrimary, marginTop: 16, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: "Manrope_400Regular",
    fontSize: 15,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  vehicleRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  vehicleChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    color: colors.textSecondary,
    overflow: "hidden",
    textTransform: "capitalize",
  },
  vehicleChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: colors.surface,
  },
  loginLink: { marginTop: 24, alignSelf: "center", paddingVertical: 15 },
  loginText: { fontFamily: "Manrope_400Regular", color: colors.textSecondary, fontSize: 14 },
  loginHighlight: { fontFamily: "Manrope_600SemiBold", color: colors.primary },
});