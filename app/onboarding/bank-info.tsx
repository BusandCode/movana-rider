import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
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

const BANKS = [
  "Access Bank",
  "Citibank",
  "Ecobank",
  "Fidelity Bank",
  "First Bank",
  "GTBank",
  "Heritage Bank",
  "Keystone Bank",
  "Polaris Bank",
  "Stanbic IBTC",
  "Sterling Bank",
  "Union Bank",
  "United Bank for Africa",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
];

export default function BankInfoScreen() {
  const rider = useAuthStore((s) => s.rider);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [filteredBanks, setFilteredBanks] = useState<string[]>([]);

  useEffect(() => {
    // ✅ Load saved bank info
    loadBankInfo();
  }, []);

  const loadBankInfo = async () => {
    try {
      setIsLoading(true);
      const { data } = await ridersApi.getBankInfo();
      const info = data.data;

      if (info) {
        setBankName(info.bankName || "");
        setAccountNumber(info.accountNumber || "");
        setAccountName(info.accountName || "");
      }
    } catch (error) {
      console.error("Error loading bank info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (bankName.length > 0) {
      const filtered = BANKS.filter((bank) =>
        bank.toLowerCase().includes(bankName.toLowerCase())
      );
      setFilteredBanks(filtered);
    } else {
      setFilteredBanks([]);
    }
  }, [bankName]);

  const handleSelectBank = (bank: string) => {
    setBankName(bank);
    setShowBankDropdown(false);
    setFilteredBanks([]);
  };

  const handleSave = async () => {
    if (!bankName.trim()) {
      Alert.alert("Bank Required", "Please select your bank.");
      return;
    }
    if (!accountNumber.trim() || accountNumber.length < 10) {
      Alert.alert("Invalid Account Number", "Please enter a valid account number.");
      return;
    }
    if (!accountName.trim()) {
      Alert.alert("Account Name Required", "Please enter the account holder's name.");
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ Save to backend
      await ridersApi.updateBankInfo({
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Bank information saved successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to save bank info. Please try again.");
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
      <Text style={styles.title}>Bank Information</Text>
      <Text style={styles.subtitle}>
        Earnings are paid out to this account. Make sure the details are correct.
      </Text>

      <Text style={styles.label}>Bank</Text>
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setShowBankDropdown(!showBankDropdown)}
        activeOpacity={0.7}
      >
        <Text style={bankName ? styles.dropdownText : styles.dropdownPlaceholder}>
          {bankName || "Select your bank"}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {showBankDropdown && (
        <Card style={styles.dropdownContainer}>
          <TextInput
            style={styles.dropdownSearch}
            placeholder="Search banks..."
            placeholderTextColor={colors.textSecondary}
            value={bankName}
            onChangeText={setBankName}
            autoFocus
          />
          <ScrollView style={styles.dropdownList}>
            {(filteredBanks.length > 0 ? filteredBanks : BANKS).map((bank) => (
              <TouchableOpacity
                key={bank}
                style={styles.dropdownItem}
                onPress={() => handleSelectBank(bank)}
              >
                <Text style={styles.dropdownItemText}>{bank}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card>
      )}

      <Text style={styles.label}>Account Number</Text>
      <TextInput
        style={styles.input}
        value={accountNumber}
        onChangeText={setAccountNumber}
        placeholder="0123456789"
        placeholderTextColor={colors.textSecondary}
        keyboardType="number-pad"
        maxLength={10}
      />

      <Text style={styles.label}>Account Name</Text>
      <TextInput
        style={styles.input}
        value={accountName}
        onChangeText={setAccountName}
        placeholder="As it appears on your bank account"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="words"
      />

      <Button
        label="Save Payout Details"
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

      <View style={styles.securityNote}>
        <Ionicons name="shield-checkmark-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.securityText}>
          Your bank details are encrypted and secure
        </Text>
      </View>
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
  dropdownTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
  },
  dropdownText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  dropdownPlaceholder: {
    fontFamily: fonts.regular,
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  dropdownContainer: {
    padding: 8,
    marginTop: 4,
    maxHeight: 200,
  },
  dropdownSearch: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  dropdownList: {
    maxHeight: 150,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
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
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 20,
  },
  securityText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
});