import React from "react";
import { Shield, Calendar, Ban, CheckCircle } from "lucide-react";

const UserCard = ({ user, onModerate }) => {
  const isActive = user.status === "active";

  return (
    <div className={`group bg-white border border-gray-100 border-l-4 ${isActive ? 'border-l-emerald-500' : 'border-l-red-500'} rounded-xl p-4 flex items-center justify-between transition-all hover:shadow-lg hover:border-gray-200`}>
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <div className={`h-11 w-11 rounded-full flex items-center justify-center border-2 font-bold text-lg uppercase transition-colors
          ${isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
          {user.name.charAt(0)}
        </div>

        <div className="flex flex-col">
          <h4 className="font-bold text-gray-900 leading-tight font-poppins group-hover:text-[#1B431C] transition-colors">
            {user.name}
          </h4>
          <p className="text-sm text-gray-500 mb-1 font-inter">{user.email}</p>

          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-tighter font-inter">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-blue-500" /> Joined Jan 2024
            </span>
            <span className="flex items-center gap-1">
              <Shield size={12} className="text-emerald-500" /> ID: #{user.id}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Status Indicator Badge */}
        <span
          className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm font-inter
            ${isActive 
              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
              : "bg-red-50 text-red-700 border-red-100"}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
          {isActive ? "Active" : "Blocked"}
        </span>

        {/* ADMIN ACTIONS */}
        <div className="flex flex-col gap-2 min-w-[130px] font-inter">
          <button
            onClick={() => onModerate("block", user.id)}
            disabled={!isActive}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border
              ${!isActive 
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50 grayscale" 
                : "bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white"}`}
          >
            <Ban size={14} /> Block Account
          </button>

          <button
            onClick={() => onModerate("unblock", user.id)}
            disabled={isActive}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border
              ${isActive 
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50 grayscale" 
                : "bg-[#1B431C] text-white hover:bg-[#153416] border-[#1B431C] shadow-lg shadow-green-100"}`}
          >
            <CheckCircle size={14} /> Unblock User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;