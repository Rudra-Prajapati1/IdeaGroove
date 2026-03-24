import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Ban,
  CheckCircle,
  CalendarDays,
  User,
  ExternalLink,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import StudentProfile from "../admin/StudentProfile";

const AdminEventCard = ({ event, onModerate }) => {
  const isActive = event.status === 1;
  const isUpcoming = new Date(event.Event_Date) > new Date();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const posterSrc = event.Poster_File || "/images/events_temp_image.jpg";

  return (
    <>
      <div
        className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden hover:-translate-y-0.5
        ${isActive ? "hover:border-green-300 hover:shadow-green-200" : "hover:border-red-300 hover:shadow-red-200"}`}
      >
        {/* Poster Image */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <img
            src={posterSrc}
            alt={event.Description}
            className="h-full w-full cursor-zoom-in object-cover transition-transform duration-500 group-hover:scale-105"
            onClick={() => setIsImageOpen(true)}
          />

          {/* Gradient overlay for readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <span className="text-[10px] font-mono font-semibold text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-md">
              #{event.id}
            </span>
            <span
              className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full backdrop-blur-sm
                ${
                  isUpcoming
                    ? "bg-emerald-500/90 text-white"
                    : "bg-red-500 text-white/70"
                }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${isUpcoming ? "bg-white animate-pulse" : "bg-white/50"}`}
              />
              {isUpcoming ? "Upcoming" : "Past"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          {/* Title */}
          <h2 className="text-base md:text-lg font-extrabold text-gray-900 line-clamp-2 leading-snug font-poppins group-hover:text-[#1B431C] transition-colors mb-3">
            {event.Description}
          </h2>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
              <CalendarDays size={12} />
              {new Date(event.Event_Date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              <ThumbsUp size={12} />
              Interested {event.Interested || 0}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-700">
              <ThumbsDown size={12} />
              Not Interested {event.Not_Interested || 0}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
            <button
              onClick={() => setIsProfileOpen(true)}
              title="View student profile"
              className="group/author flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#1B431C] transition-colors"
            >
              <User
                size={12}
                className="text-gray-300 group-hover/author:text-[#1B431C] transition-colors"
              />
              <span className="text-sm md:text-base">
                By{" "}
                <span className="font-bold text-gray-800 group-hover/author:text-[#1B431C] underline underline-offset-4 decoration-dashed decoration-gray-300 group-hover/author:decoration-[#1B431C] transition-colors">
                  {event.Organizer_Name || "Unknown"}
                </span>
              </span>
              <ExternalLink
                size={12}
                className="opacity-0 group-hover/author:opacity-100 transition-opacity"
              />
            </button>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-4 py-3 border-t border-gray-50 flex gap-2 bg-gray-50/40">
          <button
            onClick={() => onModerate(isActive ? "block" : "unblock", event.id)}
            disabled={!isActive}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
              ${
                isActive
                  ? "text-red-500 bg-red-50 hover:bg-red-500 hover:text-white"
                  : "bg-[#1B431C] text-white hover:bg-[#153416]"
              }`}
          >
            {isActive ? (
              <>
                <Ban size={14} /> Block Event
              </>
            ) : (
              <>
                <CheckCircle size={14} /> Unblock Event
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setIsProfileOpen(false)
          }
        >
          <div className="relative bg-[#f8faf8] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <StudentProfile
              id={event.Organizer_ID}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      )}

      {isImageOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsImageOpen(false)}
          >
            <button
              onClick={() => setIsImageOpen(false)}
              className="absolute top-6 right-6 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={posterSrc}
              alt={event.Description}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            />
          </div>,
          document.getElementById("modal-root") || document.body,
        )}
    </>
  );
};

export default AdminEventCard;
