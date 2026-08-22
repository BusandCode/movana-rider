import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";

interface AvatarProps {
  name: string;
  photoUrl?: string;
  size?: number;
  onPress?: () => void;
}

const PALETTE = [colors.primary, colors.primaryDark, colors.aiAccent, colors.success];

function colorForName(name: string) {
  const index = name.charCodeAt(0) % PALETTE.length;
  return PALETTE[index];
}

export function Avatar({ name, photoUrl, size = 44, onPress }: AvatarProps) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "R";
  const dimensionStyle = { width: size, height: size, borderRadius: size / 2 };

  const content = photoUrl ? (
    <Image source={{ uri: photoUrl }} style={[styles.image, dimensionStyle]} />
  ) : (
    <View style={[styles.fallback, dimensionStyle, { backgroundColor: colorForName(name) }]}>
      <Text style={[styles.initial, { fontSize: size * 0.42 }]}>{initial}</Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.border },
  fallback: { alignItems: "center", justifyContent: "center" },
  initial: { fontFamily: fonts.bold, color: colors.surface },
});