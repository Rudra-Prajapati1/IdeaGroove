import React from "react";
import { useSelector } from "react-redux";

const HeroSection = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(useSelector((state) => state.auth));

  return (
    <section className="relative bg-[#1B431C] min-h-[500px] flex flex-col justify-center">
      <div className="flex justify-between items-center">
        <div className="text-white px-16 mx-12 z-10">
          {/* Changed text-primary to text-white for better contrast on green */}

          <h1 className="capitalize text-6xl font-extrabold mb-4 leading-tight">
            Hi, {user?.Name || "User"}
          </h1>

          <div>
            <p className="text-xl font-light italic opacity-90">
              Welcome to your collective space.
            </p>
            <p className="text-xl font-light italic mb-8 opacity-90">
              This is your hub to share and grow.
            </p>
          </div>
        </div>
        <div className="px-16 mx-20 z-10">
          <img
            src={user?.Profile_Pic}
            alt=""
            className="w-60 h-60 rounded-full"
          />
        </div>
      </div>
      {/* Wave SVG */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg
          viewBox="0 0 1440 320"
          className="block w-full h-[120px] sm:h-[150px]"
          preserveAspectRatio="none"
        >
          {/* Updated Path for a smoother wave 
             Fill matches your Home page background (#FFFBEB)
          */}
          <path
            fill="#FFFBEB"
            fillOpacity="1"
            d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,149.3C672,139,768,149,864,170.7C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
