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
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesBufferRef = useRef<(Order & { timestamp: number })[]>([]);
  const alertsBufferRef = useRef<Alert[]>([]);

  useEffect(() => {
    if (!isStreaming) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
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
        const timestamp = (data.REPORTEDNS ?? 0) / 1_000_000;
        const price = data.P;
        const quantity = data.Q;
        const total = price * quantity;
        
        // Add message to buffer
        messagesBufferRef.current.push({ ...data, timestamp });
        
        // Process alert
        let alert: Alert | null = null;
        
        if (price < 50000) {
          alert = { alertMessage: "Cheap order", price, quantity, total, timestamp };
        } else if (total > 1000000) {
          alert = { alertMessage: "Big biznis here", price, quantity, total, timestamp };
        } else if (quantity > 10) {
          alert = { alertMessage: "Solid order", price, quantity, total, timestamp };
        }

        if (alert) {
          alertsBufferRef.current.push(alert);
        }

        if (messagesBufferRef.current.length >= 500) {
          dispatch(updateMessagesAndAlerts({ 
            messages: [...messagesBufferRef.current],
            alerts: [...alertsBufferRef.current]
          }));
          
          messagesBufferRef.current = [];
          alertsBufferRef.current = [];
        }
      }
    };

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
      // Dispatch any remaining messages before cleanup
      if (messagesBufferRef.current.length > 0) {
        dispatch(updateMessagesAndAlerts({ 
          messages: [...messagesBufferRef.current],
          alerts: [...alertsBufferRef.current]
        }));
      }
      
      messagesBufferRef.current = [];
      alertsBufferRef.current = [];
      
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
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