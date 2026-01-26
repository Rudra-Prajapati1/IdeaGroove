import React from "react";
import { Search, GraduationCap, BookOpen, CalendarDays } from "lucide-react";
import SimpleDropdown from "./SimpleDropdown";

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
        {onSearch && (
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
        )}

        {degreeOptions.length > 0 && (
          <SimpleDropdown
            icon={GraduationCap}
            options={degreeOptions}
            value={null}
            placeholder="All Degrees"
            onChange={onDegreeFilter}
            accent="blue"
          />
        )}

        {subjectOptions.length > 0 && (
          <SimpleDropdown
            icon={BookOpen}
            options={subjectOptions}
            value={null}
            placeholder={secondTitle}
            onChange={onSubjectFilter}
            accent="emerald"
          />
        )}
      </div>
    </div>
  );
};

export default AdminPageHeader;
