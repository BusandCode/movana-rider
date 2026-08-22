import { Badge } from "@/components/ui/Badge";
import { deliveryStatusLabel, type DeliveryStatusType } from "@/constants/deliveryStatus";
import { colors } from "@/constants/colors";

const statusToColor: Record<DeliveryStatusType, string> = {
  CREATED: colors.textSecondary,
  PENDING: colors.textSecondary,
  RIDER_ASSIGNED: colors.primary,
  ACCEPTED: colors.primary,
  PICKED_UP: colors.primary,
  IN_TRANSIT: colors.primary,
  OUT_FOR_DELIVERY: colors.warning,
  DELIVERED: colors.success,
  CANCELLED: colors.error,
  FAILED: colors.error,
  RETURNED: colors.error,
  RESCHEDULED: colors.warning,
};

export function StatusPill({ status }: { status: DeliveryStatusType }) {
  return <Badge label={deliveryStatusLabel[status]} color={statusToColor[status]} />;
}
