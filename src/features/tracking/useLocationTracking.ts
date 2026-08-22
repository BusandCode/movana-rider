import { useCallback, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { locationService } from "@/services/location.service";
import { useLocationStore } from "@/store/locationStore";

export function useLocationTracking(deliveryId: string | null) {
  const { setTracking, offlineQueue, clearQueue } = useLocationStore();

  const start = useCallback(async () => {
    if (!deliveryId) return;
    const granted = await locationService.requestPermissions();
    if (!granted) return;
    await locationService.startTracking(deliveryId);
    setTracking(true);
  }, [deliveryId, setTracking]);

  const stop = useCallback(async () => {
    await locationService.stopTracking();
    setTracking(false);
  }, [setTracking]);

  // Flush queued points whenever connectivity returns (NFR-006)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && offlineQueue.length > 0) {
        locationService.flushQueuedPoints(offlineQueue).then(clearQueue);
      }
    });
    return () => unsubscribe();
  }, [offlineQueue, clearQueue]);

  return { start, stop };
}
