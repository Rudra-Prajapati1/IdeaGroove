import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { navLinks } from "../links/navLinks";
import { logout } from "../redux/slice/authSlice";
import { UserCircle, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navRef = useRef(null);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";
  const isLogin = location.pathname === "/auth";

  const goHome = () => {
    navigate("/");
    window.scrollTo(0, 0);
    setScrolled(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state & LocalStorage
    setProfileOpen(false);
    toast.success("Logged out successfully!");
    navigate("/"); // Redirect to home
  };

  useEffect(() => {
    if (isHome) {
      const handleScroll = () => {
        setScrolled(window.scrollY > 120);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    if (isLogin) {
      setScrolled(false);
      return;
    }

    setScrolled(true);
  }, [isHome, isLogin]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[80%] lg:w-[40%] z-50">
      <nav
        ref={navRef}
        className={`
          ${scrolled ? "bg-[#256B22] text-secondary" : "bg-secondary"}
          ${menuOpen ? "rounded-t-2xl" : "rounded-2xl"}
          shadow flex justify-around items-center px-2 py-1 transition-all duration-300
        `}
      >
        <button
          onClick={() => {
            setMenuOpen((prev) => !prev);
            setProfileOpen(false);
          }}
          className="text-sm lg:text-lg font-poppins font-semibold cursor-pointer border p-2 rounded-lg transition-all duration-200 active:scale-95 hover:shadow-md"
        >
          Menu
        </button>

        <img
          onClick={goHome}
          src={scrolled ? "./Logo.png" : "./DarkLogo.png"}
          alt="IdeaGroove Logo"
          className={`h-12 w-12 lg:h-18 lg:w-18 p-1 border rounded-full cursor-pointer
            transition-all duration-500
            ${
              scrolled
                ? "opacity-100 scale-100"
                : isHome
                ? "opacity-0 scale-50 pointer-events-none"
                : "opacity-100"
            }
          `}
        />

        {isAuthenticated ? (
          <div className="relative">
            {/* Profile Button */}
            <button
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm lg:text-lg font-poppins font-semibold border px-3 py-2 rounded-lg hover:shadow-md transition-all cursor-pointer"
            >
              {/* <User className="w-5 h-5" /> */}
              <span className="hidden sm:inline">Profile</span>
              {/* <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              /> */}
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="absolute top-[120%] right-0 w-48 bg-white text-black rounded-xl shadow-xl overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200 border border-gray-100">
                {/* User Info Header */}
                {/* <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="font-semibold text-sm truncate">
                    {user?.Username || "User"}
                  </p>
                </div> */}

                {/* Option 1: My Profile */}
                <button
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
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-green-50 hover:text-[#256B22] transition-colors text-left"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Dashboard
                </button>

                {/* Option 2: Logout */}
                <button
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
          /* Join Button (Shown when NOT logged in) */
          <button
            className="text-sm lg:text-lg font-poppins font-semibold border px-4 py-2 rounded-lg hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate("/auth")}
          >
            Join
          </button>
        )}
      </nav>

      <div
        className={`
          ${scrolled ? "bg-[#256B22] text-secondary" : "bg-secondary"}
          overflow-hidden transition-all duration-300 origin-top
          ${
            menuOpen
              ? "max-h-96 scale-y-100 opacity-100"
              : "max-h-0 scale-y-95 opacity-0"
          }
          rounded-b-2xl shadow mt-1
        `}
      >
        <div className="flex max-md:flex-col items-center justify-evenly py-3 gap-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-poppins text-lg hover:underline"
            >
              {link.title}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
