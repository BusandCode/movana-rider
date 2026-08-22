import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";

interface BadgeProps {
  label: string;
  color?: string;
}

export function Badge({ label, color = colors.primary }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: `${color}1A`, borderColor: color }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSize.xs,
  },
});
