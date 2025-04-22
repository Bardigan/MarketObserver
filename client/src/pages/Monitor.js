import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSelector } from "react-redux";
import Table from "../lib/Table";
import { monitorHeaders } from "../static/static-values";
import "./Monitor.scss";
const Monitor = () => {
    const allMessages = useSelector((state) => state.webSocket.allMessages);
    const getOrderClass = (order) => {
        if (order.P < 50000)
            return "cheap-order";
        if (order.P * order.Q > 1000000)
            return "big-biznis";
        if (order.Q > 10)
            return "solid-order";
        return "";
    };
    const formatReportedNS = (reportedNS) => {
        const date = new Date(reportedNS / 1_000_000);
        return date.toLocaleString();
    };
    const renderRow = (order, index) => (_jsxs("tr", { className: getOrderClass(order), children: [_jsx("td", { children: order.TYPE }), _jsx("td", { children: order.M }), _jsx("td", { children: order.FSYM }), _jsx("td", { children: order.TSYM }), _jsx("td", { children: order.SIDE === 1 ? "Buy" : "Sell" }), _jsx("td", { children: order.ACTION === 1 ? "Add" : "Remove" }), _jsxs("td", { children: ["$", order.P?.toFixed(2)] }), _jsx("td", { children: order.Q?.toFixed(4) }), _jsxs("td", { children: ["$", (order.P * order.Q)?.toFixed(2)] }), _jsx("td", { children: order.SEQ }), _jsx("td", { children: formatReportedNS(order.REPORTEDNS) }), _jsxs("td", { children: [order.DELAYNS, "ns"] })] }, index));
    return (_jsx("div", { className: "monitor", children: allMessages.length === 0 ? (_jsx("div", { className: "no-messages", children: "No messages received yet." })) : (_jsx(Table, { headers: monitorHeaders, rows: allMessages, renderRow: renderRow, className: "orders-table" })) }));
};
export default Monitor;
