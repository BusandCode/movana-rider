import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";
import { config } from "@/constants/config";

class SocketService {
  private socket: Socket | null = null;

  async connect(): Promise<Socket> {
    if (this.socket?.connected) return this.socket;

    const token = await SecureStore.getItemAsync("movana_access_token");

    this.socket = io(config.socketUrl, {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  emitLocationUpdate(deliveryId: string, latitude: number, longitude: number) {
    this.socket?.emit("rider:location", {
      deliveryId,
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    });
  }

  onDeliveryOffer(callback: (offer: unknown) => void) {
    this.socket?.on("delivery:offer", callback);
  }

  onDeliveryUpdate(callback: (update: unknown) => void) {
    this.socket?.on("delivery:update", callback);
  }

  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export const socketService = new SocketService();
