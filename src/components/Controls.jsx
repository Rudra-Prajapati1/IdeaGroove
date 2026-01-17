import React from "react";
import { Search } from "lucide-react";

const Controls = ({ 
  search, 
  setSearch, 
  filter, 
  setFilter, 
  filterOptions = ['all', 'upcoming', 'past'],
  searchPlaceholder = "Search..." 
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
      
      {/* Search Bar */}
      <div className="relative w-full md:w-80">
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
      <div className="flex items-center gap-6">
        <span className="text-[#1A3C20] font-bold">Filters:</span>
        {filterOptions.map((type) => (
          <label key={type} className="flex items-center gap-2 cursor-pointer capitalize">
            <input
              type="radio"
              name="eventFilter"
              value={type}
              checked={filter === type}
              onChange={(e) => setFilter(e.target.value)}
              className="w-4 h-4 accent-[#1A3C20]"
            />
            <span className="text-sm font-medium">{type}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Controls;