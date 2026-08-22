import { create } from "zustand";
import type { Delivery } from "@/types/delivery";
import type { DeliveryRequestOffer } from "@/api/types/delivery.types";

interface DeliveryState {
  activeDelivery: Delivery | null;
  availableOffers: DeliveryRequestOffer[];
  history: Delivery[];
  setActiveDelivery: (delivery: Delivery | null) => void;
  setAvailableOffers: (offers: DeliveryRequestOffer[]) => void;
  addOffer: (offer: DeliveryRequestOffer) => void;
  removeOffer: (deliveryId: string) => void;
  setHistory: (deliveries: Delivery[]) => void;
  updateActiveDeliveryStatus: (status: Delivery["status"]) => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  activeDelivery: null,
  availableOffers: [],
  history: [],

  setActiveDelivery: (activeDelivery) => set({ activeDelivery }),

  setAvailableOffers: (availableOffers) => set({ availableOffers }),

  addOffer: (offer) =>
    set((state) => ({ availableOffers: [...state.availableOffers, offer] })),

  removeOffer: (deliveryId) =>
    set((state) => ({
      availableOffers: state.availableOffers.filter((o) => o.id !== deliveryId),
    })),

  setHistory: (history) => set({ history }),

  updateActiveDeliveryStatus: (status) =>
    set((state) =>
      state.activeDelivery
        ? { activeDelivery: { ...state.activeDelivery, status } }
        : state
    ),
}));
