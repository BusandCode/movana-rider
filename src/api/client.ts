import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { config } from "@/constants/config";

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token to every outgoing request
apiClient.interceptors.request.use(async (requestConfig) => {
  try {
    const token = await SecureStore.getItemAsync("movana_access_token");
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    // Silently fail if token can't be retrieved
  }
  return requestConfig;
});

// Global error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("movana_access_token");
      // You might want to navigate to login here
    }

    // Extract the error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong. Please try again.";

    // Log to the terminal so failures are visible during development
    console.error(
      `[API Error] ${error.config?.method?.toUpperCase() || "?"} ${error.config?.url || "?"} → ${error.response?.status || "no response"}: ${message}`
    );

    // Return a properly formatted error
    const enhancedError = new Error(message);
    (enhancedError as any).response = error.response;
    (enhancedError as any).status = error.response?.status;
    (enhancedError as any).config = error.config;

    return Promise.reject(enhancedError);
  }
);