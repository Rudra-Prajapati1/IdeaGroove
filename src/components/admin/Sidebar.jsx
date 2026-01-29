import { NavLink, useNavigate } from "react-router-dom";
import { sidebarLinks } from "../../links/sidebarLinks";
import toast from "react-hot-toast";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleAction = async (e, link) => {
    if (link.title === "Logout") {
      e.preventDefault(); // Stop the NavLink from navigating

      try {
        // 1. Call the Backend Logout Route
        // We use await to ensure the server session is cleared first
        await axios.post(
          "http://localhost:8080/api/admin/logout",
          {},
          { withCredentials: true }, // Required to send the session cookie
        );

        // 2. Clear Frontend Session
        localStorage.removeItem("user"); // Ensure this matches your Login.jsx key

        // 3. UI Feedback
        toast.success("Logged out successfully");

        // 4. Redirect to Login
        navigate("/admin/login", { replace: true });
      } catch (error) {
        console.error("Logout Error:", error);
        // Even if the backend fails, we usually clear local data for safety
        localStorage.removeItem("user");
        navigate("/admin/login", { replace: true });
        toast.error("Session ended, but there was a server error.");
      }
    }
  };

  return (
    <aside className="h-full flex flex-col bg-primary text-white">
      <div className="flex flex-col p-6 gap-2 items-center border-b border-white/10">
        <img src="/Logo.png" alt="IdeaGroove Logo" className="w-20" />
        <h2 className="text-xl font-poppins font-bold">Admin Panel</h2>
      </div>

      <nav className="flex flex-col mt-6 gap-2 px-3">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.id}
              to={link.to}
              end={link.to === "/admin"}
              onClick={(e) => handleAction(e, link)} // Added click handler
              className={({ isActive }) =>
                `
                group relative flex items-center gap-3 px-4 py-3 rounded-r-xl transition-all duration-300 ${
                  isActive && link.title !== "Logout"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }
              `
              }
            >
              <span
                className={`absolute left-0 top-0 h-full w-1 rounded-r transition-all duration-300 ${
                  link.to === window.location.pathname &&
                  link.title !== "Logout"
                    ? "bg-secondary"
                    : "bg-transparent group-hover:bg-secondary/60"
                }`}
              />
              <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm tracking-wide">{link.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
