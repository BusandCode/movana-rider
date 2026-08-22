import { StyleSheet, Text, View, Alert } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/features/auth/useAuth";

export default function ProfileScreen() {
  const rider = useAuthStore((s) => s.rider);
  const setRider = useAuthStore((s) => s.setRider);
  const { logout } = useAuth();

  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Enable photo library access to set a profile picture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true, aspect: [1, 1] });
    if (result.canceled || !rider) return;

    // Local preview immediately; wire to a real upload endpoint once the backend supports it.
    setRider({ ...rider, photoUrl: result.assets[0].uri });
  };

  return (
    <Screen>
      <Text style={styles.title}>Profile</Text>

      <Card style={styles.profileCard}>
        <View onTouchEnd={handleChangePhoto}>
          <Avatar name={rider?.name ?? "Rider"} photoUrl={rider?.photoUrl} size={72} />
          <View style={styles.editBadge}>
            <Text style={styles.editBadgeText}>Edit</Text>
          </View>
        </View>
        <Text style={styles.name}>{rider?.name ?? "Rider"}</Text>
        <Text style={styles.email}>{rider?.email}</Text>
        <Badge
          label={rider?.isVerified ? "Verified" : "Pending Verification"}
          color={rider?.isVerified ? colors.success : colors.warning}
        />
      </Card>

      <Card style={{ marginTop: 16, gap: 12 }}>
        <Row label="Phone" value={rider?.phone ?? "—"} />
        <Row label="Vehicle" value={rider?.vehicle?.type ?? "—"} />
        <Row label="Plate Number" value={rider?.vehicle?.plateNumber ?? "—"} />
      </Card>

      <View style={{ marginTop: 24, gap: 12 }}>
        <Button label="Vehicle Info" variant="outline" onPress={() => router.push("/onboarding/vehicle-info")} />
        <Button label="Documents" variant="outline" onPress={() => router.push("/onboarding/documents-upload")} />
        <Button label="Bank Info" variant="outline" onPress={() => router.push("/onboarding/bank-info")} />
        <Button label="Log Out" variant="danger" onPress={logout} />
      </View>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: 16 },
  profileCard: { alignItems: "center", gap: 8, paddingVertical: 28 },
  editBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  editBadgeText: { fontFamily: fonts.semiBold, fontSize: 9, color: colors.surface },
  name: { fontFamily: fonts.semiBold, fontSize: fontSize.lg, color: colors.textPrimary, marginTop: 4 },
  email: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  row: { flexDirection: "row", justifyContent: "space-between" },
  rowLabel: { fontFamily: fonts.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  rowValue: { fontFamily: fonts.medium, fontSize: fontSize.sm, color: colors.textPrimary, textTransform: "capitalize" },
});