import React, { useState } from "react";
import {
  X,
  FileText,
  PieChart,
  Trophy,
  Activity,
  BarChart2,
  CheckSquare,
  Square,
  ChevronRight,
  Calendar,
} from "lucide-react";

const DATE_PRESETS = [
  { id: "all", label: "All Time", desc: "No date filter" },
  { id: "6months", label: "Last 6 Months", desc: "Past 180 days" },
  { id: "1month", label: "Last 1 Month", desc: "Past 30 days" },
  { id: "1week", label: "Last 1 Week", desc: "Past 7 days" },
  { id: "custom", label: "Custom Range", desc: "Pick your own dates" },
];

const SECTIONS = [
  {
    id: "platformStats",
    icon: BarChart2,
    label: "Platform Stats",
    desc: "Total users, notes, questions, groups, events & complaints",
    color: "emerald",
  },
  {
    id: "contentDistribution",
    icon: PieChart,
    label: "Content Distribution",
    desc: "Pie chart breakdown of notes, questions, events & groups",
    color: "rose",
  },
  {
    id: "topContributors",
    icon: Trophy,
    label: "Top Contributors Podium",
    desc: "Podium with profile pics, crown on 1st place",
    color: "amber",
  },
  {
    id: "recentActivities",
    icon: Activity,
    label: "Recent Activities Table",
    desc: "Full activity log with student, type, date & status",
    color: "blue",
  },
];

const colorMap = {
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    check: "bg-emerald-500",
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
    check: "bg-rose-500",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    check: "bg-amber-500",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    check: "bg-blue-500",
  },
};

// Returns { from: Date|null, to: Date } for a given preset id
export const resolveDateRange = (presetId, customFrom, customTo) => {
  const to = new Date();
  to.setHours(23, 59, 59, 999);

  switch (presetId) {
    case "1week": {
      const from = new Date();
      from.setDate(from.getDate() - 7);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }
    case "1month": {
      const from = new Date();
      from.setMonth(from.getMonth() - 1);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }
    case "6months": {
      const from = new Date();
      from.setMonth(from.getMonth() - 6);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }
    case "custom":
      return {
        from: customFrom ? new Date(customFrom + "T00:00:00") : null,
        to: customTo ? new Date(customTo + "T23:59:59") : to,
      };
    default:
      return { from: null, to };
  }
};

const ReportConfigModal = ({ isOpen, onClose, onGenerate }) => {
  const [selected, setSelected] = useState({
    platformStats: true,
    contentDistribution: true,
    topContributors: true,
    recentActivities: true,
  });
  const [datePreset, setDatePreset] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  if (!isOpen) return null;

  const toggleAll = () => {
    const allOn = Object.values(selected).every(Boolean);
    const next = {};
    SECTIONS.forEach((s) => {
      next[s.id] = !allOn;
    });
    setSelected(next);
  };

  const toggle = (id) => setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  const selectedCount = Object.values(selected).filter(Boolean).length;
  const allOn = selectedCount === SECTIONS.length;
  const isCustom = datePreset === "custom";

  const handleGenerate = () => {
    const dateRange = resolveDateRange(datePreset, customFrom, customTo);
    onGenerate(selected, dateRange, datePreset);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          style={{ animation: "modalIn 0.2s ease-out" }}
        >
          {/* Header */}
          <div className="bg-[#1B431C] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <FileText size={18} className="text-emerald-300" />
              </div>
              <div>
                <h2 className="text-white font-bold text-base font-poppins">
                  Configure Report
                </h2>
                <p className="text-emerald-300/70 text-[11px]">
                  Choose what to include in the PDF
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={17} />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[70vh]">
            {/* ── DATE RANGE ─────────────────────────────────────── */}
            <div className="px-6 pt-5 pb-3">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={13} className="text-gray-400" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Date Range
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {DATE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setDatePreset(preset.id)}
                    className={`flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-all
                      ${
                        datePreset === preset.id
                          ? "bg-[#1B431C] border-[#1B431C] text-white"
                          : "bg-gray-50 border-gray-100 hover:border-gray-200 text-gray-600"
                      } ${preset.id === "all" ? "col-span-2" : ""}`}
                  >
                    <span
                      className={`text-xs font-bold ${datePreset === preset.id ? "text-white" : "text-gray-700"}`}
                    >
                      {preset.label}
                    </span>
                    <span
                      className={`text-[10px] mt-0.5 ${datePreset === preset.id ? "text-emerald-200" : "text-gray-400"}`}
                    >
                      {preset.desc}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom date inputs */}
              {isCustom && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">
                      From
                    </label>
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B431C]/30 focus:border-[#1B431C] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">
                      To
                    </label>
                    <input
                      type="date"
                      value={customTo}
                      min={customFrom}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B431C]/30 focus:border-[#1B431C] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Active range preview pill */}
              {datePreset !== "all" && (
                <div className="mt-2 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5">
                  <Calendar
                    size={11}
                    className="text-emerald-600 flex-shrink-0"
                  />
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {datePreset === "custom"
                      ? customFrom && customTo
                        ? customFrom + "  →  " + customTo
                        : "Select both dates"
                      : "Filtering: " +
                        DATE_PRESETS.find((p) => p.id === datePreset)?.label}
                  </span>
                </div>
              )}
            </div>

            <div className="mx-6 border-t border-gray-100" />

            {/* ── SECTIONS ───────────────────────────────────────── */}
            <div className="px-6 pt-4 pb-2 flex items-center justify-between">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Report Sections
              </span>
              <button
                onClick={toggleAll}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                {allOn ? <CheckSquare size={14} /> : <Square size={14} />}
                {allOn ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="px-6 pb-4 space-y-2">
              {SECTIONS.map((section) => {
                const c = colorMap[section.color];
                const checked = selected[section.id];
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => toggle(section.id)}
                    className={`w-full flex items-center gap-4 p-3.5 rounded-xl border transition-all duration-150 text-left
                      ${checked ? `${c.bg} ${c.border} border` : "bg-gray-50 border border-gray-100 hover:border-gray-200"}`}
                  >
                    <div
                      className={`p-2 rounded-lg ${checked ? c.bg : "bg-gray-100"} flex-shrink-0`}
                    >
                      <Icon
                        size={16}
                        className={checked ? c.text : "text-gray-400"}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold ${checked ? "text-gray-800" : "text-gray-400"}`}
                      >
                        {section.label}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                        {section.desc}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${checked ? `${c.check} border-transparent` : "border-gray-300 bg-white"}`}
                    >
                      {checked && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400 font-medium">
              <span className="font-black text-gray-600">{selectedCount}</span>{" "}
              of {SECTIONS.length} sections
              {datePreset !== "all" && (
                <span className="ml-1 text-emerald-600 font-bold">
                  · {DATE_PRESETS.find((p) => p.id === datePreset)?.label}
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 font-semibold hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={
                  selectedCount === 0 ||
                  (isCustom && (!customFrom || !customTo))
                }
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1B431C] text-white text-sm font-semibold hover:bg-[#153416] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                Generate PDF
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </>
  );
};

export default ReportConfigModal;
