import { useState, useMemo } from "react";
import AdminGroupCard from "./Cards/AdminGroupCard";

const initialGroups = [
  {
    id: 1,
    Room_Name: "DSA Warriors",
    Based_On: "Competitive Programming",
    Created_By: "Ankit Patel",
    Created_On: "2025-01-10",
    status: "active",
  },
  {
    id: 2,
    Room_Name: "Final Year Projects",
    Based_On: "Academics",
    Created_By: "College Admin",
    Created_On: "2024-11-02",
    status: "active",
  },
  {
    id: 3,
    Room_Name: "Old Syllabus Help",
    Based_On: "Academics",
    Created_By: "Unknown",
    Created_On: "2024-05-18",
    status: "blocked",
  },
  {
    id: 4,
    Room_Name: "AI Enthusiasts",
    Based_On: "Artificial Intelligence",
    Created_By: "Neha Patel",
    Created_On: "2025-03-01",
    status: "active",
  },
  {
    id: 5,
    Room_Name: "Web Dev Circle",
    Based_On: "Web Development",
    Created_By: "Rohan Sharma",
    Created_On: "2025-02-14",
    status: "blocked",
  },
];

const AdminGroupsGrid = ({ searchTerm, categoryFilter }) => {
  const [groups, setGroups] = useState(initialGroups);

  // Filter Logic: Filters by Room Name/Creator and Category
  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const matchesSearch =
        group.Room_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.Created_By.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || group.Based_On === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [groups, searchTerm, categoryFilter]);

  const toggleBlockGroup = (id) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === id
          ? {
              ...group,
              status: group.status === "active" ? "blocked" : "active",
            }
          : group,
      ),
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Premium Grid Header */}
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Groups Created</h3>
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
                onToggleBlock={toggleBlockGroup}
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
