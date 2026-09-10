import { apiClient } from "@/api/client";
import { config } from "@/constants/config";
import {
  fakeAxiosResponse,
  MOCK_OFFERS,
  MOCK_ACTIVE_DELIVERY,
  MOCK_HISTORY,
} from "@/api/mock/mockData";
import type { ApiResponse, PaginatedResponse } from "@/api/types/common.types";
import type {
  AcceptRejectPayload,
  DeliveryRequestOffer,
  SubmitProofOfDeliveryPayload,
  UpdateDeliveryStatusPayload,
} from "@/api/types/delivery.types";
import type { Delivery, DeliveryStatusHistoryEntry } from "@/types/delivery";
import type { DeliveryStatusType } from "@/constants/deliveryStatus";

// In-memory mock state so accept/reject/status changes feel real while clicking through.
// Resets on app reload. Swap config.useMockApi to false once the backend is live.
let mockOffers: DeliveryRequestOffer[] = [...MOCK_OFFERS];
let mockActiveDeliveries: Delivery[] = MOCK_ACTIVE_DELIVERY ? [MOCK_ACTIVE_DELIVERY] : [];

export const deliveriesApi = {
  getAvailableOffers: () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<DeliveryRequestOffer[]>>({
        success: true,
        data: mockOffers,
      });
    }
    return apiClient.get<ApiResponse<DeliveryRequestOffer[]>>("/deliveries/offers");
  },

  getActive: () => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<Delivery[]>>({
        success: true,
        data: mockActiveDeliveries,
      });
    }
    // Requires backend to return Delivery[] from this endpoint.
    return apiClient.get<ApiResponse<Delivery[]>>("/deliveries/active");
  },

  getHistory: (page = 1, pageSize = 20) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<PaginatedResponse<Delivery>>({
        success: true,
        data: MOCK_HISTORY,
        pagination: { page, pageSize, total: MOCK_HISTORY.length, totalPages: 1 },
      });
    }
    return apiClient.get<PaginatedResponse<Delivery>>("/deliveries/history", {
      params: { page, pageSize },
    });
  },

  getById: (deliveryId: string) => {
    if (config.useMockApi) {
      const found =
        [...mockOffers, ...mockActiveDeliveries, ...MOCK_HISTORY].find(
          (d) => d?.id === deliveryId
        ) ??
        mockActiveDeliveries[0] ??
        MOCK_HISTORY[0];
      return fakeAxiosResponse<ApiResponse<Delivery>>({ success: true, data: found as Delivery });
    }
    return apiClient.get<ApiResponse<Delivery>>(`/deliveries/${deliveryId}`);
  },

  getStatusHistory: (deliveryId: string) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<DeliveryStatusHistoryEntry[]>>({
        success: true,
        data: [
          { status: "PENDING", timestamp: new Date(Date.now() - 3600_000).toISOString() },
          { status: "RIDER_ASSIGNED", timestamp: new Date(Date.now() - 3000_000).toISOString() },
          { status: "ACCEPTED", timestamp: new Date(Date.now() - 2700_000).toISOString() },
          { status: "PICKED_UP", timestamp: new Date(Date.now() - 1800_000).toISOString() },
          { status: "IN_TRANSIT", timestamp: new Date(Date.now() - 900_000).toISOString() },
        ],
      });
    }
    return apiClient.get<ApiResponse<DeliveryStatusHistoryEntry[]>>(
      `/deliveries/${deliveryId}/status-history`
    );
  },

  accept: (payload: AcceptRejectPayload) => {
    if (config.useMockApi) {
      const offer = mockOffers.find((o) => o.id === payload.deliveryId);
      let accepted: Delivery | undefined;
      if (offer) {
        accepted = { ...offer, status: "RIDER_ASSIGNED" } as Delivery;
        mockActiveDeliveries = [...mockActiveDeliveries, accepted];
        mockOffers = mockOffers.filter((o) => o.id !== payload.deliveryId);
      }
      return fakeAxiosResponse<ApiResponse<Delivery>>({
        success: true,
        data: (accepted ?? mockActiveDeliveries[mockActiveDeliveries.length - 1]) as Delivery,
      });
    }
    return apiClient.post<ApiResponse<Delivery>>(`/deliveries/${payload.deliveryId}/accept`);
  },

  reject: (payload: AcceptRejectPayload) => {
    if (config.useMockApi) {
      mockOffers = mockOffers.filter((o) => o.id !== payload.deliveryId);
      return fakeAxiosResponse<ApiResponse<null>>({ success: true, data: null });
    }
    return apiClient.post<ApiResponse<null>>(`/deliveries/${payload.deliveryId}/reject`);
  },

  updateStatus: (payload: UpdateDeliveryStatusPayload) => {
    if (config.useMockApi) {
      const target = mockActiveDeliveries.find((d) => d.id === payload.deliveryId);
      if (target) {
        const updated = { ...target, status: payload.status as DeliveryStatusType };
        if (["DELIVERED", "FAILED", "CANCELLED"].includes(payload.status)) {
          mockActiveDeliveries = mockActiveDeliveries.filter((d) => d.id !== payload.deliveryId);
        } else {
          mockActiveDeliveries = mockActiveDeliveries.map((d) =>
            d.id === payload.deliveryId ? updated : d
          );
        }
        return fakeAxiosResponse<ApiResponse<Delivery>>({ success: true, data: updated });
      }
      return fakeAxiosResponse<ApiResponse<Delivery>>({
        success: true,
        data: mockActiveDeliveries[0] as Delivery,
      });
    }
    return apiClient.patch<ApiResponse<Delivery>>(
      `/deliveries/${payload.deliveryId}/status`,
      payload
    );
  },

  submitProofOfDelivery: (payload: SubmitProofOfDeliveryPayload) => {
    if (config.useMockApi) {
      return fakeAxiosResponse<ApiResponse<null>>({ success: true, data: null });
    }
    return apiClient.post<ApiResponse<null>>(
      `/deliveries/${payload.deliveryId}/proof-of-delivery`,
      payload.proof
    );
  },
};