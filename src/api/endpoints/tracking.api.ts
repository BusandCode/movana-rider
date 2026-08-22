import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/api/types/common.types";
import type { Coordinates } from "@/types/delivery";

export const trackingApi = {
  // Fallback REST push if the socket connection is unavailable (NFR-006 reliability)
  pushLocation: (payload: { deliveryId: string; coordinates: Coordinates; timestamp: string }) =>
    apiClient.post<ApiResponse<null>>("/tracking/location", payload),

  syncOfflineQueue: (
    payload: Array<{ deliveryId: string; coordinates: Coordinates; timestamp: string }>
  ) => apiClient.post<ApiResponse<null>>("/tracking/location/batch", { events: payload }),
};
