import { apiClient } from "@/api/client";
import type { ApiResponse, PaginatedResponse } from "@/api/types/common.types";

export interface Transaction {
  id: string;
  deliveryId: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  timestamp: string;
}

export const paymentsApi = {
  getTransactions: (page = 1, pageSize = 20) =>
    apiClient.get<PaginatedResponse<Transaction>>("/payments/rider/transactions", {
      params: { page, pageSize },
    }),

  getPayoutSettings: () =>
    apiClient.get<ApiResponse<{ bankName: string; accountNumberMasked: string }>>(
      "/payments/rider/payout-settings"
    ),
};
