import { create } from "zustand";
import { secureStorage, STORAGE_KEYS } from "@/services/storage.service";
import type { RiderProfile } from "@/types/rider";

interface AuthState {
  rider: RiderProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setRider: (rider: RiderProfile | null | undefined) => void;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  rider: null,
  isAuthenticated: false,
  isLoading: true,

  // Only flips isAuthenticated on when actually handed a rider. Passing
  // null/undefined (e.g. a malformed or empty API response) clears the
  // rider without falsely claiming the user is authenticated — previously
  // this always set isAuthenticated: true regardless of what was passed in,
  // which could strand the UI on "authenticated but no rider" forever.
  setRider: (rider) => set({ rider: rider ?? null, isAuthenticated: !!rider }),

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