import React from "react";
import { Search } from "lucide-react";

const Controls = ({
  search,
  setSearch,
  filter,
  setFilter,
  filterOptions = {
    All: "all",
    Upcoming: "upcoming",
    Past: "past",
    "Newest to Oldest": "newest_to_oldest",
    "Oldest to Newest": "oldest_to_newest",
  },
  searchPlaceholder = "Search...",
}) => {
  return (
    <div className="flex w-full flex-col items-stretch justify-between gap-4 rounded-2xl bg-white p-4 shadow-xl sm:p-6 md:flex-row md:items-center md:gap-6">
      {/* Search Bar */}
      <div className="relative w-full md:w-80 md:max-w-[20rem]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C20]/20"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:justify-end">
        <span className="text-[#1A3C20] font-bold">Filters:</span>
        {Object.entries(filterOptions).map(([label, value]) => (
          <label
            key={value}
            className="flex items-center gap-2 cursor-pointer capitalize text-sm sm:text-base"
          >
            <input
              type="radio"
              name="eventFilter"
              value={value}
              checked={filter === value}
              onChange={(e) => setFilter(e.target.value)}
              className="w-4 h-4 accent-[#1A3C20]"
            />
            {/* Display the key (e.g., "Newest to Oldest") */}
            <span className="text-sm font-medium">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Controls;
