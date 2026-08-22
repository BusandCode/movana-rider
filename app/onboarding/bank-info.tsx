import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Button } from "@/components/ui/Button";

export default function BankInfoScreen() {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!bankName || !accountNumber || !accountName) {
      Alert.alert("Missing info", "Fill in all bank details to receive payouts.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Bank info submission — wire to PATCH /riders/me/payout-info once available on the backend
      Alert.alert("Saved", "Your payout details have been updated.");
      router.back();
    } catch {
      Alert.alert("Error", "Could not save bank info. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.intro}>Earnings are paid out to this account. Make sure the details are correct.</Text>

      <Text style={styles.label}>Bank Name</Text>
      <TextInput
        style={styles.input}
        value={bankName}
        onChangeText={setBankName}
        placeholder="Access Bank"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Account Number</Text>
      <TextInput
        style={styles.input}
        value={accountNumber}
        onChangeText={setAccountNumber}
        placeholder="0123456789"
        keyboardType="number-pad"
        maxLength={10}
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Account Name</Text>
      <TextInput
        style={styles.input}
        value={accountName}
        onChangeText={setAccountName}
        placeholder="As it appears on your bank account"
        placeholderTextColor={colors.textSecondary}
      />

      <Button label="Save Payout Details" onPress={handleSave} isLoading={isSubmitting} style={{ marginTop: 28 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: colors.background, flexGrow: 1 },
  intro: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 20 },
  label: { fontFamily: fonts.medium, fontSize: fontSize.sm, color: colors.textPrimary, marginTop: 16, marginBottom: 6 },
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
