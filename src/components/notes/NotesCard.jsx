import { Download } from "lucide-react";
import React from "react";

const NotesCard = ({ notes }) => {
  return (
    <div className="border-3 text-primary p-4 sm:p-6 rounded-xl font-inter shadow-md hover:shadow-md/20 flex justify-between items-start hover:scale-103 duration-300">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg">{notes.Note_File}</h3>
        <p className="text-xs md:text-sm">{notes.Description}</p>
      </div>
      <button disabled className="cursor-not-allowed">
        <Download className="max-sm:h-4 max-sm:w-4 hover:w-6 hover:h-6 duration-300 hover:-translate-y-1 hover:scale-110" />
      </button>
    </div>
  );
};

export default NotesCard;
