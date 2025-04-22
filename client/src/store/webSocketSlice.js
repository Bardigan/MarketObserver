import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
export const useMessageCleanup = () => {
    const dispatch = useDispatch();
    const { allMessages, cheapOrders, solidOrders, bigBiznis } = useSelector((state) => state.webSocket);
    useEffect(() => {
        let intervalId;
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
        stopStreaming(state) {
            state.isStreaming = false;
        },
        startStreaming(state) {
            state.isStreaming = true;
            // Filter out messages and alerts older than 1 minute
            const oneMinuteAgo = Date.now() - 60000;
            state.allMessages = state.allMessages.filter((message) => message.timestamp > oneMinuteAgo);
            state.cheapOrders = state.cheapOrders.filter((alert) => alert.timestamp > oneMinuteAgo);
            state.solidOrders = state.solidOrders.filter((alert) => alert.timestamp > oneMinuteAgo);
            state.bigBiznis = state.bigBiznis.filter((alert) => alert.timestamp > oneMinuteAgo);
        },
        updateMessagesAndAlerts(state, action) {
            const { messages, alerts } = action.payload;
            const now = Date.now();
            const oneMinuteAgo = now - 60000;
            state.allMessages = [
                ...messages,
            ];
            alerts.forEach((alert) => {
                const targetArray = alert.alertMessage === "Cheap order"
                    ? state.cheapOrders
                    : alert.alertMessage === "Solid order"
                        ? state.solidOrders
                        : state.bigBiznis;
                // Clean up expired alerts and add new one
                targetArray.splice(0, targetArray.length, ...targetArray.filter(a => a.timestamp > oneMinuteAgo), alert);
            });
        },
        clearOldAlerts(state) {
            // Clear old alerts and messages older than 1 minute
            const oneMinuteAgo = Date.now() - 60000;
            state.cheapOrders = state.cheapOrders.filter((alert) => alert.timestamp > oneMinuteAgo);
            state.solidOrders = state.solidOrders.filter((alert) => alert.timestamp > oneMinuteAgo);
            state.bigBiznis = state.bigBiznis.filter((alert) => alert.timestamp > oneMinuteAgo);
            state.allMessages = state.allMessages.filter((message) => message.timestamp > oneMinuteAgo);
        },
    },
});
export const { stopStreaming, startStreaming, updateMessagesAndAlerts, clearOldAlerts } = webSocketSlice.actions;
export default webSocketSlice.reducer;
