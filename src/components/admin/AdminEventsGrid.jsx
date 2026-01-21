import { useState } from "react";
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

const AdminEventsGrid = () => {
  const [events, setEvents] = useState(initialEvents);

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
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-gray-800">Events Registered</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <AdminEventCard
            key={event.id}
            event={event}
            onToggleBlock={toggleBlockEvent}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminEventsGrid;
