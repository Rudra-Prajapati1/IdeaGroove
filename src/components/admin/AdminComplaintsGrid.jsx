import React, { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  MessageSquareText,
  UserRound,
} from "lucide-react";
import StudentProfile from "./StudentProfile";

const AdminComplaintsGrid = ({
  complaints,
  searchTerm,
  filterType,
  filterStatus,
  onStatusRequest,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedProfileStudentId, setSelectedProfileStudentId] =
    useState(null);
  const itemsPerPage = 8;
  const normalizeType = (value) =>
    String(value || "")
      .trim()
      .replace(/[^a-z]/gi, "")
      .toLowerCase();

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        item.Complaint_ID.toString().includes(s) ||
        (item.Student_Name?.toLowerCase() ?? "").includes(s) ||
        (item.Complaint_Text?.toLowerCase() ?? "").includes(s) ||
        (item.Reported_Activity?.toLowerCase() ?? "").includes(s) ||
        (item.Content_Title?.toLowerCase() ?? "").includes(s) ||
        (item.Content_Owner_Name?.toLowerCase() ?? "").includes(s);

      const matchesType =
        filterType === "all" ||
        normalizeType(item.Type) === normalizeType(filterType);
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

  const getTypeStyle = (type) => {
    const normalizedType = normalizeType(type).toUpperCase();

    switch (normalizedType) {
      case "NOTES":
      case "NOTE":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "QUESTION":
      case "QNA":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "ANSWER":
        return "bg-green-100 text-green-800 border-green-200";
      case "EVENTS":
      case "EVENT":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "USER":
        return "bg-sky-100 text-sky-700 border-sky-200";
      case "GROUPS":
      case "GROUP":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "OTHER":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatTypeLabel = (type) => {
    switch (normalizeType(type)) {
      case "question":
        return "Question";
      case "answer":
        return "Answer";
      case "notes":
      case "note":
        return "Notes";
      case "groups":
      case "group":
        return "Groups";
      case "event":
      case "events":
        return "Event";
      case "user":
        return "User";
      case "other":
        return "Other";
      default:
        return type || "Unknown";
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
              <th className="px-8 py-5">Student Name</th>
              <th className="px-8 py-5">Type</th>
              <th className="px-8 py-5">Reported Activity</th>
              <th className="px-8 py-5">Date Filed</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentData.map((item) => (
              <React.Fragment key={item.Complaint_ID}>
                <tr
                  className={`hover:bg-gray-50/50 transition-all group ${
                    expandedId === item.Complaint_ID ? "bg-gray-50/80" : ""
                  }`}
                >
                  <td className="px-8 py-5 text-sm font-medium text-gray-700">
                    <button
                      onClick={() => setSelectedProfileStudentId(item.Student_ID)}
                      title="View student profile"
                      className="group/author flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#1B431C] transition-colors"
                    >
                      <span className="text-xs md:text-base">
                        <span className="font-bold text-gray-800 group-hover/author:text-[#1B431C] underline underline-offset-4 decoration-dashed decoration-gray-300 group-hover/author:decoration-[#1B431C] transition-colors">
                          {item.Student_Name || "Unknown"}
                        </span>
                      </span>
                      <ExternalLink size={14} />
                    </button>
                  </td>
                  {/* TYPE COLUMN */}
                  <td className="px-8 py-5 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-[11px] font-bold uppercase border ${getTypeStyle(item.Type)}`}
                    >
                      {formatTypeLabel(item.Type)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-600">
                    <div className="min-w-max">
                      <p className="font-semibold text-gray-700 whitespace-nowrap">
                        {item.Reported_Activity ||
                          item.Content_Title ||
                          "IdeaGroove platform"}
                      </p>
                      {item.Content_Owner_Name &&
                        item.Content_Owner_Name !== "N/A" && (
                          <p className="mt-1 text-[11px] font-medium text-gray-400">
                            Owner: @{item.Content_Owner_Name}
                          </p>
                        )}
                    </div>
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onStatusRequest(item)}
                        title={
                          item.Status === "Pending"
                            ? "Review complaint status"
                            : "Update complaint status"
                        }
                        className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-[#1B431C] text-white hover:bg-[#153416] transition-colors"
                      >
                        <ClipboardList size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(
                            expandedId === item.Complaint_ID
                              ? null
                              : item.Complaint_ID,
                          );
                        }}
                        className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-[#1B431C] hover:bg-emerald-50 transition-all"
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            expandedId === item.Complaint_ID ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>

                {expandedId === item.Complaint_ID && (
                  <tr className="bg-gray-50/50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <td colSpan="6" className="px-8 py-4">
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                              <MessageSquareText size={18} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-800">
                                Student Complaint
                              </h4>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Complaint text submitted by student
                              </p>
                            </div>
                          </div>
                          <p className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-4 text-sm leading-relaxed text-gray-700">
                            "{item.Complaint_Text}"
                          </p>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                              <Info size={18} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-800">
                                Reported Activity
                              </h4>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Actual content that received the complaint
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-4">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Activity
                              </p>
                              <p className="mt-1 text-sm font-semibold leading-relaxed text-gray-700">
                                {item.Reported_Activity ||
                                  item.Content_Title ||
                                  "IdeaGroove platform"}
                              </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="rounded-xl bg-white/80 px-3 py-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                  Type
                                </p>
                                <p className="mt-1 text-sm font-semibold text-gray-700">
                                  {formatTypeLabel(item.Type)}
                                </p>
                              </div>
                              <div className="rounded-xl bg-white/80 px-3 py-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                  Owner
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                  <UserRound size={14} className="text-gray-400" />
                                  <span>
                                    {item.Content_Owner_Name &&
                                    item.Content_Owner_Name !== "N/A"
                                      ? `@${item.Content_Owner_Name}`
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {selectedProfileStudentId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedProfileStudentId(null)
          }
        >
          <div className="relative bg-[#f8faf8] rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <StudentProfile
              id={selectedProfileStudentId}
              onClose={() => setSelectedProfileStudentId(null)}
            />
          </div>
        </div>
      )}

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
