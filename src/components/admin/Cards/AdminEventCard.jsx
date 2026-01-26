import React from "react";
import { Ban, CheckCircle, CalendarDays, User, Clock } from "lucide-react";

const AdminEventCard = ({ event, onModerate }) => {
  // Mapping DD status: Is_Active (BOOLEAN)
  const isActive = event.status === "active";

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col border-l-4 ${!isActive ? "border-l-red-500" : "border-l-emerald-500"}  hover:border-gray-200`}
    >
      {/* IMAGE SECTION - Mapping to Poster_File */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={event.Poster_File || "/images/events_temp_image.jpg"}
          alt={event.Description}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="bg-black/50 backdrop-blur-md text-white text-[9px] px-2 py-1 rounded font-mono">
            E_ID: {event.id} {/* Unique event ID */}
          </span>
          <span
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md ${
              !isActive ? "bg-red-500/90" : "bg-emerald-500/90"
            }`}
          >
            {isActive ? "Upcoming" : "Past"}
          </span>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-lg font-bold text-slate-800 line-clamp-2 leading-snug min-h-14 font-poppins group-hover:text-[#1B431C] transition-colors">
          {event.Description} {/* Short description of the event */}
        </h2>

        {/* METADATA */}
        <div className="mt-4 flex flex-col gap-2 border-t border-slate-50 pt-4 font-inter">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <CalendarDays className="w-4 h-4 text-blue-500" />
              {new Date(event.Event_Date).toLocaleDateString("en-IN")}{" "}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Clock size={12} />
              {new Date(event.Added_On).toLocaleDateString()}{" "}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
              <User size={12} className="text-slate-500" />
            </div>
            <span className="text-xs text-slate-400">
              Organized by{" "}
              <span className="font-semibold text-slate-600">
                {event.Added_By_Name}
              </span>{" "}
            </span>
          </div>
        </div>

        {/* ADMIN ACTIONS */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => onModerate("block", event.id)}
            disabled={!isActive}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              !isActive
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50"
                : "bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white"
            }`}
          >
            <Ban size={14} /> Block
          </button>

          <button
            onClick={() => onModerate("unblock", event.id)}
            disabled={isActive}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              isActive
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50"
                : "bg-[#1B431C] text-white hover:bg-[#153416] border-[#1B431C]"
            }`}
          >
            <CheckCircle size={14} /> Unblock
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEventCard;
