import React, { useState } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../links/navLinks";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[40%] z-50">
      <nav className="bg-[#fff2cc] rounded-2xl shadow flex justify-around items-center">
        <button
          className="text-lg font-poppins cursor-pointer border p-2 rounded-2xl hover:shadow-md"
          onClick={handleMenuOpen}
        >
          Menu
        </button>
        <img
          alt="Logo"
          src="./DarkLogo.png"
          className="h-20 w-20 p-1 border-2 rounded-full"
        />
        <button className="text-lg font-poppins cursor-pointer border p-2 rounded-2xl hover:shadow-md">
          Login/Signup
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
