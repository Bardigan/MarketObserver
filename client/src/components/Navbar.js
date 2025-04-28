import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { startStreaming, stopStreaming } from "../store/webSocketSlice";
import { Link, useLocation } from "react-router-dom";
import { useMessageCleanup } from "../hooks/useMessageCleanup";
import Button from "../lib/Button";
import "./Navbar.scss";
const Navbar = () => {
    const dispatch = useDispatch();
    const isStreaming = useSelector((state) => state.webSocket.isStreaming);
    const location = useLocation();
    useMessageCleanup();
    const handleStart = () => {
        dispatch(startStreaming());
    };
    const handleStop = () => {
        dispatch(stopStreaming());
    };
    const links = [
        { to: "/", label: "Monitor" },
        { to: "/alerts", label: "Alerts" },
    ];
    return (_jsxs("div", { className: "navbar", children: [_jsx("nav", { children: links.map((link) => (_jsx(React.Fragment, { children: _jsx(Link, { to: link.to, className: location.pathname === link.to ? "active" : "", children: link.label }) }, link.to))) }), _jsxs("div", { className: "controls", children: [_jsxs(Button, { onClick: handleStart, disabled: isStreaming, className: "start-button", children: ["Start", isStreaming && _jsx("span", { className: "red-dot" })] }), _jsx(Button, { onClick: handleStop, disabled: !isStreaming, children: "Stop" })] })] }));
};
export default Navbar;
