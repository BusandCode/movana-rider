import { Pressable, StyleSheet, Text, View, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { Avatar } from "@/components/ui/Avatar";

interface DashboardHeaderProps {
  name: string;
  photoUrl?: string;
  isAvailable: boolean;
  onToggleAvailability: (value: boolean) => void;
  onAvatarPress?: () => void;
  onNotificationPress?: () => void;
  unreadNotifications?: number;
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHeader({
  name,
  photoUrl,
  isAvailable,
  onToggleAvailability,
  onAvatarPress,
  onNotificationPress,
  unreadNotifications = 0,
}: DashboardHeaderProps) {
  const firstName = name?.trim().split(" ")[0] || "Rider";

  return (
    <View style={styles.container}>
      {/* Main Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Pressable
            onPress={onAvatarPress}
            style={({ pressed }) => [
              styles.avatarButton,
              pressed && styles.pressed,
            ]}
          >
            <Avatar
              name={name}
              photoUrl={photoUrl}
              size={48}
              ring
            />
          </Pressable>

          <View style={styles.textContent}>
            <Text style={styles.title}>Hi, {firstName} 👏</Text>

            <Text style={styles.subtitle}>
              {getGreeting()}
            </Text>
          </View>
        </View>

        {/* Notification */}
        <Pressable
          style={({ pressed }) => [
            styles.notificationButton,
            pressed && styles.pressed,
          ]}
          onPress={onNotificationPress}
          hitSlop={8}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={colors.textPrimary}
          />

          {unreadNotifications > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Availability */}
      <View style={styles.availability}>
        <View style={styles.availabilityLeft}>
          <View
            style={[
              styles.availabilityIcon,
              isAvailable
                ? styles.availabilityIconOnline
                : styles.availabilityIconOffline,
            ]}
          >
            <Ionicons
              name={isAvailable ? "radio-outline" : "moon-outline"}
              size={16}
              color={
                isAvailable
                  ? colors.primary
                  : colors.textSecondary
              }
            />
          </View>

          <View style={styles.availabilityContent}>
            <View style={styles.availabilityTitleRow}>
              <View
                style={[
                  styles.statusDot,
                  isAvailable
                    ? styles.onlineDot
                    : styles.offlineDot,
                ]}
              />

              <Text style={styles.availabilityTitle}>
                {isAvailable ? "Online" : "Offline"}
              </Text>
            </View>

            <Text style={styles.availabilitySubtitle}>
              {isAvailable
                ? "Available for deliveries"
                : "Go online to receive requests"}
            </Text>
          </View>
        </View>

        <Switch
          value={isAvailable}
          onValueChange={onToggleAvailability}
          trackColor={{
            false: colors.border,
            true: colors.primary,
          }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={colors.border}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.035,
    shadowRadius: 10,
    elevation: 2,
  },

  /* Main Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatarButton: {
    borderRadius: 24,
  },

  textContent: {
    marginLeft: 12,
    justifyContent: "center",
  },

  title: {
    fontFamily: fonts.extraBold,
    fontSize: 21,
    lineHeight: 25,
    color: colors.textPrimary,
    letterSpacing: -0.45,
  },

  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    lineHeight: 16,
    color: colors.textSecondary,
    // marginTop: 2,
  },

  /* Notification */
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },

  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 3,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    lineHeight: 10,
    color: "#FFFFFF",
  },

  /* Availability */
  availability: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },

  availabilityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  availabilityIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  availabilityIconOnline: {
    backgroundColor: "#ECFDF3",
  },

  availabilityIconOffline: {
    backgroundColor: colors.background,
  },

  availabilityContent: {
    flex: 1,
  },

  availabilityTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  onlineDot: {
    backgroundColor: "#22C55E",
  },

  offlineDot: {
    backgroundColor: colors.textSecondary,
  },

  availabilityTitle: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },

  availabilitySubtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },

  pressed: {
    opacity: 0.65,
  },
});