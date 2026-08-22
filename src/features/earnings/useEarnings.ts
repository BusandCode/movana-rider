import { useEffect, useState } from "react";
import { ridersApi } from "@/api/endpoints/riders.api";
import type { RiderEarningsSummary } from "@/types/rider";

export function useEarnings() {
  const [summary, setSummary] = useState<RiderEarningsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ridersApi
      .getEarnings()
      .then(({ data }) => setSummary(data.data))
      .finally(() => setIsLoading(false));
  }, []);

  return { summary, isLoading };
}
