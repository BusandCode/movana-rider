import { useCallback, useEffect, useState } from "react";
import { deliveriesApi } from "@/api/endpoints/deliveries.api";
import { useDeliveryStore } from "@/store/deliveryStore";
import { locationService } from "@/services/location.service";
import type { DeliveryStatusType } from "@/constants/deliveryStatus";

const LOCATION_TIMEOUT_MS = 2500;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

export function useActiveDelivery() {
  const {
    activeDeliveries,
    setActiveDeliveries,
    upsertActiveDelivery,
    updateDeliveryStatus,
    removeActiveDelivery,
    removeOffer,
  } = useDeliveryStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchActive = useCallback(async () => {
    const { data } = await deliveriesApi.getActive(); // expects Delivery[]
    setActiveDeliveries(data.data);
  }, [setActiveDeliveries]);

  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  const accept = async (deliveryId: string) => {
    setIsUpdating(true);
    try {
      const { data } = await deliveriesApi.accept({ deliveryId });
      upsertActiveDelivery(data.data);
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
      // Cap GPS wait — a slow/weak fix shouldn't stall the status update itself.
      const position = await withTimeout(
        locationService.getCurrentPosition().catch(() => null),
        LOCATION_TIMEOUT_MS,
      );

      const { data } = await deliveriesApi.updateStatus({
        deliveryId,
        status,
        coordinates: position
          ? { latitude: position.coords.latitude, longitude: position.coords.longitude }
          : undefined,
      });

      const updatedDelivery = data.data;
      updateDeliveryStatus(deliveryId, status);

      if (status === "DELIVERED" || status === "FAILED" || status === "CANCELLED") {
        removeActiveDelivery(deliveryId);
        // If a rider can only ever have one delivery tracked physically at a time,
        // stop tracking here. If multiple concurrent deliveries can be tracked,
        // scope stopTracking to this deliveryId instead.
        await locationService.stopTracking();
      }

      return updatedDelivery;
    } finally {
      setIsUpdating(false);
    }
  };

  return { activeDeliveries, isUpdating, accept, reject, updateStatus, refetch: fetchActive };
}