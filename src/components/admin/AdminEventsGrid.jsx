import React from "react";
import AdminEventCard from "../cards/AdminEventCard";

const AdminEventsGrid = ({ events, onModerate }) => {
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
            {events.map((event) => (
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
    </div>
  );
};

export default AdminEventsGrid;
