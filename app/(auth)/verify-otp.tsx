import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Screen } from "@/components/ui/Screen";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/api/endpoints/auth.api";

export default function VerifyOtpScreen() {
  const { userId, phone } = useLocalSearchParams<{ userId: string; phone: string }>();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    if (code.length < 4) {
      Alert.alert("Invalid code", "Enter the code sent to your phone.");
      return;
    }
    setIsSubmitting(true);
    try {
      await authApi.verifyOtp({ userId, code });
      Alert.alert("Verified", "Your account is confirmed. You can now sign in.", [
        { text: "Continue", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (err: any) {
      Alert.alert("Verification failed", err?.response?.data?.message ?? "Incorrect or expired code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen scroll={false} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Verify Your Number</Text>
      <Text style={styles.subtitle}>Enter the code we sent to {phone ?? "your phone"}.</Text>

      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        placeholderTextColor={colors.textSecondary}
      />

      <Button label="Verify" onPress={handleVerify} isLoading={isSubmitting} style={{ marginTop: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: fonts.semiBold,
    fontSize: fontSize.xl,
    letterSpacing: 8,
    textAlign: "center",
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
});