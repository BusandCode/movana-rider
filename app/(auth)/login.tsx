import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { Link } from "expo-router";
import { colors } from "@/constants/colors";
import { Screen } from "@/components/ui/Screen";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/useAuth";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login, isSubmitting, error } = useAuth();

  useEffect(() => {
    if (error) Alert.alert("Login failed", error);
  }, [error]);

  const handleLogin = () => {
    if (!phone || !password) {
      Alert.alert("Missing info", "Enter your phone number and password.");
      return;
    }
    login(phone, password);
  };

  return (
    <Screen scroll={false} contentContainerStyle={styles.container}>
      <Text style={styles.brand}>Movana</Text>
      <Text style={styles.subtitle}>Rider Sign In</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="08012345678"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={colors.textSecondary}
        />

        <Button
          label="Sign In"
          onPress={handleLogin}
          isLoading={isSubmitting}
          style={{ marginTop: 24 }}
        />

        <Link href="/(auth)/register" style={styles.registerLink}>
          <Text style={styles.registerText}>
            New rider? <Text style={styles.registerHighlight}>Create an account</Text>
          </Text>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  brand: { fontFamily: "Manrope_700Bold", fontSize: 32, color: colors.primaryDark, textAlign: "center" },
  subtitle: { fontFamily: "Manrope_500Medium", fontSize: 15, color: colors.textSecondary, textAlign: "center", marginTop: 4, marginBottom: 40 },
  form: { gap: 4 },
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
  registerLink: { marginTop: 24, alignSelf: "center" },
  registerText: { fontFamily: "Manrope_400Regular", color: colors.textSecondary, fontSize: 14 },
  registerHighlight: { fontFamily: "Manrope_600SemiBold", color: colors.primary },
});