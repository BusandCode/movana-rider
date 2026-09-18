import { useEffect, useState } from "react";
import { ridersApi } from "@/api/endpoints/riders.api";
import type { RiderEarningsSummary } from "@/types/rider";

export function useEarnings() {
  const [summary, setSummary] = useState<RiderEarningsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ridersApi
      .getEarnings()
      .then(({ data }) => {
        // ✅ Backend returns { success: true, data: {...} }
        setSummary(data.data);
      })
      .catch((err) => {
        console.error("Earnings fetch error:", err);
        setError(err?.message || "Failed to load earnings");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { summary, isLoading, error };
}