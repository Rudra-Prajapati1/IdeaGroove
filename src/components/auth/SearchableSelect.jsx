import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

const SearchableSelect = ({
  label,
  placeholder,
  endpoint,
  onSelect,
  value,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch API Logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 0) {
        try {
          const res = await fetch(`${endpoint}?q=${query}`);
          const data = await res.json();
          setSuggestions(data);
          setIsOpen(true);
        } catch (error) {
          console.error("Search fetch error:", error);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, endpoint]);

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder || "Search..."}
          value={query} // You can change this to display 'value' prop if you want the selected name to persist
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === "") onSelect(null, "");
          }}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none transition-colors duration-300 focus:border-primary/60 p-3 pr-10"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((item, index) => {
            // Normalize data keys since different tables have different column names
            const id = item.College_ID || item.Degree_ID || item.Hobby_ID;
            const name =
              item.College_Name || item.Degree_Name || item.Hobby_Name;

            return (
              <li
                key={id || index}
                onClick={() => {
                  setQuery(name); // Update input display
                  onSelect(id, name); // Pass BOTH ID and Name back to parent
                  setIsOpen(false);
                }}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 transition-colors border-b last:border-none"
              >
                {name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
