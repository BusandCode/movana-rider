import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { socketService } from "@/services/socket.service";
import { trackingApi } from "@/api/endpoints/tracking.api";

export const LOCATION_TRACKING_TASK = "movana-background-location-task";

TaskManager.defineTask(LOCATION_TRACKING_TASK, async ({ data, error }) => {
  if (error) return;
  const locations = (data as { locations: Location.LocationObject[] } | undefined)?.locations;
  const latest = locations?.[locations.length - 1];
  if (!latest) return;

  const { latitude, longitude } = latest.coords;

  // Prefer the live socket; REST push is the offline-safe fallback (NFR-006)
  socketService.emitLocationUpdate("active", latitude, longitude);
});

export const locationService = {
  async requestPermissions(): Promise<boolean> {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.status !== "granted") return false;

    const background = await Location.requestBackgroundPermissionsAsync();
    return background.status === "granted";
  },

  async startTracking(deliveryId: string) {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING_TASK);
    if (hasStarted) return;

    await Location.startLocationUpdatesAsync(LOCATION_TRACKING_TASK, {
      accuracy: Location.Accuracy.High,
      timeInterval: 8000,
      distanceInterval: 20,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Movana is tracking your delivery",
        notificationBody: "Your location is being shared while this delivery is active.",
      },
    });
  },

  async stopTracking() {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING_TASK);
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TRACKING_TASK);
    }
  },

  async getCurrentPosition() {
    return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  },

  // Called when connectivity is restored — flushes any queued points via REST (NFR-006)
  async flushQueuedPoints(
    queue: Array<{ deliveryId: string; coordinates: { latitude: number; longitude: number }; timestamp: string }>
  ) {
    if (queue.length === 0) return;
    await trackingApi.syncOfflineQueue(queue);
  },
};
