import { useState, useMemo } from "react";
import AdminNoteCard from "./Cards/AdminNoteCard";

const initialNotes = [
  {
    id: 1,
    title: "Operating Systems Notes",
    subject: "OS",
    description: "Complete notes covering process, memory, and scheduling.",
    uploadedBy: "Rohan Sharma",
    status: "active",
  },
  {
    id: 2,
    title: "DBMS Normalization",
    subject: "DBMS",
    description: "Detailed explanation of 1NF, 2NF, 3NF with examples.",
    uploadedBy: "Aisha Khan",
    status: "blocked",
  },
  {
    id: 3,
    title: "Computer Networks Cheatsheet",
    subject: "CN",
    description: "Quick revision notes for TCP/IP and OSI layers.",
    uploadedBy: "Kunal Verma",
    status: "active",
  },
  {
    id: 4,
    title: "React Hooks Summary",
    subject: "Web Dev",
    description: "Short notes on useState, useEffect, useContext.",
    uploadedBy: "Neha Patel",
    status: "active",
  },
  {
    id: 5,
    title: "Machine Learning Basics",
    subject: "AI",
    description: "Introductory ML concepts and algorithms.",
    uploadedBy: "Arjun Mehta",
    status: "blocked",
  },
];

const AdminNotesGrid = ({ searchTerm, filterSubject }) => {
  const [notes, setNotes] = useState(initialNotes);

  // Filter Logic
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSubject =
        filterSubject === "all" || note.subject === filterSubject;

      return matchesSearch && matchesSubject;
    });
  }, [notes, searchTerm, filterSubject]);

  const toggleBlockNote = (id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, status: note.status === "active" ? "blocked" : "active" }
          : note,
      ),
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Grid Header with result count */}
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Notes Uploaded</h3>
        <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
          {filteredNotes.length} Results Found
        </span>
      </div>

      <div className="p-6 bg-gray-50/30">
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <AdminNoteCard
                key={note.id}
                note={note}
                onToggleBlock={toggleBlockNote}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
              No notes match your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotesGrid;
