import React from "react";
import { AlertTriangle } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { selectIsAuthenticated } from "../redux/slice/authSlice";

const ComplaintButton = ({ onClick, className = "", element = "" }) => {
  const isAuth = useSelector(selectIsAuthenticated);

  const handleClick = (e) => {
    e.stopPropagation();

    if (!isAuth) {
      toast.error(`Please login to report this ${element}`);
      return;
    }

    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 bg-red-400 hover:bg-red-500 text-white backdrop-blur-md rounded-full transition-all duration-300 ${className} ${isAuth ? "cursor-pointer" : "cursor-not-allowed"}`}
      title="Report"
    >
      <AlertTriangle className="w-4 h-4" />
    </button>
  );
};

export default ComplaintButton;
