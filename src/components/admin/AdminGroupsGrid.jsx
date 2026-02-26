// import { useMemo } from "react";
// import AdminGroupCard from "../cards/AdminGroupCard";

// const AdminGroupsGrid = ({
//   groups,
//   searchTerm,
//   filterDegree,
//   filterCategory,
//   onModerate,
// }) => {
//   const filteredGroups = useMemo(() => {
//     return groups.filter((group) => {
//       const searchStr = searchTerm.toLowerCase();

//       const matchesSearch =
//         (group.Room_Name?.toLowerCase() ?? "").includes(searchStr) ||
//         (group.Created_By_Name?.toLowerCase() ?? "").includes(searchStr) ||
//         (group.Room_Type?.toLowerCase() ?? "").includes(searchStr);

//       const matchesDegree =
//         filterDegree === "all" || group.Degree === filterDegree;

//       const matchesCategory =
//         filterCategory === "all" || group.Based_On === filterCategory;

//       return matchesSearch && matchesDegree && matchesCategory;
//     });
//   }, [groups, searchTerm, filterDegree, filterCategory]);

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//       <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-primary">
//         <h3 className="text-lg font-bold text-white font-poppins">
//           Groups Created
//         </h3>
//         <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
//           {filteredGroups.length} Groups Found
//         </span>
//       </div>

//       <div className="p-6 bg-gray-50/30">
//         {filteredGroups.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredGroups.map((group) => (
//               <AdminGroupCard
//                 key={group.id}
//                 group={group}
//                 onModerate={onModerate}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="py-20 text-center flex flex-col items-center gap-2">
//             <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
//               No groups match your search or filter
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminGroupsGrid;
import React, { useState, useEffect, useMemo } from "react";
import AdminGroupCard from "../cards/AdminGroupCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GROUPS_PER_PAGE = 6;

const AdminGroupsGrid = ({ groups, searchTerm, filterHobby, onModerate }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Filter logic
  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const searchStr = searchTerm.toLowerCase();

      const matchesSearch =
        (group.Name?.toLowerCase() ?? "").includes(searchStr) ||
        (group.Creator_Name?.toLowerCase() ?? "").includes(searchStr) ||
        (group.Room_Type?.toLowerCase() ?? "").includes(searchStr);

      const matchesCategory =
        filterHobby === "all" || group.Based_On === filterHobby;

      return matchesSearch && matchesCategory;
    });
  }, [groups, searchTerm, filterHobby]);

  // ✅ Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredGroups]);

  const totalPages = Math.ceil(filteredGroups.length / GROUPS_PER_PAGE);

  // ✅ Paginate
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * GROUPS_PER_PAGE;
    return filteredGroups.slice(start, start + GROUPS_PER_PAGE);
  }, [filteredGroups, currentPage]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-primary">
        <h3 className="text-lg font-bold text-white font-poppins">
          Groups Created
        </h3>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
          {filteredGroups.length} Groups Found
        </span>
      </div>

      <div className="p-6 bg-gray-50/30">
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGroups.map((group) => (
              <AdminGroupCard
                key={group.id}
                group={group}
                onModerate={onModerate}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
              No groups match your search or filter
            </p>
          </div>
        )}
      </div>

      {/* ✅ Pagination Footer */}
      {paginatedGroups.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Showing{" "}
            <span className="text-gray-600">
              {(currentPage - 1) * GROUPS_PER_PAGE + 1}–
              {Math.min(currentPage * GROUPS_PER_PAGE, filteredGroups.length)}
            </span>{" "}
            of <span className="text-gray-600">{filteredGroups.length}</span>{" "}
            Groups
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            ))}

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

export default AdminGroupsGrid;
