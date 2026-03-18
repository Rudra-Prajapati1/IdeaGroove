import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminNotesGrid from "../../components/admin/AdminNotesGrid";
import EmailConfirmationModal from "../../components/admin/EmailConfirmationModal";
import {
  fetchAdminDegreeSubjectData,
  selectAdminDegreeOptions,
  selectAdminDegreeSubjectMap,
} from "../../redux/adminSlice/adminMetaSlice";
import {
  fetchAdminNotes,
  moderateAdminNote,
  selectAdminNotes,
  selectAdminNotesActionStatus,
  selectAdminNotesStats,
} from "../../redux/adminSlice/adminNotesSlice";

// // Moved initial data here to allow global state management
// const initialNotes = [
//   {
//     id: 1,
//     title: "Operating Systems Notes",
//     subject: "OS",
//     degree: "B.Tech",
//     description: "Complete notes covering process, memory, and scheduling.",
//     uploadedBy: "Rohan Sharma",
//     status: "active",
//   },
//   {
//     id: 2,
//     title: "DBMS Normalization",
//     subject: "DBMS",
//     degree: "B.Tech",
//     description: "Detailed explanation of 1NF, 2NF, 3NF with examples.",
//     uploadedBy: "Aisha Khan",
//     status: "blocked",
//   },
//   {
//     id: 3,
//     title: "Computer Networks Cheatsheet",
//     subject: "CN",
//     degree: "BCA",
//     description: "Quick revision notes for TCP/IP and OSI layers.",
//     uploadedBy: "Kunal Verma",
//     status: "active",
//   },
//   {
//     id: 4,
//     title: "React Hooks Summary",
//     subject: "Web Dev",
//     degree: "BCA",
//     description: "Short notes on useState, useEffect, useContext.",
//     uploadedBy: "Neha Patel",
//     status: "active",
//   },
//   {
//     id: 5,
//     title: "Machine Learning Basics",
//     subject: "AI",
//     degree: "BCA",
//     description: "Introductory ML concepts and algorithms.",
//     uploadedBy: "Arjun Mehta",
//     status: "blocked",
//   },
// ];

const AdminNotes = () => {
  const dispatch = useDispatch();
  const notes = useSelector(selectAdminNotes);
  const notesStats = useSelector(selectAdminNotesStats);
  const degreeOptions = useSelector(selectAdminDegreeOptions);
  const degreeSubjectMap = useSelector(selectAdminDegreeSubjectMap);
  const actionStatus = useSelector(selectAdminNotesActionStatus);

  const [searchTerm, setSearchTerm] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");
  const subjectOptions = useMemo(() => {
    if (degreeFilter === "all") {
      return [...new Set(Object.values(degreeSubjectMap).flat())].sort((a, b) =>
        String(a).localeCompare(String(b)),
      );
    }
    return degreeSubjectMap[degreeFilter] || [];
  }, [degreeFilter, degreeSubjectMap]);

  // ✅ Move fetchNotes outside useEffect so handleActionSubmit can call it
  useEffect(() => {
    dispatch(fetchAdminNotes());
    dispatch(fetchAdminDegreeSubjectData());
  }, [dispatch]);

  useEffect(() => {
    setSubjectFilter("all");
  }, [degreeFilter]);

  const handleModerateRequest = (type, noteId) => {
    setSelectedAction(type);
    setTargetId(noteId);
    setModalOpen(true);
    setReason(
      type === "block"
        ? "This content has been blocked due to a violation of academic integrity or copyright policies."
        : "This content has been reviewed and reinstated for community access.",
    );
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        moderateAdminNote({
          action: selectedAction,
          id: targetId,
          reason,
        }),
      ).unwrap();

        // Update local state — no need to refetch
        

      toast.success(`Note ${selectedAction}ed successfully! Email sent to student.`);
      setModalOpen(false);
      setReason("");
    } catch (err) {
      toast.error(err || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="flex flex-col gap-8 relative min-h-screen">
      <AdminPageHeader
        title="Notes Moderation"
        subtitle="Review and manage user uploads"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        degreeOptions={degreeOptions}
        subjectOptions={subjectOptions}
        onDegreeFilter={setDegreeFilter}
        onSubjectFilter={setSubjectFilter}
      />

      <StatsRow stats={notesStats} />

      <AdminNotesGrid
        notes={notes}
        searchTerm={searchTerm}
        filterDegree={degreeFilter}
        filterSubject={subjectFilter}
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
        loading={actionStatus === "loading"}
      />
    </section>
  );
};

export default AdminNotes;
