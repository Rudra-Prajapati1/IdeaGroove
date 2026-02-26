import React, { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Search, Clock, X } from "lucide-react";

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

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [history, setHistory] = useState(getHistory);

  // ── Submit ──────────────────────────────────
  const handleSubmit = (e, overrideTerm) => {
    e?.preventDefault();

    const trimmed = (overrideTerm ?? searchTerm).trim();
    if (!trimmed) return;

    setSearchTerm(trimmed);
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

  return (
    <section
      aria-label="Search Students"
      className="bg-white p-6 rounded-[2.5rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] border border-slate-50 max-w-6xl mx-auto font-sans"
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
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
            autoComplete="off"
            autoCorrect="off"
            className="w-full pl-14 pr-6 py-4 bg-slate-50/80 border-none rounded-3xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
          />
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
