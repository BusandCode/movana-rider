import { create } from "zustand";
import type { Coordinates } from "@/types/delivery";

interface QueuedLocationPoint {
  deliveryId: string;
  coordinates: Coordinates;
  timestamp: string;
}

interface LocationState {
  currentPosition: Coordinates | null;
  isTracking: boolean;
  offlineQueue: QueuedLocationPoint[];
  setCurrentPosition: (coordinates: Coordinates) => void;
  setTracking: (isTracking: boolean) => void;
  enqueuePoint: (point: QueuedLocationPoint) => void;
  clearQueue: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentPosition: null,
  isTracking: false,
  offlineQueue: [],

  setCurrentPosition: (currentPosition) => set({ currentPosition }),
  setTracking: (isTracking) => set({ isTracking }),

  enqueuePoint: (point) =>
    set((state) => ({ offlineQueue: [...state.offlineQueue, point] })),

  clearQueue: () => set({ offlineQueue: [] }),
}));
