import { Route, Routes, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import {
  fetchDegreeSubject,
  selectDegreeSubjectStatus,
} from "../src/redux/slice/degreeSubjectSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  restoreSession,
  selectAuthSessionChecked,
  selectUser,
} from "./redux/slice/authSlice";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectAdmin from "./routes/ProtectAdmin";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/admin/Login";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

const App = () => {
  const dispatch = useDispatch();
  const degreeStatus = useSelector(selectDegreeSubjectStatus);
  const currentUser = useSelector(selectUser);
  const authSessionChecked = useSelector(selectAuthSessionChecked);

  useEffect(() => {
    if (degreeStatus === "idle") {
      dispatch(fetchDegreeSubject());
    }
  }, [degreeStatus, dispatch]);

  useEffect(() => {
    if (!authSessionChecked && currentUser?.role !== "admin") {
      dispatch(restoreSession());
    }
  }, [currentUser, authSessionChecked, dispatch]);

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<UserLayout />}>
          {UserRoutes}
        </Route>

        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin/*"
          element={
            <ProtectAdmin>
              <AdminLayout />
            </ProtectAdmin>
          }
        >
          {AdminRoutes}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
