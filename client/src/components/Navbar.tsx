import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { startStreaming, stopStreaming } from "../store/webSocketSlice";
import { Link, useLocation } from "react-router-dom";
import Button from "../lib/Button";
import "./Navbar.scss";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const isStreaming = useSelector((state: RootState) => state.webSocket.isStreaming);
  const location = useLocation();

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

  return (
    <div className="navbar">
      <nav>
        {links.map((link) => (
          <React.Fragment key={link.to}>
            <Link
              to={link.to}
              className={location.pathname === link.to ? "active" : ""}
            >
              {link.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>
      <div className="controls">
        <Button onClick={handleStart} disabled={isStreaming} className="start-button">
          Start
          {isStreaming && <span className="red-dot"></span>}
        </Button>
        <Button onClick={handleStop} disabled={!isStreaming}>
          Stop
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
