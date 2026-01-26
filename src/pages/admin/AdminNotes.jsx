import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminNotesGrid from "../../components/admin/AdminNotesGrid";
import EmailConfirmationModal from "../../components/admin/EmailConfrimationModal";

// Moved initial data here to allow global state management
const initialNotes = [
  {
    id: 1,
    title: "Operating Systems Notes",
    subject: "OS",
    degree: "B.Tech",
    description: "Complete notes covering process, memory, and scheduling.",
    uploadedBy: "Rohan Sharma",
    status: "active",
  },
  {
    id: 2,
    title: "DBMS Normalization",
    subject: "DBMS",
    degree: "B.Tech",
    description: "Detailed explanation of 1NF, 2NF, 3NF with examples.",
    uploadedBy: "Aisha Khan",
    status: "blocked",
  },
  {
    id: 3,
    title: "Computer Networks Cheatsheet",
    subject: "CN",
    degree: "BCA",
    description: "Quick revision notes for TCP/IP and OSI layers.",
    uploadedBy: "Kunal Verma",
    status: "active",
  },
  {
    id: 4,
    title: "React Hooks Summary",
    subject: "Web Dev",
    degree: "BCA",
    description: "Short notes on useState, useEffect, useContext.",
    uploadedBy: "Neha Patel",
    status: "active",
  },
  {
    id: 5,
    title: "Machine Learning Basics",
    subject: "AI",
    degree: "BCA",
    description: "Introductory ML concepts and algorithms.",
    uploadedBy: "Arjun Mehta",
    status: "blocked",
  },
];

export const notesStats = [
  {
    title: "Total Notes Uploaded",
    value: "12,450",
    infoText: "+12% this month",
    color: "green",
    type: "total",
  },
  {
    title: "Pending Review",
    value: "84",
    infoText: "Priority items",
    color: "yellow",
    type: "pending",
  },
  {
    title: "Blocked Content",
    value: "312",
    infoText: "Compliance removal",
    color: "red",
    type: "blocked",
  },
];

const AdminNotes = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const degreeOptions = ["B.Tech", "BCA", "MCA", "M.Tech"];
  const subjectOptions = ["OS", "DBMS", "CN", "Web Dev", "AI"];

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
    setLoading(true);

    setTimeout(() => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === targetId
            ? {
                ...n,
                status: selectedAction === "block" ? "blocked" : "active",
              }
            : n,
        ),
      );

      toast.success(`Note ${selectedAction}ed successfully!`);
      setModalOpen(false);
      setLoading(false);
      setReason("");
    }, 1000);
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
        loading={loading}
      />

    </section>
  );
};

export default AdminNotes;
