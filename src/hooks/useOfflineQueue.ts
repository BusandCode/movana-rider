import { useCallback } from "react";
import { localStorage, STORAGE_KEYS } from "@/services/storage.service";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

interface QueueItem<T> {
  id: string;
  payload: T;
  createdAt: string;
}

// Generic offline-first queue: persists writes locally when offline,
// and the caller flushes them once connectivity returns.
export function useOfflineQueue<T>(storageKey: keyof typeof STORAGE_KEYS) {
  const { isConnected } = useNetworkStatus();

  const enqueue = useCallback(
    async (payload: T) => {
      const existing = (await localStorage.get<QueueItem<T>[]>(STORAGE_KEYS[storageKey])) ?? [];
      const item: QueueItem<T> = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        payload,
        createdAt: new Date().toISOString(),
      };
      await localStorage.set(STORAGE_KEYS[storageKey], [...existing, item]);
    },
    [storageKey]
  );

  const drain = useCallback(
    async (handler: (payload: T) => Promise<void>) => {
      const existing = (await localStorage.get<QueueItem<T>[]>(STORAGE_KEYS[storageKey])) ?? [];
      if (existing.length === 0) return;

      for (const item of existing) {
        await handler(item.payload);
      }
      await localStorage.set(STORAGE_KEYS[storageKey], []);
    },
    [storageKey]
  );

  return { isConnected, enqueue, drain };
}
