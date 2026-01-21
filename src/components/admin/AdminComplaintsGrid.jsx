import React, { useState, useMemo } from "react";
import AdminComplaintCard from "./Cards/AdminComplaintCard";

const initialComplaints = [
  {
    id: "#CMP-4582",
    name: "Alex Thompson",
    category: "Resource Access",
    date: "Oct 24, 2023",
    status: "PENDING",
    description:
      "Unable to access data science modules from hostel Wi-Fi. Shows 403 Forbidden error.",
  },
  {
    id: "#CMP-4579",
    name: "Sarah Jenkins",
    category: "Group Conflict",
    date: "Oct 22, 2023",
    status: "IN PROGRESS",
    description: "Conflict in BCA group project regarding task distribution.",
  },
  {
    id: "#CMP-4570",
    name: "Emma Rodriguez",
    category: "Other",
    date: "Oct 18, 2023",
    status: "HIGH PRIORITY",
    description: "Request for urgent meeting regarding scholarship deadlines.",
  },
  {
    id: "#CMP-4575",
    name: "Michael Chen",
    category: "Technical Issue",
    date: "Oct 20, 2023",
    status: "RESOLVED",
    description: "Portal login credentials reset manually.",
  },
];

const AdminComplaintsGrid = ({ searchTerm, categoryFilter }) => {
  const [complaints, setComplaints] = useState(initialComplaints);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [complaints, searchTerm, categoryFilter]);

  const handleResolve = (id) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "RESOLVED" } : c)),
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with results count */}
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">
          Complaints Registered
        </h3>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
          {filteredComplaints.length} Complaints Found
        </span>
      </div>

      <div className="p-4 flex flex-col gap-4 bg-gray-50/30">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((item) => (
            <AdminComplaintCard
              key={item.id}
              item={item}
              onResolve={handleResolve}
              onBlock={(id) => console.log("Block user for complaint:", id)}
            />
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
              No complaints found matching your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaintsGrid;
