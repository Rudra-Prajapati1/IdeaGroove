import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminNotesGrid from "../../components/admin/AdminNotesGrid";

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

    // Simulate API logic
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
        // Pass the new props
        degreeOptions={degreeOptions}
        subjectOptions={subjectOptions}
        onDegreeFilter={setDegreeFilter}
        onSubjectFilter={setSubjectFilter}
      />

      <AdminNotesGrid
        notes={notes}
        searchTerm={searchTerm}
        filterDegree={degreeFilter}
        filterSubject={subjectFilter}
        onModerate={handleModerateRequest}
      />

      {/* MODERATION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 border border-gray-100 font-inter">
            <div
              className={`p-6 text-white flex justify-between items-center ${selectedAction === "block" ? "bg-red-600" : "bg-[#1B431C]"}`}
            >
              <div className="flex items-center gap-3">
                {selectedAction === "block" ? (
                  <Ban className="w-6 h-6" />
                ) : (
                  <CheckCircle className="w-6 h-6" />
                )}
                <h2 className="text-xl font-bold font-poppins capitalize">
                  {selectedAction} Content
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleActionSubmit}
              className="p-6 flex flex-col gap-5"
            >
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3 text-xs text-blue-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  Inform the uploader why the status changed. This will be sent
                  as a direct notification.
                </p>
              </div>
              <textarea
                rows="4"
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none focus:border-[#1B431C]/40 text-sm resize-none"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 font-bold text-gray-400 hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all ${selectedAction === "block" ? "bg-red-600 shadow-red-100" : "bg-[#1B431C] shadow-green-100"}`}
                >
                  {loading ? (
                    "Updating..."
                  ) : (
                    <>
                      Send <Send className="ml-2 w-4 h-4 inline" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminNotes;
