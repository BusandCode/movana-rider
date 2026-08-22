import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";
import { ACTIVE_STATUS_ORDER, deliveryStatusLabel, type DeliveryStatusType } from "@/constants/deliveryStatus";

export function DeliveryTimeline({ currentStatus }: { currentStatus: DeliveryStatusType }) {
  const currentIndex = ACTIVE_STATUS_ORDER.indexOf(currentStatus);

  return (
    <View>
      {ACTIVE_STATUS_ORDER.map((status, index) => {
        const isComplete = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <View key={status} style={styles.row}>
            <View style={styles.markerColumn}>
              <View
                style={[
                  styles.dot,
                  isComplete && { backgroundColor: colors.primary, borderColor: colors.primary },
                  isCurrent && styles.currentDot,
                ]}
              />
              {index < ACTIVE_STATUS_ORDER.length - 1 && (
                <View
                  style={[styles.line, isComplete && { backgroundColor: colors.primary }]}
                />
              )}
            </View>
            <Text style={[styles.label, isComplete && styles.labelComplete]}>
              {deliveryStatusLabel[status]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", minHeight: 40 },
  markerColumn: { alignItems: "center", width: 24 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  currentDot: { width: 18, height: 18, borderRadius: 9 },
  line: { flex: 1, width: 2, backgroundColor: colors.border },
  label: {
    marginLeft: 12,
    fontFamily: fonts.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  labelComplete: { fontFamily: fonts.semiBold, color: colors.textPrimary },
});
