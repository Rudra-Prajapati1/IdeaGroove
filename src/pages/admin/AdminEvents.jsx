import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminEventsGrid from "../../components/admin/AdminEventsGrid";
import EmailConfirmationModal from "../../components/admin/EmailConfirmationModal";
import { useEffect } from "react";

// const initialEvents = [
//   {
//     id: 1,
//     Description: "React Workshop",
//     Event_Date: "2026-08-25",
//     Added_By: 101,
//     Added_By_Name: "Tech Club",
//     Added_On: "2026-01-20T10:30:00",
//     // Poster_File: "/path/to/poster1.jpg",
//     status: "active",
//   },

//   {
//     id: 2,
//     Description: "Hackathon 2026",
//     Event_Date: "2026-09-10",
//     Added_By: 102,
//     Added_By_Name: "CSI Chapter",
//     Added_On: "2026-01-22T14:15:00",
//     // Poster_File: "/path/to/poster2.jpg",
//     status: "blocked",
//   },

//   {
//     id: 3,
//     Description: "Career Guidance Seminar",
//     Event_Date: "2026-08-05",
//     Added_By: 103,
//     Added_By_Name: "Placement Cell",
//     Added_On: "2026-01-25T09:45:00",
//     // Poster_File: "/path/to/poster3.jpg",
//     status: "active",
//   },

//   {
//     id: 4,
//     Description: "AI & ML Bootcamp",
//     Event_Date: "2026-10-01",
//     Added_By: 104,
//     Added_By_Name: "AI Club",
//     Added_On: "2026-01-28T16:00:00",
//     // Poster_File: "/path/to/poster4.jpg",
//     status: "active",
//   },

//   {
//     id: 5,
//     Description: "Open Source Contribution Day",
//     Event_Date: "2026-07-20",
//     Added_By: 105,
//     Added_By_Name: "Developer Society",
//     Added_On: "2026-01-30T11:20:00",
//     // Poster_File: "/path/to/poster5.jpg",
//     status: "blocked",
//   },
// ];

export const eventsStats = [
  {
    title: "Total Events",
    value: "",
    infoText: "+6 new events",
    color: "green",
    type: "total",
  },
  {
    title: "Active Events",
    value: "",
    infoText: "Currently ongoing",
    color: "yellow",
    type: "pending",
  },
  {
    title: "Expired Events",
    value: "",
    infoText: "Completed",
    color: "red",
    type: "blocked",
  },
];

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // --- MODAL STATE ---
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [eventFilter, setEventFilter] = useState("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/events`);
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();

        const formattedEvents = data.data.map((ev) => ({
          id: ev.E_ID,
          Description: ev.Description,
          Event_Date: ev.Event_Date,
          Organizer_ID: ev.Organizer_ID,
          Organizer_Name: ev.Organizer_Name,
          Added_On: ev.Added_On,
          Poster_File: ev.Poster_File,
          status: ev.Is_Active,
        }));

        console.log(formattedEvents);

        eventsStats[0].value = data.total;
        eventsStats[1].value = formattedEvents.filter(
          (ev) => ev.Event_Date >= new Date().toISOString().split("T")[0],
        ).length;
        eventsStats[2].value = formattedEvents.filter(
          (ev) => ev.Event_Date < new Date().toISOString().split("T")[0],
        ).length;
        setEvents(formattedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filterOptions = ["Active", "Past"];

  const handleModerateRequest = (type, eventId) => {
    setSelectedAction(type);
    setTargetId(eventId);
    setModalOpen(true);
    setReason(
      type === "block"
        ? "This event has been blocked due to a policy violation or incorrect details."
        : "The event has been reviewed and reinstated successfully.",
    );
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === targetId
            ? {
                ...ev,
                status: selectedAction === "block" ? "blocked" : "active",
              }
            : ev,
        ),
      );

      toast.success(`Event ${selectedAction}ed successfully!`);
      setModalOpen(false);
      setLoading(false);
      setReason("");
    }, 1000);
  };

  const filteredEvents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !search ||
        event.Description.toLowerCase().includes(search) ||
        event.Organizer_Name.toLowerCase().includes(search);

      let matchesFilter = true;

      if (eventFilter === "Active") {
        matchesFilter =
          event.Event_Date >= new Date().toISOString().split("T")[0];
      } else if (eventFilter === "Past") {
        matchesFilter =
          event.Event_Date < new Date().toISOString().split("T")[0];
      }

      return matchesSearch && matchesFilter;
    });
  }, [events, searchTerm, eventFilter]);

  return (
    <section className="flex flex-col gap-6 relative min-h-screen">
      <AdminPageHeader
        title="Events Management"
        subtitle="Filter events by degree, subject, or search terms"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        degreeOptions={filterOptions}
        onDegreeFilter={setEventFilter}
        firstTitle="All Events"
      />

      <StatsRow stats={eventsStats} />

      <AdminEventsGrid
        events={filteredEvents}
        onModerate={handleModerateRequest}
      />

      <EmailConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleActionSubmit}
        actionType={selectedAction}
        targetType="Notes"
        reason={reason}
        setReason={setReason}
        loading={loading}
      />
    </section>
  );
};

export default AdminEvents;
