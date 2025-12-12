import { ArrowRight } from "lucide-react";
import React from "react";

const ShowMore = ({ text = "" }) => {
  return (
    <button
      type="button"
      className="mt-20 flex gap-2 items-center border-3 text-primary border-primary px-2 py-3 font-semibold font-inter rounded-xl hover:scale-105 group cursor-pointer duration-300"
    >
      {text}
      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 duration-300 text-primary" />
    </button>
  );
};

export default ShowMore;
