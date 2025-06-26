import { jsx as _jsx } from "react/jsx-runtime";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import "./main.scss";
const rootElement = document.getElementById("root");
if (rootElement !== null) {
    ReactDOM.createRoot(rootElement).render(_jsx(App, {}));
}
else {
    console.error("Root element not found");
}
