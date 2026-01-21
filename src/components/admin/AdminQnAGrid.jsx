import { useState, useMemo } from "react";
import AdminQnACard from "./Cards/AdminQnACard";

const initialQnA = [
  {
    id: 1,
    title: "Clarification on Project Submission Guidelines for CS202",
    author: "Prof. H. Smith",
    time: "2h ago",
    subject: "Web Development",
    answersCount: 2,
    status: "active",
  },
  {
    id: 2,
    title: "Help needed with Linear Algebra Eigenvalues",
    author: "Jessica S.",
    time: "45m ago",
    subject: "Linear Algebra",
    answersCount: 0,
    status: "active",
  }, // Cleaned 'reported' to 'active' as per previous request
  {
    id: 3,
    title: "Thermodynamics: Second Law confusion",
    author: "Michael P.",
    time: "3h ago",
    subject: "Thermodynamics",
    answersCount: 1,
    status: "active",
  },
  {
    id: 4,
    title: "Is recursion better than iteration?",
    author: "Anonymous",
    time: "1d ago",
    subject: "Data Structures",
    answersCount: 3,
    status: "blocked",
  },
];

const AdminQnAGrid = ({ searchTerm, filterSubject }) => {
  const [qnas, setQnas] = useState(initialQnA);

  // Filter Logic: Matches title/author for search and subject for dropdown
  const filteredQnAs = useMemo(() => {
    return qnas.filter((qna) => {
      const matchesSearch =
        qna.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qna.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSubject =
        filterSubject === "all" || qna.subject === filterSubject;

      return matchesSearch && matchesSubject;
    });
  }, [qnas, searchTerm, filterSubject]);

  const toggleBlockQnA = (id) => {
    setQnas((prev) =>
      prev.map((qna) =>
        qna.id === id
          ? { ...qna, status: qna.status === "blocked" ? "active" : "blocked" }
          : qna,
      ),
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with dynamic results count */}
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Questions Asked</h3>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
          {filteredQnAs.length} Questions Found
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3 bg-gray-50/30">
        {filteredQnAs.length > 0 ? (
          filteredQnAs.map((qna) => (
            <AdminQnACard
              key={qna.id}
              qna={qna}
              onToggleBlock={toggleBlockQnA}
            />
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
              No questions match your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQnAGrid;
