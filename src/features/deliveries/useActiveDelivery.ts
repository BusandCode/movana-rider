import { useCallback, useEffect, useState } from "react";
import { deliveriesApi } from "@/api/endpoints/deliveries.api";
import { useDeliveryStore } from "@/store/deliveryStore";
import { locationService } from "@/services/location.service";
import type { DeliveryStatusType } from "@/constants/deliveryStatus";

export function useActiveDelivery() {
  const { activeDelivery, setActiveDelivery, updateActiveDeliveryStatus, removeOffer } =
    useDeliveryStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchActive = useCallback(async () => {
    const { data } = await deliveriesApi.getActive();
    setActiveDelivery(data.data);
  }, [setActiveDelivery]);

  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  const accept = async (deliveryId: string) => {
    setIsUpdating(true);
    try {
      const { data } = await deliveriesApi.accept({ deliveryId });
      setActiveDelivery(data.data);
      removeOffer(deliveryId);
      await locationService.startTracking(deliveryId);
    } finally {
      setIsUpdating(false);
    }
  };

  const reject = async (deliveryId: string) => {
    await deliveriesApi.reject({ deliveryId });
    removeOffer(deliveryId);
  };

  const updateStatus = async (deliveryId: string, status: DeliveryStatusType) => {
    setIsUpdating(true);
    try {
      const position = await locationService.getCurrentPosition().catch(() => null);
      await deliveriesApi.updateStatus({
        deliveryId,
        status,
        coordinates: position
          ? { latitude: position.coords.latitude, longitude: position.coords.longitude }
          : undefined,
      });
      updateActiveDeliveryStatus(status);

      if (status === "DELIVERED" || status === "FAILED" || status === "CANCELLED") {
        await locationService.stopTracking();
        setActiveDelivery(null);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return { activeDelivery, isUpdating, accept, reject, updateStatus, refetch: fetchActive };
}
