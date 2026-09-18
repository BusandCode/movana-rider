import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/authStore";
import { secureStorage, STORAGE_KEYS } from "@/services/storage.service";
import { ridersApi } from "@/api/endpoints/riders.api";
import { colors } from "@/constants/colors";
import { AnimatedSplash } from "@/components/AnimatedSplash";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const [bootstrapped, setBootstrapped] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setRider = useAuthStore((s) => s.setRider);

  useEffect(() => {
    (async () => {
      const token = await secureStorage.get(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        try {
          const { data } = await ridersApi.getProfile();
          setRider(data.data);
        } catch {
          useAuthStore.setState({ isAuthenticated: false, rider: null });
        }
      }
      setLoading(false);
      setBootstrapped(true);
    })();
  }, []);

  const appIsReady = fontsLoaded && bootstrapped;

  if (!splashDone) {
    return (
      <AnimatedSplash
        isReady={appIsReady}
        onAnimationComplete={() => setSplashDone(true)}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          headerBackButtonDisplayMode: "minimal",
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="delivery/[id]" options={{ headerShown: true, title: "Delivery Details" }} />
        <Stack.Screen name="delivery/navigate" options={{ headerShown: true, title: "Navigate" }} />
        <Stack.Screen name="delivery/proof-of-delivery" options={{ headerShown: true, title: "Proof of Delivery" }} />
        <Stack.Screen name="onboarding/vehicle-info" options={{ headerShown: true, title: "Vehicle Info" }} />
        <Stack.Screen name="onboarding/documents-upload" options={{ headerShown: true, title: "Documents" }} />
        <Stack.Screen name="onboarding/bank-info" options={{ headerShown: true, title: "Bank Info" }} />
      </Stack>
    </SafeAreaProvider>
  );
}