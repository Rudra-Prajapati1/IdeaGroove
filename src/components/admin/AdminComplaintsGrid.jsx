import React, { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredComplaints]);

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
      {currentData.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Showing{" "}
            <span className="text-gray-600">
              {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredComplaints.length)}
            </span>{" "}
            of{" "}
            <span className="text-gray-600">{filteredComplaints.length}</span>{" "}
            Complaints
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

export default AdminComplaintsGrid;
