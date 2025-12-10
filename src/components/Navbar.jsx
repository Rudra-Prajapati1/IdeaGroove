import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { navLinks } from "../links/navLinks";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };

  const goHome = () => {
    navigate("/");
    window.scrollTo(0, 0);
    setScrolled(false);
  };

  //function to make the logo transition on scroll
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

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[40%] z-50">
      <nav className="bg-[#fff2cc] rounded-2xl shadow flex justify-around items-center">
        <button
          className="text-lg font-poppins font-semibold cursor-pointer border p-2 rounded-2xl hover:shadow-md/50"
          onClick={handleMenuOpen}
        >
          Menu
        </button>
        <img
          onClick={goHome}
          alt="IdeaGroove Logo with a title text and arrows with a light bub and a stack of books"
          src="./DarkLogo.png"
          className={`h-20 w-20 p-1 border-2 rounded-full transition-all duration-500 cursor-pointer ${
            scrolled
              ? "opacity-100 scale-100"
              : isHome
              ? "opacity-0 scale-50 pointer-events-none"
              : "opacity-100 pointer-events-auto"
          }`}
        />
        <button className="text-lg font-poppins font-semibold cursor-pointer border p-2 rounded-2xl hover:shadow-md/50">
          Join
        </button>
      </nav>

      {menuOpen && (
        <div className="w-full mt-1 flex justify-evenly origin-top bg-[#fff2cc] animate-dropdown rounded-b-2xl py-3 shadow">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.href}
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
