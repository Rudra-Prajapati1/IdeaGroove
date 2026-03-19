import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden md:h-screen md:flex-row">
      <aside className="w-full bg-primary text-white md:w-64 md:shrink-0">
        <Sidebar />
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
