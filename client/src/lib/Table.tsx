import React from "react";
import "./Table.scss";

interface TableProps<T> {
  headers: string[];
  rows: T[];
  renderRow: (row: T, index: number) => React.ReactNode;
  className?: string;
}

const Table = <T,>({ headers, rows, renderRow, className }: TableProps<T>) => {
  return (
    <div className={`table-container ${className || ""}`}>
      <table className="custom-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => renderRow(row, index))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;