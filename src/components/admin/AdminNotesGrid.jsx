import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AdminNoteCard from "../cards/AdminNoteCard";

const NOTES_PER_PAGE = 6;

const AdminNotesGrid = ({
  notes,
  searchTerm,
  filterDegree,
  filterSubject,
  onModerate,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

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

      // 🎯 IMPORTANT LOGIC
      if (filterDegree !== "all" && filterSubject !== "all") {
        return matchesSearch && matchesSubject;
      }

      return matchesSearch && matchesDegree && matchesSubject;
    });
  }, [notes, searchTerm, filterDegree, filterSubject]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDegree, filterSubject, notes]);

  const totalPages = Math.ceil(filteredNotes.length / NOTES_PER_PAGE);

  const paginatedNotes = useMemo(() => {
    const start = (currentPage - 1) * NOTES_PER_PAGE;
    return filteredNotes.slice(start, start + NOTES_PER_PAGE);
  }, [filteredNotes, currentPage]);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-inter">
      {/* Header */}
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-primary">
        <h3 className="text-lg font-bold text-white font-poppins">
          Notes Uploaded
        </h3>
        <span className="text-[10px] font-black text-gray-400 bg-white px-3 py-1.5 rounded-full uppercase tracking-widest">
          {filteredNotes.length} Found
        </span>
      </div>

      {/* Notes Grid */}
      <div className="p-6 bg-gray-50/30">
        {paginatedNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedNotes.map((note) => (
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

      {/* Pagination Footer */}
      {filteredNotes.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          {/* Showing X–Y of Z */}
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Showing{" "}
            <span className="text-gray-600">
              {(currentPage - 1) * NOTES_PER_PAGE + 1}–
              {Math.min(currentPage * NOTES_PER_PAGE, filteredNotes.length)}
            </span>{" "}
            of <span className="text-gray-600">{filteredNotes.length}</span>{" "}
            Notes
          </p>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
            </button>

            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span
                  key={`dots-${i}`}
                  className="h-8 w-8 flex items-center justify-center text-gray-300 text-xs"
                >
                  ···
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors
                    ${
                      currentPage === page
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotesGrid;
