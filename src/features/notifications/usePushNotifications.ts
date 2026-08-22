import { useEffect, useRef } from "react";
import type { Subscription } from "expo-notifications";
import { notificationService } from "@/services/notification.service";
import { router } from "expo-router";

export function usePushNotifications() {
  const receivedListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    notificationService.registerForPushNotifications();

    receivedListener.current = notificationService.addNotificationReceivedListener(() => {
      // New delivery offer / status update arrived — screens re-fetch via socket/store
    });

    responseListener.current = notificationService.addNotificationResponseListener((response) => {
      const deliveryId = response.notification.request.content.data?.deliveryId as
        | string
        | undefined;
      if (deliveryId) {
        router.push(`/delivery/${deliveryId}`);
      }
    });

    return () => {
      receivedListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);
}
