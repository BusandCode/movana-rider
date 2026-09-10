import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import { useState } from "react";

import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";

import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/features/auth/useAuth";

export default function ProfileScreen() {
  const rider = useAuthStore((s) => s.rider);
  const setRider = useAuthStore((s) => s.setRider);

  const { logout } = useAuth();

  const [isUploading, setIsUploading] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                         CHANGE PROFILE PHOTO                               */
  /* -------------------------------------------------------------------------- */

  const handleChangePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Needed",
          "Please enable photo library access to set a profile picture."
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          quality: 0.7,
          allowsEditing: true,
          aspect: [1, 1],
        });

      if (result.canceled || !rider) {
        return;
      }

      setIsUploading(true);

      // Simulate upload delay
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      // Local preview only.
      // Replace this with your upload endpoint later.
      setRider({
        ...rider,
        photoUrl: result.assets[0].uri,
      });

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      Alert.alert(
        "Success",
        "Profile photo updated successfully!"
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to update profile photo. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                          REMOVE PROFILE PHOTO                              */
  /* -------------------------------------------------------------------------- */

  const handleRemovePhoto = () => {
    if (!rider?.photoUrl) {
      return;
    }

    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove your profile photo?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            if (!rider) return;

            setRider({
              ...rider,
              photoUrl: undefined,
            });

            Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Light
            );
          },
        },
      ]
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                  LOGOUT                                    */
  /* -------------------------------------------------------------------------- */

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                MENU ITEM                                  */
  /* -------------------------------------------------------------------------- */

  const MenuItem = ({
    icon,
    label,
    onPress,
    badge,
    destructive = false,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    badge?: string;
    destructive?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View
          style={[
            styles.menuIcon,
            destructive && styles.menuIconDanger,
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={
              destructive
                ? colors.error
                : colors.primary
            }
          />
        </View>

        <Text
          style={[
            styles.menuLabel,
            destructive && styles.menuLabelDanger,
          ]}
        >
          {label}
        </Text>
      </View>

      {badge && (
        <View style={styles.menuBadge}>
          <Text style={styles.menuBadgeText}>
            {badge}
          </Text>
        </View>
      )}

      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.border}
      />
    </TouchableOpacity>
  );

  /* -------------------------------------------------------------------------- */
  /*                                LOADING                                     */
  /* -------------------------------------------------------------------------- */

  if (!rider) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading profile...
          </Text>
        </View>
      </Screen>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                  SCREEN                                    */
  /* -------------------------------------------------------------------------- */

  return (
    <Screen
      scroll={true}
      contentContainerStyle={styles.container}
    >
      {/* ------------------------------------------------------------------ */}
      {/*                         PROFILE HEADER                             */}
      {/* ------------------------------------------------------------------ */}

      <Card style={styles.profileCard}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handleChangePhoto}
          onLongPress={handleRemovePhoto}
          activeOpacity={0.85}
          disabled={isUploading}
        >
          <View style={styles.avatarWrapper}>
            {isUploading ? (
              <View
                style={[
                  styles.avatar,
                  styles.avatarLoading,
                ]}
              >
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                />
              </View>
            ) : (
              <Avatar
                name={rider.name ?? "Rider"}
                photoUrl={rider.photoUrl}
                size={84}
                ring
              />
            )}

            {!isUploading && (
              <View style={styles.editBadge}>
                <Ionicons
                  name="camera"
                  size={13}
                  color="#FFFFFF"
                />
              </View>
            )}
          </View>

          {/* Photo interaction hint */}
          <View style={styles.photoHint}>
            <Ionicons
              name="camera-outline"
              size={13}
              color={colors.textSecondary}
            />

            <Text style={styles.editHint}>
              Tap to change · Long press to remove
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>
          {rider.name ?? "Rider"}
        </Text>

        <Text style={styles.email}>
          {rider.email}
        </Text>

        <View style={styles.badgeRow}>
          <Badge
            label={
              rider.isVerified
                ? "✓ Verified"
                : "Pending Verification"
            }
            color={
              rider.isVerified
                ? colors.success
                : colors.warning
            }
          />

          <View style={styles.ratingBadge}>
            <Ionicons
              name="star"
              size={14}
              color={colors.warning}
            />

            <Text style={styles.ratingText}>
              {rider.successRate ?? 0}%
            </Text>
          </View>
        </View>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/*                           VEHICLE INFO                              */}
      {/* ------------------------------------------------------------------ */}

      <Card style={styles.infoCard}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>
            Vehicle
          </Text>

          <Text style={styles.rowValue}>
            {rider.vehicle?.type ?? "—"}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>
            Plate Number
          </Text>

          <Text style={styles.rowValue}>
            {rider.vehicle?.plateNumber ?? "—"}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>
            Phone
          </Text>

          <Text style={styles.rowValue}>
            {rider.phone ?? "—"}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>
            Total Deliveries
          </Text>

          <Text style={styles.rowValue}>
            {rider.totalDeliveriesCompleted ?? 0}
          </Text>
        </View>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/*                              MENU                                   */}
      {/* ------------------------------------------------------------------ */}

      <Card style={styles.menuCard}>
        <MenuItem
          icon="car-outline"
          label="Vehicle Info"
          onPress={() =>
            router.push("/onboarding/vehicle-info")
          }
        />

        <View style={styles.menuDivider} />

        <MenuItem
          icon="document-text-outline"
          label="Documents"
          onPress={() =>
            router.push(
              "/onboarding/documents-upload"
            )
          }
          badge="2"
        />

        <View style={styles.menuDivider} />

        <MenuItem
          icon="wallet-outline"
          label="Bank Info"
          onPress={() =>
            router.push("/onboarding/bank-info")
          }
        />

        <View style={styles.menuDivider} />

      <MenuItem
        icon="notifications-outline"
        label="Notifications"
        onPress={() => router.push("/notifications")}
      />

        <View style={styles.menuDivider} />

        <MenuItem
        icon="help-circle-outline"
        label="Help & Support"
        onPress={() => router.push("/help-support")}
      />

        <View style={styles.menuDivider} />

        <MenuItem
          icon="log-out-outline"
          label="Log Out"
          onPress={handleLogout}
          destructive
        />
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/*                             VERSION                                */}
      {/* ------------------------------------------------------------------ */}

      <Text style={styles.version}>
        Movana Rider v1.0.0
      </Text>
    </Screen>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  STYLES                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
    backgroundColor: colors.background,
  },

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: 12,
  },

  loadingText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  /* ---------------------------------------------------------------------- */
  /* Profile Card                                                           */
  /* ---------------------------------------------------------------------- */

  profileCard: {
    alignItems: "center",
    paddingVertical: 28,
    marginBottom: 16,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 6,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    overflow: "hidden",
  },

  avatarLoading: {
    backgroundColor: `${colors.primary}10`,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },

  editBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.surface,
  },

  photoHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },

  editHint: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textSecondary,
  },

  name: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    marginTop: 4,
  },

  email: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${colors.warning}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  ratingText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.warning,
  },

  /* ---------------------------------------------------------------------- */
  /* Vehicle Info                                                           */
  /* ---------------------------------------------------------------------- */

  infoCard: {
    marginBottom: 16,
    gap: 0,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  rowLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  rowValue: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    textTransform: "capitalize",
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  /* ---------------------------------------------------------------------- */
  /* Menu                                                                   */
  /* ---------------------------------------------------------------------- */

  menuCard: {
    padding: 0,
    overflow: "hidden",
    marginBottom: 20,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: `${colors.primary}10`,
    alignItems: "center",
    justifyContent: "center",
  },

  menuIconDanger: {
    backgroundColor: `${colors.error}10`,
  },

  menuLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },

  menuLabelDanger: {
    color: colors.error,
  },

  menuBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: "center",
    marginRight: 10,
  },

  menuBadgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: "#FFFFFF",
  },

  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },

  /* ---------------------------------------------------------------------- */
  /* Version                                                                */
  /* ---------------------------------------------------------------------- */

  version: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
});