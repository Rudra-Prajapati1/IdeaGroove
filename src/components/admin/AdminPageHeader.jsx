import React from "react";
import { Search, GraduationCap, BookOpen, CalendarDays } from "lucide-react";

const AdminPageHeader = ({
  title,
  subtitle,
  onSearch,
  searchValue,
  degreeOptions = [],
  subjectOptions = [],
  onDegreeFilter,
  onSubjectFilter,
  secondTitle = "All Subjects",
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-2">
      <div className="flex-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 font-medium mt-1 uppercase tracking-wider opacity-70">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Search Bar */}
        <div className="relative group flex-1 min-w-[250px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={`Search ${title.split(" ")[0]}...`}
            className="w-full bg-white border border-gray-200 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
          />
        </div>

        {/* Degree Filter - Only displays if degreeOptions has items */}
        {degreeOptions.length > 0 && (
          <div className="relative flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2.5 shadow-sm hover:border-gray-300 transition-all group">
            <GraduationCap
              size={16}
              className="text-gray-400 group-hover:text-blue-500 transition-colors"
            />
            <select
              onChange={(e) => onDegreeFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-700 focus:outline-none cursor-pointer pr-2"
            >
              <option value="all">All Degrees</option>
              {degreeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {subjectOptions.length > 0 && (
          <div className="relative flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2.5 shadow-sm hover:border-gray-300 transition-all group">
            <BookOpen
              size={16}
              className="text-gray-400 group-hover:text-emerald-500 transition-colors"
            />

            <select
              onChange={(e) => onSubjectFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-700 focus:outline-none cursor-pointer pr-2"
            >
              <option value="all">{secondTitle}</option>
              {subjectOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPageHeader;
