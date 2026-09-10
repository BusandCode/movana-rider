import { create } from "zustand";
import type { Delivery } from "@/types/delivery";
import type { DeliveryRequestOffer } from "@/api/types/delivery.types";

interface DeliveryState {
  activeDeliveries: Delivery[];
  availableOffers: DeliveryRequestOffer[];
  history: Delivery[];
  setActiveDeliveries: (deliveries: Delivery[]) => void;
  upsertActiveDelivery: (delivery: Delivery) => void;
  removeActiveDelivery: (deliveryId: string) => void;
  updateDeliveryStatus: (deliveryId: string, status: Delivery["status"]) => void;
  setAvailableOffers: (offers: DeliveryRequestOffer[]) => void;
  addOffer: (offer: DeliveryRequestOffer) => void;
  removeOffer: (deliveryId: string) => void;
  setHistory: (deliveries: Delivery[]) => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  activeDeliveries: [],
  availableOffers: [],
  history: [],

  setActiveDeliveries: (activeDeliveries) => set({ activeDeliveries }),

  upsertActiveDelivery: (delivery) =>
    set((state) => {
      const exists = state.activeDeliveries.some((d) => d.id === delivery.id);
      return {
        activeDeliveries: exists
          ? state.activeDeliveries.map((d) => (d.id === delivery.id ? delivery : d))
          : [...state.activeDeliveries, delivery],
      };
    }),

  removeActiveDelivery: (deliveryId) =>
    set((state) => ({
      activeDeliveries: state.activeDeliveries.filter((d) => d.id !== deliveryId),
    })),

  updateDeliveryStatus: (deliveryId, status) =>
    set((state) => ({
      activeDeliveries: state.activeDeliveries.map((d) =>
        d.id === deliveryId ? { ...d, status } : d
      ),
    })),

  setAvailableOffers: (availableOffers) => set({ availableOffers }),

  addOffer: (offer) =>
    set((state) => ({ availableOffers: [...state.availableOffers, offer] })),

  removeOffer: (deliveryId) =>
    set((state) => ({
      availableOffers: state.availableOffers.filter((o) => o.id !== deliveryId),
    })),

  setHistory: (history) => set({ history }),
}));