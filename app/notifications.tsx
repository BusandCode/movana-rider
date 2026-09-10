import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";

import { useState, useCallback, useMemo } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { format, isToday, isYesterday } from "date-fns";

import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";

import { Screen } from "@/components/ui/Screen";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface Notification {
  id: string;
  title: string;
  body: string;
  type:
    | "delivery_offer"
    | "delivery_update"
    | "earning"
    | "system"
    | "promotional";
  isRead: boolean;
  createdAt: string;

  data?: {
    deliveryId?: string;
    amount?: number;
    orderId?: string;
  };
}

interface NotificationSection {
  title: string;
  data: Notification[];
}

/* -------------------------------------------------------------------------- */
/*                                MOCK DATA                                   */
/* -------------------------------------------------------------------------- */

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New Delivery Available",
    body: "Pick up from TechHub Electronics, 10 Adeola Odeku St, VI. 2.5km away.",
    type: "delivery_offer",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    data: { deliveryId: "del_001" },
  },
  {
    id: "2",
    title: "Delivery Completed",
    body: "You've successfully delivered #LD-2026-000128. You earned ₦1,200.",
    type: "earning",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    data: { deliveryId: "del_002", amount: 1200 },
  },
  {
    id: "3",
    title: "New Delivery Available",
    body: "Pick up from Zainab's Kitchen, 22 Admiralty Way, Lekki. 3.4km away.",
    type: "delivery_offer",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    data: { deliveryId: "del_003" },
  },
  {
    id: "4",
    title: "Payment Received",
    body: "You've received ₦8,500 for your deliveries today.",
    type: "earning",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    data: { amount: 8500 },
  },
  {
    id: "5",
    title: "Welcome to Movana",
    body: "Thank you for joining Movana. Complete your profile and start earning today.",
    type: "system",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "6",
    title: "Special Bonus Offer",
    body: "Complete 5 deliveries today and earn an extra ₦2,000 bonus!",
    type: "promotional",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
];

/* -------------------------------------------------------------------------- */
/*                         NOTIFICATION HELPERS                               */
/* -------------------------------------------------------------------------- */

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "delivery_offer":
      return { name: "cube-outline" as const, color: colors.primary };
    case "delivery_update":
      return { name: "sync-outline" as const, color: colors.primary };
    case "earning":
      return { name: "checkmark-circle-outline" as const, color: colors.primary };
    case "system":
      return { name: "megaphone-outline" as const, color: colors.primary };
    case "promotional":
      return { name: "gift-outline" as const, color: colors.primary };
    default:
      return { name: "notifications-outline" as const, color: colors.primary };
  }
};

const formatClockTime = (dateString: string) => {
  try {
    return format(new Date(dateString), "h:mm a");
  } catch {
    return "";
  }
};

const getSectionLabel = (dateString: string) => {
  const date = new Date(dateString);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "MMM d");
};

const groupNotifications = (
  notifications: Notification[]
): NotificationSection[] => {
  const order: string[] = [];
  const map = new Map<string, Notification[]>();

  notifications.forEach((notification) => {
    const label = getSectionLabel(notification.createdAt);

    if (!map.has(label)) {
      map.set(label, []);
      order.push(label);
    }

    map.get(label)!.push(notification);
  });

  return order.map((label) => ({
    title: label,
    data: map.get(label)!,
  }));
};

/* -------------------------------------------------------------------------- */
/*                              NOTIFICATION ROW                              */
/* -------------------------------------------------------------------------- */

function NotificationItem({ item }: { item: Notification }) {
  const { name: iconName, color: iconColor } = getNotificationIcon(item.type);

  return (
    <View style={styles.notificationItem}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}12` }]}>
        <Ionicons name={iconName} size={18} color={iconColor} />
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.notificationTitle,
            !item.isRead && styles.notificationTitleUnread,
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>

        <Text style={styles.body} numberOfLines={2}>
          {item.body}
        </Text>
      </View>

      <View style={styles.metaContainer}>
        <Text style={styles.timestamp}>{formatClockTime(item.createdAt)}</Text>

        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SECTION HEADER                                */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  section,
  onMarkRead,
}: {
  section: NotificationSection;
  onMarkRead: () => void;
}) {
  const unreadCount = section.data.filter((n) => !n.isRead).length;

  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {section.title}
        {unreadCount > 0 && (
          <Text style={styles.sectionUnreadCount}> ({unreadCount} unread)</Text>
        )}
      </Text>

      {unreadCount > 0 && (
        <TouchableOpacity onPress={onMarkRead} activeOpacity={0.7}>
          <Text style={styles.markReadLink}>Mark as Read</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                           EMPTY NOTIFICATIONS                              */
/* -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="notifications-outline" size={30} color={colors.primary} />
      </View>

      <Text style={styles.emptyTitle}>No notifications yet</Text>

      <Text style={styles.emptyMessage}>
        Updates about your deliveries, earnings and account will appear here.
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN SCREEN                                  */
/* -------------------------------------------------------------------------- */

export default function NotificationsScreen() {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);

  const [refreshing, setRefreshing] = useState(false);

  const sections = useMemo(
    () => groupNotifications(notifications),
    [notifications]
  );

  const totalUnread = notifications.filter((n) => !n.isRead).length;

  /* ---------------------------------------------------------------------- */
  /* Mark a single section as read                                          */
  /* ---------------------------------------------------------------------- */

  const handleMarkSectionRead = (sectionTitle: string) => {
    setNotifications((previous) =>
      previous.map((item) =>
        getSectionLabel(item.createdAt) === sectionTitle
          ? { ...item, isRead: true }
          : item
      )
    );

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  /* ---------------------------------------------------------------------- */
  /* Mark all read                                                          */
  /* ---------------------------------------------------------------------- */

  const handleMarkAllRead = () => {
    if (totalUnread === 0) {
      Alert.alert("You're all caught up", "There are no unread notifications.");
      return;
    }

    setNotifications((previous) =>
      previous.map((item) => ({ ...item, isRead: true }))
    );

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  /* ---------------------------------------------------------------------- */
  /* Delete all                                                             */
  /* ---------------------------------------------------------------------- */

  const handleDeleteAll = () => {
    if (notifications.length === 0) return;

    Alert.alert(
      "Delete all notifications",
      "This will permanently remove all your notifications.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete all",
          style: "destructive",
          onPress: () => {
            setNotifications([]);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ]
    );
  };

  /* ---------------------------------------------------------------------- */
  /* Overflow menu                                                          */
  /* ---------------------------------------------------------------------- */

  const handleOpenMenu = () => {
    Alert.alert("Notifications", undefined, [
      { text: "Mark all as read", onPress: handleMarkAllRead },
      { text: "Delete all", style: "destructive", onPress: handleDeleteAll },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  /* ---------------------------------------------------------------------- */
  /* Refresh                                                                */
  /* ---------------------------------------------------------------------- */

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notification</Text>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleOpenMenu}
          activeOpacity={0.7}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={18}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        renderSectionHeader={({ section }) => (
          <SectionHeader
            section={section as NotificationSection}
            onMarkRead={() => handleMarkSectionRead(section.title)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          sections.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={<EmptyState />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Screen>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  STYLES                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  /* ---------------------------------------------------------------------- */
  /* Header                                                                 */
  /* ---------------------------------------------------------------------- */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    textAlign: "center",
  },

  menuButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ---------------------------------------------------------------------- */
  /* Section header                                                         */
  /* ---------------------------------------------------------------------- */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },

  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  sectionUnreadCount: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: "none",
  },

  markReadLink: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
  },

  /* ---------------------------------------------------------------------- */
  /* List                                                                   */
  /* ---------------------------------------------------------------------- */

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: colors.background,
  },

  listEmpty: {
    flex: 1,
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 50,
  },

  /* ---------------------------------------------------------------------- */
  /* Notification Item                                                      */
  /* ---------------------------------------------------------------------- */

  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    backgroundColor: colors.background,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },

  contentContainer: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },

  notificationTitle: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 3,
  },

  notificationTitleUnread: {
    fontFamily: fonts.semiBold,
  },

  body: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },

  metaContainer: {
    alignItems: "flex-end",
    flexShrink: 0,
    marginLeft: 8,
    gap: 6,
  },

  timestamp: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textSecondary,
  },

  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.primary,
  },

  /* ---------------------------------------------------------------------- */
  /* Empty State                                                            */
  /* ---------------------------------------------------------------------- */

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 80,
  },

  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: `${colors.primary}0D`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 7,
  },

  emptyMessage: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    maxWidth: 280,
  },
});