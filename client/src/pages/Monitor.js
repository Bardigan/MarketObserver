import { jsx as _jsx } from "react/jsx-runtime";
import { useSelector } from "react-redux";
import Table from "../lib/Table";
import { monitorHeaders } from "../static/static-values";
import "./Monitor.scss";
const Monitor = () => {
    const allMessages = useSelector((state) => state.webSocket.allMessages);
    return (_jsx("div", { className: "monitor", children: allMessages.length === 0 ? (_jsx("div", { className: "no-messages", children: "No messages received yet." })) : (_jsx(Table, { headers: monitorHeaders, rows: allMessages, className: "orders-table" })) }));
};
export default Monitor;
