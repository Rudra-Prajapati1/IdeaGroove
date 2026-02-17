import { NavLink } from "react-router-dom";
import { navLinks } from "@/links/navLinks";
import { socialLinks } from "@/links/socialLinks";

const Footer = () => {
  return (
    <footer className="px-6 sm:px-10 py-14 sm:py-20 bg-primary mt-20 rounded-t-[3rem] sm:rounded-t-[5rem] text-white border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-0 items-center">
        {/* QUICK LINKS */}
        <section className="flex flex-col gap-6 font-dm-sans text-center">
          <div>
            <h3 className="border-2 lg:py-2 px-4 rounded-xl w-fit mx-auto">
              QUICK LINKS
            </h3>

            <ul className="flex flex-col text-sm mt-3 font-light">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <NavLink to={link.href} className="hover:underline">
                    {link.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="border-2 lg:py-2 px-4 rounded-xl w-fit mx-auto hover:bg-white hover:text-primary transition-all duration-300">
              <NavLink to="/termsCondition">TERMS & CONDITIONS</NavLink>
            </h3>
          </div>
        </section>

        {/* LOGO */}
        <div className="flex justify-center">
          <div className="w-32 h-32 sm:w-48 sm:h-48 relative flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-secondary rounded-xl rotate-45"></div>

            <img
              src="/Logo.png"
              alt="IdeaGroove Logo"
              className="h-24 w-24 lg:h-32 lg:w-32 object-contain z-10"
            />
          </div>
        </div>

        {/* SOCIAL + POLICIES */}
        <section className="flex flex-col gap-6 font-dm-sans text-center">
          <div>
            <h3 className="border-2 lg:py-2 px-4 rounded-xl w-fit mx-auto">
              SOCIALS
            </h3>

            <ul className="flex flex-col text-sm mt-3 font-light">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 hover:underline"
                    >
                      <Icon className="h-4 w-4" />
                      {link.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="border-2 lg:py-2 px-4 rounded-xl w-fit mx-auto hover:bg-white hover:text-primary transition-all duration-300">
              <NavLink to="/submitComplaint">FEEDBACKS & COMPLAINTS</NavLink>
            </h3>
          </div>

          <div>
            <h3 className="border-2 lg:py-2 px-4 rounded-xl w-fit mx-auto hover:bg-white hover:text-primary transition-all duration-300">
              <NavLink to="/privacyPolicies">PRIVACY POLICIES</NavLink>
            </h3>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
