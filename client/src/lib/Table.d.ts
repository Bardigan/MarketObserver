import "./Table.scss";
interface TableProps<T> {
    headers: string[];
    rows: T[];
    className?: string;
}
declare const Table: <T extends Record<string, any>>({ headers, rows, className }: TableProps<T>) => import("react/jsx-runtime").JSX.Element;
export default Table;
