import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const ShowMore = ({ text = "", path= "/" }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        navigate(path);
      }}
      className="mt-20 flex gap-2 items-center border-3 text-primary border-primary px-2 py-3 font-semibold font-inter rounded-xl hover:scale-105 group cursor-pointer duration-300"
    >
      {text}
      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 duration-300 text-primary" />
    </button>
  );
};

export default ShowMore;
