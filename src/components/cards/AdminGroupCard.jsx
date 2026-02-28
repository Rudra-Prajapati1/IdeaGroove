// import React, { useState } from "react";
// import {
//   Ban,
//   CheckCircle,
//   Calendar,
//   ShieldCheck,
//   MessageSquare,
//   Users,
//   ExternalLink,
// } from "lucide-react";
// import { selectIsAuthenticated } from "../../redux/slice/authSlice";
// import { useSelector } from "react-redux";
// import AdminViewMembers from "../admin/AdminViewMember";
// import StudentProfile from "../admin/StudentProfile";

// const AdminGroupCard = ({ group, onModerate }) => {
//   const isActive = group.status === "active";
//   const isAuth = useSelector(selectIsAuthenticated);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   return (
//     <div
//       className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col ${
//         !isActive ? "border-red-500" : "border-green-500"
//       } hover:border-gray-200`}
//     >
//       <div className="p-5 flex flex-col flex-1">
//         {/* Header: Status & ID */}
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex items-center gap-2">
//             <div
//               className={`p-2 rounded-lg ${
//                 isActive
//                   ? "bg-emerald-50 text-emerald-600"
//                   : "bg-red-50 text-red-600"
//               }`}
//             >
//               <MessageSquare size={20} />
//             </div>
//             <div>
//               <h3 className="font-bold text-slate-800 line-clamp-1 font-poppins group-hover:text-[#1B431C]">
//                 {group.Name}
//               </h3>
//               <span className="text-[10px] font-mono text-gray-400">
//                 ROOM_ID: #{group.id}
//               </span>
//             </div>
//           </div>
//           <span
//             className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider text-white ${
//               isActive ? "bg-emerald-500" : "bg-red-500"
//             }`}
//           >
//             {isActive ? "Active" : "Blocked"}
//           </span>
//         </div>

//         {/* Categories */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
//             {group.Based_On}
//           </span>
//           {/* <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase">
//             {group.Room_Type}
//           </span>
//           <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
//             {group.Degree}
//           </span> */}
//         </div>

//         {/* Metadata */}
//         <div className="space-y-2 border-t border-slate-50 pt-4 font-inter">
//           <div className="flex items-center gap-2 text-xs text-slate-500">
//             <button
//               onClick={() => setIsProfileOpen(true)}
//               title="View student profile"
//               className="group/author flex items-center gap-1.5 hover:text-[#1B431C] transition-colors"
//             >
//               <ShieldCheck size={14} className="text-slate-400" />
//               <span>
//                 Admin:{" "}
//                 <span className="font-semibold text-[0.75rem] text-gray-600 group-hover/author:text-[#1B431C] underline underline-offset-2 decoration-dashed decoration-gray-300 group-hover/author:decoration-[#1B431C] transition-colors">
//                   {group.Creator_Name}
//                 </span>
//               </span>
//               <ExternalLink
//                 size={9}
//                 className="text-gray-300 opacity-0 group-hover/author:opacity-100 transition-opacity"
//               />
//             </button>
//           </div>
//           <div className="flex items-center gap-2 text-xs text-slate-500">
//             <Calendar size={14} className="text-slate-400" />
//             <span>
//               Created:{" "}
//               {new Date(group.Created_On).toLocaleDateString("en-GB", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </span>
//           </div>
//         </div>

//         <button
//           disabled={!isAuth}
//           onClick={() => setIsModalOpen(true)}
//           className={`${isAuth ? "cursor-pointer" : "cursor-not-allowed"} w-8/10 m-auto mt-5 mb-3 py-2 flex-1 border border-primary text-primary rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors text-sm`}
//         >
//           View Members
//           <Users className="w-4 h-4" />
//         </button>

//         {/* Actions (Block/Unblock) */}
//         <div className="mt-3 grid grid-cols-2 gap-3">
//           <button
//             onClick={() => onModerate("block", event.id)}
//             disabled={!isActive}
//             className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
//                         ${
//                           isActive
//                             ? "text-red-500 bg-red-50 hover:bg-red-500 hover:text-white"
//                             : "bg-gray-100 text-gray-300 cursor-not-allowed"
//                         }`}
//           >
//             <Ban size={12} /> Block
//           </button>

//           <button
//             onClick={() => onModerate("unblock", event.id)}
//             disabled={isActive}
//             className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
//                         ${
//                           isActive
//                             ? "bg-gray-100 text-gray-300 cursor-not-allowed"
//                             : "bg-[#1B431C] text-white hover:bg-[#153416]"
//                         }`}
//           >
//             <CheckCircle size={12} /> Unblock
//           </button>
//         </div>
//       </div>
//       {isModalOpen && (
//         <AdminViewMembers group={group} setIsModalOpen={setIsModalOpen} />
//       )}
//       {isProfileOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
//           onClick={(e) =>
//             e.target === e.currentTarget && setIsProfileOpen(false)
//           }
//         >
//           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
//             <StudentProfile
//               id={group.Creator_ID}
//               onClose={() => setIsProfileOpen(false)}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminGroupCard;

import React, { useState } from "react";
import {
  Ban,
  CheckCircle,
  Calendar,
  ShieldCheck,
  Users,
  ExternalLink,
} from "lucide-react";
import { selectIsAuthenticated } from "../../redux/slice/authSlice";
import { useSelector } from "react-redux";
import AdminViewMembers from "../admin/AdminViewMember";
import StudentProfile from "../admin/StudentProfile";

const AdminGroupCard = ({ group, onModerate }) => {
  const isActive = group.status === "active";
  const isAuth = useSelector(selectIsAuthenticated);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div
        className={`bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden ${isActive ? "hover:border-green-300 hover:shadow-green-200" : "hover:border-red-300 hover:shadow-red-200"}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Group Icon */}
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Users size={18} className="text-[#1B431C]" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 text-base">
                {group.Name}
              </h3>

              <span className="inline-block mt-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                {group.Based_On}
              </span>
            </div>
          </div>

          {/* Status */}
          <span
            className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full
              ${
                isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
              }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-emerald-600" : "bg-red-500"
              }`}
            />
            {isActive ? "Active" : "Blocked"}
          </span>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-4 text-sm">
          {/* Admin (UNCHANGED readability structure) */}
          <button
            onClick={() => setIsProfileOpen(true)}
            title="View student profile"
            className="group/author flex items-center gap-2 text-[13px] text-gray-500 hover:text-[#1B431C] transition-colors w-fit"
          >
            <ShieldCheck
              size={14}
              className="text-gray-400 group-hover/author:text-[#1B431C] transition-colors"
            />
            <span>
              Admin:{" "}
              <span className="font-semibold text-gray-700 underline underline-offset-2 decoration-dashed decoration-gray-300 group-hover/author:decoration-[#1B431C] transition-colors">
                {group.Creator_Name}
              </span>
            </span>
            <ExternalLink
              size={13}
              className="opacity-60 group-hover/author:opacity-100 transition-opacity"
            />
          </button>

          {/* Created On */}
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={14} className="text-gray-400" />
            <span>
              Created on{" "}
              <span className="font-semibold">
                {new Date(group.Created_On).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </span>
          </div>

          {/* View Members */}
          <button
            disabled={!isAuth}
            onClick={() => setIsModalOpen(true)}
            className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all
              ${
                isAuth
                  ? "bg-emerald-50 text-[#1B431C] hover:bg-[#1B431C] hover:text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Users size={14} />
            View Members
          </button>
        </div>

        {/* Single Dynamic Action Button */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => onModerate(isActive ? "block" : "unblock", group.id)}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all
              ${
                isActive
                  ? "text-red-500 bg-red-50 hover:bg-red-500 hover:text-white"
                  : "bg-[#1B431C] text-white hover:bg-[#153416]"
              }`}
          >
            {isActive ? (
              <>
                <Ban size={14} /> Block Group
              </>
            ) : (
              <>
                <CheckCircle size={14} /> Unblock Group
              </>
            )}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <AdminViewMembers group={group} setIsModalOpen={setIsModalOpen} />
      )}

      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setIsProfileOpen(false)
          }
        >
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <StudentProfile
              id={group.Creator_ID}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminGroupCard;
