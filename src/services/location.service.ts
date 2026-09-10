import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { socketService } from "@/services/socket.service";
import { trackingApi } from "@/api/endpoints/tracking.api";
import { Platform } from "react-native";
import Constants from "expo-constants";

export const LOCATION_TRACKING_TASK = "movana-background-location-task";

TaskManager.defineTask(LOCATION_TRACKING_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Location task error:", error);
    return;
  }
  const locations = (data as { locations: Location.LocationObject[] } | undefined)?.locations;
  const latest = locations?.[locations.length - 1];
  if (!latest) return;

  const { latitude, longitude } = latest.coords;
  socketService.emitLocationUpdate("active", latitude, longitude);
});

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === "expo";

export const locationService = {
  async requestPermissions(): Promise<boolean> {
    try {
      // Request foreground permissions
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        console.log("❌ Foreground permission denied");
        return false;
      }

      // Only request background permissions if NOT in Expo Go
      if (!isExpoGo && Platform.OS === "ios") {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== "granted") {
          console.log("⚠️ Background permission denied - location will work in foreground only");
          // Return true anyway since foreground is granted
          return true;
        }
      }

      console.log("✅ Location permissions granted");
      return true;
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return false;
    }
  },

  async checkPermissions(): Promise<boolean> {
    try {
      const { status: foregroundStatus } = await Location.getForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        console.log("❌ Foreground permission not granted");
        return false;
      }

      console.log("✅ Foreground permission granted");
      return true;
    } catch (error) {
      console.error("Error checking permissions:", error);
      return false;
    }
  },

  async startTracking(deliveryId: string) {
    try {
      // Check foreground permission
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        console.log("❌ Cannot start tracking: permissions not granted");
        return false;
      }

      // Skip background tracking in Expo Go
      if (isExpoGo) {
        console.log("ℹ️ Background tracking skipped in Expo Go");
        return true;
      }

      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING_TASK);
      if (hasStarted) {
        console.log("ℹ️ Location tracking already started");
        return true;
      }

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
      
      console.log("✅ Location tracking started for delivery:", deliveryId);
      return true;
    } catch (error) {
      console.error("❌ Failed to start tracking:", error);
      return false;
    }
  },

  async stopTracking() {
    try {
      // Skip in Expo Go
      if (isExpoGo) {
        console.log("ℹ️ Stop tracking skipped in Expo Go");
        return true;
      }

      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING_TASK);
      if (hasStarted) {
        await Location.stopLocationUpdatesAsync(LOCATION_TRACKING_TASK);
        console.log("✅ Location tracking stopped");
      }
      return true;
    } catch (error) {
      console.error("❌ Failed to stop tracking:", error);
      return false;
    }
  },

  async getCurrentPosition() {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        console.log("❌ Cannot get position: permissions not granted");
        return null;
      }
      return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    } catch (error) {
      console.error("❌ Failed to get current position:", error);
      return null;
    }
  },

  async flushQueuedPoints(
    queue: Array<{ deliveryId: string; coordinates: { latitude: number; longitude: number }; timestamp: string }>
  ) {
    if (queue.length === 0) return;
    await trackingApi.syncOfflineQueue(queue);
  },
};