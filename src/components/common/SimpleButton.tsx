import React from "react";

interface SimpleButtonProps {
  title: string;
  className?: string;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;  // Add disabled prop
}

const SimpleButton: React.FC<SimpleButtonProps> = ({
  title,
  className = "",
  icon,
  onClick,
  type = "button",
  disabled = false,  // Add default value
}) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center px-4 py-2 rounded hover: transition ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {title}
  </button>
);

export default SimpleButton;