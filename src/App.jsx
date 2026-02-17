import { Route, Routes, useLocation } from "react-router-dom";
import React, { useEffect } from "react";

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
