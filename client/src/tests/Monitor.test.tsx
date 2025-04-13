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
import { RootState } from "../store/store";

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

let store: ReturnType<typeof configureStore>;

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
  const AppWrapper = () => (
    <Provider store={store}>
      <MemoryRouter>
        <div>
          <Navbar />
          <Monitor />
        </div>
      </MemoryRouter>
    </Provider>
  );

  it("connects to WebSocket and displays a message in the table", async () => {
    render(<AppWrapper />);

    expect(screen.getByText("No messages received yet.")).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /start/i }));

    await waitFor(() => {
      const state = store.getState() as RootState;
      expect(state.webSocket.isStreaming).toBe(true);
    });

    store.dispatch(
      updateMessagesAndAlerts({
        messages: [mockMessage],
        alerts: [],
      })
    );

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
