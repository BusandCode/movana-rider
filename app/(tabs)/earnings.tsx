import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Ellipse,
} from "react-native-svg";

import { colors } from "@/constants/colors";
import {
  fonts,
  fontSize,
} from "@/constants/typography";

import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";

import { useEarnings } from "@/features/earnings/useEarnings";
import { formatCurrency } from "@/utils/formatters";

/* -------------------------------------------------------------------------- */
/*                              EYE ICON                                      */
/* -------------------------------------------------------------------------- */

const EyeIcon = ({ open }: { open: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    {open ? (
      <>
        <Path
          d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="12" cy="12" r="3" stroke="#FFFFFF" strokeWidth="1.8" />
      </>
    ) : (
      <>
        <Path d="M3 3L21 21" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        <Path
          d="M10.6 5.2C11.05 5.07 11.52 5 12 5C18.5 5 22 12 22 12C22 12 21.06 13.86 19.2 15.6M6.8 6.8C4.2 8.4 2 12 2 12C2 12 5.5 19 12 19C13.4 19 14.65 18.68 15.72 18.15"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M9.9 10C9.34 10.56 9 11.24 9 12C9 13.66 10.34 15 12 15C12.76 15 13.44 14.66 14 14.1"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </Svg>
);

/* -------------------------------------------------------------------------- */
/*                          TODAY'S EARNINGS CARD                             */
/* -------------------------------------------------------------------------- */

const BalanceCard = ({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) => {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.balanceCard}>
      <Svg
        style={StyleSheet.absoluteFill}
        width="100%"
        height="100%"
        viewBox="0 0 340 180"
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="cardBg" x1="0" y1="0" x2="340" y2="180" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#2563EB" />
            <Stop offset="0.55" stopColor="#4C1D95" />
            <Stop offset="1" stopColor="#1E1B4B" />
          </LinearGradient>

          <RadialGradient id="swirl" cx="0.85" cy="0.1" r="0.75" gradientUnits="objectBoundingBox">
            <Stop offset="0" stopColor="#7C3AED" stopOpacity="0.45" />
            <Stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect width="340" height="180" rx="20" fill="url(#cardBg)" />
        <Ellipse cx="300" cy="10" rx="160" ry="120" fill="url(#swirl)" />
      </Svg>

      <View style={styles.balanceContent}>
        {/* Label + account badge sit together — they're one unit of context */}
        <View style={styles.balanceHeaderRow}>
          <Text style={styles.balanceLabel}>Today's Earnings</Text>
          <View style={styles.accountBadge}>
            <Text style={styles.accountBadgeText}>RIDER</Text>
          </View>
        </View>

        {/* The number is the only thing that should command attention */}
        <View style={styles.balanceAmountRow}>
          <Text style={styles.balanceAmount}>
            {hidden ? "••••••" : formatCurrency(amount, currency)}
          </Text>

          <TouchableOpacity
            onPress={() => setHidden((value) => !value)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.eyeButton}
          >
            <EyeIcon open={!hidden} />
          </TouchableOpacity>
        </View>

        <Text style={styles.balanceCaption}>Updated just now</Text>
      </View>
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*                              EARNINGS SCREEN                               */
/* -------------------------------------------------------------------------- */

export default function EarningsScreen() {
  const { summary, isLoading } = useEarnings();

  if (isLoading) {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching your earnings...</Text>
        </View>
      </Screen>
    );
  }

  const earnings = summary ?? {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    lifetime: 0,
    currency: "NGN",
  };

  return (
    <Screen scroll={true} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Earnings</Text>

      <BalanceCard amount={earnings.today} currency={earnings.currency} />

      <View style={styles.grid}>
        <Card style={styles.gridCard}>
          <Text style={styles.gridEyebrow}>WEEKLY</Text>
          <Text style={styles.gridValue}>
            {formatCurrency(earnings.thisWeek, earnings.currency)}
          </Text>
          <Text style={styles.gridLabel}>This week</Text>
        </Card>

        <Card style={styles.gridCard}>
          <Text style={styles.gridEyebrow}>MONTHLY</Text>
          <Text style={styles.gridValue}>
            {formatCurrency(earnings.thisMonth, earnings.currency)}
          </Text>
          <Text style={styles.gridLabel}>This month</Text>
        </Card>
      </View>

      <Card style={styles.lifetimeCard}>
        <View style={styles.lifetimeTop}>
          <Text style={styles.lifetimeLabel}>Lifetime earnings</Text>
          <View style={styles.lifetimeBadge}>
            <Text style={styles.lifetimeBadgeText}>TOTAL</Text>
          </View>
        </View>
        <Text style={styles.lifetimeValue}>
          {formatCurrency(earnings.lifetime, earnings.currency)}
        </Text>
      </Card>
    </Screen>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  STYLES                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  loadingText: {
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 12,
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    marginBottom: 16,
  },

  // ✅ TODAY'S EARNINGS CARD
  balanceCard: {
    width: "100%",
    height: 170,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#1E1B4B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },

  balanceContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    gap: 10,
  },

  balanceHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  balanceLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: "#FFFFFF",
    opacity: 0.8,
  },

  accountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  accountBadgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },

  balanceAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  balanceAmount: {
    fontFamily: fonts.extraBold,
    fontSize: 34,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  eyeButton: {
    padding: 4,
  },

  balanceCaption: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: "#FFFFFF",
    opacity: 0.6,
  },

  // ✅ GRID
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  gridCard: {
    flex: 1,
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderRadius: 16,
  },

  gridEyebrow: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: colors.textSecondary,
    letterSpacing: 0.7,
    marginBottom: 7,
  },

  gridValue: {
    fontFamily: fonts.bold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },

  gridLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 3,
  },

  // ✅ LIFETIME
  lifetimeCard: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 4,
  },

  lifetimeTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  lifetimeLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },

  lifetimeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: `${colors.primary}0D`,
  },

  lifetimeBadgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 8,
    color: colors.primary,
    letterSpacing: 0.5,
  },

  lifetimeValue: {
    fontFamily: fonts.extraBold,
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
  },
});