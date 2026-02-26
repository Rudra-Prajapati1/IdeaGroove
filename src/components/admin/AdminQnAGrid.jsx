// import React, { useMemo } from "react";
// import AdminQnACard from "../cards/AdminQnACard";

// const AdminQnAGrid = ({
//   qnas,
//   searchTerm,
//   filterDegree,
//   filterSubject,
//   onModerate,
//   onModerateAnswer,
// }) => {
//   const filteredQnAs = useMemo(() => {
//     return qnas.filter((qna) => {
//       const s = searchTerm.toLowerCase();
//       const matchesSearch =
//         (qna.question?.toLowerCase() ?? "").includes(s) ||
//         (qna.authorName?.toLowerCase() ?? "").includes(s) ||
//         (qna.subjectName?.toLowerCase() ?? "").includes(s) ||
//         (qna.degreeName?.toLowerCase() ?? "").includes(s);
//       const matchesDegree =
//         filterDegree === "all" || qna.degreeName === filterDegree;
//       const matchesSubject =
//         filterSubject === "all" || qna.subjectName === filterSubject;
//       return matchesSearch && matchesDegree && matchesSubject;
//     });
//   }, [qnas, searchTerm, filterDegree, filterSubject]);

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//       <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-primary">
//         <h3 className="text-lg font-bold text-white font-poppins">
//           Questions Asked
//         </h3>
//         <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
//           {filteredQnAs.length} Results
//         </span>
//       </div>
//       <div className="p-4 bg-gray-50/20">
//         <div className="flex flex-col gap-4">
//           {filteredQnAs.map((qna) => (
//             <AdminQnACard
//               key={qna.id}
//               qna={qna}
//               onModerate={onModerate}
//               onModerateAnswer={onModerateAnswer}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminQnAGrid;

import React, { useMemo, useState, useEffect } from "react";
import AdminQnACard from "../cards/AdminQnACard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const QNA_PER_PAGE = 5;

const AdminQnAGrid = ({
  qnas,
  searchTerm,
  filterDegree,
  filterSubject,
  onModerate,
  onModerateAnswer,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // 🔎 Filter logic
  const filteredQnAs = useMemo(() => {
    return qnas.filter((qna) => {
      const s = searchTerm.toLowerCase();

      const matchesSearch =
        (qna.question?.toLowerCase() ?? "").includes(s) ||
        (qna.authorName?.toLowerCase() ?? "").includes(s) ||
        (qna.subjectName?.toLowerCase() ?? "").includes(s) ||
        (qna.degreeName?.toLowerCase() ?? "").includes(s);

      const matchesDegree =
        filterDegree === "all" || qna.degreeName === filterDegree;

      const matchesSubject =
        filterSubject === "all" || qna.subjectName === filterSubject;

      // 🎯 IMPORTANT LOGIC
      if (filterDegree !== "all" && filterSubject !== "all") {
        return matchesSearch && matchesSubject;
      }

      return matchesSearch && matchesDegree && matchesSubject;
    });
  }, [qnas, searchTerm, filterDegree, filterSubject]);

  // 🔁 Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredQnAs]);

  const totalPages = Math.ceil(filteredQnAs.length / QNA_PER_PAGE);

  // 📄 Paginated data
  const paginatedQnAs = useMemo(() => {
    const start = (currentPage - 1) * QNA_PER_PAGE;
    return filteredQnAs.slice(start, start + QNA_PER_PAGE);
  }, [filteredQnAs, currentPage]);

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-primary">
        <h3 className="text-lg font-bold text-white font-poppins">
          Questions Asked
        </h3>
        <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
          {filteredQnAs.length} Results
        </span>
      </div>

      <div className="p-4 bg-gray-50/20">
        <div className="flex flex-col mb-1">
          {paginatedQnAs.map((qna) => (
            <AdminQnACard
              key={qna.id}
              qna={qna}
              onModerate={onModerate}
              onModerateAnswer={onModerateAnswer}
            />
          ))}
        </div>
      </div>

      {/* ✅ Pagination Footer */}
      {paginatedQnAs.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Showing{" "}
            <span className="text-gray-600">
              {(currentPage - 1) * QNA_PER_PAGE + 1}–
              {Math.min(currentPage * QNA_PER_PAGE, filteredQnAs.length)}
            </span>{" "}
            of <span className="text-gray-600">{filteredQnAs.length}</span>{" "}
            Questions
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30"
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
                  className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold
                  ${
                    currentPage === page
                      ? "bg-primary text-white"
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
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQnAGrid;
