import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stopStreaming, updateMessagesAndAlerts, clearOldAlerts, } from "../store/webSocketSlice";
const WebSocketHandler = () => {
    const dispatch = useDispatch();
    const isStreaming = useSelector((state) => state.webSocket.isStreaming);
    const wsRef = useRef(null);
    const cleanupIntervalRef = useRef(null);
    const messagesBufferRef = useRef([]);
    const alertsBufferRef = useRef([]);
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
        const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${apiKey}`);
        wsRef.current = socket;
        socket.onopen = () => {
            socket.send(JSON.stringify({
                action: "SubAdd",
                subs: ["8~Binance~BTC~USDT"],
            }));
        };
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const formatReportedNS = (reportedNS) => {
                const date = new Date(reportedNS / 1_000_000);
                return date.toLocaleString();
            };
            const getOrderClass = (order) => {
                if (order.P < 50000)
                    return "cheap-order";
                if (order.P * order.Q > 1000000)
                    return "big-biznis";
                if (order.Q > 10)
                    return "solid-order";
                return "";
            };
            if (data.TYPE === "8") {
                const timestamp = (data.REPORTEDNS ?? 0) / 1_000_000;
                messagesBufferRef.current.push({
                    Market: data.M,
                    Reported: formatReportedNS(data.REPORTEDNS),
                    Delay: data.DELAYNS,
                    From: data.FSYM,
                    To: data.TSYM,
                    Side: data.SIDE === 1 ? "Buy" : "Sell",
                    Action: data.ACTION === 1 ? "Add" : "Remove",
                    Price: `$${data.P?.toFixed(2)}`,
                    Quantity: data.Q?.toFixed(4),
                    Total: `$${(data.P * data.Q)?.toFixed(2)}`,
                    Sequence: data.SEQ,
                    Class: getOrderClass(data),
                    timestamp,
                });
                let alert = null;
                const alertCoreData = {
                    Price: `$${data.P?.toFixed(2)}`,
                    Quantity: data.Q?.toFixed(4),
                    Total: `$${(data.P * data.Q)?.toFixed(2)}`,
                    timestamp
                };
                if (data.P < 50000) {
                    alert = {
                        ...alertCoreData,
                        alertMessage: "Cheap order",
                    };
                }
                else if ((data.P * data.Q) > 1000000) {
                    alert = {
                        ...alertCoreData,
                        alertMessage: "Big biznis here",
                    };
                }
                else if (data.Q > 10) {
                    alert = {
                        ...alertCoreData,
                        alertMessage: "Solid order",
                    };
                }
                if (alert) {
                    alertsBufferRef.current.push(alert);
                }
                if (messagesBufferRef.current.length >= 500) {
                    dispatch(updateMessagesAndAlerts({
                        messages: [...messagesBufferRef.current],
                        alerts: [...alertsBufferRef.current],
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
            if (messagesBufferRef.current.length > 0) {
                dispatch(updateMessagesAndAlerts({
                    messages: [...messagesBufferRef.current],
                    alerts: [...alertsBufferRef.current],
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
