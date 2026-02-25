import React, { useState, useMemo, useRef, useEffect } from "react";

const SearchableDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Search degree...",
  icon: Icon,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ensure unique options and include "All Degrees"
  const enhancedOptions = useMemo(() => {
    const uniqueOptions = [...new Set(options)];
    return [
      "All Degrees",
      ...uniqueOptions.filter((opt) => opt !== "All Degrees"),
    ];
  }, [options]);

  // Filter but ALWAYS keep "All Degrees" at top
  const filteredOptions = useMemo(() => {
    const filtered = enhancedOptions.filter((option) =>
      option.toLowerCase().includes(search.toLowerCase()),
    );

    // Always ensure "All Degrees" is first
    return ["All Degrees", ...filtered.filter((opt) => opt !== "All Degrees")];
  }, [enhancedOptions, search]);

  return (
    <div className="relative w-64" ref={dropdownRef}>
      {/* Always visible search input */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2">
        {Icon && <Icon size={16} />}
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* Results */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  onChange(option === "All Degrees" ? "all" : option);
                  setSearch(option);
                  setOpen(false);
                }}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
