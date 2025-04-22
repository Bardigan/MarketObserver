import { Order } from "../types/types";
export declare const useMessageCleanup: () => void;
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
export declare const stopStreaming: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"webSocket/stopStreaming">, startStreaming: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"webSocket/startStreaming">, updateMessagesAndAlerts: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    messages: Order[];
    alerts: Alert[];
}, "webSocket/updateMessagesAndAlerts">, clearOldAlerts: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"webSocket/clearOldAlerts">;
declare const _default: import("redux").Reducer<WebSocketState>;
export default _default;
