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
  MessageSquare,
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
        className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden hover:-translate-y-0.5 ${isActive ? "hover:border-green-300" : "hover:border-red-300"}`}
      >
        {/* Colored Header Band */}
        <div
          className={`relative h-24 w-full flex items-center justify-center
          ${
            isActive
              ? "bg-linear-to-br from-emerald-500 to-teal-700"
              : "bg-linear-to-br from-red-400 to-rose-600"
          }`}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* Icon */}
          <div className="relative z-10 h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <MessageSquare size={22} className="text-white" />
          </div>

          {/* ID badge */}
          <span className="absolute top-3 left-3 text-[10px] font-mono font-semibold text-white/70 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-md">
            #{group.id}
          </span>

          {/* Status pill */}
          <span
            className={`absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full
            ${isActive ? "bg-white/20 text-white backdrop-blur-sm" : "bg-white/20 text-white backdrop-blur-sm"}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white animate-pulse" : "bg-white/60"}`}
            />
            {isActive ? "Active" : "Blocked"}
          </span>

          {/* Group name pinned to bottom */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-bold text-white text-sm line-clamp-1 font-poppins drop-shadow">
              {group.Name}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          {/* Tag */}
          <div className="mb-3">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
              {group.Based_On}
            </span>
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-1.5 border-t border-gray-50 pt-3 mb-4">
            <button
              onClick={() => setIsProfileOpen(true)}
              title="View student profile"
              className="group/author flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#1B431C] transition-colors w-fit"
            >
              <ShieldCheck
                size={12}
                className="text-gray-300 group-hover/author:text-[#1B431C] transition-colors"
              />
              <span>
                Admin:{" "}
                <span className="font-semibold text-md text-gray-600 group-hover/author:text-[#1B431C] underline underline-offset-2 decoration-dashed decoration-gray-300 group-hover/author:decoration-[#1B431C] transition-colors">
                  {group.Creator_Name}
                </span>
              </span>
              <ExternalLink
                size={11}
                className="opacity-0 group-hover/author:opacity-100 transition-opacity"
              />
            </button>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Calendar size={11} className="text-gray-300" />
              Created:{" "}
              <span className="font-semibold text-gray-500">
                {new Date(group.Created_On).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* View Members */}
          <button
            disabled={!isAuth}
            onClick={() => setIsModalOpen(true)}
            className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all
              ${
                isAuth
                  ? "text-[#1B431C] bg-emerald-50 hover:bg-[#1B431C] hover:text-white cursor-pointer"
                  : "text-gray-300 bg-gray-100 cursor-not-allowed"
              }`}
          >
            <Users size={13} />
            View Members
          </button>
        </div>

        {/* Action Footer */}
        <div className="px-4 py-3 border-t border-gray-50 flex gap-2 bg-gray-50/40">
          <button
            onClick={() => onModerate("block", group.id)}
            disabled={!isActive}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
              ${
                !isActive
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "text-red-500 bg-red-50 hover:bg-red-500 hover:text-white"
              }`}
          >
            <Ban size={12} /> Block
          </button>
          <button
            onClick={() => onModerate("unblock", group.id)}
            disabled={isActive}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
              ${
                isActive
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-[#1B431C] text-white hover:bg-[#153416]"
              }`}
          >
            <CheckCircle size={12} /> Unblock
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
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
