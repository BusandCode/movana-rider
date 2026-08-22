import { useState } from "react";
import { router } from "expo-router";
import { authApi } from "@/api/endpoints/auth.api";
import { ridersApi } from "@/api/endpoints/riders.api";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { setRider, setTokens, logout: clearAuth } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (phoneOrEmail: string, password: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { data } = await authApi.login({ phoneOrEmail, password });
      await setTokens(data.data.accessToken, data.data.refreshToken);

      const profile = await ridersApi.getProfile();
      setRider(profile.data.data);

      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    await authApi.logout().catch(() => null);
    await clearAuth();
    router.replace("/(auth)/login");
  };

  return { login, logout, isSubmitting, error };
}
