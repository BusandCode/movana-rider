import type { RiderProfile } from "@/types/rider";

export interface UpdateAvailabilityPayload {
  isAvailable: boolean;
}

export interface RiderRegistrationPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  vehicleType: string;
}

export type RiderProfileResponse = RiderProfile;
