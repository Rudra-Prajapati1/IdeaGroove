import React from "react";
import group_temp_image from "/images/group_temp_image.jpg";

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
    <div className="relative bg-white border border-gray-200 shadow-sm rounded-2xl p-6 w-full max-w-sm transition-transform hover:scale-[1.02]">
      
      {/* 1. Category Badge (Top Right) */}
      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(group.Based_On)}`}>
        {group.Based_On}
      </span>

      {/* 2. Group Icon */}
      <div className="mb-4">
        <img
          src={group_temp_image}
          alt={group.Room_Name}
          className="rounded-full h-16 w-16 object-cover border-2 border-gray-100 shadow-sm"
        />
      </div>

      {/* 3. Text Content */}
      <div className="mb-6">
        <h3 className="font-bold font-poppins text-xl text-gray-900 mb-1">
          {group.Room_Name}
        </h3>
        
        {/* Member Count with Icon */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="font-medium">{group.Member_Count || "0"} Members</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {group.Description || "No description provided for this group."}
        </p>
      </div>

      {/* 4. Full-Width Join Button */}
      <button className="w-full bg-[#1B431C] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2a5c2b] transition-colors">
        Join Group
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      </button>
    </div>
  );
};

export default GroupCard;