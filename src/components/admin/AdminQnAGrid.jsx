import { useState } from "react";
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
    status: "reported",
  },
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

const AdminQnAGrid = () => {
  const [qnas, setQnas] = useState(initialQnA);

  const toggleBlockQnA = (id) => {
    setQnas((prev) =>
      prev.map((qna) =>
        qna.id === id
          ? {
              ...qna,
              status: qna.status === "blocked" ? "active" : "blocked",
            }
          : qna,
      ),
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-gray-800">Questions Asked</h3>
      <div className="p-4 flex flex-col gap-3 bg-gray-50/30">
        {qnas.map((qna) => (
          <AdminQnACard key={qna.id} qna={qna} onToggleBlock={toggleBlockQnA} />
        ))}
      </div>
    </div>
  );
};

export default AdminQnAGrid;
