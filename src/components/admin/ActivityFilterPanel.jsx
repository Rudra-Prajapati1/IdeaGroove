import React, { useEffect, useRef } from "react";
import { X, SlidersHorizontal, RotateCcw, Check } from "lucide-react";

const ACTIVITY_TYPES = ["EVENT", "NOTE", "GROUP", "QUESTION", "COMPLAINT"];
const STATUS_OPTIONS = ["Active", "Blocked"];

const ActivityFilterPanel = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onReset,
}) => {
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleType = (type) => {
    const current = filters.types || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onFiltersChange({ ...filters, types: updated });
  };

  const toggleStatus = (status) => {
    const current = filters.statuses || [];
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    onFiltersChange({ ...filters, statuses: updated });
  };

  const activeFilterCount = [
    (filters.types?.length || 0) > 0,
    (filters.statuses?.length || 0) > 0,
    filters.studentName?.trim(),
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  const typeColors = {
    EVENT:
      "bg-amber-50 text-amber-700 border-amber-200 data-[active=true]:bg-amber-500 data-[active=true]:text-white data-[active=true]:border-amber-500",
    NOTE: "bg-rose-50 text-rose-700 border-rose-200 data-[active=true]:bg-rose-500 data-[active=true]:text-white data-[active=true]:border-rose-500",
    GROUP:
      "bg-purple-50 text-purple-700 border-purple-200 data-[active=true]:bg-purple-500 data-[active=true]:text-white data-[active=true]:border-purple-500",
    QUESTION:
      "bg-green-50 text-green-700 border-green-200 data-[active=true]:bg-green-500 data-[active=true]:text-white data-[active=true]:border-green-500",
    COMPLAINT:
      "bg-red-50 text-red-700 border-red-200 data-[active=true]:bg-red-500 data-[active=true]:text-white data-[active=true]:border-red-500",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-in Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="bg-primary px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-emerald-300" />
            <h2 className="text-white font-bold text-base font-poppins">
              Filter Activities
            </h2>
            {activeFilterCount > 0 && (
              <span className="bg-emerald-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
          {/* ── Activity Type ─────────────────────────────────────── */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Activity Type
            </p>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_TYPES.map((type) => {
                const isActive = (filters.types || []).includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    data-active={isActive}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150 ${typeColors[type]}`}
                  >
                    {isActive && <Check size={11} />}
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Status ───────────────────────────────────────────── */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Status
            </p>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((status) => {
                const isActive = (filters.statuses || []).includes(status);
                return (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition-all duration-150 flex-1 justify-center
                      ${
                        status === "Active"
                          ? isActive
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isActive
                            ? "bg-red-500 text-white border-red-500"
                            : "bg-red-50 text-red-700 border-red-200"
                      }`}
                  >
                    {isActive && <Check size={11} />}
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Student Name ──────────────────────────────────────── */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Student Name
            </p>
            <input
              type="text"
              value={filters.studentName || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, studentName: e.target.value })
              }
              placeholder="Search by student name..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* ── Date Range ────────────────────────────────────────── */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Date Range
            </p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">
                  From
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, dateFrom: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 font-semibold mb-1 block">
                  To
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ""}
                  min={filters.dateFrom || ""}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, dateTo: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-gray-50/50">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 font-semibold hover:bg-gray-100 transition-all"
          >
            <RotateCcw size={13} />
            Reset
          </button>
          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
          >
            <Check size={13} />
            Apply Filters
            {activeFilterCount > 0 && (
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ActivityFilterPanel;
