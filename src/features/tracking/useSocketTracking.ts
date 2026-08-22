import { useEffect } from "react";
import { socketService } from "@/services/socket.service";
import { useDeliveryStore } from "@/store/deliveryStore";
import type { DeliveryRequestOffer } from "@/api/types/delivery.types";
import type { Delivery } from "@/types/delivery";

export function useSocketTracking() {
  const { addOffer, setActiveDelivery } = useDeliveryStore();

  useEffect(() => {
    let mounted = true;

    (async () => {
      await socketService.connect();
      if (!mounted) return;

      socketService.onDeliveryOffer((offer) => {
        addOffer(offer as DeliveryRequestOffer);
      });

      socketService.onDeliveryUpdate((update) => {
        setActiveDelivery(update as Delivery);
      });
    })();

    return () => {
      mounted = false;
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, [addOffer, setActiveDelivery]);
}
