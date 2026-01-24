import { CheckCircle, Ban, Calendar, FileText, User } from "lucide-react";
import React, { useState } from "react";
const AdminNoteCard = ({ note, onModerate }) => {
  const isActive = note.status === "active";
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group border-l-4 ${
        !isActive ? "border-l-red-500" : "border-l-emerald-500"
      }`}
    >
      <div className="p-4 pb-2 flex justify-between items-start">
        <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
          ID: {note.id} {/* Mapping to N_ID */}
        </span>
        <span
          className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
            !isActive ? "bg-red-500" : "bg-emerald-500"
          }`}
        >
          {isActive ? "Active" : "Blocked"}
        </span>
      </div>
      <div className="p-4 pt-0">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-tight">
            {note.subject} {/* Mapping to Subject_ID/Subject Name */}
          </span>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
            {note.degree}
          </span>
        </div>

        <h3 className="text-md font-bold text-gray-800 leading-tight mb-2 line-clamp-1 font-poppins group-hover:text-[#1B431C] flex items-center gap-2">
          <FileText size={16} className="text-gray-400" />
          {note.title} {/* Mapping to Note_File (display name) */}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
          {note.description} {/* Mapping to Description */}
        </p>

        <hr className="border-gray-50 mb-4" />

        <div className="space-y-2 font-inter">
          <div className="flex items-center gap-2">
            <User size={14} className="text-gray-400" />
            <p className="text-xs text-gray-500" onClick={() => setIsProfileOpen(true)}>
              By{" "}
              <span className="text-gray-700 font-bold" >{note.uploadedBy}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <p className="text-[11px] text-gray-400">
              {/* Mapping to Added_On */}
              Uploaded: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* ACTION FOOTER (Moderation Logic) */}
      <div className="p-4 pt-2 grid grid-cols-2 gap-3 bg-gray-50/50">
        <button
          onClick={() => onModerate("block", note.id)}
          disabled={!isActive}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            !isActive
              ? "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed opacity-50"
              : "bg-white text-red-600 border-red-100 hover:bg-red-600 hover:text-white"
          }`}
        >
          <Ban size={14} />
          Block
        </button>

        <button
          onClick={() => onModerate("unblock", note.id)}
          disabled={isActive}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            isActive
              ? "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed opacity-50"
              : "bg-[#1B431C] text-white hover:bg-[#153416] border-[#1B431C] shadow-md"
          }`}
        >
          <CheckCircle size={14} />
          Unblock
        </button>
      </div>
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden">
            
            {/* 2. Pass the data and the close function to the profile component */}
            <StudentProfile 
              user={note.uploadedBy} 
              onClose={() => setIsProfileOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNoteCard;
