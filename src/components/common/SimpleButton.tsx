import React from "react";

interface SimpleButtonProps {
  title: string;
  className?: string;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

const SimpleButton: React.FC<SimpleButtonProps> = ({
  title,
  className = "",
  icon,
  onClick,
  type = "button",
}) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${className}`}
    onClick={onClick}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {title}
  </button>
);

export default SimpleButton;