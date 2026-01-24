import React, { useMemo } from "react";
import AdminQnACard from "./Cards/AdminQnACard";

const AdminQnAGrid = ({
  qnas,
  searchTerm,
  filterDegree,
  filterSubject,
  onModerate,
}) => {
  const filteredQnAs = useMemo(() => {
    return qnas.filter((qna) => {
      const s = searchTerm.toLowerCase();

      // Search across question text, author, subject, and degree mapping to DD fields
      const matchesSearch =
        (qna.question?.toLowerCase() ?? "").includes(s) ||
        (qna.authorName?.toLowerCase() ?? "").includes(s) ||
        (qna.subjectName?.toLowerCase() ?? "").includes(s) ||
        (qna.degreeName?.toLowerCase() ?? "").includes(s);

      const matchesDegree =
        filterDegree === "all" || qna.degreeName === filterDegree;
      const matchesSubject =
        filterSubject === "all" || qna.subjectName === filterSubject;

      return matchesSearch && matchesDegree && matchesSubject;
    });
  }, [qnas, searchTerm, filterDegree, filterSubject]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden font-inter">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 font-poppins">
          Questions Asked
        </h3>
        <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
          {filteredQnAs.length} Results
        </span>
      </div>

      {/* Grid Content Section */}
      <div className="p-4 bg-gray-50/20">
        {filteredQnAs.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredQnAs.map((qna) => (
              <AdminQnACard key={qna.id} qna={qna} onModerate={onModerate} />
            ))}
          </div>
        ) : (
          /* Consistent No Results State */
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
