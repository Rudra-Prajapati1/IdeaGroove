import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import UserRoutes from "./routes/UserRoutes";
import ProtectAdmin from "./routes/ProtectAdmin";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/admin/Login";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
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
    </Routes>
  );
};

export default App;
