import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { navLinks } from "../links/navLinks";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";

  const handleMenuOpen = () => {
    setMenuOpen((prev) => !prev);
  };

  const goHome = () => {
    navigate("/");
    window.scrollTo(0, 0);
    setScrolled(false);
  };

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 120) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

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
        className={`${
          scrolled ? "bg-[#256B22] text-secondary" : "bg-secondary"
        }  rounded-2xl shadow flex justify-around items-center duration-300`}
      >
        <button
          className="text-sm lg:text-lg font-poppins font-semibold cursor-pointer border p-2 rounded-2xl hover:shadow-md/30"
          onClick={handleMenuOpen}
        >
          Menu
        </button>
        <img
          onClick={goHome}
          alt="IdeaGroove Logo with a title text and arrows with a light bub and a stack of books"
          src={`${scrolled ? "./Logo.png" : "./DarkLogo.png"}`}
          className={`h-12 w-12 lg:h-18 lg:w-18 p-1 border lg:border-2 rounded-full object-center transition-all duration-500 cursor-pointer ${
            scrolled
              ? "opacity-100 scale-100"
              : isHome
              ? "opacity-0 scale-50 pointer-events-none"
              : "opacity-100 pointer-events-auto"
          }`}
        />
        <button className="text-sm lg:text-lg font-poppins font-semibold cursor-pointer border p-2 rounded-2xl hover:shadow-md/30">
          Join
        </button>
      </nav>

      {menuOpen && (
        <div
          className={`w-full mt-1 flex max-md:flex-col items-center justify-evenly origin-top ${
            scrolled ? "bg-[#256B22] text-secondary" : "bg-secondary"
          }  animate-dropdown rounded-b-2xl py-3 shadow`}
        >
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
      )}
    </header>
  );
};

export default Navbar;
