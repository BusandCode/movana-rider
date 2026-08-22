import { apiClient } from "@/api/client";
import { config } from "@/constants/config";
import { fakeAxiosResponse } from "@/api/mock/mockData";
import type { ApiResponse } from "@/api/types/common.types";
import type { RiderRegistrationPayload } from "@/api/types/rider.types";

export const authApi = {
  login: (payload: { phoneOrEmail: string; password: string }) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<{ accessToken: string; refreshToken: string }>>({
        success: true,
        data: { accessToken: "mock_access_token", refreshToken: "mock_refresh_token" },
      });
    }
    return apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      "/auth/login",
      payload
    );
  },

  register: (payload: RiderRegistrationPayload) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<{ userId: string }>>({
        success: true,
        data: { userId: "mock_user_id" },
      });
    }
    return apiClient.post<ApiResponse<{ userId: string }>>("/auth/register", payload);
  },

  verifyOtp: (payload: { userId: string; code: string }) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<{ verified: boolean }>>({
        success: true,
        data: { verified: true },
      });
    }
    return apiClient.post<ApiResponse<{ verified: boolean }>>("/auth/verify-otp", payload);
  },

  requestPasswordReset: (payload: { phoneOrEmail: string }) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<null>>({ success: true, data: null });
    }
    return apiClient.post<ApiResponse<null>>("/auth/password-reset/request", payload);
  },

  resetPassword: (payload: { token: string; newPassword: string }) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<null>>({ success: true, data: null });
    }
    return apiClient.post<ApiResponse<null>>("/auth/password-reset/confirm", payload);
  },

  logout: () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<null>>({ success: true, data: null });
    }
    return apiClient.post<ApiResponse<null>>("/auth/logout");
  },
};