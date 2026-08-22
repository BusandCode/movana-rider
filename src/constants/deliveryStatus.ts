// FR-010 — Delivery Status Management lifecycle
export const DeliveryStatus = {
  CREATED: "CREATED",
  PENDING: "PENDING",
  RIDER_ASSIGNED: "RIDER_ASSIGNED",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
  IN_TRANSIT: "IN_TRANSIT",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
  RETURNED: "RETURNED",
  RESCHEDULED: "RESCHEDULED",
} as const;

export type DeliveryStatusType = (typeof DeliveryStatus)[keyof typeof DeliveryStatus];

export const deliveryStatusLabel: Record<DeliveryStatusType, string> = {
  CREATED: "Created",
  PENDING: "Pending",
  RIDER_ASSIGNED: "Rider Assigned",
  ACCEPTED: "Accepted",
  PICKED_UP: "Picked Up",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  FAILED: "Failed",
  RETURNED: "Returned",
  RESCHEDULED: "Rescheduled",
};

// Order riders move through for an active, non-cancelled delivery
export const ACTIVE_STATUS_ORDER: DeliveryStatusType[] = [
  "PENDING",
  "RIDER_ASSIGNED",
  "ACCEPTED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];
