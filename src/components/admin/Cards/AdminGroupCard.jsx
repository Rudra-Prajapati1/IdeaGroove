import React from "react";
import {
  Ban,
  CheckCircle,
  Calendar,
  ShieldCheck,
  MessageSquare,
  Users, // Added for View Members
} from "lucide-react";

const AdminGroupCard = ({ group, onModerate, onViewMembers }) => {
  const isActive = group.status === "active";

  return (
    <div
      className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col ${
        !isActive ? "border-red-500" : "border-green-500"
      } hover:border-gray-200`}
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Header: Status & ID */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}
            >
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 line-clamp-1 font-poppins group-hover:text-[#1B431C]">
                {group.Room_Name}
              </h3>
              <span className="text-[10px] font-mono text-gray-400">
                ROOM_ID: #{group.id}
              </span>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider text-white ${
              isActive ? "bg-emerald-500" : "bg-red-500"
            }`}
          >
            {isActive ? "Active" : "Blocked"}
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
            {group.Based_On}
          </span>
          <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase">
            {group.Room_Type}
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
            {group.Degree}
          </span>
        </div>

        {/* Metadata */}
        <div className="space-y-2 border-t border-slate-50 pt-4 font-inter">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-slate-400" />
            <span>
              Admin:{" "}
              <span className="font-semibold text-slate-700">
                {group.Created_By_Name}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar size={14} className="text-slate-400" />
            <span>
              Created:{" "}
              {new Date(group.Created_On).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* View Members Button (Full Width) */}
        <button
          onClick={() => onViewMembers(group)}
          className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors border border-slate-200"
        >
          <Users size={14} /> View Members
        </button>

        {/* Actions (Block/Unblock) */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            onClick={() => onModerate("block", group.id)}
            disabled={!isActive}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              !isActive
                ? "bg-slate-50 text-slate-300 border-slate-100 opacity-50 cursor-not-allowed"
                : "bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white"
            }`}
          >
            <Ban size={14} /> Block
          </button>
          <button
            onClick={() => onModerate("unblock", group.id)}
            disabled={isActive}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              isActive
                ? "bg-slate-50 text-slate-300 border-slate-100 opacity-50 cursor-not-allowed"
                : "bg-[#1B431C] text-white hover:bg-[#153416]"
            }`}
          >
            <CheckCircle size={14} /> Unblock
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminGroupCard;