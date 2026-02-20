import React, { useState } from "react";
import { Download, X, FileText, TrendingUp } from "lucide-react";

const StudentProfile = ({ user, onClose }) => {
  const [filter, setFilter] = useState("none");

  // Mock data for activities (extended to include all 5 types)
  const activities = [
    {
      id: 1,
      type: "Notes",
      title: "Quantum Mechanics Lecture Notes",
      course: "PHY401",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "Resources",
      title: "Advanced Calculus Textbook PDF",
      course: "MAT302",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "Q&A",
      title: "Answered: Thermal Dynamics Problem Set 4",
      course: "PHY202",
      time: "1 day ago",
    },
    {
      id: 4,
      type: "Events",
      title: "Registered: Tech Symposium 2024",
      course: "GEN101",
      time: "2 days ago",
    },
    {
      id: 5,
      type: "Groups",
      title: "Joined: AI Research Lab Group",
      course: "CS450",
      time: "3 days ago",
    },
    {
      id: 6,
      type: "Complaints",
      title: "Reported: Lab Equipment Issue",
      course: "PHY401",
      time: "4 days ago",
    },
    {
      id: 7,
      type: "Notes",
      title: "Data Structures Cheat Sheet",
      course: "CS201",
      time: "5 days ago",
    },
  ];

  const filteredActivities = activities.filter(
    (a) => filter === "none" || a.type === filter,
  );

  return (
    <div className="bg-white w-full font-sans">
      {/* Top Green Header */}
      <div className="bg-white text-[#0f3d1e] p-5 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Student Report</h1>
        </div>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-10 py-5 max-w-4xl mx-auto">
        {/* Main Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-4xl font-black text-[#0f3d1e] tracking-tight mb-1">
              {user?.Name.charAt(0).toUpperCase() + user?.Name.slice(1)}
            </h2>
            <p className="text-gray-500 font-semibold text-sm">
              @{user?.Username}
            </p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mb-12">
          <h3 className="text-xs font-black text-gray-800 mb-2 uppercase tracking-widest">
            Profile Information
          </h3>
          <hr className="border-emerald-50 mb-8" />

          <div className="grid grid-cols-2 gap-y-10">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                College
              </p>
              <p className="text-sm font-bold text-gray-800">
                School of Engineering
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Roll No
              </p>
              <p className="text-sm font-bold text-gray-800">{user?.Roll_No}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Email Address
              </p>
              <p className="text-sm font-bold text-gray-800">{user?.Email}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Hobbies
              </p>
              <p className="text-sm font-bold text-gray-800">
                {user?.hobbies.map((h) => h.Hobby_Name).join(", ") ||
                  "No hobbies listed"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Status
              </p>
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${user?.is_Active === 1 ? "bg-emerald-400" : "bg-red-400 shadow-sm"}`}
                ></span>
                <p className="text-sm font-bold text-gray-800">
                  {user?.is_Active === 1 ? "Active Member" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Analysis Section */}
        <div className="bg-gray-50/70 rounded-3xl border border-gray-100 p-8 mb-10">
          <h3 className="text-[#0f3d1e] font-black text-sm uppercase tracking-wider mb-8">
            Engagement Analysis
          </h3>

          <div className="flex flex-col lg:flex-row items-center justify-around gap-12">
            {/* CALCULATED DONUT CHART */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg
                className="w-full h-full -rotate-90 scale-110"
                viewBox="0 0 36 36"
              >
                {/* Background Ring */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-gray-100"
                  strokeWidth="4"
                ></circle>

                {/* 1. Notes Shared (40%) - Starts at 0, Length 40 */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-[#0f3d1e]"
                  strokeWidth="4"
                  strokeDasharray="40 100"
                  strokeDashoffset="0"
                ></circle>

                {/* 2. Q&A Responses (25%) - Starts at 40, Length 25 */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-[#4caf50]"
                  strokeWidth="4"
                  strokeDasharray="25 100"
                  strokeDashoffset="-40"
                ></circle>

                {/* 3. Events (20%) - Starts at 65 (40+25), Length 20 */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-[#1b5e20]"
                  strokeWidth="4"
                  strokeDasharray="20 100"
                  strokeDashoffset="-65"
                ></circle>

                {/* 4. Groups (10%) - Starts at 85 (40+25+20), Length 10 */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-[#81c784]"
                  strokeWidth="4"
                  strokeDasharray="10 100"
                  strokeDashoffset="-85"
                ></circle>

                {/* 5. Complaints (5%) - Starts at 95 (40+25+20+10), Length 5 */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-[#c8e6c9]"
                  strokeWidth="4"
                  strokeDasharray="5 100"
                  strokeDashoffset="-95"
                ></circle>
              </svg>

              <div className="absolute text-center">
                <span className="block text-4xl font-black text-[#0f3d1e] leading-none">
                  156
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">
                  Activities
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <StatItem
                label="Notes Shared"
                value="62"
                percent="40%"
                color="bg-[#0f3d1e]"
                onClick={() => setFilter("Notes")}
              />
              <StatItem
                label="Q&A Responses"
                value="39"
                percent="25%"
                color="bg-[#4caf50]"
                onClick={() => setFilter("Q&A")}
              />
              <StatItem
                label="Events"
                value="31"
                percent="20%"
                color="bg-[#1b5e20]"
                onClick={() => setFilter("Events")}
              />
              <StatItem
                label="Groups"
                value="24"
                percent="10%"
                color="bg-[#81c784]"
                onClick={() => setFilter("Groups")}
              />
              <StatItem
                label="Complaints"
                value="12"
                percent="5%"
                color="bg-[#c8e6c9]"
                onClick={() => setFilter("Complaints")}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Activity List */}
        {filter !== "none" ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-8 pt-6 border-t border-gray-100">
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-widest">
                Recent{" "}
                <span className="text-[#0f3d1e] underline decoration-emerald-200 underline-offset-4">
                  {filter}
                </span>{" "}
                Activities
              </h3>
              <button
                onClick={() => setFilter("none")}
                className="text-[10px] bg-red-50 text-red-500 px-3 py-1 rounded-full font-black uppercase hover:bg-red-500 hover:text-white transition shadow-sm"
              >
                Clear Filter
              </button>
            </div>

            <div className="space-y-6">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 group/item"
                  >
                    <div className="flex items-center gap-5">
                      <div className="bg-emerald-50 p-3 rounded-2xl group-hover/item:bg-[#0f3d1e] transition-colors">
                        <FileText
                          size={20}
                          className="text-[#0f3d1e] group-hover/item:text-white"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-base leading-tight group-hover/item:text-[#0f3d1e] transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">
                          Category:{" "}
                          <span className="text-gray-600">{item.type}</span> •
                          Course:{" "}
                          <span className="uppercase text-gray-600 font-bold">
                            {item.course}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-gray-300 uppercase group-hover/item:text-gray-500">
                      {item.time}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 italic py-4">
                  No recent activities found for this category.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-300 text-sm font-bold italic tracking-wide">
              Select a category above to visualize detailed engagement metrics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Stat Component
const StatItem = ({ label, value, percent, color, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer group select-none flex flex-col items-center lg:items-start"
  >
    <div className="flex items-center gap-3 mb-2">
      <span
        className={`w-3 h-3 rounded-full ${color} shadow-sm group-hover:scale-125 transition-transform`}
      ></span>
      <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#0f3d1e] transition-colors">
        {label}
      </span>
    </div>
    <p className="text-2xl font-black text-gray-800 group-hover:translate-x-1 transition-transform">
      {value}{" "}
      <span className="text-sm font-medium text-gray-300 ml-1">
        ({percent})
      </span>
    </p>
  </div>
);

export default StudentProfile;
