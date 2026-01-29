import React from "react";
import toast from "react-hot-toast";

const ActionButton = ({
  label,
  icon: Icon,
  onClick,
  disabled = false,
  disabledMessage = "Please login to continue",
  className = "",
}) => {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      toast.error(disabledMessage);
      return;
    }

    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2
        bg-green-600 text-white
        shadow-md px-4 py-2 rounded-lg
        font-medium text-sm
        transition-colors
        ${disabled ? "cursor-not-allowed" : "hover:bg-green-700 cursor-pointer"}
        ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
};

export default ActionButton;
