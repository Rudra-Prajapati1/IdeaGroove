import React, { useState, useMemo } from "react";
import AdminComplaintCard from "./Cards/AdminComplaintCard";

const AdminComplaintsGrid = ({
  complaints,
  searchTerm,
  filterDegree,
  filterStatus,
  onResolve,
  onBlock,
}) => {
  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const s = searchTerm.toLowerCase();

      const matchesSearch =
        item.Complaint_ID.toString().includes(s) ||
        (item.Student_Name?.toLowerCase() ?? "").includes(s) ||
        (item.Complaint_Text?.toLowerCase() ?? "").includes(s);

      const matchesDegree =
        filterDegree === "all" || item.degreeName === filterDegree;
      const matchesStatus =
        filterStatus === "all" || item.Status === filterStatus;

      return matchesSearch && matchesDegree && matchesStatus;
    });
  }, [complaints, searchTerm, filterDegree, filterStatus]);

  const handleResolve = (id) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "RESOLVED" } : c)),
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
