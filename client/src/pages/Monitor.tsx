import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Table from "../lib/Table";
import { Order } from "../types/types";
import { monitorHeaders } from "../static/static-values";
import "./Monitor.scss";

const Monitor: React.FC = () => {
  const allMessages = useSelector((state: RootState) => state.webSocket.allMessages);

  const getOrderClass = (order: Order) => {
    if (order.P < 50000) return "cheap-order";
    if (order.P * order.Q > 1000000) return "big-biznis";
    if (order.Q > 10) return "solid-order";
    return "";
  };

  const formatReportedNS = (reportedNS: number) => {
    const date = new Date(reportedNS / 1_000_000);
    return date.toLocaleString();
  };

  const renderRow = (order: Order, index: number) => (
    <tr key={index} className={getOrderClass(order)}>
      <td>{order.TYPE}</td>
      <td>{order.M}</td>
      <td>{order.FSYM}</td>
      <td>{order.TSYM}</td>
      <td>{order.SIDE === 1 ? "Buy" : "Sell"}</td>
      <td>{order.ACTION === 1 ? "Add" : "Remove"}</td>
      <td>${order.P?.toFixed(2)}</td>
      <td>{order.Q?.toFixed(4)}</td>
      <td>${(order.P * order.Q)?.toFixed(2)}</td>
      <td>{order.SEQ}</td>
      <td>{formatReportedNS(order.REPORTEDNS)}</td>
      <td>{order.DELAYNS}ns</td>
    </tr>
  );

  return (
    <div className="monitor">
      {allMessages.length === 0 ? (
        <div className="no-messages">No messages received yet.</div>
      ) : (
        <Table
          headers={monitorHeaders}
          rows={allMessages.slice(-500).reverse()}
          renderRow={renderRow}
          className="orders-table"
        />
      )}
    </div>
  );
};

export default Monitor;
