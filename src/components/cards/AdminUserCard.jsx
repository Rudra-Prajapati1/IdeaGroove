import React, { useState } from "react";
import { Shield, Calendar, Ban, CheckCircle, Hash, X } from "lucide-react";
import StudentProfile from "../admin/StudentProfile";

const UserCard = ({ user, onModerate }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isActive = user.status === "active";

  return (
    <>
      <div
        className={`group bg-white border-gray-100 border-2 ${
          isActive ? "border-green-500" : "border-red-500"
        } rounded-xl p-4 flex items-center justify-between transition-all hover:shadow-lg  hover:border-gray-200`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center border-2 font-bold text-lg uppercase 
            ${isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}
          >
            {user.name.charAt(0)}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h4
                className="font-bold text-gray-900 leading-tight group-hover:text-[#1B431C] cursor-pointer hover:underline"
                onClick={() => setIsProfileOpen(true)}
              >
                {user.name}
              </h4>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                @{user.username}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">{user.email}</p>

            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              <span className="flex items-center gap-1">
                <Hash size={12} className="text-blue-500" /> {user.rollNo}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-orange-500" /> Year{" "}
                {user.year}
              </span>
              <span className="flex items-center gap-1">
                <Shield size={12} className="text-emerald-500" /> S_ID:{" "}
                {user.id}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span
            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm ${isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`}
            />
            {isActive ? "Active" : "Deleted/Inactive"}
          </span>

          <div className="flex flex-col gap-2 min-w-[130px]">
            <button
              onClick={() => onModerate("block", user.id)}
              disabled={!isActive}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border ${!isActive ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50 grayscale" : "bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white"}`}
            >
              <Ban size={14} /> Deactivate
            </button>

            <button
              onClick={() => onModerate("unblock", user.id)}
              disabled={isActive}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border ${isActive ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50 grayscale" : "bg-[#1B431C] text-white hover:bg-[#153416] border-[#1B431C]"}`}
            >
              <CheckCircle size={14} /> Activate
            </button>
          </div>
        </div>
      </div>

      {/* MODAL OVERLAY */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden">
            {/* 2. Pass the data and the close function to the profile component */}
            <StudentProfile
              user={user}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;
