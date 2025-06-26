import { jsx as _jsx } from "react/jsx-runtime";
import "./Button.scss";
const Button = ({ onClick, disabled, className, children }) => {
    return (_jsx("button", { onClick: onClick, disabled: disabled, className: `custom-button ${className || ""}`, children: children }));
};
export default Button;
