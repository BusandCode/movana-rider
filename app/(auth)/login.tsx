import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Link } from "expo-router";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Screen } from "@/components/ui/Screen";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/useAuth";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, isSubmitting, error: authError } = useAuth();

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleLogin = () => {
    Keyboard.dismiss();

    if (!phone.trim() || !password.trim()) {
      setError("Please enter your phone number/email and password.");
      return;
    }

    setError(null);
    login(phone, password);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.screen}>
        <Screen scroll={false} contentContainerStyle={styles.container}>
          <Image
            source={require("../../assets/images/movana.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Welcome Back!</Text>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Text style={styles.label}>Phone Number or Email</Text>

            <TextInput
              style={styles.input}
              placeholder="08012345678 or you@example.com"
              keyboardType="default"
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
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
                New rider?{" "}
                <Text style={styles.registerHighlight}>
                  Create an account
                </Text>
              </Text>
            </Link>
          </View>
        </Screen>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  logo: {
    width: 290,
    height: 200,
    alignSelf: "center",
  },

  subtitle: {
    fontFamily: fonts.medium,
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: -60,
    marginBottom: 40,
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

  form: {
    gap: 4,
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

  registerLink: {
    marginTop: 24,
    alignSelf: "center",
  },

  registerText: {
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    fontSize: fontSize.base,
  },

  registerHighlight: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
});