import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stopStreaming, updateMessagesAndAlerts, clearOldAlerts } from "../store/webSocketSlice";
import { RootState } from "../store/store";
import { Alert } from "../store/webSocketSlice";
import { Order } from "../types/types";

const WebSocketHandler: React.FC = () => {
  const dispatch = useDispatch();
  const isStreaming = useSelector((state: RootState) => state.webSocket.isStreaming);
  const wsRef = useRef<WebSocket | null>(null);
  const messageBuffer = useRef<Order[]>([]);
  const batchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isStreaming) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (batchIntervalRef.current) {
        clearInterval(batchIntervalRef.current);
        batchIntervalRef.current = null;
      }
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
        cleanupIntervalRef.current = null;
      }
      return;
    }

    if (wsRef.current) {
      return;
    }

    const apiKey = import.meta.env.VITE_KEY;

    if (!apiKey) {
      console.error("API key is missing");
      return;
    }

    const socket = new WebSocket(
      `wss://streamer.cryptocompare.com/v2?api_key=${apiKey}`
    );
    wsRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          action: "SubAdd",
          subs: ["8~Binance~BTC~USDT"],
        })
      );
    };

    socket.onmessage = (event) => {
      const data: Order = JSON.parse(event.data);

      if (data.TYPE === "8") {
        messageBuffer.current.push({
          ...data,
          timestamp: (data.REPORTEDNS ?? 0) / 1_000_000,
        });
      }
    };

    batchIntervalRef.current = setInterval(() => {
      if (messageBuffer.current.length > 0) {
        const messages:Order[] = [...messageBuffer.current];
        messageBuffer.current = [];

        const alerts: Alert[] = messages
          .map((data: any) => {
            const price = data.P;
            const quantity = data.Q;
            const total = price * quantity;
            const timestamp = data.timestamp;

            if (price < 50000) {
              return {
                alertMessage: "Cheap order",
                price,
                quantity,
                total,
                timestamp,
              };
            }
            if (total > 1000000) {
              return {
                alertMessage: "Big biznis here",
                price,
                quantity,
                total,
                timestamp,
              };
            }
            if (quantity > 10) {
              return {
                alertMessage: "Solid order",
                price,
                quantity,
                total,
                timestamp,
              };
            }
            return null;
          })
          .filter((alert:any): alert is Alert => alert !== null);

        dispatch(updateMessagesAndAlerts({ messages, alerts }));
      }
    }, 500);

    cleanupIntervalRef.current = setInterval(() => {
      dispatch(clearOldAlerts());
    }, 60000);

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      dispatch(stopStreaming());
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (batchIntervalRef.current) {
        clearInterval(batchIntervalRef.current);
        batchIntervalRef.current = null;
      }
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
        cleanupIntervalRef.current = null;
      }
    };
  }, [isStreaming, dispatch]);

  return null;
};

export default WebSocketHandler;