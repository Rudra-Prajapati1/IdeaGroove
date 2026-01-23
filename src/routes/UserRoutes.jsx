import { Route } from "react-router-dom";
import Home from "../pages/Home";
import Events from "../pages/Events";
import Chats from "../pages/Chats";
import Groups from "../pages/Groups";
import Notes from "../pages/Notes";
import QnA from "../pages/QnA";
import Dashboard from "../pages/Dashboard";
import Auth from "../pages/Auth";
import ProfileInformation from "../pages/Profile";
import ComplaintDashboard from "../pages/ComplaintDashboard";
import SubmitComplaint from "../pages/SubmitComplaint";
import Searchpage from "../pages/Searchpage";
import NotFound from "../pages/NotFound";
import ResetPassword from "../pages/ResetPassword";

const UserRoutes = (
  <>
    <Route index element={<Home />} />
    <Route path="events" element={<Events />} />
    <Route path="chats" element={<Chats />} />
    <Route path="groups" element={<Groups />} />
    <Route path="notes" element={<Notes />} />
    <Route path="qna" element={<QnA />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="auth" element={<Auth />} />
    <Route path="profile" element={<ProfileInformation />} />
    <Route path="complaintDashboard" element={<ComplaintDashboard />} />
    <Route path="submitComplaint/:type?/:id?" element={<SubmitComplaint />} />
    <Route path="search" element={<Searchpage />} />
    <Route path="resetPassword" element={<ResetPassword />} />
    <Route path="*" element={<NotFound />} />
  </>
);

export default UserRoutes;
