import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Table from "../lib/Table";
import { monitorHeaders } from "../static/static-values";
import "./Monitor.scss";

const Monitor: React.FC = () => {
  const allMessages = useSelector((state: RootState) => state.webSocket.allMessages);

  return (
    <div className="monitor">
      {allMessages.length === 0 ? (
        <div className="no-messages">No messages received yet.</div>
      ) : (
        <Table
          headers={monitorHeaders}
          rows={allMessages}
          className="orders-table"
        />
      )}
    </div>
  );
};

export default Monitor;
