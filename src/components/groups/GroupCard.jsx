import React from "react";
import group_temp_image from "/images/group_temp_image.jpg";
import { Eye, UserPlus, Flag, Users } from "lucide-react";
import SubmitComplaint from "../../pages/SubmitComplaint";

const GroupCard = ({ group }) => {
  // Helper to determine badge color based on hobby/category
  const getBadgeColor = (category) => {
    const colors = {
      Coding: "bg-green-100 text-green-700",
      Music: "bg-red-50 text-red-800",
      Sports: "bg-blue-50 text-blue-800",
      Arts: "bg-purple-50 text-purple-800",
      Social: "bg-orange-50 text-orange-800",
      Volunteering: "bg-emerald-50 text-emerald-800",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="relative bg-white border border-gray-100 shadow-md rounded-2xl p-6 w-full max-w-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      
      {/* 1. Category Badge and Report Icon (Top Right) */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${getBadgeColor(group.Based_On)}`}>
          {group.Based_On}
        </span>
        <button 
          className="text-gray-300 hover:text-red-500 transition-colors"
          title="Report Group" onClick={SubmitComplaint}
        >
          complaint
        </button>
      </div>

      {/* 2. Group Icon */}
      <div className="mb-4">
        <img
          src={group_temp_image}
          alt={group.Room_Name}
          className="rounded-full h-16 w-16 object-cover border-2 border-gray-50 shadow-sm"
        />
      </div>

      {/* 3. Text Content */}
      <div className="mb-6">
        <h3 className="font-bold font-poppins text-xl text-gray-900 mb-1">
          {group.Room_Name}
        </h3>
        
        {/* Member Count */}
        <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
          <Users className="w-4 h-4" />
          <span className="font-medium">{group.Member_Count || "0"} Members</span>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
          {group.Description || "Exploring data structures, competitive programming, and whiteboard challenges..."}
        </p>
      </div>

      {/* 4. Action Buttons (Side-by-Side) */}
      <div className="flex gap-3">
        <button className="flex-1 border border-primary text-primary py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors text-sm">
          View
          <Eye className="w-4 h-4" />
        </button>
        
        <button className="flex-1 bg-primary text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#153416] transition-colors text-sm shadow-md shadow-primary/20">
          Join
          <UserPlus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default GroupCard;