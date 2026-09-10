import { useState } from "react";
import { router } from "expo-router";
import { authApi } from "@/api/endpoints/auth.api";
import { useAuthStore } from "@/store/authStore";
import type { RiderProfile, VehicleType } from "@/types/rider";

export function useAuth() {
  const { setRider, setTokens, logout: clearAuth } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (phoneOrEmail: string, password: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await authApi.login({ phoneOrEmail, password });
      const authData = response.data.data;

      if (!authData || !authData.token) {
        throw new Error("Invalid response from server");
      }

      const vehicleType = (authData.user?.rider?.vehicleType || "motorcycle") as VehicleType;

      const riderProfile: RiderProfile = {
        id: authData.user?.id || "",
        name: authData.user?.rider?.name || authData.user?.email || "Rider",
        email: authData.user?.email || "",
        phone: authData.user?.phone || "",
        photoUrl: authData.user?.rider?.photoUrl || "",
        address: authData.user?.rider?.address || "",
        vehicle: {
          type: vehicleType,
          plateNumber: authData.user?.rider?.plateNumber || "",
          capacityKg: authData.user?.rider?.vehicleCapacityKg || 25,
        },
        isVerified: authData.user?.rider?.isVerified || false,
        isAvailable: authData.user?.rider?.isAvailable || false,
        successRate: authData.user?.rider?.successRate || 0,
        activeDeliveriesCount: authData.user?.rider?.activeDeliveriesCount || 0,
        totalDeliveriesCompleted: authData.user?.rider?.totalDeliveries || 0,
      };

      await setTokens(authData.token, authData.token);
      setRider(riderProfile);

      router.replace("/(tabs)");
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    try {
      // ✅ Try to call logout if it exists, but don't fail if it doesn't
      await authApi.logout().catch(() => null);
    } catch (error) {
      // Ignore logout errors
    } finally {
      // ✅ Always clear local token
      await clearAuth();
      router.replace("/(auth)/login");
    }
  };

  return { login, logout, isSubmitting, error };
}