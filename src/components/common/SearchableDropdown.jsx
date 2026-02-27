import React, { useState, useMemo, useRef, useEffect } from "react";

const SearchableDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Search degree...",
  text = "All Degrees",
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
    return [text, ...uniqueOptions.filter((opt) => opt !== text)];
  }, [options, text]);

  // Filter but ALWAYS keep "All Degrees" at top
  const filteredOptions = useMemo(() => {
    const filtered = enhancedOptions.filter((option) =>
      option.toLowerCase().includes(search.toLowerCase()),
    );

    // Always ensure "All Degrees" is first
    return [text, ...filtered.filter((opt) => opt !== text)];
  }, [enhancedOptions, search, text]);

  const handleSelect = (option) => {
    if (option === text) {
      onChange("all");
      setSearch(""); // ✅ Clear input when selecting "All"
    } else {
      onChange(option);
      setSearch(option);
    }

    setOpen(false);
  };

  return (
    <div className="relative min-w-[160px] flex-shrink-0" ref={dropdownRef}>
      {/* Always visible search input */}
      <div className="relative group flex-1 min-w-[150px] max-w-[220px]">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          className="w-full bg-white border border-gray-200 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium"
        />
      </div>

      {/* Results */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
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
