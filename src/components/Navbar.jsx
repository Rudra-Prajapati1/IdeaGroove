import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../links/navLinks";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[40%] z-50">
      <nav className="bg-[#fff2cc] rounded-2xl shadow flex justify-around items-center">
        <button
          className="text-lg font-poppins font-semibold cursor-pointer border p-2 rounded-2xl hover:shadow-md"
          onClick={handleMenuOpen}
        >
          Menu
        </button>
        <img
          alt="IdeaGroove Logo with a title text and arrows with a light bub and a stack of books"
          src="./DarkLogo.png"
          className={`h-20 w-20 p-1 border-2 rounded-full transition-all duration-500 ${
            scrolled ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        />
        <button className="text-lg font-poppins font-semibold cursor-pointer border p-2 rounded-2xl hover:shadow-md">
          Join
        </button>
      </nav>

      {menuOpen && (
        <div className="w-full mt-1 flex justify-evenly origin-top bg-[#fff2cc] animate-dropdown rounded-b-2xl py-3 shadow">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              className="font-poppins text-lg hover:underline"
            >
              {link.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
