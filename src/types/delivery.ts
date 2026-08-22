import type { DeliveryStatusType } from "@/constants/deliveryStatus";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ContactPoint {
  name: string;
  phone: string;
  address: string;
  coordinates: Coordinates;
}

export interface PackageInfo {
  description: string;
  quantity: number;
  weightKg?: number;
  dimensions?: string;
  valueNaira?: number;
}

export interface Delivery {
  id: string;
  trackingId: string; // e.g. LD-2026-000128
  status: DeliveryStatusType;
  pickup: ContactPoint;
  dropoff: ContactPoint;
  package: PackageInfo;
  deliveryType: "standard" | "express" | "same_day";
  priority: "low" | "normal" | "high";
  fee: number;
  riderEarnings: number;
  distanceKm: number;
  etaWindow?: { start: string; end: string };
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryStatusHistoryEntry {
  status: DeliveryStatusType;
  timestamp: string;
}

export interface ProofOfDelivery {
  method: "otp" | "signature" | "photo" | "gps";
  otpCode?: string;
  signatureUri?: string;
  photoUri?: string;
  recipientName?: string;
  coordinates?: Coordinates;
  timestamp: string;
}
