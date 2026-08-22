import { apiClient } from "@/api/client";
import type { ApiResponse, PaginatedResponse } from "@/api/types/common.types";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  registerPushToken: (payload: { expoPushToken: string }) =>
    apiClient.post<ApiResponse<null>>("/notifications/register-token", payload),

  getAll: (page = 1, pageSize = 20) =>
    apiClient.get<PaginatedResponse<NotificationItem>>("/notifications", {
      params: { page, pageSize },
    }),

  markAsRead: (notificationId: string) =>
    apiClient.patch<ApiResponse<null>>(`/notifications/${notificationId}/read`),
};
