import { Loader } from "lucide-react";
import React from "react";

const Loading = ({ text }) => {
  return (
    <div className="flex gap-3 text-primary font-bold animate-pulse font-JetBrains my-30">
      <Loader className="animate-spin" />
      {text}
    </div>
  );
};

export default Loading;
