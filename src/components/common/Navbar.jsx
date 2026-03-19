import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { navLinks } from "@/links/navLinks";
import { logout } from "@/redux/slice/authSlice";
import { UserCircle, LogOut, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";
import useClickOutside from "@/hooks/useClickOutside.jsx";
import { selectIsAuthenticated } from "../../redux/slice/authSlice";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navRef = useRef(null);
  const profileRef = useRef(null);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";

  useClickOutside(profileRef, () => setProfileOpen(false));
  useClickOutside(navRef, () => {
    setMenuOpen(false);
    setProfileOpen(false);
  });

  const filteredNavLinks = useMemo(() => {
    return navLinks.filter((link) => !link.requiresAuth || isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <header
      ref={navRef}
      className="fixed top-5 left-1/2 -translate-x-1/2 w-[80%] lg:w-[40%] z-50"
    >
      <nav
        aria-label="Main Navigation"
        className={`${
          scrolled ? "bg-[#256B22] text-secondary" : "bg-secondary"
        } ${
          menuOpen ? "rounded-t-2xl" : "rounded-2xl"
        } shadow flex justify-around items-center px-2 py-1 transition-all duration-300`}
      >
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => {
            setMenuOpen((prev) => !prev);
            setProfileOpen(false);
          }}
          className="text-sm lg:text-lg font-poppins font-semibold border p-2 rounded-lg transition-all duration-200 active:scale-95 hover:shadow-md"
        >
          Menu
        </button>

        <NavLink to="/" aria-label="Go to homepage">
          <img
            src={scrolled ? "/Logo.png" : "/DarkLogo.png"}
            alt="IdeaGroove Logo"
            className={`h-12 w-12 lg:h-18 lg:w-18 p-1 border border-secondary rounded-full transition-all duration-500 ${
              scrolled
                ? "opacity-100 scale-100"
                : isHome
                  ? "opacity-0 scale-50 pointer-events-none"
                  : "opacity-100"
            }`}
          />
        </NavLink>

        {isAuthenticated ? (
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm lg:text-lg font-poppins font-semibold border px-3 py-2 rounded-lg hover:shadow-md transition-all"
            >
              <span className="hidden sm:inline">Profile</span>
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute top-[120%] right-0 w-48 bg-white text-black rounded-xl shadow-xl overflow-hidden flex flex-col z-50 border border-gray-100"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate("/profile");
                    setProfileOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-green-50 hover:text-[#256B22] transition-colors text-left"
                >
                  <UserCircle className="w-4 h-4" />
                  My Profile
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-green-50 hover:text-[#256B22] transition-colors text-left"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Dashboard
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-red-50 hover:text-red-600 transition-colors text-left border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/auth")}
            className="text-sm lg:text-lg font-poppins font-semibold border px-4 py-2 rounded-lg hover:shadow-md transition-all"
          >
            Join
          </button>
        )}
      </nav>

      <div
        id="mobile-menu"
        className={`${
          scrolled ? "bg-[#256B22] text-secondary" : "bg-secondary"
        } overflow-hidden transition-all duration-300 origin-top ${
          menuOpen
            ? "max-h-96 scale-y-100 opacity-100"
            : "max-h-0 scale-y-95 opacity-0"
        } rounded-b-2xl shadow mt-1`}
      >
        <ul className="flex max-md:flex-col items-center justify-evenly py-3 gap-3">
          {filteredNavLinks.map((link) => (
            <li key={link.id}>
              <NavLink
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-poppins text-lg hover:underline"
              >
                {link.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
