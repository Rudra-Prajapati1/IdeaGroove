import { Navigate } from "react-router-dom";

const ProtectAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" state={{ from: "protected" }} replace />;
  }

  return children;
};

export default ProtectAdmin;
