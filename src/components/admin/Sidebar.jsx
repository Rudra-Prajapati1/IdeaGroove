import { NavLink } from "react-router-dom";
import { sidebarLinks } from "../../links/sidebarLinks";

const Sidebar = () => {
  return (
    <aside className="h-full flex flex-col bg-primary text-white">
      <div className="flex flex-col p-6 gap-2 items-center border-b border-white/10">
        <img src="./Logo.png" alt="IdeaGroove Logo" className="w-20" />
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
              className={({ isActive }) =>
                `
                group relative flex items-center gap-3 px-4 py-3 rounded-r-xl
                transition-all duration-300
                ${
                  isActive
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }
              `
              }
            >
              <span
                className={`
                  absolute left-0 top-0 h-full w-1 rounded-r
                  transition-all duration-300
                  ${
                    link.to === window.location.pathname
                      ? "bg-secondary"
                      : "bg-transparent group-hover:bg-secondary/60"
                  }
                `}
              />
              <Icon
                className={`
                  w-5 h-5 transition-transform duration-300
                  group-hover:scale-110
                `}
              />
              <span className="text-sm tracking-wide">{link.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
