import { apiClient } from "@/api/client";
import { config } from "@/constants/config";
import { fakeAxiosResponse, MOCK_RIDER, MOCK_EARNINGS, MOCK_WEEKLY_DELIVERIES } from "@/api/mock/mockData";
import type { ApiResponse } from "@/api/types/common.types";
import type {
  RiderProfile,
  RiderEarningsSummary,
  RiderDocument,
  BankInfo,
  RiderPerformance,
  WeeklyDelivery,
} from "@/types/rider";

// ==============================
// REQUEST PAYLOADS
// ==============================

export interface UpdateAvailabilityPayload {
  isAvailable: boolean;
}

export interface RiderRegistrationPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  vehicleType: string;
  plateNumber?: string;
}

export interface UpdateVehiclePayload {
  vehicleType: string;
  plateNumber: string;
  capacityKg: number;
}

export interface UpdateBankInfoPayload {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

// ==============================
// RESPONSE TYPES (Aliases)
// ==============================

export type RiderProfileResponse = RiderProfile;
export type RiderDocumentResponse = RiderDocument;
export type BankInfoResponse = BankInfo;
export type PerformanceResponse = RiderPerformance;
export type WeeklyDeliveriesResponse = WeeklyDelivery;
export type EarningsResponse = RiderEarningsSummary;

// ==============================
// API METHODS
// ==============================

export const ridersApi = {
  // Profile
  getProfile: () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<RiderProfileResponse>>({
        success: true,
        data: MOCK_RIDER,
      });
    }
    return apiClient.get<ApiResponse<RiderProfileResponse>>("/riders/me");
  },

  // Availability
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

  // Documents
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

  getDocuments: () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<RiderDocumentResponse[]>>({
        success: true,
        data: [
          {
            id: "doc_1",
            documentType: "drivers_license",
            fileUrl: "https://example.com/license.jpg",
            status: "approved",
            uploadedAt: new Date().toISOString(),
          },
          {
            id: "doc_2",
            documentType: "vehicle_registration",
            fileUrl: "https://example.com/registration.jpg",
            status: "pending",
            uploadedAt: new Date().toISOString(),
          },
          {
            id: "doc_3",
            documentType: "national_id",
            fileUrl: "https://example.com/national_id.jpg",
            status: "pending",
            uploadedAt: new Date().toISOString(),
          },
        ],
      });
    }
    return apiClient.get<ApiResponse<RiderDocumentResponse[]>>("/riders/me/documents");
  },

  // Vehicle
  updateVehicle: (payload: UpdateVehiclePayload) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<RiderProfileResponse>>({
        success: true,
        data: {
          ...MOCK_RIDER,
          vehicle: {
            type: payload.vehicleType as any,
            plateNumber: payload.plateNumber,
            capacityKg: payload.capacityKg,
          },
        },
      });
    }
    return apiClient.patch<ApiResponse<RiderProfileResponse>>(
      "/riders/me/vehicle",
      payload
    );
  },

  // Bank Info
  getBankInfo: () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<BankInfoResponse>>({
        success: true,
        data: {
          bankName: "GTBank",
          accountNumber: "0123456789",
          accountName: "Tunde Balogun",
          isVerified: true,
        },
      });
    }
    return apiClient.get<ApiResponse<BankInfoResponse>>("/riders/me/bank-info");
  },

  updateBankInfo: (payload: UpdateBankInfoPayload) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<null>>({
        success: true,
        data: null,
      });
    }
    return apiClient.patch<ApiResponse<null>>(
      "/riders/me/bank-info",
      payload
    );
  },

  // Earnings
  getEarnings: () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<EarningsResponse>>({
        success: true,
        data: MOCK_EARNINGS,
      });
    }
    return apiClient.get<ApiResponse<EarningsResponse>>("/riders/me/earnings");
  },

  // Performance
  getPerformance: () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<PerformanceResponse>>({
        success: true,
        data: {
          completedDeliveries: 214,
          failedDeliveries: 9,
          averageDeliveryTimeMinutes: 24,
          successRate: 96,
          onTimeDeliveries: 160,
          lateDeliveries: 40,
          cancelledDeliveries: 6,
          rejectedDeliveries: 3,
        },
      });
    }
    return apiClient.get<ApiResponse<PerformanceResponse>>("/riders/me/performance");
  },

  // Weekly Deliveries
  getWeeklyDeliveries: () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<WeeklyDeliveriesResponse[]>>({
        success: true,
        data: MOCK_WEEKLY_DELIVERIES,
      });
    }
    return apiClient.get<ApiResponse<WeeklyDeliveriesResponse[]>>(
      "/riders/me/deliveries/weekly"
    );
  },
};