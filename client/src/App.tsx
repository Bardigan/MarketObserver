import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Monitor from "./pages/Monitor";
import Alerts from "./pages/Alerts";
import Navbar from "./components/Navbar";
import WebSocketHandler from "./components/WebSocketHandler";
import store from "./store/store";
import "./App.scss";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Navbar />
          <WebSocketHandler />
          <div className="page-content">
            <Routes>
              <Route path={"/"} element={<Monitor />} />
              <Route path="/alerts" element={<Alerts />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
};

export default App;

