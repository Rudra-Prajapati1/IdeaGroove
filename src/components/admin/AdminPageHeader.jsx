import React, { useState, useEffect, useMemo } from "react";
import { Search, GraduationCap, BookOpen, Heart } from "lucide-react";
import SimpleDropdown from "./SimpleDropdown";
import SearchableDropdown from "../common/SearchableDropdown";

const AdminPageHeader = ({
  title,
  subtitle,
  onSearch,
  searchValue,

  degreeOptions = [],
  subjectOptions = [],
  hobbyOptions = [],

  onDegreeFilter,
  onSubjectFilter,
  onHobbyFilter,

  firstTitle = "All Degrees",
  secondTitle = "All Subjects",
  thirdTitle = "All Hobbies",
}) => {
  const [selectedDegree, setSelectedDegree] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedHobby, setSelectedHobby] = useState("all");

  const [debouncedDegree, setDebouncedDegree] = useState(selectedDegree);
  const [degreeSearch, setDegreeSearch] = useState("");
  const [debouncedDegreeSearch, setDebouncedDegreeSearch] = useState("");

  // Debounce degree search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDegreeSearch(degreeSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [degreeSearch]);

  // Debounce degree filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDegree(selectedDegree);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedDegree]);

  useEffect(() => {
    if (onDegreeFilter) {
      onDegreeFilter(debouncedDegree);
    }
  }, [debouncedDegree, onDegreeFilter]);

  // Filter degree options
  const filteredDegreeOptions = useMemo(() => {
    if (!debouncedDegreeSearch) return degreeOptions;

    return degreeOptions.filter((degree) =>
      degree.toLowerCase().includes(debouncedDegreeSearch.toLowerCase()),
    );
  }, [degreeOptions, debouncedDegreeSearch]);

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

      <div className="flex flex-wrap items-center gap-3 lg:gap-4">
        {/* Search */}
        {onSearch && (
          <div className="relative group flex-1 min-w-[250px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={`Search ${title.split(" ")[0]}...`}
              className="w-full bg-white border border-gray-200 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium"
            />
          </div>
        )}

        {/* Degree Dropdown (only if provided) */}
        {degreeOptions?.length > 0 && (
          <div className="min-w-[160px] max-w-[180px]">
            <SearchableDropdown
              icon={GraduationCap}
              options={filteredDegreeOptions}
              value={selectedDegree !== "all" ? selectedDegree : null}
              placeholder={firstTitle}
              accent="blue"
              onChange={(val) => {
                setSelectedDegree(val);
                if (onDegreeFilter) onDegreeFilter(val);
              }}
            />
          </div>
        )}

        {/* Subject Dropdown (only if provided) */}
        {subjectOptions?.length > 0 && (
          <div className="min-w-[160px] max-w-[200px]">
            <SimpleDropdown
              icon={BookOpen}
              options={subjectOptions}
              value={selectedSubject !== "all" ? selectedSubject : null}
              placeholder={secondTitle}
              accent="emerald"
              onChange={(val) => {
                setSelectedSubject(val);
                if (onSubjectFilter) onSubjectFilter(val);
              }}
            />
          </div>
        )}

        {/* Hobby Dropdown (only if provided) */}
        {hobbyOptions?.length > 0 && (
          <div className="min-w-[160px] max-w-[180px]">
            <SearchableDropdown
              icon={Heart}
              options={hobbyOptions}
              value={selectedHobby !== "all" ? selectedHobby : null}
              placeholder={thirdTitle}
              accent="rose"
              text="All Hobbies"
              onChange={(val) => {
                setSelectedHobby(val);
                if (onHobbyFilter) onHobbyFilter(val);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPageHeader;
