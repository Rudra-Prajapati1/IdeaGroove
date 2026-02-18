import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../redux/slice/authSlice";

const ProtectAdmin = ({ children }) => {
  const user = useSelector(selectUser);

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" state={{ from: "protected" }} replace />;
  }

  return children;
};

export default ProtectAdmin;
