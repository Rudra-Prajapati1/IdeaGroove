import React, { useMemo, useState } from "react";
import {
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

const AdminComplaintsGrid = ({
  complaints,
  searchTerm,
  filterType,
  filterStatus,
  onStatusRequest,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const itemsPerPage = 8;

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        item.Complaint_ID.toString().includes(s) ||
        (item.Student_Name?.toLowerCase() ?? "").includes(s) ||
        (item.Complaint_Text?.toLowerCase() ?? "").includes(s);

      const matchesType =
        filterType === "all" || item.complaintType === filterType;
      const matchesStatus =
        filterStatus === "all" || item.Status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [complaints, searchTerm, filterType, filterStatus]);

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const currentData = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "In-Progress":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Resolved":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-inter">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-primary">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">
          Complaint Logs
        </h3>
        <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
          {filteredComplaints.length} Records Found
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-400">
              <th className="px-8 py-5">Complaint ID</th>
              <th className="px-8 py-5">Student Name</th>
              <th className="px-8 py-5">Type</th>
              <th className="px-8 py-5">Date Filed</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentData.map((item) => (
              <React.Fragment key={item.Complaint_ID}>
                <tr
                  onClick={() =>
                    setExpandedId(
                      expandedId === item.Complaint_ID
                        ? null
                        : item.Complaint_ID,
                    )
                  }
                  className={`hover:bg-gray-50/50 transition-all group cursor-pointer ${
                    expandedId === item.Complaint_ID ? "bg-gray-50/80" : ""
                  }`}
                >
                  <td className="px-8 py-5 text-sm font-bold text-[#1B431C] flex items-center gap-2">
                    #CMP-{item.Complaint_ID}
                    <MessageCircle
                      size={14}
                      className="text-gray-300 group-hover:text-[#1B431C]"
                    />
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-700">
                    {item.Student_Name}
                  </td>
                  {/* TYPE COLUMN */}
                  <td className="px-8 py-5 text-sm">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[11px] font-bold uppercase">
                      {item.complaintType}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-400">
                    {new Date(item.Date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span
                      className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase ${getStatusStyle(item.Status)}`}
                    >
                      {item.Status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusRequest(item);
                      }}
                      className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-[#1B431C] hover:bg-emerald-50 transition-all"
                    >
                      <ClipboardList size={18} />
                    </button>
                  </td>
                </tr>

                {expandedId === item.Complaint_ID && (
                  <tr className="bg-gray-50/50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <td colSpan="6" className="px-8 py-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                          Detailed Issue
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-emerald-500/20 pl-4 py-1">
                          "{item.Complaint_Text}"
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center">
        <p className="text-xs text-gray-400 font-medium">
          Showing{" "}
          <span className="font-bold text-gray-600">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-bold text-gray-600">
            {Math.min(currentPage * itemsPerPage, filteredComplaints.length)}
          </span>{" "}
          <br /> of{" "}
          <span className="font-bold text-gray-600">
            {filteredComplaints.length}
          </span>{" "}
          complaints
        </p>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-2 border border-gray-200 bg-white rounded-lg text-gray-400 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                currentPage === i + 1
                  ? "bg-[#062D1C] text-white"
                  : "bg-white border border-gray-200 text-gray-400"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-2 border border-gray-200 bg-white rounded-lg text-gray-400 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintsGrid;
