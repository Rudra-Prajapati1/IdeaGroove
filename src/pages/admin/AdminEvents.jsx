import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminEventsGrid from "../../components/admin/AdminEventsGrid";
import EmailConfirmationModal from "../../components/admin/EmailConfirmationModal";
import { useEffect } from "react";
import {
  fetchAdminEvents,
  moderateAdminEvent,
  selectAdminEvents,
  selectAdminEventsActionStatus,
  selectAdminEventsStats,
} from "../../redux/adminSlice/adminEventsSlice";

const AdminEvents = () => {
  const dispatch = useDispatch();
  const events = useSelector(selectAdminEvents);
  const eventsStats = useSelector(selectAdminEventsStats);
  const actionStatus = useSelector(selectAdminEventsActionStatus);
  const [searchTerm, setSearchTerm] = useState("");

  // --- MODAL STATE ---
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");
  const [eventFilter, setEventFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAdminEvents());
  }, [dispatch]);

  const filterOptions = ["Upcoming", "Past"];

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

    try {
      await dispatch(
        moderateAdminEvent({
          action: selectedAction,
          id: targetId,
          reason,
        }),
      ).unwrap();

      toast.success(`Event ${selectedAction}ed successfully! Email sent.`);
      setModalOpen(false);
      setReason("");
    } catch (err) {
      toast.error(err || "Something went wrong. Please try again.");
    }
  };

  const filteredEvents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    const today = new Date().toISOString().split("T")[0];

    return events.filter((event) => {
      const matchesSearch =
        !search ||
        event.Description?.toLowerCase().includes(search) ||
        event.Organizer_Name?.toLowerCase().includes(search);

      let matchesFilter = true;

      if (eventFilter === "Upcoming") {
        matchesFilter = event.Event_Date >= today;
      } else if (eventFilter === "Past") {
        matchesFilter = event.Event_Date < today;
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
        subjectOptions={filterOptions}
        onSubjectFilter={setEventFilter}
        secondTitle="All Events"
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
        targetType="Event"
        reason={reason}
        setReason={setReason}
        loading={actionStatus === "loading"}
      />
    </section>
  );
};

export default AdminEvents;
