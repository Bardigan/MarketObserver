import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { useEffect } from "react";

export const useMessageCleanup = () => {
  const dispatch = useDispatch();
  const { allMessages, cheapOrders, solidOrders, bigBiznis } = useSelector(
    (state: RootState) => state.webSocket
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (allMessages.length > 0 || cheapOrders.length > 0 || 
        solidOrders.length > 0 || bigBiznis.length > 0) {
      intervalId = setInterval(() => {
        dispatch(clearOldAlerts());
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [allMessages.length, cheapOrders.length, solidOrders.length, bigBiznis.length]);
};

export interface Alert {
  alertMessage: "Cheap order" | "Solid order" | "Big biznis here";
  price: number;
  quantity: number;
  total: number;
  timestamp: number;
}

export interface WebSocketState {
  isStreaming: boolean;
  allMessages: Order[];
  cheapOrders: Alert[];
  solidOrders: Alert[];
  bigBiznis: Alert[];
}

const initialState: WebSocketState = {
  isStreaming: false,
  allMessages: [],
  cheapOrders: [],
  solidOrders: [],
  bigBiznis: [],
};

const webSocketSlice = createSlice({
  name: "webSocket",
  initialState,
  reducers: {
    stopStreaming(state) {
      state.isStreaming = false;
    },
    startStreaming(state) {
      state.isStreaming = true;

      // Filter out messages and alerts older than 1 minute
      const oneMinuteAgo = Date.now() - 60000;

      state.allMessages = state.allMessages.filter(
        (message: Order) => message.timestamp > oneMinuteAgo
      );
      state.cheapOrders = state.cheapOrders.filter(
        (alert: Alert) => alert.timestamp > oneMinuteAgo
      );
      state.solidOrders = state.solidOrders.filter(
        (alert: Alert) => alert.timestamp > oneMinuteAgo
      );
      state.bigBiznis = state.bigBiznis.filter(
        (alert: Alert) => alert.timestamp > oneMinuteAgo
      );
    },
    updateMessagesAndAlerts(
      state,
      action: PayloadAction<{ messages: Order[]; alerts: Alert[] }>
    ) {
      const { messages, alerts } = action.payload;
      const now = Date.now();
      const oneMinuteAgo = now - 60000;


      state.allMessages = [
        ...messages,
      ];

      alerts.forEach((alert: Alert) => {
        const targetArray = alert.alertMessage === "Cheap order" 
          ? state.cheapOrders 
          : alert.alertMessage === "Solid order" 
            ? state.solidOrders 
            : state.bigBiznis;

        // Clean up expired alerts and add new one
        targetArray.splice(
          0, 
          targetArray.length, 
          ...targetArray.filter(a => a.timestamp > oneMinuteAgo),
          alert
        );
      });
    },
    clearOldAlerts(state) {
      // Clear old alerts and messages older than 1 minute
      const oneMinuteAgo = Date.now() - 60000;

      state.cheapOrders = state.cheapOrders.filter(
        (alert: Alert) => alert.timestamp > oneMinuteAgo
      );
      state.solidOrders = state.solidOrders.filter(
        (alert: Alert) => alert.timestamp > oneMinuteAgo
      );
      state.bigBiznis = state.bigBiznis.filter(
        (alert: Alert) => alert.timestamp > oneMinuteAgo
      );
      state.allMessages = state.allMessages.filter(
        (message: Order) => message.timestamp > oneMinuteAgo
      );
    },
  },
});

export const { stopStreaming, startStreaming, updateMessagesAndAlerts, clearOldAlerts } =
  webSocketSlice.actions;

export default webSocketSlice.reducer;