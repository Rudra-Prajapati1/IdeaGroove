import { useMemo } from "react";
import AdminGroupCard from "./Cards/AdminGroupCard";

const AdminGroupsGrid = ({
  groups,
  searchTerm,
  filterDegree,
  filterCategory,
  onModerate,
}) => {
  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const searchStr = searchTerm.toLowerCase();

      const matchesSearch =
        (group.Room_Name?.toLowerCase() ?? "").includes(searchStr) ||
        (group.Created_By_Name?.toLowerCase() ?? "").includes(searchStr) ||
        (group.Room_Type?.toLowerCase() ?? "").includes(searchStr);

      const matchesDegree =
        filterDegree === "all" || group.Degree === filterDegree;

      const matchesCategory =
        filterCategory === "all" || group.Based_On === filterCategory;

      return matchesSearch && matchesDegree && matchesCategory;
    });
  }, [groups, searchTerm, filterDegree, filterCategory]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 font-poppins">
          Groups Created
        </h3>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
          {filteredGroups.length} Groups Found
        </span>
      </div>

      <div className="p-6 bg-gray-50/30">
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
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
    </div>
  );
};

export default AdminGroupsGrid;
