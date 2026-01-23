import { useMemo } from "react";
import AdminNoteCard from "./Cards/AdminNoteCard";

const AdminNotesGrid = ({ notes, searchTerm, filterSubject, onModerate }) => {
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-inter">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 font-poppins">Notes Uploaded</h3>
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
                onModerate={onModerate}
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