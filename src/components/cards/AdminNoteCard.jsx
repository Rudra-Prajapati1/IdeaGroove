// import { CheckCircle, Ban, Calendar, FileText, User } from "lucide-react";
// import React, { useState } from "react";

// const AdminNoteCard = ({ note, onModerate }) => {
//   const isActive = note.status === "active";

//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   return (
//     <div
//       className={`bg-white rounded-2xl  border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group border-2 ${
//         !isActive ? "border-red-500" : "border-green-500"
//       }  hover:border-gray-200`}
//     >
//       <div className="p-4 pb-2 flex justify-between items-start">
//         <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
//           ID: {note.id} {/* Mapping to N_ID */}
//         </span>
//         <span
//           className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
//             !isActive ? "bg-red-500" : "bg-emerald-500"
//           }`}
//         >
//           {isActive ? "Active" : "Blocked"}
//         </span>
//       </div>
//       <div className="p-4 pt-0">
//         <div className="mb-2 flex items-center gap-2">
//           <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-tight">
//             {note.subject} {/* Mapping to Subject_ID/Subject Name */}
//           </span>
//           <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
//             {note.degree}
//           </span>
//         </div>

//         <h3 className="text-md font-bold text-gray-800 leading-tight mb-2 line-clamp-1 font-poppins group-hover:text-[#1B431C] flex items-center gap-2">
//           <FileText size={16} className="text-gray-400" />
//           {note.title} {/* Mapping to Note_File (display name) */}
//         </h3>

//         <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
//           {note.file} {/* Mapping to Description */}
//         </p>

//         <hr className="border-gray-50 mb-4" />

//         <div className="space-y-2 font-inter">
//           <div className="flex items-center gap-2">
//             <User size={14} className="text-gray-400" />
//             <p
//               className="text-xs text-gray-500"
//               onClick={() => setIsProfileOpen(true)}
//             >
//               By{" "}
//               <span className="text-gray-700 font-bold">{note.uploadedBy}</span>
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Calendar size={14} className="text-gray-400" />
//             <p className="text-[11px] text-gray-400">
//               Uploaded:{" "}
//               {new Date().toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ACTION FOOTER (Moderation Logic) */}
//       <div className="p-4 pt-2 grid grid-cols-2 gap-3 bg-gray-50/50">
//         <button
//           onClick={() => onModerate("block", note.id)}
//           disabled={!isActive}
//           className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
//             !isActive
//               ? "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed opacity-50"
//               : "bg-white text-red-600 border-red-100 hover:bg-red-600 hover:text-white"
//           }`}
//         >
//           <Ban size={14} />
//           Block
//         </button>

//         <button
//           onClick={() => onModerate("unblock", note.id)}
//           disabled={isActive}
//           className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
//             isActive
//               ? "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed opacity-50"
//               : "bg-[#1B431C] text-white hover:bg-[#153416] border-[#1B431C] shadow-md"
//           }`}
//         >
//           <CheckCircle size={14} />
//           Unblock
//         </button>
//       </div>
//       {isProfileOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden">
//             {/* 2. Pass the data and the close function to the profile component */}
//             <StudentProfile
//               user={note.uploadedBy}
//               onClose={() => setIsProfileOpen(false)}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminNoteCard;

import {
  CheckCircle,
  Ban,
  Calendar,
  FileText,
  User,
  ExternalLink,
} from "lucide-react";
import React, { useState } from "react";
import StudentProfile from "../admin/StudentProfile";

const AdminNoteCard = ({ note, onModerate }) => {
  const isActive = note.status === "active";
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div
        className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden group ${isActive ? "hover:border-green-300 hover:shadow-green-200" : "hover:border-red-300 hover:shadow-red-200"}`}
      >
        <div className="px-4 pt-4 pb-3 flex justify-between items-center">
          <span className="text-[10px] font-mono font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
            #{note.id}
          </span>
          <span
            className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full
              ${
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-500"
              }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`}
            />
            {isActive ? "Active" : "Blocked"}
          </span>
        </div>

        {/* Body */}
        <div className="px-4 pb-4">
          {/* Tags */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-tight">
              {note.subject}
            </span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
              {note.degree}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-gray-800 leading-snug mb-1.5 line-clamp-1 font-poppins group-hover:text-[#1B431C] transition-colors flex items-center gap-2">
            <FileText size={14} className="text-gray-300 shrink-0" />
            {note.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
            {note.file}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <button
              onClick={() => setIsProfileOpen(true)}
              title="View student profile"
              className="group/author flex items-center gap-1.5 hover:text-[#1B431C] transition-colors"
            >
              <User
                size={11}
                className="text-gray-300 group-hover/author:text-[#1B431C] transition-colors"
              />
              <span>
                By{" "}
                <span className="font-semibold text-gray-600 group-hover/author:text-[#1B431C] underline underline-offset-2 decoration-dashed decoration-gray-300 group-hover/author:decoration-[#1B431C] transition-colors">
                  {note.uploadedBy}
                </span>
              </span>
              <ExternalLink
                size={9}
                className="text-gray-300 opacity-0 group-hover/author:opacity-100 transition-opacity"
              />
            </button>
            <div className="flex items-center gap-1">
              <Calendar size={11} className="text-gray-300" />
              <span>
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-4 py-3 border-t border-gray-50 flex gap-2 bg-gray-50/40">
          <button
            onClick={() => onModerate("block", note.id)}
            disabled={!isActive}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
              ${
                !isActive
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "text-red-500 bg-red-50 hover:bg-red-500 hover:text-white"
              }`}
          >
            <Ban size={12} />
            Block
          </button>

          <button
            onClick={() => onModerate("unblock", note.id)}
            disabled={isActive}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
              ${
                isActive
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-[#1B431C] text-white hover:bg-[#153416]"
              }`}
          >
            <CheckCircle size={12} />
            Unblock
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setIsProfileOpen(false)
          }
        >
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <StudentProfile
              id={note.userId} // Assuming Added_By contains the S_ID of the uploader
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNoteCard;
