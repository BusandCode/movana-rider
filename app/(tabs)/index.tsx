import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import Svg, {
  Path,
  Rect,
  Circle,
  Polyline,
  Line,
} from "react-native-svg";
import { router } from "expo-router";

import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";

import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsOverviewCard } from "@/components/dashboard/StatsOverviewCard";
import { WeeklyDeliveriesChart } from "@/components/dashboard/WeeklyDeliveriesChart";
import { DonutChart } from "@/components/dashboard/DonutChart";
import { ActiveDeliveriesSection } from "@/components/dashboard/ActiveDeliveriesSection";

import { DeliveryCard } from "@/components/delivery/DeliveryCard";

import { useAuthStore } from "@/store/authStore";
import { useDeliveries } from "@/features/deliveries/useDeliveries";
import { useActiveDelivery } from "@/features/deliveries/useActiveDelivery";

import { ridersApi } from "@/api/endpoints/riders.api";
import { locationService } from "@/services/location.service";

interface PerformanceBreakdown {
  onTime: number;
  late: number;
  cancelled: number;
  rejected: number;
}

type EmptyStateIcon =
  | "package"
  | "calendar"
  | "chart"
  | "truck";

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: EmptyStateIcon;
}

/* -------------------------------------------------------------------------- */
/*                                EMPTY SVG                                   */
/* -------------------------------------------------------------------------- */

const EmptyStateSvg = ({
  type,
  size = 46,
}: {
  type: EmptyStateIcon;
  size?: number;
}) => {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
  };

  switch (type) {
    case "calendar":
      return (
        <Svg {...commonProps}>
          <Rect
            x="3"
            y="4"
            width="18"
            height="17"
            rx="2.5"
            stroke={colors.primary}
            strokeWidth="1.7"
          />

          <Line
            x1="16"
            y1="2.5"
            x2="16"
            y2="6"
            stroke={colors.primary}
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          <Line
            x1="8"
            y1="2.5"
            x2="8"
            y2="6"
            stroke={colors.primary}
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          <Line
            x1="3"
            y1="9"
            x2="21"
            y2="9"
            stroke={colors.primary}
            strokeWidth="1.7"
          />

          <Circle
            cx="8"
            cy="13.5"
            r="1"
            fill={colors.primary}
          />

          <Circle
            cx="12"
            cy="13.5"
            r="1"
            fill={colors.primary}
          />

          <Circle
            cx="16"
            cy="13.5"
            r="1"
            fill={colors.primary}
          />

          <Circle
            cx="8"
            cy="17"
            r="1"
            fill={`${colors.primary}66`}
          />

          <Circle
            cx="12"
            cy="17"
            r="1"
            fill={`${colors.primary}66`}
          />
        </Svg>
      );

    case "chart":
      return (
        <Svg {...commonProps}>
          <Line
            x1="4"
            y1="20"
            x2="4"
            y2="4"
            stroke={colors.primary}
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          <Line
            x1="4"
            y1="20"
            x2="21"
            y2="20"
            stroke={colors.primary}
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          <Polyline
            points="7,15 10.5,11 13.5,14 18.5,7"
            stroke={colors.primary}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <Circle
            cx="7"
            cy="15"
            r="1.2"
            fill={colors.primary}
          />

          <Circle
            cx="10.5"
            cy="11"
            r="1.2"
            fill={colors.primary}
          />

          <Circle
            cx="13.5"
            cy="14"
            r="1.2"
            fill={colors.primary}
          />

          <Circle
            cx="18.5"
            cy="7"
            r="1.2"
            fill={colors.primary}
          />
        </Svg>
      );

    case "truck":
      return (
        <Svg {...commonProps}>
          <Rect
            x="3"
            y="6"
            width="11"
            height="10"
            rx="1.5"
            stroke={colors.primary}
            strokeWidth="1.7"
          />

          <Path
            d="M14 9h3.2l3.2 3.5V16H14V9Z"
            stroke={colors.primary}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />

          <Circle
            cx="7"
            cy="17"
            r="2"
            stroke={colors.primary}
            strokeWidth="1.7"
          />

          <Circle
            cx="17"
            cy="17"
            r="2"
            stroke={colors.primary}
            strokeWidth="1.7"
          />

          <Line
            x1="14"
            y1="13"
            x2="20"
            y2="13"
            stroke={colors.primary}
            strokeWidth="1.7"
          />

          <Line
            x1="17"
            y1="9"
            x2="17"
            y2="12"
            stroke={colors.primary}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </Svg>
      );

    case "package":
    default:
      return (
        <Svg {...commonProps}>
          <Path
            d="M21 8.5 12 4 3 8.5 12 13l9-4.5Z"
            stroke={colors.primary}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />

          <Path
            d="M3 8.5V17l9 4 9-4V8.5"
            stroke={colors.primary}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />

          <Path
            d="M12 13v8"
            stroke={colors.primary}
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          <Path
            d="m7.5 6.25 9 4.5"
            stroke={colors.primary}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </Svg>
      );
  }
};

/* -------------------------------------------------------------------------- */
/*                               EMPTY STATE                                  */
/* -------------------------------------------------------------------------- */

const EmptyState = ({
  title,
  message,
  icon = "package",
}: EmptyStateProps) => {
  return (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconContainer}>
        <EmptyStateSvg type={icon} size={46} />
      </View>

      <Text style={styles.emptyStateTitle}>
        {title}
      </Text>

      <Text style={styles.emptyStateMessage}>
        {message}
      </Text>
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*                              DASHBOARD                                     */
/* -------------------------------------------------------------------------- */

export default function DashboardScreen() {
  const { isAuthenticated, rider } = useAuthStore();

  const {
    availableOffers,
    isLoading,
    fetchOffers,
  } = useDeliveries();

  const {
    activeDeliveries,
    accept,
    reject,
    isUpdating,
  } = useActiveDelivery();

  const [isAvailable, setIsAvailable] = useState(
    rider?.isAvailable ?? false
  );

  const [avgDeliveryTime, setAvgDeliveryTime] =
    useState<number | null>(null);

  const [weeklyData, setWeeklyData] = useState<
    { day: string; count: number }[]
  >([]);

  const [performanceBreakdown, setPerformanceBreakdown] =
    useState<PerformanceBreakdown | null>(null);

  const [hasLocationPermission, setHasLocationPermission] =
    useState<boolean | null>(null);

  const [isCheckingPermission, setIsCheckingPermission] =
    useState(true);

  // Tracks the combined performance + weekly load, separate from
  // `isLoading` (which belongs to useDeliveries/offers).
  const [isDashboardLoading, setIsDashboardLoading] =
    useState(true);

  const safeActiveDeliveries =
    activeDeliveries || [];

  const safeAvailableOffers =
    availableOffers || [];

  /* ------------------------------------------------------------------------ */
  /*                              AUTH CHECK                                  */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated]);

  /* ------------------------------------------------------------------------ */
  /*                         LOCATION PERMISSION                              */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    checkLocationPermissions();
  }, []);

  const checkLocationPermissions =
    async () => {
      try {
        setIsCheckingPermission(true);

        const hasPermission =
          await locationService.checkPermissions();

        setHasLocationPermission(
          hasPermission
        );
      } catch (error) {
        console.error(
          "Error checking location permissions:",
          error
        );

        setHasLocationPermission(false);
      } finally {
        setIsCheckingPermission(false);
      }
    };

  const requestLocationPermissions =
    async (
      showAlert = true
    ): Promise<boolean> => {
      try {
        const granted =
          await locationService.requestPermissions();

        setHasLocationPermission(granted);

        if (!granted && showAlert) {
          Alert.alert(
            "Location Permission Required",
            "Movana needs location access to find nearby deliveries and track your rides. Please enable location in settings.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Open Settings",
                onPress: () =>
                  Linking.openSettings(),
              },
            ]
          );
        }

        return granted;
      } catch (error) {
        console.error(
          "Error requesting location permissions:",
          error
        );

        setHasLocationPermission(false);

        return false;
      }
    };

  /* ------------------------------------------------------------------------ */
  /*                   DASHBOARD DATA (performance + weekly)                  */
  /* ------------------------------------------------------------------------ */
  /*
    Combined into a single Promise.allSettled call instead of two separate,
    independently-racing requests. Each result is handled on its own so one
    endpoint failing (e.g. a 404 from an undeployed route) doesn't wipe out
    data from the other.
  */

  const loadDashboardData = useCallback(async () => {
    if (!isAuthenticated || !rider) return;

    setIsDashboardLoading(true);

    const [perfResult, weeklyResult] = await Promise.allSettled([
      ridersApi.getPerformance(),
      ridersApi.getWeeklyDeliveries(),
    ]);

    if (perfResult.status === "fulfilled") {
      const p = perfResult.value.data?.data;

      if (!p) {
        setAvgDeliveryTime(0);
        setPerformanceBreakdown(null);
      } else {
        setAvgDeliveryTime(p.averageDeliveryTimeMinutes || 0);

        const total =
          (p.onTimeDeliveries || 0) +
          (p.lateDeliveries || 0) +
          (p.cancelledDeliveries || 0) +
          (p.rejectedDeliveries || 0) || 1;

        setPerformanceBreakdown({
          onTime: Math.round(((p.onTimeDeliveries || 0) / total) * 100),
          late: Math.round(((p.lateDeliveries || 0) / total) * 100),
          cancelled: Math.round(((p.cancelledDeliveries || 0) / total) * 100),
          rejected: Math.round(((p.rejectedDeliveries || 0) / total) * 100),
        });
      }
    } else {
      console.error("Error fetching performance:", perfResult.reason);
      setAvgDeliveryTime(0);
      setPerformanceBreakdown(null);
    }

    if (weeklyResult.status === "fulfilled") {
      setWeeklyData(weeklyResult.value.data?.data || []);
    } else {
      console.error("Error fetching weekly deliveries:", weeklyResult.reason);
      setWeeklyData([]);
    }

    setIsDashboardLoading(false);
  }, [isAuthenticated, rider]);

  useEffect(() => {
    loadDashboardData();
    // Keyed on rider?.id rather than the whole `rider` object, so this
    // doesn't refetch every time the auth store hands back a new object
    // reference for the same underlying rider (e.g. after toggling
    // availability).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, rider?.id]);

  /* ------------------------------------------------------------------------ */
  /*                         LOCATION TRACKING                                 */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!isAuthenticated || !rider) {
      return;
    }

    const handleLocationTracking =
      async () => {
        if (!hasLocationPermission) {
          return;
        }

        if (
          isAvailable &&
          safeActiveDeliveries.length > 0
        ) {
          await locationService.startTracking(
            safeActiveDeliveries[0].id
          );
        } else {
          await locationService.stopTracking();
        }
      };

    handleLocationTracking();
  }, [
    isAvailable,
    safeActiveDeliveries,
    hasLocationPermission,
    isAuthenticated,
    rider,
  ]);

const handleAccept = async (deliveryId: string) => {
  await accept(deliveryId);
  await loadDashboardData();
};

const handleReject = async (deliveryId: string) => {
  await reject(deliveryId);
  await loadDashboardData();
};

  const toggleAvailability = async (
    value: boolean
  ) => {
    if (
      value &&
      !hasLocationPermission
    ) {
      const granted =
        await requestLocationPermissions(
          true
        );

      if (!granted) {
        Alert.alert(
          "Location Required",
          "You need to enable location to go online and accept deliveries.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Try Again",
              onPress: () =>
                toggleAvailability(value),
            },
          ]
        );

        return;
      }
    }

    setIsAvailable(value);

    try {
      await ridersApi.updateAvailability({
        isAvailable: value,
      });
    } catch (error) {
      console.error(
        "Failed to update availability:",
        error
      );

      setIsAvailable(!value);

      Alert.alert(
        "Error",
        "Failed to update availability. Please try again."
      );

      return;
    }

    if (
      value &&
      hasLocationPermission
    ) {
      if (
        safeActiveDeliveries.length > 0
      ) {
        await locationService.startTracking(
          safeActiveDeliveries[0].id
        );
      }
    } else {
      await locationService.stopTracking();
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              REFRESH                                     */
  /* ------------------------------------------------------------------------ */

  const onRefresh = useCallback(async () => {
    if (!isAuthenticated || !rider) {
      return;
    }

    // Awaited together so the pull-to-refresh spinner stays up until
    // everything actually finishes, instead of dropping as soon as
    // whichever request resolves first.
    await Promise.allSettled([
      fetchOffers(),
      loadDashboardData(),
    ]);
  }, [
    isAuthenticated,
    rider,
    fetchOffers,
    loadDashboardData,
  ]);

  /* ------------------------------------------------------------------------ */
  /*                              LOADING                                     */
  /* ------------------------------------------------------------------------ */

  if (isCheckingPermission) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Checking permissions...
          </Text>
        </View>
      </Screen>
    );
  }

  if (!isAuthenticated || !rider) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading...
          </Text>
        </View>
      </Screen>
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                              DASHBOARD                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={isLoading || isDashboardLoading}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <DashboardHeader
        name={rider?.name ?? "Rider"}
        photoUrl={rider?.photoUrl}
        isAvailable={isAvailable}
        onToggleAvailability={
          toggleAvailability
        }
        onAvatarPress={() =>
          router.push("/(tabs)/profile")
        }
        onNotificationPress={() =>
          router.push("/notifications")
        }
        unreadNotifications={0}
      />

      {/* ------------------------------------------------------------------ */}
      {/* ACTIVE DELIVERIES                                                  */}
      {/* ------------------------------------------------------------------ */}

      {safeActiveDeliveries.length > 0 ? (
        <ActiveDeliveriesSection
          deliveries={safeActiveDeliveries}
        />
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* STATS                                                              */}
      {/* ------------------------------------------------------------------ */}

      <StatsOverviewCard
        stats={[
          {
            icon: "completed",
            color: colors.primary,
            value:
              rider?.totalDeliveriesCompleted ??
              0,
            label: "Completed",
          },

          {
            icon: "success",
            color: colors.success,
            value: `${rider?.successRate ?? 0}%`,
            label: "Success rate",
            ringProgress:
              rider?.successRate ?? 0,
          },

          {
            icon: "active",
            color: colors.primary,
            value:
              safeActiveDeliveries.length,
            label: "Active",
          },

          {
            icon: "time",
            color: colors.warning,
            value: `${avgDeliveryTime ?? "—"}${
              avgDeliveryTime ? "m" : ""
            }`,
            label: "Avg. time",
          },
        ]}
      />

      {/* ------------------------------------------------------------------ */}
      {/* WEEKLY DELIVERIES                                                  */}
      {/* ------------------------------------------------------------------ */}

      <Card style={styles.chartCard}>
        {weeklyData.length > 0 ? (
          <WeeklyDeliveriesChart
            data={weeklyData}
          />
        ) : (
          <EmptyState
            title="No Deliveries This Week"
            message="Start accepting deliveries to see your weekly activity."
            icon="calendar"
          />
        )}
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* PERFORMANCE BREAKDOWN                                              */}
      {/* ------------------------------------------------------------------ */}

      <View style={styles.breakdownHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            Activity Breakdown
          </Text>

          <Text style={styles.chartSubtitle}>
            Performance distribution
          </Text>
        </View>
      </View>

      <Card style={styles.breakdownCard}>
        {performanceBreakdown ? (
          <DonutChart
            segments={[
              {
                label: "On-time",
                value:
                  performanceBreakdown.onTime,
                color: colors.success,
              },

              {
                label: "Late",
                value:
                  performanceBreakdown.late,
                color: colors.warning,
              },

              {
                label: "Cancelled",
                value:
                  performanceBreakdown.cancelled,
                color: colors.error,
              },

              {
                label: "Rejected",
                value:
                  performanceBreakdown.rejected,
                color: colors.border,
              },
            ]}
          />
        ) : (
          <EmptyState
            title="No Performance Data Yet"
            message="Complete your first delivery to see your performance breakdown."
            icon="chart"
          />
        )}
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* AVAILABLE DELIVERIES                                               */}
      {/* ------------------------------------------------------------------ */}

      <Card style={styles.listCard}>
        <View style={styles.listHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Available Deliveries
            </Text>

            <Text style={styles.listSubtitle}>
              Nearby delivery requests
            </Text>
          </View>

          {safeAvailableOffers.length > 0 ? (
            <View style={styles.countBadge}>
              <Text
                style={styles.countBadgeText}
              >
                {safeAvailableOffers.length}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Loading */}
        {isLoading &&
        safeAvailableOffers.length === 0 ? (
          <View style={styles.deliveryLoading}>
            <ActivityIndicator
              color={colors.primary}
            />

            <Text
              style={styles.deliveryLoadingText}
            >
              Finding available deliveries...
            </Text>
          </View>
        ) : safeAvailableOffers.length ===
          0 ? (
          /* Empty */
          <EmptyState
            title="No Available Deliveries"
            message="Check back later! New deliveries will appear here when available."
            icon="truck"
          />
        ) : (
          /* Offers */
          safeAvailableOffers.map(
            (offer) => (
              <View
                key={offer.id}
                style={styles.offerRow}
              >
                <DeliveryCard
                  delivery={offer}
                />

                <View
                  style={styles.offerActions}
                >
                  <Button
                    label="Reject"
                    variant="outline"
                    size="small"
                    onPress={() =>
                      handleReject(
                        offer.id
                      )
                    }
                    disabled={isUpdating}
                    style={{
                      flex: 1,
                    }}
                  />

                  <Button
                    label="Accept"
                    size="small"
                    onPress={() =>
                      handleAccept(
                        offer.id
                      )
                    }
                    disabled={isUpdating}
                    style={{
                      flex: 1,
                    }}
                  />
                </View>
              </View>
            )
          )
        )}
      </Card>
    </Screen>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  STYLES                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  /* Loading */

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  /* Section */

  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },

  chartSubtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },

  /* Weekly chart */

  chartCard: {
    marginBottom: 20,
  },

  /* Performance */

  breakdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  breakdownCard: {
    marginBottom: 24,
    paddingVertical: 16,
  },

  /* Available deliveries */

  listCard: {
    padding: 0,
    overflow: "hidden",
    marginBottom: 24,
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  listSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 3,
  },

  countBadge: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: `${colors.primary}0D`,
    alignItems: "center",
    justifyContent: "center",
  },

  countBadgeText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.xs,
    color: colors.primary,
  },

  deliveryLoading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    gap: 10,
  },

  deliveryLoadingText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },

  offerRow: {
    padding: 16,
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  offerActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  /* Empty state */

  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },

  emptyStateIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${colors.primary}0D`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${colors.primary}12`,
  },

  emptyStateTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 5,
  },

  emptyStateMessage: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: "82%",
  },
});