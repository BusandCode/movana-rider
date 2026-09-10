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
  photoUrl?: string;
  address?: string;
  vehicle: Vehicle;
  isVerified: boolean;
  isAvailable: boolean;
  successRate: number;
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

export interface RiderDocument {
  id: string;
  documentType: string;
  fileUrl: string;
  status: "pending" | "approved" | "rejected";
  uploadedAt: string;
  expiresAt?: string;
}

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
  isVerified: boolean;
}

export interface RiderPerformance {
  completedDeliveries: number;
  failedDeliveries: number;
  averageDeliveryTimeMinutes: number;
  successRate: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  cancelledDeliveries: number;
  rejectedDeliveries: number;
}

export interface WeeklyDelivery {
  day: string;
  count: number;
}