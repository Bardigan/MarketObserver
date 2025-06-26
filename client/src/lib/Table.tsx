import "./Table.scss";

interface TableProps<T> {
  headers: string[];
  rows: T[];
  className?: string;
}

const Table = <T extends Record<string, string | number | undefined>>({ headers, rows, className }: TableProps<T>) => {
  
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
          {rows.map((row, rowIndex) => (
            <tr className={row.Class ? String(row.Class) : ""} key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={`${rowIndex}-${colIndex}`}>
                  {row[header] !== undefined ? row[header] : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;