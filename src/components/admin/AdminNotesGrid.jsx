import { useMemo } from "react";
import AdminNoteCard from "./Cards/AdminNoteCard";

const AdminNotesGrid = ({
  notes,
  searchTerm,
  filterDegree,
  filterSubject,
  onModerate,
}) => {
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const searchStr = searchTerm.toLowerCase();

      const title = note.title?.toLowerCase() ?? "";
      const description = note.description?.toLowerCase() ?? "";
      const uploadedBy = note.uploadedBy?.toLowerCase() ?? "";

      const matchesSearch =
        title.includes(searchStr) ||
        description.includes(searchStr) ||
        uploadedBy.includes(searchStr);

      const matchesDegree =
        filterDegree === "all" || note.degree === filterDegree;
      const matchesSubject =
        filterSubject === "all" || note.subject === filterSubject;

      return matchesSearch && matchesDegree && matchesSubject;
    });
  }, [notes, searchTerm, filterDegree, filterSubject]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-inter">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 font-poppins">
          Notes Uploaded
        </h3>
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
