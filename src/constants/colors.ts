// Design tokens — Movana SRS Section 11 (Color System)
export const colors = {
  primary: "#2563EB", // Primary Blue
  primaryDark: "#0F172A", // Deep Navy
  background: "#F8FAFC", // Soft Gray
  surface: "#FFFFFF",
  border: "#E2E8F0",
  aiAccent: "#7C3AED", // Purple — use sparingly, AI-generated insights only
  success: "#16A34A", // Delivered / successful
  warning: "#F59E0B", // Delayed / attention required
  error: "#DC2626", // Failed / error
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
} as const;

export type ColorToken = keyof typeof colors;

// Semantic status -> color mapping (Section 11: Color Usage)
export const statusColor = {
  delivered: colors.success,
  in_transit: colors.primary,
  out_for_delivery: colors.primary,
  delayed: colors.warning,
  failed: colors.error,
  cancelled: colors.error,
  pending: colors.textSecondary,
  ai_insight: colors.aiAccent,
} as const;
