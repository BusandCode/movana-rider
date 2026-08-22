import { ReactNode } from "react";
import { RefreshControlProps, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";

interface ScreenProps {
  children: ReactNode;
  /** Set false for screens that manage their own scrolling (e.g. FlatList) or need a static layout (e.g. maps). */
  scroll?: boolean;
  contentContainerStyle?: ViewStyle;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

/**
 * Every top-level tab/auth screen should render inside this.
 * The safe-area inset lives on a fixed outer View, NOT inside the scrollable
 * content — that's what stops content from sliding up behind the status bar
 * when scrolling, and keeps the top inset visually anchored.
 */
export function Screen({ children, scroll = true, contentContainerStyle, refreshControl }: ScreenProps) {
  const insets = useSafeAreaInsets();

  if (!scroll) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={[styles.flexFill, contentContainerStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.flexFill}
        contentContainerStyle={[styles.defaultPadding, contentContainerStyle]}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flexFill: { flex: 1 },
  defaultPadding: { padding: 20 },
});