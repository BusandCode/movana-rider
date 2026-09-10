import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Path,
  Circle,
  Rect,
  Polyline,
  Line,
} from "react-native-svg";

import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";

type StatIcon = "completed" | "success" | "active" | "time";

interface StatItem {
  icon: StatIcon;
  color: string;
  value: string | number;
  label: string;
  ringProgress?: number;
}

interface StatsOverviewCardProps {
  stats: StatItem[];
}

const RING_SIZE = 48;
const STROKE = 4;

function StatIconSvg({
  type,
  color,
  size = 19,
}: {
  type: StatIcon;
  color: string;
  size?: number;
}) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
  };

  switch (type) {
    case "completed":
      return (
        <Svg {...commonProps}>
          <Path
            d="M4 7.5 12 4l8 3.5-8 3.5-8-3.5Z"
            stroke={color}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />

          <Path
            d="M4 7.5v9L12 20l8-3.5v-9"
            stroke={color}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />

          <Path
            d="M12 11v9"
            stroke={color}
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          <Path
            d="m7.5 6 8 3.5"
            stroke={color}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </Svg>
      );

    case "success":
      return (
        <Svg {...commonProps}>
          <Circle
            cx="12"
            cy="12"
            r="8.5"
            stroke={color}
            strokeWidth="1.7"
          />

          <Polyline
            points="8,12.2 10.7,15 16.5,9"
            stroke={color}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "active":
      return (
        <Svg {...commonProps}>
          <Path
            d="M13 3 5.5 13h5L10 21l8.5-11h-5L13 3Z"
            stroke={color}
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case "time":
      return (
        <Svg {...commonProps}>
          <Circle
            cx="12"
            cy="12"
            r="8.5"
            stroke={color}
            strokeWidth="1.7"
          />

          <Path
            d="M12 7v5l3.2 2"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    default:
      return null;
  }
}

function StatRing({
  color,
  progress = 100,
  icon,
}: {
  color: string;
  progress?: number;
  icon: StatIcon;
}) {
  const radius = (RING_SIZE - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;

  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const dash = (safeProgress / 100) * circumference;

  return (
    <View style={styles.ringContainer}>
      <Svg
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      >
        {/* Background ring */}
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={radius}
          stroke={`${color}18`}
          strokeWidth={STROKE}
          fill="none"
        />

        {/* Progress ring */}
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={radius}
          stroke={color}
          strokeWidth={STROKE}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          fill="none"
          rotation={-90}
          origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
        />
      </Svg>

      <View style={styles.ringIcon}>
        <StatIconSvg type={icon} color={color} />
      </View>
    </View>
  );
}

export function StatsOverviewCard({
  stats,
}: StatsOverviewCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.grid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.item}>
            <StatRing
              color={stat.color}
              progress={stat.ringProgress}
              icon={stat.icon}
            />

            <View style={styles.textContainer}>
              <Text style={styles.value} numberOfLines={1}>
                {stat.value}
              </Text>

              <Text
                style={styles.label}
                numberOfLines={1}
              >
                {stat.label}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 20,
    columnGap: 12,
  },

  item: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },

  ringIcon: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    flex: 1,
    minWidth: 0,
  },

  value: {
    fontFamily: fonts.extraBold,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    lineHeight: 22,
  },

  label: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.45,
    marginTop: 2,
  },
});