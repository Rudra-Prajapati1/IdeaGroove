import React from "react";
import { useSelector } from "react-redux";

const HeroSection = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <section>
      <div className=" text-primary pt-20 px-16 mt-20 mx-12">
        <h1 className="capitalize text-6xl font-extrabold mb-4">
          Hi {user?.Username || "User"}
        </h1>
        <div>
          <p className="text-xl font-thin italic">
            Welcome to your collective space.
          </p>
          <p className="text-xl font-thin italic mb-8">
            This is your hub to share and grow.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
