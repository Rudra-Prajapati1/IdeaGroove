import { useState } from "react";
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

const AdminGroupsGrid = () => {
  const [groups, setGroups] = useState(initialGroups);

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
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-gray-800">Groups Created</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <AdminGroupCard
            key={group.id}
            group={group}
            onToggleBlock={toggleBlockGroup}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminGroupsGrid;
