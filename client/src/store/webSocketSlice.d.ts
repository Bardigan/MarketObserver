import { OrdersFormated, Alert, WebSocketState } from "../types/types";
export declare const stopStreaming: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"webSocket/stopStreaming">, startStreaming: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"webSocket/startStreaming">, updateMessagesAndAlerts: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    messages: OrdersFormated[];
    alerts: Alert[];
}, "webSocket/updateMessagesAndAlerts">, clearOldAlerts: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"webSocket/clearOldAlerts">;
declare const _default: import("redux").Reducer<WebSocketState>;
export default _default;
