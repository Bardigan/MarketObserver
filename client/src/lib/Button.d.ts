import React from "react";
import "./Button.scss";
interface ButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
}
declare const Button: React.FC<ButtonProps>;
export default Button;
