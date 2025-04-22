import { createSlice } from "@reduxjs/toolkit";
const filterStaleItems = (items, threshold = 60000) => {
    const cutoffTime = Date.now() - threshold;
    return items.filter((item) => item.timestamp > cutoffTime);
};
const alertTypeToArrayMap = {
    "Cheap order": "cheapOrders",
    "Solid order": "solidOrders",
    "Big biznis here": "bigBiznis"
};
const getAlertArrayByType = (state, alertType) => {
    const arrayKey = alertTypeToArrayMap[alertType];
    return state[arrayKey];
};
const clearStaleItems = (state) => {
    state.allMessages = filterStaleItems(state.allMessages);
    state.cheapOrders = filterStaleItems(state.cheapOrders);
    state.solidOrders = filterStaleItems(state.solidOrders);
    state.bigBiznis = filterStaleItems(state.bigBiznis);
};
const initialState = {
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
        stopStreaming: (state) => {
            state.isStreaming = false;
        },
        startStreaming: (state) => {
            state.isStreaming = true;
            clearStaleItems(state);
        },
        updateMessagesAndAlerts: (state, action) => {
            const { messages, alerts } = action.payload;
            state.allMessages = messages;
            alerts.forEach((alert) => {
                const targetArray = getAlertArrayByType(state, alert.alertMessage);
                const filteredAlerts = filterStaleItems(targetArray);
                const arrayKey = alertTypeToArrayMap[alert.alertMessage];
                state[arrayKey] = [...filteredAlerts, alert];
            });
        },
        clearOldAlerts: (state) => {
            clearStaleItems(state);
        },
    },
});
export const { stopStreaming, startStreaming, updateMessagesAndAlerts, clearOldAlerts } = webSocketSlice.actions;
export default webSocketSlice.reducer;
