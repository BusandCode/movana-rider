import { apiClient } from "@/api/client";
import { config } from "@/constants/config";
import { fakeAxiosResponse, MOCK_RIDER, MOCK_EARNINGS, MOCK_WEEKLY_DELIVERIES } from "@/api/mock/mockData";
import type { ApiResponse } from "@/api/types/common.types";
import type {
  RiderProfileResponse,
  UpdateAvailabilityPayload,
} from "@/api/types/rider.types";
import type { RiderEarningsSummary } from "@/types/rider";

export const ridersApi = {
  getProfile: () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<RiderProfileResponse>>({
        success: true,
        data: MOCK_RIDER,
      });
    }
    return apiClient.get<ApiResponse<RiderProfileResponse>>("/riders/me");
  },

  updateAvailability: (payload: UpdateAvailabilityPayload) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<RiderProfileResponse>>({
        success: true,
        data: { ...MOCK_RIDER, isAvailable: payload.isAvailable },
      });
    }
    return apiClient.patch<ApiResponse<RiderProfileResponse>>(
      "/riders/me/availability",
      payload
    );
  },

  uploadDocument: (formData: FormData) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<{ documentId: string }>>({
        success: true,
        data: { documentId: "mock_doc_id" },
      });
    }
    return apiClient.post<ApiResponse<{ documentId: string }>>(
      "/riders/me/documents",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  getEarnings: () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<RiderEarningsSummary>>({
        success: true,
        data: MOCK_EARNINGS,
      });
    }
    return apiClient.get<ApiResponse<RiderEarningsSummary>>("/riders/me/earnings");
  },

  getPerformance: () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<
        ApiResponse<{
          completedDeliveries: number;
          failedDeliveries: number;
          averageDeliveryTimeMinutes: number;
          successRate: number;
        }>
      >({
        success: true,
        data: {
          completedDeliveries: 214,
          failedDeliveries: 9,
          averageDeliveryTimeMinutes: 24,
          successRate: 96,
        },
      });
    }
    return apiClient.get<
      ApiResponse<{
        completedDeliveries: number;
        failedDeliveries: number;
        averageDeliveryTimeMinutes: number;
        successRate: number;
      }>
    >("/riders/me/performance");
  },

  // SRS Section 17 — Rider Analytics: deliveries completed per day (last 7 days)
  getWeeklyDeliveries: () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<{ day: string; count: number }[]>>({
        success: true,
        data: MOCK_WEEKLY_DELIVERIES,
      });
    }
    return apiClient.get<ApiResponse<{ day: string; count: number }[]>>(
      "/riders/me/deliveries/weekly"
    );
  },
};