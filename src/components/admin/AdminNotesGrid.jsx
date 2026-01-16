import { useState } from "react";
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

const AdminNotesGrid = () => {
  const [notes, setNotes] = useState(initialNotes);

  const toggleBlockNote = (id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              status: note.status === "active" ? "blocked" : "active",
            }
          : note
      )
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <AdminNoteCard
          key={note.id}
          note={note}
          onToggleBlock={toggleBlockNote}
        />
      ))}
    </div>
  );
};

export default AdminNotesGrid;
