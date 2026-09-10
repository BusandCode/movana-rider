import { ActivityIndicator, Pressable, StyleSheet, StyleProp, Text, TextStyle, ViewStyle } from "react-native";
import { colors } from "@/constants/colors";
import { fonts, fontSize } from "@/constants/typography";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "default" | "small";
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "default",
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === "small" && styles.baseSmall,
        variantStyles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === "outline" ? colors.primary : colors.surface} />
      ) : (
        <Text
          style={[
            styles.label,
            size === "small" && styles.labelSmall,
            variant === "outline" && { color: colors.primary },
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  baseSmall: { height: 38, borderRadius: 10, paddingHorizontal: 14 },
  label: { fontFamily: fonts.semiBold, fontSize: fontSize.base, color: colors.surface },
  labelSmall: { fontSize: fontSize.sm },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
});

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, ViewStyle> = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primaryDark },
  danger: { backgroundColor: colors.error },
  outline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.primary },
};