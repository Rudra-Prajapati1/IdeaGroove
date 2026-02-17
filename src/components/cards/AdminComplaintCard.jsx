import React, { useState } from "react";
import {
  MessageCircle,
  Calendar,
  CheckCircle,
  ChevronDown,
  AlertCircle,
  Hash,
} from "lucide-react";

const AdminComplaintCard = ({ item, onResolve, onBlock }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Status mapping based on DD
  const status = item.Status;
  const isResolved = status === "Resolved";
  const isInProgress = status === "In-Progress";
  const isPending = status === "Pending";

  const accentColor = isPending
    ? "border-l-amber-500"
    : isInProgress
      ? "border-l-blue-500"
      : "border-l-emerald-500";

  return (
    <div
      className={`group bg-white border border-gray-100 border-l-4 ${accentColor} rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg`}
    >
      <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider border ${
                isPending
                  ? "bg-amber-50 text-amber-600 border-amber-100"
                  : isInProgress
                    ? "bg-blue-50 text-blue-600 border-blue-100"
                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}
            >
              {status}
            </span>
            <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
              <Hash size={12} /> ID: {item.Complaint_ID} • {item.degreeName}
            </span>
          </div>

          <h3 className="text-base font-bold text-gray-800 leading-snug">
            Complaint from{" "}
            <span className="text-blue-600">{item.Student_Name}</span>
          </h3>

          <div className="flex items-center gap-4 text-[11px] text-gray-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} /> {new Date(item.Date).toLocaleDateString()}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-gray-500 hover:text-emerald-700 transition-colors"
            >
              <MessageCircle size={13} />{" "}
              {isExpanded ? "Hide Details" : "View Issue"}
              <ChevronDown
                size={13}
                className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onBlock(item.Student_ID)}
            className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold border border-red-100 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all"
          >
            <AlertCircle size={14} /> Block User
          </button>

          <button
            onClick={() => onResolve(item.Complaint_ID)}
            disabled={isResolved}
            className={`flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold transition-all border ${
              isResolved
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            <CheckCircle size={14} /> {isResolved ? "Resolved" : "Resolve"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 animate-in slide-in-from-top-2">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
              Original Complaint
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed italic">
              "{item.Complaint_Text}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintCard;
