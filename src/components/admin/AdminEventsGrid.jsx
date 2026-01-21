import { useState, useMemo } from "react";
import AdminEventCard from "./Cards/AdminEventCard";

const initialEvents = [
  {
    id: 1,
    Description: "React Workshop",
    Event_Date: "2026-08-25",
    Added_By: "Tech Club",
    status: "active",
  },
  {
    id: 2,
    Description: "Hackathon 2026",
    Event_Date: "2026-09-10",
    Added_By: "CSI Chapter",
    status: "blocked",
  },
  {
    id: 3,
    Description: "Career Guidance Seminar",
    Event_Date: "2026-08-05",
    Added_By: "Placement Cell",
    status: "active",
  },
  {
    id: 4,
    Description: "AI & ML Bootcamp",
    Event_Date: "2026-10-01",
    Added_By: "AI Club",
    status: "active",
  },
  {
    id: 5,
    Description: "Open Source Contribution Day",
    Event_Date: "2026-07-20",
    Added_By: "Developer Society",
    status: "blocked",
  },
];

const AdminEventsGrid = ({ searchTerm, statusFilter }) => {
  const [events, setEvents] = useState(initialEvents);

  // Filter Logic: Filters by Description/Added_By and Status
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

  const toggleBlockEvent = (id) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? {
              ...event,
              status: event.status === "active" ? "blocked" : "active",
            }
          : event,
      ),
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Dynamic Header showing result count */}
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Events Registered</h3>
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
                onToggleBlock={toggleBlockEvent}
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
