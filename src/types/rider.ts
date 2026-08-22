export type VehicleType = "bike" | "motorcycle" | "car" | "van";

export interface Vehicle {
  type: VehicleType;
  plateNumber?: string;
  capacityKg?: number;
}

export interface RiderProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  photoUrl?: string;
  vehicle: Vehicle;
  isVerified: boolean;
  isAvailable: boolean;
  successRate: number; // 0-100
  activeDeliveriesCount: number;
  totalDeliveriesCompleted: number;
}

export interface RiderEarningsSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  lifetime: number;
  currency: string;
}