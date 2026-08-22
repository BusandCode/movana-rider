import { create } from "zustand";
import { secureStorage, STORAGE_KEYS } from "@/services/storage.service";
import type { RiderProfile } from "@/types/rider";

interface AuthState {
  rider: RiderProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setRider: (rider: RiderProfile) => void;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  rider: null,
  isAuthenticated: false,
  isLoading: true,

  setRider: (rider) => set({ rider, isAuthenticated: true }),

  setTokens: async (accessToken, refreshToken) => {
    await secureStorage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await secureStorage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    set({ isAuthenticated: true });
  },

  logout: async () => {
    await secureStorage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    await secureStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    set({ rider: null, isAuthenticated: false });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
