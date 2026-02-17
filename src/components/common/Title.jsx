import React from "react";

const Title = ({ text }) => {
  return (
    <h2 className="text-xl lg:text-3xl font-bold font-dm-sans border-5 border-primary text-primary w-full lg:w-[70%] text-center m-10 py-2 lg:py-4 rounded-2xl">
      {text.toUpperCase()}
    </h2>
  );
};

export default Title;
