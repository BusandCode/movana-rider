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
  VehicleType,
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
// RAW BACKEND SHAPES
// ==============================

interface RawRider {
  id: string;
  userId?: string;
  name: string;
  photoUrl?: string | null;
  address?: string | null;
  vehicleType?: string | null;
  plateNumber?: string | null;
  vehicleCapacityKg?: number | null;
  isVerified?: boolean;
  isAvailable?: boolean;
  successRate?: number;
  activeDeliveriesCount?: number;
  totalDeliveriesCompleted?: number;
  totalDeliveries?: number;
  user?: {
    email: string;
    phone: string;
    role: string;
  };
}

// ==============================
// TRANSFORMERS
// ==============================

function transformRider(raw: RawRider): RiderProfile {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.user?.email || "",
    phone: raw.user?.phone || "",
    photoUrl: raw.photoUrl || "",
    address: raw.address || "",
    vehicle: {
      type: (raw.vehicleType || "motorcycle") as VehicleType,
      plateNumber: raw.plateNumber || "",
      capacityKg: raw.vehicleCapacityKg || 25,
    },
    isVerified: raw.isVerified || false,
    isAvailable: raw.isAvailable || false,
    successRate: raw.successRate || 0,
    activeDeliveriesCount: raw.activeDeliveriesCount || 0,
    totalDeliveriesCompleted:
      raw.totalDeliveriesCompleted ?? raw.totalDeliveries ?? 0,
  };
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
  getProfile: async (): Promise<{ data: ApiResponse<RiderProfile> }> => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<RiderProfile>>({
        success: true,
        data: MOCK_RIDER,
      });
    }
    const response = await apiClient.get<ApiResponse<RawRider>>("/riders/me");
    return {
      ...response,
      data: {
        ...response.data,
        data: transformRider(response.data.data),
      },
    };
  },

  // Availability
  updateAvailability: async (
    payload: UpdateAvailabilityPayload
  ): Promise<{ data: ApiResponse<RiderProfile> }> => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<RiderProfile>>({
        success: true,
        data: { ...MOCK_RIDER, isAvailable: payload.isAvailable },
      });
    }
    const response = await apiClient.patch<ApiResponse<RawRider>>(
      "/riders/me/availability",
      payload
    );
    return {
      ...response,
      data: {
        ...response.data,
        data: transformRider(response.data.data),
      },
    };
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
  updateVehicle: async (
    payload: UpdateVehiclePayload
  ): Promise<{ data: ApiResponse<RiderProfile> }> => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<RiderProfile>>({
        success: true,
        data: {
          ...MOCK_RIDER,
          vehicle: {
            type: payload.vehicleType as VehicleType,
            plateNumber: payload.plateNumber,
            capacityKg: payload.capacityKg,
          },
        },
      });
    }
    const response = await apiClient.patch<ApiResponse<RawRider>>(
      "/riders/me/vehicle",
      payload
    );
    return {
      ...response,
      data: {
        ...response.data,
        data: transformRider(response.data.data),
      },
    };
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
    return apiClient.patch<ApiResponse<null>>("/riders/me/bank-info", payload);
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