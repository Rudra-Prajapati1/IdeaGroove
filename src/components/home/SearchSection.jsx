import React from "react";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";

const SearchSection = () => {
  const popularTags = ["UI Design", "Python", "Marketing", "Robotics"];

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] border border-slate-50 max-w-6xl mx-auto font-sans">
      {/* Search and Filters Row */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search Input Field */}
        <div className="relative flex-1 w-full group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search students by name, skills or interests..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50/80 border-none rounded-[1.5rem] text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
          />
        </div>

        {/* Department Dropdown */}
        <div className="relative w-full md:w-auto">
          <select className="w-full md:w-auto pl-6 pr-14 py-4 bg-slate-50/80 border-none rounded-[1.5rem] text-slate-700 font-bold text-sm outline-none cursor-pointer appearance-none transition-all hover:bg-slate-50">
            <option>All Departments</option>
            <option>Technology</option>
            <option>Management</option>
            <option>Design</option>
          </select>
          <ChevronDown
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* Popular Tags Row */}
      <div className="flex flex-wrap items-center gap-3 mt-6 px-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Example
        </span>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              className="px-5 py-1.5 bg-[#E9F3EA] text-[#2D4F33] rounded-full text-xs font-bold border border-[#D1E7D4] hover:bg-[#D1E7D4] hover:scale-105 transition-all cursor-pointer shadow-sm"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
