// import React, { useMemo } from "react";
// import UserCard from "../cards/AdminUserCard";

// const DashboardUsers = ({
//   users,
//   searchTerm,
//   filterDegree,
//   filterYear,
//   onModerate,
// }) => {
//   const filteredUsers = useMemo(() => {
//     return users.filter((user) => {
//       const s = searchTerm.toLowerCase();
//       const matchesSearch =
//         !s ||
//         user.Name?.toLowerCase().includes(s) ||
//         user.Email?.toLowerCase().includes(s) ||
//         user.Username?.toLowerCase().includes(s) ||
//         user.Roll_No?.toLowerCase().includes(s);

//       const matchesDegree =
//         filterDegree === "all" || user.Degree.Degree_Name === filterDegree;
//       const matchesYear =
//         filterYear === "all" || user.Year.toString() === filterYear;

//       return matchesSearch && matchesDegree && matchesYear;
//     });
//   }, [users, searchTerm, filterDegree, filterYear]);
//   return (
//     <div className="bg-whitw rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-inter">
//       <div className="p-6 border-b bg-primary border-gray-50 flex justify-between items-center">
//         <h3 className="text-lg font-bold text-white font-poppins">
//           Recent Users
//         </h3>
//         <span className="text-[10px] font-black text-gray-400 bg-white px-3 py-1.5 rounded-full uppercase tracking-widest">
//           {filteredUsers.length} Found
//         </span>
//       </div>

//       <div className="p-4 bg-gray-50/20">
//         <div className="flex flex-col gap-6">
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map((user) => (
//               <UserCard key={user.S_ID} user={user} onModerate={onModerate} />
//             ))
//           ) : (
//             <div className="py-20 text-center flex flex-col items-center gap-2">
//               <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
//                 No Users Match Your Search
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardUsers;

import React, { useEffect, useMemo, useState } from "react";
import UserCard from "../cards/AdminUserCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const USERS_PER_PAGE = 5;

const DashboardUsers = ({
  users,
  searchTerm,
  filterDegree,
  filterYear,
  onModerate,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const s = searchTerm.toLowerCase();

      const matchesSearch =
        !s ||
        user?.Name?.toLowerCase().includes(s) ||
        user?.Email?.toLowerCase().includes(s) ||
        user?.Username?.toLowerCase().includes(s) ||
        user?.Roll_No?.toLowerCase().includes(s);

      const matchesDegree =
        filterDegree === "all" || user?.Degree?.Degree_Name === filterDegree;

      const matchesYear =
        filterYear === "all" || user?.Year?.toString() === filterYear;

      return matchesSearch && matchesDegree && matchesYear;
    });
  }, [users, searchTerm, filterDegree, filterYear]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDegree, filterYear, users]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

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
      <div className="p-6 border-b bg-primary border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white font-poppins">
          Recent Users
        </h3>
        <span className="text-[10px] font-black text-gray-400 bg-white px-3 py-1.5 rounded-full uppercase tracking-widest">
          {filteredUsers.length} Found
        </span>
      </div>

      {/* User List */}
      <div className="p-4 bg-gray-50/20">
        <div className="flex flex-col gap-3">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <UserCard key={user.S_ID} user={user} onModerate={onModerate} />
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-2">
              <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
                No Users Match Your Search
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      {filteredUsers.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          {/* Showing X of Y */}
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Showing{" "}
            <span className="text-gray-600">
              {(currentPage - 1) * USERS_PER_PAGE + 1}–
              {Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)}
            </span>{" "}
            of <span className="text-gray-600">{filteredUsers.length}</span>{" "}
            Users
          </p>

          {/* Page Controls */}
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

export default DashboardUsers;
