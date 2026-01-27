import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectAdmin;
