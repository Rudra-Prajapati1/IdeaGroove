import React, { useMemo } from "react";
import AdminEventCard from "./Cards/AdminEventCard";

const AdminEventsGrid = ({ events, searchTerm, statusFilter, onModerate }) => {
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.Added_By.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        event.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, statusFilter]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 font-poppins">Events Registered</h3>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
          {filteredEvents.length} Events Found
        </span>
      </div>

      <div className="p-6 bg-gray-50/30">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
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
              No events match your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventsGrid;