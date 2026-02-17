import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer.jsx";

const UserLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === "/auth";

  return (
    <main>
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>

      {!hideFooter && <Footer />}
    </main>
  );
};

export default UserLayout;
