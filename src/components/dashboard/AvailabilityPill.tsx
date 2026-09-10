import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";

interface AvailabilityPillProps {
  isAvailable: boolean;
  onToggle: (value: boolean) => void;
  variant?: "light" | "onDark";
}

export function AvailabilityPill({ isAvailable, onToggle, variant = "light" }: AvailabilityPillProps) {
  const onDark = variant === "onDark";

  return (
    <Pressable
      onPress={() => onToggle(!isAvailable)}
      style={[
        styles.pill,
        onDark ? styles.pillOnDark : isAvailable ? styles.pillOnline : styles.pillOffline,
      ]}
    >
      <View
        style={[
          styles.dot,
          onDark
            ? isAvailable
              ? styles.dotOnlineOnDark
              : styles.dotOfflineOnDark
            : isAvailable
              ? styles.dotOnline
              : styles.dotOffline,
        ]}
      />
      <Text
        style={[
          styles.label,
          onDark ? styles.labelOnDark : isAvailable ? styles.labelOnline : styles.labelOffline,
        ]}
      >
        {isAvailable ? "Online" : "Offline"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillOnline: { backgroundColor: colors.primary },
  pillOffline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillOnDark: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotOnline: { backgroundColor: "#FFFFFF" },
  dotOffline: { backgroundColor: colors.textSecondary },
  dotOnlineOnDark: { backgroundColor: colors.success },
  dotOfflineOnDark: { backgroundColor: "rgba(255,255,255,0.5)" },
  label: { fontFamily: fonts.semiBold, fontSize: fontSize.xs },
  labelOnline: { color: "#FFFFFF" },
  labelOffline: { color: colors.textSecondary },
  labelOnDark: { color: "#FFFFFF" },
});