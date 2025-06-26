export interface Order {
    TYPE: string;
    M: string;
    FSYM: string;
    TSYM: string;
    SIDE: number;
    ACTION: number;
    CCSEQ: number;
    P: number;
    Q: number;
    SEQ: number;
    REPORTEDNS: number;
    DELAYNS: number;
    [key: string]: string | number;
}
export interface OrdersFormated {
    Market: string;
    From: string;
    To: string;
    Side: string;
    Action: string;
    Total: string;
    Price: string;
    Quantity: string;
    Sequence: number;
    Reported: string;
    Delay: number;
    Class: string;
    timestamp: number;
    [key: string]: string | number;
}
export type AlertArrayKeys = "cheapOrders" | "solidOrders" | "bigBiznis";
export interface Alert {
    alertMessage: string;
    Price: string;
    Quantity: string;
    Total: string;
    timestamp: number;
    [key: string]: string | number;
}
export interface WebSocketState {
    isStreaming: boolean;
    allMessages: OrdersFormated[];
    cheapOrders: Alert[];
    solidOrders: Alert[];
    bigBiznis: Alert[];
}
