import { useCallback, useEffect, useState } from "react";
import { deliveriesApi } from "@/api/endpoints/deliveries.api";
import { useDeliveryStore } from "@/store/deliveryStore";

export function useDeliveries() {
  const { availableOffers, setAvailableOffers, history, setHistory } = useDeliveryStore();
  const [isLoading, setIsLoading] = useState(false);

  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await deliveriesApi.getAvailableOffers();
      setAvailableOffers(data.data);
    } finally {
      setIsLoading(false);
    }
  }, [setAvailableOffers]);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await deliveriesApi.getHistory();
      setHistory(data.data);
    } finally {
      setIsLoading(false);
    }
  }, [setHistory]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return { availableOffers, history, isLoading, fetchOffers, fetchHistory };
}
