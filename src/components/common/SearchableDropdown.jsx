import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  getCustomOptionLabel,
  normalizeCustomOptionInput,
} from "../../utils/customOptionHelpers";

const SearchableDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Search degree...",
  text = "All Degrees",
  icon: Icon,
  className = "",
  menuClassName = "",
  allowCustom = false,
  customTypeLabel = "option",
  onCustomSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const inputValue = open ? search : value || "";

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSearch("");
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

  const normalizedSearch = useMemo(
    () => normalizeCustomOptionInput(search),
    [search],
  );

  const showCustomOption =
    allowCustom &&
    !!onCustomSelect &&
    !!normalizedSearch &&
    normalizedSearch.toLowerCase() !== text.toLowerCase() &&
    !enhancedOptions.some(
      (option) => option.toLowerCase() === normalizedSearch.toLowerCase(),
    );

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

  const handleCustomOption = () => {
    if (!showCustomOption) return;
    onCustomSelect(normalizedSearch);
    setSearch(normalizedSearch);
    setOpen(false);
  };

  return (
    <div
      className={`relative w-full min-w-0 flex-shrink-0 ${className}`}
      ref={dropdownRef}
    >
      <div className="relative w-full">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onFocus={() => {
            if (value && search === value) {
              setSearch("");
            }
            setOpen(true);
          }}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          className={`w-full bg-white border border-gray-200 rounded-2xl py-2.5 ${
            Icon ? "pl-12" : "pl-4"
          } pr-4 text-sm font-medium`}
        />
      </div>

      {open && (
        <div
          className={`absolute top-full left-0 z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-[min(60vh,30rem)] overflow-y-auto ${menuClassName}`}
        >
          {filteredOptions.length > 0 &&
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className="px-4 py-2.5 text-sm hover:bg-gray-100 cursor-pointer"
              >
                {option}
              </div>
            ))}

          {showCustomOption && (
            <div
              onClick={handleCustomOption}
              className="px-4 py-2.5 text-sm hover:bg-gray-100 cursor-pointer"
            >
              {getCustomOptionLabel(normalizedSearch)}
              <span className="text-gray-400"> as new {customTypeLabel}</span>
            </div>
          )}

          {filteredOptions.length === 0 && !showCustomOption && (
            <div className="px-4 py-2.5 text-sm text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
