import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Button from "../lib/Button";
import Table from "../lib/Table";
import { alertsHeaders } from "../static/static-values";
import "./Alerts.scss";

const Alerts: React.FC = () => {
  const { cheapOrders, solidOrders, bigBiznis } = useSelector(
    (state: RootState) => state.webSocket
  );

  const [selectedTable, setSelectedTable] = useState<string>("cheap-orders");
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

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

  const renderTable = (orders: typeof cheapOrders, type: string) => (
    <Table
      headers={alertsHeaders}
      rows={orders}
      renderRow={(alert, index) => (
        <tr key={index}>
          <td>${alert.price.toFixed(2)}</td>
          <td>{alert.quantity.toFixed(4)}</td>
          <td>${alert.total.toFixed(2)}</td>
        </tr>
      )}
      className={`alerts-table ${type}`}
    />
  );

  const renderHeaderCounter = (
    label: string,
    count: number,
    tableKey: string,
    isActive: boolean
  ) => {
    const className = `alerts-header-counter ${isActive && isMobileView ? `${tableKey}-active` : ""}`;
    return isMobileView ? (
      <Button className={className} onClick={() => setSelectedTable(tableKey)}>
        {label} {count}
      </Button>
    ) : (
      <div className={className}>
        {label} {count}
      </div>
    );
  };

  const tables = [
    { key: "cheap-orders", label: "Cheap Orders", data: cheapOrders },
    { key: "solid-orders", label: "Solid Orders", data: solidOrders },
    { key: "big-biznis", label: "Big Biznis", data: bigBiznis },
  ];

  return (
    <div className="alerts">
      {tables.every((table) => table.data.length === 0) ? (
        <div className="no-messages">No messages received yet.</div>
      ) : (
        <>
          <div className="alerts-headers-counters">
          {tables.map((table, i) =>
            <React.Fragment key={i}>
              {renderHeaderCounter(
                table.label,
                table.data.length,
                table.key,
                selectedTable === table.key
              )}
            </React.Fragment>
          )}
          </div>
          <div className="tables-container">
            {tables.map(
              (table, i) =>
                (!isMobileView || selectedTable === table.key) &&
                <React.Fragment key={i}>
                  {renderTable(table.data, `${table.key}-table`)}
                </React.Fragment>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Alerts;
