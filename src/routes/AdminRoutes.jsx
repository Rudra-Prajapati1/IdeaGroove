import { Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import NotFound from "../pages/NotFound";
import AdminNotes from "../pages/admin/AdminNotes";
import AdminEvents from "../pages/admin/AdminEvents";
import AdminGroups from "../pages/admin/AdminGroups";
import AdminQnA from "../pages/admin/AdminQnA";
import AdminComplaints from "../pages/admin/AdminComplaints";

const AdminRoutes = (
  <>
    <Route index element={<AdminDashboard />} />
    <Route path="notes" element={<AdminNotes />} />
    <Route path="events" element={<AdminEvents />} />
    <Route path="groups" element={<AdminGroups />} />
    <Route path="qna" element={<AdminQnA />} />
    <Route path="complaints" element={<AdminComplaints />} />
    <Route path="*" element={<NotFound />} />
  </>
);

export default AdminRoutes;
