import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// SecureStore — for sensitive data (tokens, credentials)
export const secureStorage = {
  set: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  get: (key: string) => SecureStore.getItemAsync(key),
  remove: (key: string) => SecureStore.deleteItemAsync(key),
};

// AsyncStorage — for non-sensitive cached data (e.g. offline delivery queue)
export const localStorage = {
  set: async (key: string, value: unknown) =>
    AsyncStorage.setItem(key, JSON.stringify(value)),
  get: async <T>(key: string): Promise<T | null> => {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  remove: (key: string) => AsyncStorage.removeItem(key),
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "movana_access_token",
  REFRESH_TOKEN: "movana_refresh_token",
  OFFLINE_LOCATION_QUEUE: "movana_offline_location_queue",
  OFFLINE_STATUS_QUEUE: "movana_offline_status_queue",
} as const;
