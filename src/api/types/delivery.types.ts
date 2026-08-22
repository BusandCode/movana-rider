import type { Delivery, ProofOfDelivery } from "@/types/delivery";

export interface DeliveryRequestOffer extends Delivery {
  offerExpiresAt: string;
}

export interface AcceptRejectPayload {
  deliveryId: string;
}

export interface UpdateDeliveryStatusPayload {
  deliveryId: string;
  status: string;
  coordinates?: { latitude: number; longitude: number };
}

export interface SubmitProofOfDeliveryPayload {
  deliveryId: string;
  proof: ProofOfDelivery;
}
