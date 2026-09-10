import type { Delivery } from "@/types/delivery";
import type { DeliveryRequestOffer } from "@/api/types/delivery.types";
import type { RiderProfile, RiderEarningsSummary } from "@/types/rider";

/**
 * Wraps a value so it looks like an axios response: { data: value }.
 * Lets mock endpoints be swapped in for real ones without touching hooks/screens.
 */
export function fakeAxiosResponse<T>(data: T, delayMs = 400): Promise<{ data: T }> {
  return new Promise((resolve) => setTimeout(() => resolve({ data }), delayMs));
}

export const MOCK_RIDER: RiderProfile = {
  id: "rider_001",
  name: "Tunde Balogun",
  email: "tunde.balogun@example.com",
  phone: "08012345678",
  address: "14 Admiralty Way, Lekki Phase 1, Lagos",
  vehicle: { type: "motorcycle", plateNumber: "LND-234-XY", capacityKg: 25 },
  isVerified: true,
  isAvailable: false,
  successRate: 96,
  activeDeliveriesCount: 2,
  totalDeliveriesCompleted: 214,
};

export const MOCK_EARNINGS: RiderEarningsSummary = {
  today: 8500,
  thisWeek: 42300,
  thisMonth: 168400,
  lifetime: 1284600,
  currency: "NGN",
};

function makeDelivery(overrides: Partial<Delivery>): Delivery {
  return {
    id: "del_" + Math.random().toString(36).slice(2, 9),
    trackingId: "LD-2026-" + Math.floor(100000 + Math.random() * 900000),
    status: "PENDING",
    pickup: {
      name: "Zainab's Kitchen",
      phone: "08023456789",
      address: "22 Admiralty Way, Lekki Phase 1, Lagos",
      coordinates: { latitude: 6.4406, longitude: 3.4784 },
    },
    dropoff: {
      name: "Chidi Okeke",
      phone: "08034567890",
      address: "5 Freedom Way, Lekki Phase 1, Lagos",
      coordinates: { latitude: 6.4478, longitude: 3.4726 },
    },
    package: {
      description: "Jollof rice & grilled chicken, 3 packs",
      quantity: 3,
      weightKg: 2.5,
    },
    deliveryType: "express",
    priority: "normal",
    fee: 1800,
    riderEarnings: 1200,
    distanceKm: 3.4,
    etaWindow: { start: "2:35 PM", end: "2:55 PM" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

export const MOCK_ACTIVE_DELIVERY: Delivery = makeDelivery({
  id: "del_active_01",
  trackingId: "LD-2026-000128",
  status: "IN_TRANSIT",
});

// Plural set — use this wherever a screen/hook supports more than one concurrent
// active delivery. MOCK_ACTIVE_DELIVERY above stays for single-delivery call sites.
export const MOCK_ACTIVE_DELIVERIES: Delivery[] = [
  MOCK_ACTIVE_DELIVERY,
  makeDelivery({
    id: "del_active_02",
    trackingId: "LD-2026-000129",
    status: "PICKED_UP",
    riderEarnings: 1450,
    distanceKm: 5.1,
    pickup: {
      name: "Green Bowl Salads",
      phone: "08056789012",
      address: "3 Ozumba Mbadiwe Ave, Victoria Island, Lagos",
      coordinates: { latitude: 6.4304, longitude: 3.4219 },
    },
    dropoff: {
      name: "Amaka Nwosu",
      phone: "08067890123",
      address: "18 Ligali Ayorinde St, Victoria Island, Lagos",
      coordinates: { latitude: 6.4335, longitude: 3.4258 },
    },
    package: {
      description: "Salad bowls & fresh juice, 2 packs",
      quantity: 2,
      weightKg: 1.2,
    },
    etaWindow: { start: "3:10 PM", end: "3:30 PM" },
  }),
];

export const MOCK_OFFERS: DeliveryRequestOffer[] = [
  {
    ...makeDelivery({ id: "del_offer_01", trackingId: "LD-2026-000131", riderEarnings: 950, distanceKm: 1.8 }),
    offerExpiresAt: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
  },
  {
    ...makeDelivery({
      id: "del_offer_02",
      trackingId: "LD-2026-000132",
      riderEarnings: 1500,
      distanceKm: 4.2,
      pickup: {
        name: "TechHub Electronics",
        phone: "08045678901",
        address: "10 Adeola Odeku St, Victoria Island, Lagos",
        coordinates: { latitude: 6.4281, longitude: 3.4219 },
      },
    }),
    offerExpiresAt: new Date(Date.now() + 90 * 1000).toISOString(),
  },
];

export const MOCK_HISTORY: Delivery[] = [
  makeDelivery({ id: "del_hist_01", trackingId: "LD-2026-000101", status: "DELIVERED", riderEarnings: 1100 }),
  makeDelivery({ id: "del_hist_02", trackingId: "LD-2026-000098", status: "DELIVERED", riderEarnings: 1400 }),
  makeDelivery({ id: "del_hist_03", trackingId: "LD-2026-000090", status: "FAILED", riderEarnings: 0 }),
  makeDelivery({ id: "del_hist_04", trackingId: "LD-2026-000085", status: "DELIVERED", riderEarnings: 950 }),
];

// SRS Section 17 — Rider Analytics: deliveries completed per day, last 7 days
export const MOCK_WEEKLY_DELIVERIES: { day: string; count: number }[] = [
  { day: "Mon", count: 6 },
  { day: "Tue", count: 9 },
  { day: "Wed", count: 4 },
  { day: "Thu", count: 11 },
  { day: "Fri", count: 8 },
  { day: "Sat", count: 13 },
  { day: "Sun", count: 5 },
];