import { format } from "date-fns";

export function formatCurrency(amount: number, currency = "NGN"): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export function formatDate(dateString: string, pattern = "MMM d, h:mm a"): string {
  return format(new Date(dateString), pattern);
}

export function formatEtaWindow(start: string, end: string): string {
  return `${format(new Date(start), "h:mm a")} – ${format(new Date(end), "h:mm a")}`;
}
