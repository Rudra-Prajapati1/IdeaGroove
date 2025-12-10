import React from "react";

const Title = ({ text }) => {
  return (
    <h2 className="text-3xl font-bold font-dm-sans border-5 border-[#1D4E1A] text-[#1D4E1A] w-[70%] text-center m-10 py-4 rounded-2xl">
      {text.toUpperCase()}
    </h2>
  );
};

export default Title;
