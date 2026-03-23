import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Search, Clock, X } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import { selectUser } from "../../redux/slice/authSlice";

const HISTORY_KEY = "student_search_history";
const MAX_HISTORY = 5;

const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveToHistory = (term) => {
  if (!term.trim()) return;
  const prev = getHistory().filter(
    (h) => h.toLowerCase() !== term.toLowerCase(),
  );
  const updated = [term.trim(), ...prev].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

const removeFromHistory = (term) => {
  const updated = getHistory().filter((h) => h !== term);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

// ─────────────────────────────────────────────
const SearchSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef(null);
  const currentUser = useSelector(selectUser);
  const currentUserId = currentUser?.S_ID || currentUser?.id || null;

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [history, setHistory] = useState(getHistory);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const trimmed = searchTerm.trim();

    if (!trimmed) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoadingSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true);
        const res = await api.get("/students/search", {
          params: {
            q: trimmed,
            page: 1,
            limit: 5,
          },
        });

        const nextSuggestions = res.data?.data || [];
        setSuggestions(nextSuggestions);
        setShowSuggestions(nextSuggestions.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ── Submit ──────────────────────────────────
  const handleSubmit = (e, overrideTerm) => {
    e?.preventDefault();

    const trimmed = (overrideTerm ?? searchTerm).trim();
    if (!trimmed) return;

    setSearchTerm(trimmed);
    setShowSuggestions(false);
    saveToHistory(trimmed);
    setHistory(getHistory());

    const newParams = new URLSearchParams();
    newParams.set("q", trimmed);
    setSearchParams(newParams);

    if (location.pathname === "/") {
      navigate(`/search?${newParams.toString()}`);
    }
  };

  // ── History tag click ───────────────────────
  const handleHistoryTagClick = (term) => {
    handleSubmit(null, term);
  };

  // ── Remove one history item ─────────────────
  const handleRemoveHistoryTag = (e, term) => {
    e.stopPropagation();
    removeFromHistory(term);
    setHistory(getHistory());
  };

  const handleSuggestionSelect = (student) => {
    const selectedId = student?.S_ID;
    const selectedTerm = student?.Name || student?.Username || "";
    if (!selectedId || !selectedTerm) return;

    setSearchTerm(selectedTerm);
    setShowSuggestions(false);
    saveToHistory(selectedTerm);
    setHistory(getHistory());

    if (String(selectedId) === String(currentUserId)) {
      navigate("/dashboard");
      return;
    }

    navigate(`/dashboard/${selectedId}`);
  };

  return (
    <section
      aria-label="Search Students"
      className="bg-white p-6 rounded-[2.5rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] border border-slate-50 max-w-6xl mx-auto font-sans"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <div className="relative flex-1 w-full group" ref={wrapperRef}>
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
            onFocus={() => {
              if (searchTerm.trim() && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            autoComplete="off"
            autoCorrect="off"
            className="w-full pl-14 pr-6 py-4 bg-slate-50/80 border-none rounded-3xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
          />

          {(showSuggestions || isLoadingSuggestions) && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-40 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.18)]">
              {isLoadingSuggestions ? (
                <div className="px-5 py-4 text-sm text-slate-400">
                  Searching...
                </div>
              ) : (
                <ul className="max-h-72 overflow-y-auto py-2">
                  {suggestions.map((student) => (
                    <li key={student.S_ID}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionSelect(student)}
                        className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E9F3EA] text-sm font-bold text-[#1A3C20]">
                          {student.Profile_Pic ? (
                            <img
                              src={student.Profile_Pic}
                              alt={student.Name || student.Username || "Student"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            (student.Name || student.Username || "?")[0]?.toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {student.Name || student.Username}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            @{student.Username}
                            {student.Degree_Name ? ` • ${student.Degree_Name}` : ""}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 bg-[#1A3C20] text-white rounded-3xl text-xs font-bold hover:bg-[#2D4F33] transition-colors shrink-0"
        >
          Search
        </button>
      </form>

      {/* Recent search history tags */}
      <div className="flex flex-wrap items-center gap-3 mt-6 px-2 min-h-[28px]">
        {history.length > 0 ? (
          <>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Recent
            </span>
            <div className="flex flex-wrap gap-2">
              {history.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleHistoryTagClick(term)}
                  className="flex items-center gap-1.5 pl-4 pr-2 py-1.5 bg-[#E9F3EA] text-[#2D4F33] rounded-full text-xs font-bold border border-[#D1E7D4] hover:bg-[#D1E7D4] transition-all cursor-pointer shadow-sm group/tag"
                >
                  <Clock size={11} className="shrink-0 opacity-60" />
                  <span>{term}</span>
                  <span
                    role="button"
                    aria-label={`Remove ${term}`}
                    onClick={(e) => handleRemoveHistoryTag(e, term)}
                    className="ml-0.5 opacity-0 group-hover/tag:opacity-100 text-[#2D4F33] hover:text-red-500 transition-all"
                  >
                    <X size={11} />
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            No recent searches
          </span>
        )}
      </div>
    </section>
  );
};

export default SearchSection;
