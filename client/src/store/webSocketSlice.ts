import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../types/types";

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
      state.allMessages.push(...messages);

      alerts.forEach((alert: Alert) => {
        if (alert.alertMessage === "Cheap order") {
          state.cheapOrders.push(alert);
        } else if (alert.alertMessage === "Solid order") {
          state.solidOrders.push(alert);
        } else if (alert.alertMessage === "Big biznis here") {
          state.bigBiznis.push(alert);
        }
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