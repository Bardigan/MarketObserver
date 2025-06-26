import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./Table.scss";
const Table = ({ headers, rows, className }) => {
    return (_jsx("div", { className: `table-container ${className || ""}`, children: _jsxs("table", { className: "custom-table", children: [_jsx("thead", { children: _jsx("tr", { children: headers.map((header, index) => (_jsx("th", { children: header }, index))) }) }), _jsx("tbody", { children: rows.map((row, rowIndex) => (_jsx("tr", { className: row.Class ? String(row.Class) : "", children: headers.map((header, colIndex) => (_jsx("td", { children: row[header] !== undefined ? row[header] : '' }, `${rowIndex}-${colIndex}`))) }, rowIndex))) })] }) }));
};
export default Table;
