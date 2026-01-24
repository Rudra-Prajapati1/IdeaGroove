import { Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import NotFound from "../pages/NotFound";
import AdminNotes from "../pages/admin/AdminNotes";
import AdminEvents from "../pages/admin/AdminEvents";
import AdminGroups from "../pages/admin/AdminGroups";
import AdminQnA from "../pages/admin/AdminQnA";
import AdminComplaints from "../pages/admin/AdminComplaints";
import AdminDash from "../pages/admin/AdminDash";

const AdminRoutes = (
  <>
    <Route index element={<AdminDash />} />
    <Route path="notes" element={<AdminNotes />} />
    <Route path="users" element={<AdminDashboard />} />
    <Route path="events" element={<AdminEvents />} />
    <Route path="groups" element={<AdminGroups />} />
    <Route path="qna" element={<AdminQnA />} />
    <Route path="complaints" element={<AdminComplaints />} />
    
    <Route path="adminDash" element={<AdminDash />} />
    <Route path="*" element={<NotFound />} />
  </>
);

export default AdminRoutes;
