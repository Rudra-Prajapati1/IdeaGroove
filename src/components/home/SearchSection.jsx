import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import axios from "axios";

const SearchSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [department, setDepartment] = useState(
    searchParams.get("department") || "All Departments",
  );

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const timeoutRef = useRef(null);

  const popularTags = ["UI Design", "Python", "Marketing", "Robotics"];

  // Custom debounce
  const debounce = (func, delay) => {
    return (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = debounce(async (term, dept) => {
    if (term.trim().length < 2 || location.pathname !== "/") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/api/students/search", {
        params: {
          q: term.trim(),
          department: dept !== "All Departments" ? dept : undefined,
          limit: 5,
          page: 1,
        },
      });

      setSuggestions(res.data.data || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Suggestions fetch failed:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, 350);

  useEffect(() => {
    fetchSuggestions(searchTerm, department);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [searchTerm, department]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    setShowSuggestions(false);

    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    const newParams = new URLSearchParams();
    newParams.set("q", trimmed);
    if (department !== "All Departments")
      newParams.set("department", department);

    setSearchParams(newParams);

    if (location.pathname === "/") {
      navigate(`/search?${newParams.toString()}`);
    }
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
    handleSubmit();
  };

  // ────────────────────────────────────────────────
  //  CHANGED: Direct navigation to profile on click
  // ────────────────────────────────────────────────
  const handleSuggestionClick = (student) => {
    setShowSuggestions(false);
    setSearchTerm(student.Name); // optional — keeps input filled
    navigate(`/dashboard/${student.S_ID}`);
  };

  return (
    <section
      aria-label="Search Students"
      className="bg-white p-6 rounded-[2.5rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] border border-slate-50 max-w-6xl mx-auto font-sans"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-center gap-4"
      >
        <div className="relative flex-1 w-full group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={20}
          />
          <label htmlFor="student-search" className="sr-only">
            Search students
          </label>
          <input
            id="student-search"
            type="text"
            placeholder="Search students by name, skills or interests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50/80 border-none rounded-3xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions &&
            suggestions.length > 0 &&
            location.pathname === "/" && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-80 overflow-y-auto divide-y divide-slate-100">
                {suggestions.map((student) => (
                  <div
                    key={student.S_ID}
                    onClick={() => handleSuggestionClick(student)}
                    className="p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {student.Profile_Pic ? (
                        <img
                          src={student.Profile_Pic}
                          alt={student.Name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xl">
                          {student.Name?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 truncate">
                        {student.Name}
                      </h3>
                      <p className="text-sm text-slate-600 truncate">
                        {student.Username} • {student.Degree_Name || "Student"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="relative w-full md:w-auto">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full md:w-auto pl-6 pr-14 py-4 bg-slate-50/80 border-none rounded-3xl text-slate-700 font-bold text-sm outline-none cursor-pointer appearance-none transition-all hover:bg-slate-50"
          >
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
      </form>

      {/* Popular tags */}
      <div className="flex flex-wrap items-center gap-3 mt-6 px-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Example
        </span>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-5 py-1.5 bg-[#E9F3EA] text-[#2D4F33] rounded-full text-xs font-bold border border-[#D1E7D4] hover:bg-[#D1E7D4] hover:scale-105 transition-all cursor-pointer shadow-sm"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
