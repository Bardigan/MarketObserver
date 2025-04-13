import React from "react";
import "./Button.scss";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, className, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`custom-button ${className || ""}`}
    >
      {children}
    </button>
  );
};

export default Button;