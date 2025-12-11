import React from "react";

const Footer = () => {
  return (
    <footer className="px-10 py-20 bg-[#1D4E1A] mt-20 rounded-t-[5rem] text-white border">
      <div className="max-w-6xl mx-auto grid grid-cols-3 items-center">
        <div className="flex flex-col gap-6 font-dm-sans font-semibold text-center">
          <div>
            <h6 className="border-2 py-2 px-4 rounded-xl w-fit mx-auto">
              QUICK LINKS
            </h6>
          </div>

          <div>
            <h6 className="border-2 py-2 px-4 rounded-xl w-fit mx-auto">
              SOCIALS
            </h6>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-48 h-48 relative flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-[#fff2cc] rounded-xl rotate-45"></div>

            <img
              src="./Logo.png"
              alt="Logo"
              className="h-32 w-32 object-contain z-10"
            />
          </div>
        </div>
        <div className="flex flex-col gap-6 font-dm-sans font-semibold text-center">
          <div>
            <h6 className="border-2 py-2 px-4 rounded-xl w-fit mx-auto">
              FEEDBACKS & COMPLAINTS
            </h6>
          </div>

          <div>
            <h6 className="border-2 py-2 px-4 rounded-xl w-fit mx-auto">
              TERMS & CONDITIONS
            </h6>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
