import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "../lib/Button";
import Table from "../lib/Table";
import { alertsHeaders } from "../static/static-values";
import "./Alerts.scss";
const Alerts = () => {
    const { cheapOrders, solidOrders, bigBiznis } = useSelector((state) => state.webSocket);
    const [selectedTable, setSelectedTable] = useState("cheap-orders");
    const [isMobileView, setIsMobileView] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 975);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    const renderTable = (orders, type) => (_jsx(Table, { headers: alertsHeaders, rows: orders, className: `alerts-table ${type}` }));
    const renderHeaderCounter = (label, count, tableKey, isActive) => {
        const className = `alerts-header-counter ${isActive && isMobileView ? `${tableKey}-active` : ""}`;
        return isMobileView ? (_jsxs(Button, { className: className, onClick: () => setSelectedTable(tableKey), children: [label, " ", count] })) : (_jsxs("div", { className: className, children: [label, " ", count] }));
    };
    const tables = [
        { key: "cheap-orders", label: "Cheap Orders", data: cheapOrders },
        { key: "solid-orders", label: "Solid Orders", data: solidOrders },
        { key: "big-biznis", label: "Big Biznis", data: bigBiznis },
    ];
    return (_jsx("div", { className: "alerts", children: tables.every((table) => table.data.length === 0) ? (_jsx("div", { className: "no-messages", children: "No messages received yet." })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "alerts-headers-counters", children: tables.map((table, i) => _jsx(React.Fragment, { children: renderHeaderCounter(table.label, table.data.length, table.key, selectedTable === table.key) }, i)) }), _jsx("div", { className: "tables-container", children: tables.map((table, i) => (!isMobileView || selectedTable === table.key) &&
                        _jsx(React.Fragment, { children: renderTable(table.data, `${table.key}-table`) }, i)) })] })) }));
};
export default Alerts;
