import React from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../links/navLinks";
import { socialLinks } from "../links/socialLinks";

const Footer = () => {
  return (
    <footer className="px-6 sm:px-10 py-14 sm:py-20 bg-primary mt-20 rounded-t-[3rem] sm:rounded-t-[5rem] text-white border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-0 items-center">
        <div className="flex flex-col gap-6 font-dm-sans lg:font-semibold text-center">
          <div>
            <h6 className="border-2 lg:py-2 px-4 rounded-xl w-fit mx-auto">
              QUICK LINKS
            </h6>

            <ul className="flex flex-col text-sm mt-3 font-light">
              {navLinks.map((link) => (
                <Link key={link.id} to={link.href} className="hover:underline">
                  {link.title}
                </Link>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="border-2 lg:py-2 px-4 rounded-xl w-fit mx-auto">
              FEEDBACKS & COMPLAINTS
            </h6>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-32 h-32 sm:w-48 sm:h-48 relative flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-secondary rounded-xl rotate-45"></div>

            <img
              src="./Logo.png"
              alt="Logo"
              className="h-24 w-24 lg:h-32 lg:w-32 object-contain z-10"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 font-dm-sans font-semibold text-center">
          <div>
            <h6 className="border-2 lg:py-2 px-4 rounded-xl w-fit mx-auto">
              SOCIALS
            </h6>
            <ul className="flex flex-col text-sm mt-3 font-light">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.id}
                    to={link.href}
                    className="flex items-center justify-center gap-2 hover:underline"
                  >
                    <Icon className="h-4 w-4" />
                    {link.title}
                  </Link>
                );
              })}
            </ul>
          </div>

          <div>
            <Link to="/termsCondition">
              <h6 className="border-2 lg:py-2 px-4 rounded-xl w-fit mx-auto hover:bg-white hover:text-primary transition-all duration-300 cursor-pointer">
                TERMS & CONDITIONS
              </h6>
            </Link>
          </div>

          <div>
            <Link to="/privacyPolicies">
              <h6 className="border-2 lg:py-2 px-4 rounded-xl w-fit mx-auto hover:bg-white hover:text-primary transition-all duration-300 cursor-pointer">
                PRIVACY POLICIES
              </h6>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
