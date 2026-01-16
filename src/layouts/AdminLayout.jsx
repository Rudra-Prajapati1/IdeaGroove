import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-primary text-white">
        <Sidebar />
      </aside>

      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
