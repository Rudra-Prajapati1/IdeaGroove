import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminEventsGrid from "../../components/admin/AdminEventsGrid";
import EmailConfirmationModal from "../../components/admin/EmailConfrimationModal";

const initialEvents = [
  {
    id: 1,
    Description: "React Workshop",
    Event_Date: "2026-08-25",
    Added_By: 101,
    Added_By_Name: "Tech Club",
    Added_On: "2026-01-20T10:30:00",
    // Poster_File: "/path/to/poster1.jpg",
    status: "active",
  },

  {
    id: 2,
    Description: "Hackathon 2026",
    Event_Date: "2026-09-10",
    Added_By: 102,
    Added_By_Name: "CSI Chapter",
    Added_On: "2026-01-22T14:15:00",
    // Poster_File: "/path/to/poster2.jpg",
    status: "blocked",
  },

  {
    id: 3,
    Description: "Career Guidance Seminar",
    Event_Date: "2026-08-05",
    Added_By: 103,
    Added_By_Name: "Placement Cell",
    Added_On: "2026-01-25T09:45:00",
    // Poster_File: "/path/to/poster3.jpg",
    status: "active",
  },

  {
    id: 4,
    Description: "AI & ML Bootcamp",
    Event_Date: "2026-10-01",
    Added_By: 104,
    Added_By_Name: "AI Club",
    Added_On: "2026-01-28T16:00:00",
    // Poster_File: "/path/to/poster4.jpg",
    status: "active",
  },

  {
    id: 5,
    Description: "Open Source Contribution Day",
    Event_Date: "2026-07-20",
    Added_By: 105,
    Added_By_Name: "Developer Society",
    Added_On: "2026-01-30T11:20:00",
    // Poster_File: "/path/to/poster5.jpg",
    status: "blocked",
  },
];

export const eventsStats = [
  {
    title: "Total Events",
    value: "128",
    infoText: "+6 new events",
    color: "green",
    type: "total",
  },
  {
    title: "Active Events",
    value: "42",
    infoText: "Currently ongoing",
    color: "yellow",
    type: "pending",
  },
  {
    title: "Expired Events",
    value: "86",
    infoText: "Completed",
    color: "red",
    type: "blocked",
  },
];

const AdminEvents = () => {
  const [events, setEvents] = useState(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");

  // --- MODAL STATE ---
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const filterOptions = ["Active", "Blocked"];

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

    // Simulate API logic
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

  return (
    <section className="flex flex-col gap-6 relative min-h-screen">
      <AdminPageHeader
        title="Events Management"
        subtitle="Filter events by degree, subject, or search terms"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
      />

      <StatsRow stats={eventsStats} />

      <AdminEventsGrid
        events={events}
        searchTerm={searchTerm}
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
