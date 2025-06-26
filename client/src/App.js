import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Monitor from "./pages/Monitor";
import Alerts from "./pages/Alerts";
import Navbar from "./components/Navbar";
import WebSocketHandler from "./components/WebSocketHandler";
import store from "./store/store";
import "./App.scss";
const App = () => {
    return (_jsx(Provider, { store: store, children: _jsx(Router, { children: _jsxs("div", { className: "app", children: [_jsx(Navbar, {}), _jsx(WebSocketHandler, {}), _jsx("div", { className: "page-content", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Monitor, {}) }), _jsx(Route, { path: "/alerts", element: _jsx(Alerts, {}) })] }) })] }) }) }));
};
export default App;
