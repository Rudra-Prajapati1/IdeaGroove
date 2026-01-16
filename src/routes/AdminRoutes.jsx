import { Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AdminRoutes = (
  <>
    <Route path="/dashboard" element={<AdminDashboard />} />
    <Route path="*" element={<NotFound />} />
  </>
);

export default AdminRoutes;
