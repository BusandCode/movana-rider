// src/constants/config.ts
import Constants from "expo-constants";

const ENV = (Constants.expoConfig?.extra as Record<string, string>) ?? {};

const BACKEND_PORT = 4000;

/**
 * In development, derive the dev machine's current LAN IP from Expo's
 * hostUri (the address the phone/simulator used to load the JS bundle —
 * it always matches whatever network you're actually on, hotspot or not).
 * Falls back to a manual override or localhost if hostUri is unavailable
 * (e.g. in a production build, where EXPO_PUBLIC_API_URL should be set).
 */
function resolveApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri; // e.g. "172.20.10.4:8081"
  const host = hostUri?.split(":")[0];

  if (host) {
    return `http://${host}:${BACKEND_PORT}`;
  }

  // Last-resort fallback (works on iOS simulator only, not physical devices)
  return `http://localhost:${BACKEND_PORT}`;
}

const apiBaseUrl = resolveApiBaseUrl();

export const config = {
  apiBaseUrl,
  socketUrl: apiBaseUrl,
  googleMapsApiKey: ENV.googleMapsApiKey ?? "",
  environment: ENV.environment ?? "development",
  useMockApi: false, // Set to true if backend is not working
} as const;