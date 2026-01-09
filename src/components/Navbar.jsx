import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { navLinks } from "../links/navLinks";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";

  const goHome = () => {
    navigate("/");
    window.scrollTo(0, 0);
    setScrolled(false);
    setMenuOpen(false);
  };

  // Scroll logic
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

  // Outside click + ESC close
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
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-sm lg:text-lg font-poppins font-semibold cursor-pointer border p-2 rounded-2xl transition-all duration-200 active:scale-95 hover:shadow-md/30"
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

        <button
          className="text-sm lg:text-lg font-poppins font-semibold border px-4 py-2 rounded-lg
                     hover:shadow-md transition-all"
        >
          Join
        </button>
      </nav>

      {/* Dropdown */}
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
