import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] mt-20 text-center">
      <h1 className="text-[6rem] sm:text-[8rem] font-extrabold text-primary leading-none">
        404
      </h1>

      <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-gray-800 font-dm-sans">
        Page Not Found
      </h2>

      <p className="mt-2 max-w-md text-gray-500">
        The page you are looking for doesn't exist or has been moved. Please
        check the URL or return to the homepage.
      </p>

      <div className="font-inter mt-6 flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/80 cursor-pointer transition"
        >
          Go Home
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-lg border border-primary text-primary cursor-pointer font-semibold hover:bg-primary hover:text-white transition"
        >
          Go Back
        </button>
      </div>
    </section>
  );
};

export default NotFound;
