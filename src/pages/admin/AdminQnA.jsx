import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminQnAGrid from "../../components/admin/AdminQnAGrid";

// Initial data moved here to allow state management
const initialData = [
  {
    id: 1,
    question: "Clarification on Project Submission Guidelines for CS202",
    authorName: "Prof. H. Smith",
    addedOn: "2025-01-20T10:30:00",
    subjectName: "Web Development",
    degreeName: "B.Tech",
    answersCount: 2,
    status: "active",
  },

  {
    id: 2,
    question: "Help needed with Linear Algebra Eigenvalues",
    authorName: "Jessica S.",
    addedOn: "2025-01-24T09:15:00",
    subjectName: "Linear Algebra",
    degreeName: "BCA",
    answersCount: 0,
    status: "active",
  },

  {
    id: 3,
    question: "Thermodynamics: Second Law confusion",
    authorName: "Michael P.",
    addedOn: "2025-01-23T18:40:00",
    subjectName: "Thermodynamics",
    degreeName: "B.Tech",
    answersCount: 1,
    status: "active",
  },

  {
    id: 4,
    question: "Is recursion better than iteration?",
    authorName: "Anonymous",
    addedOn: "2025-01-22T11:00:00",
    subjectName: "Data Structures",
    degreeName: "BCA",
    answersCount: 3,
    status: "blocked",
  },
];

const AdminQnA = () => {
  const [qnas, setQnas] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const degreeOptions = ["B.Tech", "BCA", "MCA"];
  const subjectOptions = [
    "Web Development",
    "Linear Algebra",
    "Thermodynamics",
    "Data Structures",
  ];

  const handleModerateRequest = (type, questionId) => {
    setSelectedAction(type);
    setTargetId(questionId);
    setModalOpen(true);
    setReason(
      type === "block"
        ? "Your question has been hidden for violating community guidelines."
        : "Your question has been reinstated after review.",
    );
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
      // UPDATE STATUS LOGIC
      setQnas((prev) =>
        prev.map((q) =>
          q.id === targetId
            ? {
                ...q,
                status: selectedAction === "block" ? "blocked" : "active",
              }
            : q,
        ),
      );

      toast.success(`Content successfully ${selectedAction}ed`);
      setModalOpen(false);
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="flex flex-col gap-6 relative min-h-screen font-inter">
      <AdminPageHeader
        title="QnA Moderation"
        subtitle="Manage questions and user compliance"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        // Pass dual filters to Header
        degreeOptions={degreeOptions}
        subjectOptions={subjectOptions}
        onDegreeFilter={setDegreeFilter}
        onSubjectFilter={setSubjectFilter}
      />

      <StatsRow stats={[]} />

      <AdminQnAGrid
        qnas={qnas}
        searchTerm={searchTerm}
        filterDegree={degreeFilter}
        filterSubject={subjectFilter}
        onModerate={handleModerateRequest}
      />

      {/* MODERATION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 border border-gray-100">
            <div
              className={`p-6 text-white flex justify-between items-center ${selectedAction === "block" ? "bg-red-600" : "bg-[#1B431C]"}`}
            >
              <h2 className="text-xl font-bold font-poppins capitalize">
                {selectedAction} Question
              </h2>
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
                  Inform the user why their status changed. This will be sent to
                  their email.
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
                  className="flex-1 py-3 font-bold text-gray-400"
                >
                  Cancel
                </button>
                <button
                  className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg ${selectedAction === "block" ? "bg-red-600 shadow-red-100" : "bg-[#1B431C] shadow-green-100"}`}
                >
                  {loading ? "Sending..." : "Confirm & Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminQnA;
