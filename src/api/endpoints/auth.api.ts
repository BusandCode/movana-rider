import { apiClient } from "@/api/client";
import { config } from "@/constants/config";
import { fakeAxiosResponse } from "@/api/mock/mockData";
import type { ApiResponse } from "@/api/types/common.types";

export interface RiderRegistrationPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  vehicleType: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    phone: string;
    role: string;
    rider?: {
      id?: string;
      name?: string;
      photoUrl?: string;
      address?: string;
      vehicleType?: string;
      plateNumber?: string;
      vehicleCapacityKg?: number;
      isVerified?: boolean;
      isAvailable?: boolean;
      successRate?: number;
      activeDeliveriesCount?: number;
      totalDeliveries?: number;
    };
  };
}

export const authApi = {
  login: (payload: { phoneOrEmail: string; password: string }) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<AuthResponse>>({
        success: true,
        data: {
          token: "mock_access_token",
          user: {
            id: "mock_user_id",
            email: payload.phoneOrEmail,
            phone: payload.phoneOrEmail,
            role: "RIDER",
            rider: {
              id: "mock_rider_id",
              name: "Mock Rider",
              vehicleType: "motorcycle",
              isAvailable: false,
              isVerified: true,
              successRate: 95,
              totalDeliveries: 10,
            },
          },
        },
      });
    }
    return apiClient.post<ApiResponse<AuthResponse>>("/auth/login", payload);
  },

  register: (payload: RiderRegistrationPayload) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<AuthResponse>>({
        success: true,
        data: {
          token: "mock_access_token",
          user: {
            id: "mock_user_id",
            email: payload.email,
            phone: payload.phone,
            role: "RIDER",
            rider: {
              id: "mock_rider_id",
              name: payload.name,
              vehicleType: payload.vehicleType,
              isAvailable: false,
              isVerified: false,
              successRate: 0,
              totalDeliveries: 0,
            },
          },
        },
      });
    }
    return apiClient.post<ApiResponse<AuthResponse>>("/auth/register", payload);
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

  // ✅ FIX: Logout - returns success even if endpoint doesn't exist
  logout: async () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<null>>({ success: true, data: null });
    }
    try {
      return await apiClient.post<ApiResponse<null>>("/auth/logout");
    } catch (error) {
      // ✅ If the endpoint doesn't exist, return success anyway
      console.log("Logout endpoint not found, clearing local session");
      return { data: { success: true, data: null } };
    }
  },
};