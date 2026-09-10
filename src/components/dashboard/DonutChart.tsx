import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  gapDegrees?: number;
  // Removed centerValue and centerCaption props
}

export function DonutChart({
  segments,
  size = 220,
  strokeWidth = 28,
  gapDegrees = 0,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  let offsetAccum = 0;

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {segments.map((segment) => {
            const fraction = segment.value / total;
            const angleDeg = fraction * 360;
            const dash = (angleDeg / 360) * circumference;
            const rotation = (offsetAccum / total) * 360 - 90;
            offsetAccum += segment.value;

            return (
              <Circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeLinecap="butt"
                fill="none"
                rotation={rotation}
                origin={`${size / 2}, ${size / 2}`}
              />
            );
          })}
        </Svg>
        {/* Removed the center text overlay */}
      </View>

      <View style={styles.legend}>
        {segments.map((segment) => (
          <View key={segment.label} style={styles.legendRow}>
            <View style={styles.legendLeft}>
              <View style={[styles.legendBar, { backgroundColor: segment.color }]} />
              <Text style={styles.legendLabel}>{segment.label}</Text>
            </View>
            <Text style={styles.legendValue}>{segment.value}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export const defaultActivitySegments: DonutSegment[] = [
  { label: "Video Lessons", value: 50, color: "#86EFAC" },
  { label: "Practice Questions", value: 18, color: "#A5B4FC" },
  { label: "Mock Exams", value: 18, color: "#FCA5A5" },
  { label: "Reading Notes", value: 14, color: "#D1D5DB" },
];

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  legend: { alignSelf: "stretch", marginTop: 24, gap: 14 },
  legendRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between" 
  },
  legendLeft: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8 
  },
  legendBar: { width: 4, height: 16, borderRadius: 2 },
  legendLabel: { 
    fontFamily: fonts.regular, 
    fontSize: fontSize.sm, 
    color: colors.textPrimary 
  },
  legendValue: { 
    fontFamily: fonts.semiBold, 
    fontSize: fontSize.sm, 
    color: colors.textPrimary 
  },
});