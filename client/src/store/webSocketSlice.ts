import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrdersFormated, AlertArrayKeys, Alert, WebSocketState } from "../types/types";

const filterStaleItems = <T extends { timestamp: number }>(
  items: T[],
  threshold: number = 60000
): T[] => {
  const cutoffTime = Date.now() - threshold;
  return items.filter((item) => item.timestamp > cutoffTime);
};

const alertTypeToArrayMap: Record<string, AlertArrayKeys> = {
  "Cheap order": "cheapOrders",
  "Solid order": "solidOrders",
  "Big biznis here": "bigBiznis"
};

const getAlertArrayByType = (
  state: WebSocketState,
  alertType: string
): Alert[] => {
  const arrayKey = alertTypeToArrayMap[alertType];
  return state[arrayKey];
};


const clearStaleItems = (state: WebSocketState): void => {
  state.allMessages = filterStaleItems(state.allMessages);
  state.cheapOrders = filterStaleItems(state.cheapOrders);
  state.solidOrders = filterStaleItems(state.solidOrders);
  state.bigBiznis = filterStaleItems(state.bigBiznis);
};

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
    stopStreaming: (state: WebSocketState): void => {
      state.isStreaming = false;
    },
    
    startStreaming: (state: WebSocketState): void => {
      state.isStreaming = true;
      clearStaleItems(state);
    },
    
    updateMessagesAndAlerts: (
      state: WebSocketState,
      action: PayloadAction<{ messages: OrdersFormated[]; alerts: Alert[] }>
    ): void => {
      const { messages, alerts } = action.payload;
      state.allMessages = messages;

      alerts.forEach((alert) => {
        const targetArray = getAlertArrayByType(state, alert.alertMessage);
        const filteredAlerts = filterStaleItems(targetArray);
        const arrayKey = alertTypeToArrayMap[alert.alertMessage];
        
        state[arrayKey] = [...filteredAlerts, alert];
      });
    },
    
    clearOldAlerts: (state: WebSocketState): void => {
      clearStaleItems(state);
    },
  },
});

export const { 
  stopStreaming,
  startStreaming,
  updateMessagesAndAlerts,
  clearOldAlerts 
} = webSocketSlice.actions;

export default webSocketSlice.reducer;