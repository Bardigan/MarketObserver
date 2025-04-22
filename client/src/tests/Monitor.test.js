import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Monitor from "../pages/Monitor";
import Navbar from "../components/Navbar";
import { updateMessagesAndAlerts } from "../store/webSocketSlice";
import { configureStore } from "@reduxjs/toolkit";
import webSocketSlice from "../store/webSocketSlice";
const mockMessage = {
    TYPE: "8",
    M: "Binance",
    FSYM: "BTC",
    TSYM: "USDT",
    SIDE: 1,
    ACTION: 1,
    P: 40000,
    Q: 5,
    SEQ: 12345,
    REPORTEDNS: Date.now() * 1_000_000,
    DELAYNS: 1000,
    CCSEQ: 67890,
};
const formattedMockMessage = {
    Market: mockMessage.M,
    From: mockMessage.FSYM,
    To: mockMessage.TSYM,
    Side: mockMessage.SIDE === 1 ? "Buy" : "Sell",
    Action: mockMessage.ACTION === 1 ? "Add" : "Remove",
    Price: `$${mockMessage.P?.toFixed(2)}`,
    Quantity: mockMessage.Q.toFixed(4),
    Total: `$${(mockMessage.P * mockMessage.Q)?.toFixed(2)}`,
    Sequence: mockMessage.SEQ,
    Reported: new Date(mockMessage.REPORTEDNS / 1_000_000).toLocaleString(),
    Delay: mockMessage.DELAYNS,
    Class: mockMessage.P < 50000 ? "cheap-order" : "",
    timestamp: mockMessage.REPORTEDNS / 1_000_000,
};
let store;
beforeEach(() => {
    store = configureStore({
        reducer: {
            webSocket: webSocketSlice,
        },
        preloadedState: {
            webSocket: {
                isStreaming: false,
                allMessages: [],
                cheapOrders: [],
                solidOrders: [],
                bigBiznis: [],
            },
        },
    });
});
describe("Monitor Component", () => {
    const AppWrapper = () => (_jsx(Provider, { store: store, children: _jsx(MemoryRouter, { children: _jsxs("div", { children: [_jsx(Navbar, {}), _jsx(Monitor, {})] }) }) }));
    it("connects to WebSocket and displays a message in the table", async () => {
        render(_jsx(AppWrapper, {}));
        expect(screen.getByText("No messages received yet.")).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: /start/i }));
        await waitFor(() => {
            const state = store.getState();
            expect(state.webSocket.isStreaming).toBe(true);
        });
        store.dispatch(updateMessagesAndAlerts({
            messages: [formattedMockMessage],
            alerts: [],
        }));
        await waitFor(() => {
            expect(screen.getByText("Binance")).toBeInTheDocument();
        });
        expect(screen.getByText("BTC")).toBeInTheDocument();
        expect(screen.getByText("USDT")).toBeInTheDocument();
        expect(screen.getByText("Buy")).toBeInTheDocument();
        expect(screen.getByText("Add")).toBeInTheDocument();
        expect(screen.getByText("$40000.00")).toBeInTheDocument();
        expect(screen.getByText("5.0000")).toBeInTheDocument();
        expect(screen.getByText("$200000.00")).toBeInTheDocument();
        expect(screen.getByText("12345")).toBeInTheDocument();
    });
});
