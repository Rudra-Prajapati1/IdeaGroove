import React from "react";
import AdminEventCard from "../cards/AdminEventCard";
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EVENTS_PER_PAGE = 3;

const AdminEventsGrid = ({ events, onModerate }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [events]);

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * EVENTS_PER_PAGE;
    return events.slice(start, start + EVENTS_PER_PAGE);
  }, [events, currentPage]);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-primary">
        <h3 className="text-lg font-bold text-white font-poppins">
          Events Registered
        </h3>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
          {events.length} Events Found
        </span>
      </div>

      <div className="p-6 bg-gray-50/30">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedEvents.map((event) => (
              <AdminEventCard
                key={event.id}
                event={event}
                onModerate={onModerate}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
              No events match your criteria
            </p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {paginatedEvents.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          {/* Showing X–Y of Z */}
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Showing{" "}
            <span className="text-gray-600">
              {(currentPage - 1) * EVENTS_PER_PAGE + 1}–
              {Math.min(currentPage * EVENTS_PER_PAGE, events.length)}
            </span>{" "}
            of <span className="text-gray-600">{events.length}</span> Events
          </p>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
            </button>

            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span
                  key={`dots-${i}`}
                  className="h-8 w-8 flex items-center justify-center text-gray-300 text-xs"
                >
                  ···
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors
                    ${
                      currentPage === page
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventsGrid;
