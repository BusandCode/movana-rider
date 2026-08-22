import Constants from "expo-constants";

const ENV = (Constants.expoConfig?.extra as Record<string, string>) ?? {};

export const config = {
  apiBaseUrl: ENV.API_BASE_URL ?? "http://localhost:4000/api",
  socketUrl: ENV.SOCKET_URL ?? "http://localhost:4000",
  googleMapsApiKey: ENV.GOOGLE_MAPS_API_KEY ?? "",
  environment: ENV.APP_ENV ?? "development",
  // Set to false once the real backend is ready — see src/api/mock/mockData.ts
  useMockApi: true,
} as const;