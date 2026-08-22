import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { config } from "@/constants/config";

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token to every outgoing request
apiClient.interceptors.request.use(async (requestConfig) => {
  const token = await SecureStore.getItemAsync("movana_access_token");
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

// Global error handling — surface clean messages, not raw technical errors (NFR-026)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("movana_access_token");
      // TODO: route to (auth)/login when a global navigation ref is wired up
    }
    const message =
      error.response?.data?.message ?? "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);
