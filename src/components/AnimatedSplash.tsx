import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { colors } from "@/constants/colors";

SplashScreen.preventAutoHideAsync();

const MIN_VISIBLE_MS = 900;

type AnimatedSplashProps = {
  isReady: boolean;
  onAnimationComplete: () => void;
};

function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(value, { toValue: 0.3, duration: 350, useNativeDriver: true }),
        ]),
      );

    Animated.parallel([pulse(dot1, 0), pulse(dot2, 150), pulse(dot3, 300)]).start();
  }, []);

  return (
    <View style={styles.dotsRow}>
      <Animated.View style={[styles.dot, { opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { opacity: dot3 }]} />
    </View>
  );
}

export function AnimatedSplash({ isReady, onAnimationComplete }: AnimatedSplashProps) {
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const elapsed = Date.now() - mountedAt.current;
    const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);

    const timeout = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => onAnimationComplete());
    }, remaining);

    return () => clearTimeout(timeout);
  }, [isReady]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity, backgroundColor: colors.background }]}>
      <Animated.Image
        source={require("../../assets/images/movana.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <LoadingDots />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  logo: {
    width: 320,
    height: 128,
  },
  dotsRow: {
    flexDirection: "row",
    marginTop: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});