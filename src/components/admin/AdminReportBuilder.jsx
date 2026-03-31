import React, { useEffect, useState, useCallback, useRef } from "react";
import jsPDF from "jspdf";
import logo from "/DarkLogo.png";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { formatAcademicYear } from "../../utils/academicYear";
import {
  Calendar,
  Users,
  FileText,
  MessageSquare,
  AlertTriangle,
  FileBarChart2,
  Loader2,
  EyeOff,
  Zap,
  ChevronDown,
  ChevronUp,
  Check,
  Columns,
  Sparkles,
  UserCircle2,
  GraduationCap,
  BookOpen,
  Heart,
  Tag,
  Filter,
  Search,
  Plus,
} from "lucide-react";

// FILTER KEY RULES — must match backend controller exactly:
//   users:      degree, college
//   events:     event_status ("Upcoming" | "Past")
//   groups:     hobby
//   notes:      degree, subject
//   qna:        degree, subject
//   complaints: type
const SECTIONS = [
  {
    id: "users",
    label: "Users",
    icon: UserCircle2,
    color: "#0ea5e9",
    rgb: [14, 165, 233],
    accent: "#e0f2fe",
    border: "border-sky-200",
    bg: "from-sky-50 to-cyan-50",
    tag: "MEMBERS",
    tagColor: "bg-sky-100 text-sky-700",
    desc: "All registered students with degree, year & status",
    endpoint: "users-report",
    columns: [
      { key: "Name", label: "Name", default: true },
      { key: "Username", label: "Username", default: true },
      { key: "Roll_No", label: "Roll No", default: true },
      { key: "Email", label: "Email", default: true },
      { key: "Degree_Name", label: "Degree", default: true },
      { key: "Year", label: "Year", default: true },
      { key: "hobby_name", label: "Hobby", default: false },
      { key: "is_Active", label: "Status", default: true },
    ],
    filters: [
      { key: "degree", label: "Degree", source: "degreeApi" },
      {
        key: "college",
        label: "College",
        source: "degreeApi",
        collegeFilter: true,
      },
    ],
  },
  {
    id: "events",
    label: "Events",
    icon: Calendar,
    color: "#f59e0b",
    rgb: [245, 158, 11],
    accent: "#fef3c7",
    border: "border-amber-200",
    bg: "from-amber-50 to-orange-50",
    tag: "ACTIVITIES",
    tagColor: "bg-amber-100 text-amber-700",
    desc: "Platform events with upcoming/past status & organizer",
    endpoint: "events-report",
    columns: [
      { key: "Description", label: "Title", default: true },
      { key: "Event_Date", label: "Event Date", default: true },
      { key: "event_status", label: "When", default: true },
      { key: "Added_On", label: "Added On", default: false },
      { key: "student_name", label: "Organizer", default: true },
      { key: "Is_Active", label: "Status", default: true },
    ],
    filters: [
      {
        key: "event_status",
        label: "When",
        source: "hardcoded",
        options: ["Upcoming", "Past"],
      },
    ],
  },
  {
    id: "groups",
    label: "Groups",
    icon: Users,
    color: "#8b5cf6",
    rgb: [139, 92, 246],
    accent: "#ede9fe",
    border: "border-violet-200",
    bg: "from-violet-50 to-purple-50",
    tag: "COMMUNITY",
    tagColor: "bg-violet-100 text-violet-700",
    desc: "Groups, member counts & hobby tags",
    endpoint: "groups-report",
    columns: [
      { key: "Room_Name", label: "Group Name", default: true },
      { key: "Description", label: "Description", default: true },
      { key: "Created_On", label: "Created On", default: true },
      { key: "student_name", label: "Created By", default: true },
      { key: "member_count", label: "Members", default: true },
      { key: "member_names", label: "Member Names", default: true },
      { key: "hobby_name", label: "Hobby", default: true },
      { key: "Is_Active", label: "Status", default: true },
    ],
    filters: [
      // hobby is multi-select → backend must use IN (...) for this filter
      { key: "hobby", label: "Hobby", source: "hobbyApi" },
      {
        key: "groups",
        label: "Groups",
        source: "rowMulti",
        rowKey: "Room_Name",
        fullWidth: true,
      },
    ],
  },
  {
    id: "notes",
    label: "Notes",
    icon: FileText,
    color: "#ef4444",
    rgb: [239, 68, 68],
    accent: "#fee2e2",
    border: "border-red-200",
    bg: "from-red-50 to-rose-50",
    tag: "CONTENT",
    tagColor: "bg-red-100 text-red-700",
    desc: "Uploaded notes by subject, degree & status",
    endpoint: "notes-report",
    columns: [
      { key: "File_Name", label: "File Name", default: true },
      { key: "Description", label: "Description", default: true },
      { key: "Added_On", label: "Uploaded On", default: true },
      { key: "student_name", label: "Author", default: true },
      { key: "Subject_Name", label: "Subject", default: true },
      { key: "Degree_Name", label: "Degree", default: true },
      { key: "Is_Active", label: "Status", default: true },
    ],
    filters: [
      { key: "degree", label: "Degree", source: "degreeApi" },
      {
        key: "subject",
        label: "Subject",
        source: "degreeApi",
        subjectFilter: true,
      },
    ],
  },
  {
    id: "qna",
    label: "Q&A",
    icon: MessageSquare,
    color: "#10b981",
    rgb: [16, 185, 129],
    accent: "#d1fae5",
    border: "border-emerald-200",
    bg: "from-emerald-50 to-teal-50",
    tag: "KNOWLEDGE",
    tagColor: "bg-emerald-100 text-emerald-700",
    desc: "Questions asked, answers given & resolution rate",
    endpoint: "qna-report",
    columns: [
      { key: "Question", label: "Question", default: true },
      { key: "Added_On", label: "Posted On", default: true },
      { key: "student_name", label: "Asked By", default: true },
      { key: "answer_count", label: "Answers", default: true },
      // all_answers now contains "Author: text || Author: text" formatted string from backend
      { key: "all_answers", label: "Answers (Author + Text)", default: true },
      { key: "Subject_Name", label: "Subject", default: true },
      { key: "Is_Active", label: "Status", default: true },
    ],
    filters: [
      { key: "degree", label: "Degree", source: "degreeApi" },
      {
        key: "subject",
        label: "Subject",
        source: "degreeApi",
        subjectFilter: true,
      },
      {
        key: "questions",
        label: "Questions",
        source: "rowMulti",
        rowKey: "Question",
      },
    ],
  },
  {
    id: "complaints",
    label: "Complaints",
    icon: AlertTriangle,
    color: "#6366f1",
    rgb: [99, 102, 241],
    accent: "#e0e7ff",
    border: "border-indigo-200",
    bg: "from-indigo-50 to-blue-50",
    tag: "MODERATION",
    tagColor: "bg-indigo-100 text-indigo-700",
    desc: "All complaints with complaint text, reported activity & status data",
    endpoint: "complaints-report",
    columns: [
      { key: "Complaint_Text", label: "Complaint Text", default: true },
      { key: "Reported_Activity", label: "Reported Activity", default: true },
      { key: "Content_Title", label: "Content", default: true },
      { key: "Complaint_Type", label: "Type", default: true },
      { key: "Date", label: "Filed On", default: true },
      { key: "student_name", label: "Student", default: true },
      { key: "Status", label: "Status", default: true },
      { key: "Is_Active", label: "Active State", default: true },
      { key: "Content_Owner_Name", label: "Activity Owner", default: false },
    ],

    filters: [
      {
        key: "type",
        label: "Type",
        source: "fromRows",
        rowKey: "Complaint_Type",
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Active: [16, 185, 129],
  Blocked: [239, 68, 68],
  Upcoming: [14, 165, 233],
  Past: [148, 163, 184],
  Resolved: [16, 185, 129],
  Pending: [245, 158, 11],
  "In-Progress": [59, 130, 246],
};

const getCompressedCanvasDataUrl = (canvas, quality = 0.72) => {
  const output = document.createElement("canvas");
  output.width = canvas.width;
  output.height = canvas.height;
  const outputCtx = output.getContext("2d");
  outputCtx.fillStyle = "#ffffff";
  outputCtx.fillRect(0, 0, output.width, output.height);
  outputCtx.drawImage(canvas, 0, 0);
  return output.toDataURL("image/jpeg", quality);
};

const formatCell = (key, val) => {
  if (val === null || val === undefined) return "-";
  if (key === "Year") return formatAcademicYear(val) || "-";
  if (key === "Is_Active" || key === "is_Active")
    return val === 1 ? "Active" : "Blocked";
  if (["Event_Date", "Added_On", "Created_On", "Date"].includes(key)) {
    try {
      return new Date(val).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return String(val);
    }
  }
  const s = String(val);
  return s.length > 40 ? s.slice(0, 39) + "..." : s;
};

const formatPdfCell = (key, val) => {
  if (val === null || val === undefined || val === "") return "-";
  if (key === "Year") return formatAcademicYear(val) || "-";
  if (key === "Is_Active" || key === "is_Active")
    return val === 1 ? "Active" : "Blocked";
  if (["Event_Date", "Added_On", "Created_On", "Date"].includes(key)) {
    try {
      return new Date(val).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return String(val);
    }
  }
  return String(val);
};

const formatComplaintType = (value) => {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "-";
  return rawValue.charAt(0).toUpperCase() + rawValue.slice(1).toLowerCase();
};

// ─── Parse answers string into [{author, text}] ───────────────────────────
// Backend should send all_answers as "Author1: answer1 || Author2: answer2"
// This parser handles that format gracefully.
const parseAnswers = (raw) => {
  if (!raw || String(raw).trim() === "" || String(raw).trim() === "-")
    return [];
  const parts = String(raw)
    .split("||")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.map((part) => {
    const colonIdx = part.indexOf(":");
    if (colonIdx > 0) {
      return {
        author: part.slice(0, colonIdx).trim(),
        text: part.slice(colonIdx + 1).trim(),
      };
    }
    return { author: "", text: part };
  });
};

const formatDisplayCell = (key, val, row = {}) => {
  if (key === "Complaint_Type") return formatComplaintType(val);
  if (
    key === "all_answers" &&
    (Number(row?.answer_count) === 0 || String(row?.answer_count || "") === "0")
  ) {
    return "-";
  }
  return formatCell(key, val);
};

const formatPdfDisplayCell = (key, val, row = {}) => {
  if (key === "Complaint_Type") return formatComplaintType(val);
  if (
    key === "all_answers" &&
    (Number(row?.answer_count) === 0 || String(row?.answer_count || "") === "0")
  ) {
    return "-";
  }
  return formatPdfCell(key, val);
};

const getPdfColumnWeight = (key) => {
  switch (key) {
    case "Email":
      return 2.1;
    case "hobby_name":
      return 1.8;
    case "Reported_Activity":
      return 2.2;
    case "Complaint_Text":
    case "member_names":
    case "all_answers":
      return 1.7;
    case "Description":
    case "Question":
    case "Content_Title":
      return 1.5;
    case "Year":
    case "Status":
    case "Is_Active":
    case "is_Active":
    case "Complaint_Type":
      return 0.9;
    default:
      return 1;
  }
};

// ─── Mini SVG Donut ───────────────────────────────────────────────────────
const MiniDonut = ({ slices, size = 110 }) => {
  const r = 40,
    c = size / 2;
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total === 0)
    return (
      <div className="w-[110px] h-[110px] rounded-full bg-gray-100 animate-pulse" />
    );
  const nonZero = slices.filter((s) => s.value > 0);
  if (nonZero.length === 1) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={c} cy={c} r={r} fill={nonZero[0].color} />
        <circle cx={c} cy={c} r={r * 0.54} fill="white" />
        <text
          x={c}
          y={c + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 14, fontWeight: 900, fill: "#1e293b" }}
        >
          {total}
        </text>
      </svg>
    );
  }
  let cum = 0; // ← moved here from top
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth="13"
      />
      {slices.map((s, i) => {
        const pct = s.value / total;
        const a1 = cum * 2 * Math.PI - Math.PI / 2;
        cum += pct;
        const a2 = cum * 2 * Math.PI - Math.PI / 2;
        const x1 = c + r * Math.cos(a1),
          y1 = c + r * Math.sin(a1);
        const x2 = c + r * Math.cos(a2),
          y2 = c + r * Math.sin(a2);
        return (
          <path
            key={i}
            d={`M${c},${c} L${x1},${y1} A${r},${r} 0 ${pct > 0.5 ? 1 : 0},1 ${x2},${y2} Z`}
            fill={s.color}
          />
        );
      })}
      <circle cx={c} cy={c} r={r * 0.54} fill="white" />
      <text
        x={c}
        y={c + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: 14, fontWeight: 900, fill: "#1e293b" }}
      >
        {total}
      </text>
    </svg>
  );
};

// ─── Mini Bar Chart ───────────────────────────────────────────────────────
const MiniBarChart = ({ bars, color }) => {
  const max = Math.max(...bars.map((b) => b.value), 1);
  return (
    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(28px,1fr))] items-end gap-1">
      {bars.map((b, i) => (
        <div key={i} className="min-w-0">
          <div className="flex h-14 flex-col justify-end gap-1">
            <span className="text-center text-[8px] font-bold text-gray-500">
              {b.value}
            </span>
            <div className="flex h-9 items-end">
              <div
                className="w-full rounded-t-sm"
                style={{
                  height: `${Math.max((b.value / max) * 36, 2)}px`,
                  backgroundColor: color,
                  opacity: 0.5 + (i / bars.length) * 0.5,
                }}
              />
            </div>
          </div>
          <span className="mt-1 block w-full truncate text-center text-[7px] leading-none text-gray-400">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Section Preview ──────────────────────────────────────────────────────
const SectionPreview = ({ section, sData }) => {
  if (!sData) {
    return (
      <div className="p-4 space-y-2">
        {[100, 75, 90].map((w, i) => (
          <div
            key={i}
            className="h-2.5 bg-gray-100 rounded animate-pulse"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    );
  }

  if (sData._error) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 text-red-500 text-[11px] font-bold">
          <span>
            Failed to load data. Check the browser console for details.
          </span>
        </div>
      </div>
    );
  }

  const summary = Array.isArray(sData.summary) ? sData.summary : [];
  const donut = Array.isArray(sData.chartData?.donut)
    ? sData.chartData.donut
    : [];
  const bars = Array.isArray(sData.chartData?.bars) ? sData.chartData.bars : [];
  const rows = Array.isArray(sData.rows) ? sData.rows : [];

  return (
    <div className="p-4 space-y-3">
      {summary.length > 0 ? (
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${Math.min(summary.length, 4)}, 1fr)`,
          }}
        >
          {summary.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border px-3 py-2.5 text-left shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${section.accent}, #ffffff)`,
                borderColor: `${section.color}25`,
              }}
            >
              <div
                className="text-base font-black leading-tight"
                style={{ color: section.color }}
              >
                {s.value}
              </div>
              <div className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-gray-500 leading-tight">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-xl"
          style={{ backgroundColor: section.accent }}
        >
          <span
            className="text-2xl font-black"
            style={{ color: section.color }}
          >
            {rows.length}
          </span>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
            records
          </span>
        </div>
      )}

      {(donut.length > 0 || bars.length > 0) && (
        <div className="grid gap-3 pt-1 lg:grid-cols-[minmax(0,240px)_1fr]">
          {donut.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 px-3 py-3">
              <div className="mb-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
                Snapshot
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <MiniDonut slices={donut} />
                <div className="space-y-1.5">
                  {donut.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-[10px] text-gray-500 leading-none">
                        {s.label}:{" "}
                        <strong className="text-gray-700">{s.value}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {bars.length > 0 && (
            <div className="min-w-0 rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Monthly trend
              </div>
              <MiniBarChart bars={bars} color={section.color} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Column Chip ──────────────────────────────────────────────────────────
const ColChip = ({ col, active, onToggle, color }) => (
  <button
    onClick={onToggle}
    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all duration-150
      ${active ? "border-transparent text-white shadow-sm" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"}`}
    style={active ? { backgroundColor: color, borderColor: color } : {}}
  >
    {active && <Check size={8} />}
    {col.label}
  </button>
);

// ─── Render answer list for QnA ───────────────────────────────────────────
const AnswerList = ({ raw, answerCount }) => {
  if (!answerCount || Number(answerCount) === 0)
    return <span className="text-gray-300 italic text-[10px]">No answers</span>;
  const answers = parseAnswers(raw);
  if (!answers.length)
    return (
      <span className="text-gray-400 text-[10px]">{String(raw || "-")}</span>
    );
  return (
    <div className="flex flex-col divide-y divide-emerald-100 border border-emerald-100 rounded-xl overflow-hidden">
      {answers.map((a, i) => (
        <div
          key={i}
          className="px-2 py-2 bg-white hover:bg-emerald-50/40 transition-colors"
        >
          {a.author && (
            <span className="text-[9px] font-black uppercase tracking-wide text-emerald-600">
              {a.author}
            </span>
          )}
          <div className="text-[10px] text-gray-600 leading-relaxed break-words mt-0.5">
            {a.text || "-"}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Render member list for Groups ───────────────────────────────────────
const MemberList = ({ memberNames, memberCount }) => {
  if (!memberCount || Number(memberCount) === 0)
    return <span className="text-gray-300 italic text-[10px]">No members</span>;
  if (!memberNames || String(memberNames).trim() === "")
    return (
      <span className="text-[10px] text-gray-400">{memberCount} member(s)</span>
    );
  const members = String(memberNames)
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return (
    <div className="flex flex-wrap gap-1">
      {members.map((m, i) => (
        <span
          key={i}
          className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-violet-50 border border-violet-100 text-[9px] font-semibold text-violet-700"
        >
          {m}
        </span>
      ))}
    </div>
  );
};

// ─── Render hobby list for Users ─────────────────────────────────────────
const HobbyList = ({ raw }) => {
  if (!raw || String(raw).trim() === "" || String(raw).trim() === "-")
    return <span className="text-gray-300 italic text-[10px]">—</span>;
  const hobbies = String(raw)
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);
  if (hobbies.length === 1)
    return <span className="text-[10px] text-gray-600">{hobbies[0]}</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {hobbies.map((h, i) => (
        <span
          key={i}
          className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-sky-50 border border-sky-100 text-[9px] font-semibold text-sky-700"
        >
          {h}
        </span>
      ))}
    </div>
  );
};

// ─── Sample Table ─────────────────────────────────────────────────────────
const SampleTable = ({ section, rows, colState }) => {
  const visibleCols = section.columns.filter((c) => colState[c.key]);
  if (!visibleCols.length || !rows?.length) return null;

  const renderCell = (col, row) => {
    const val = row[col.key];

    if (col.key === "Is_Active" || col.key === "is_Active") {
      return (
        <span
          className={`font-bold ${val === 1 ? "text-emerald-600" : "text-red-500"}`}
        >
          {val === 1 ? "Active" : "Blocked"}
        </span>
      );
    }
    if (col.key === "Status") {
      return (
        <span
          className={`font-bold ${val === "Resolved" ? "text-emerald-600" : val === "Pending" ? "text-amber-600" : val === "In-Progress" ? "text-blue-600" : "text-gray-500"}`}
        >
          {val || "-"}
        </span>
      );
    }
    // QnA answers — show author + text pairs
    if (col.key === "all_answers") {
      return <AnswerList raw={val} answerCount={row.answer_count} />;
    }
    // Groups member names — show as badges stacked under group
    if (col.key === "member_names" && section.id === "groups") {
      return <MemberList memberNames={val} memberCount={row.member_count} />;
    }
    // Users hobby — allow wrapping across multiple lines
    if (col.key === "hobby_name" && section.id === "users") {
      return <HobbyList raw={val} />;
    }
    return formatDisplayCell(col.key, val, row);
  };

  const getCellClass = (col) => {
    if (
      col.key === "all_answers" ||
      col.key === "member_names" ||
      col.key === "hobby_name" ||
      col.key === "Question" ||
      col.key === "Room_Name" ||
      col.key === "Description" ||
      col.key === "Complaint_Text" ||
      col.key === "Reported_Activity" ||
      col.key === "Content_Title"
    ) {
      return "whitespace-normal break-words align-top";
    }
    return "whitespace-nowrap max-w-[160px] truncate align-top";
  };

  return (
    <div className="mx-4 mb-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
        Sample — first 5 rows
      </div>
      <table className="w-full text-[10px] border-collapse min-w-max">
        <thead>
          <tr>
            {visibleCols.map((col) => (
              <th
                key={col.key}
                className="text-left py-2 px-3 font-black text-[9px] text-gray-400 uppercase border-b border-gray-100 whitespace-nowrap bg-gray-50/80"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 5).map((row, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60">
              {visibleCols.map((col) => (
                <td
                  key={col.key}
                  className={`py-2 px-3 text-gray-600 ${getCellClass(col)}`}
                >
                  {renderCell(col, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Simple Select ────────────────────────────────────────────────────────
const ReportSimpleSelect = ({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 pl-0.5">
      {label}
    </span>
    <div className="relative flex items-center">
      {Icon && (
        <Icon
          size={11}
          className="absolute left-2 text-gray-400 pointer-events-none"
        />
      )}
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="appearance-none text-[11px] font-medium border border-gray-200 rounded-lg bg-white text-gray-600 hover:border-gray-300 focus:outline-none focus:ring-1 transition-all cursor-pointer pr-6 py-1"
        style={{ paddingLeft: Icon ? "22px" : "8px", minWidth: "110px" }}
      >
        <option value="">All {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={10}
        className="absolute right-1.5 text-gray-400 pointer-events-none"
      />
    </div>
  </div>
);

// ─── Searchable Select ────────────────────────────────────────────────────
const ReportSearchableSelect = ({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  color,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = options.filter((o) =>
    String(o).toLowerCase().includes(search.toLowerCase()),
  );
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div className="flex flex-col gap-1 relative min-w-[220px]" ref={ref}>
      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-0.5">
        {label}
      </span>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-1.5 text-xs font-medium border rounded-xl bg-white hover:border-gray-300 focus:outline-none transition-all cursor-pointer py-2 pr-2
          ${open ? "border-gray-400 ring-1 ring-gray-200" : "border-gray-200"} ${hasValue ? "text-gray-700" : "text-gray-400"}`}
        style={{ paddingLeft: "10px", minWidth: "160px" }}
      >
        {Icon && (
          <Icon size={12} className="text-gray-400 flex-shrink-0 mr-1" />
        )}
        <span className="flex-1 text-left truncate">
          {hasValue ? String(value) : `All ${label}`}
        </span>
        {hasValue && (
          <span
            onMouseDown={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="w-4 h-4 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 text-gray-500 flex items-center justify-center text-[10px] flex-shrink-0 transition-colors"
          >
            x
          </span>
        )}
        <ChevronDown
          size={12}
          className={`text-gray-400 flex-shrink-0 ml-1 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl w-72 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${label}...`}
                className="w-full text-xs border border-gray-200 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder-gray-300"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-[11px] text-gray-400 text-center">
                No results
              </p>
            ) : (
              filtered.map((opt) => {
                const isActive = String(opt) === String(value);
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      onChange(isActive ? null : String(opt));
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-gray-50 ${isActive ? "font-semibold text-gray-800" : "text-gray-600"}`}
                  >
                    <span
                      className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={
                        isActive
                          ? { backgroundColor: color, borderColor: color }
                          : { borderColor: "#d1d5db" }
                      }
                    >
                      {isActive && (
                        <Check size={8} color="white" strokeWidth={3} />
                      )}
                    </span>
                    <span className="truncate">{String(opt)}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Multi Select ─────────────────────────────────────────────────────────
const ReportMultiSelect = ({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  color,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const selectedValues = Array.isArray(value) ? value : [];

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = options.filter(
    (option) =>
      String(option).toLowerCase().includes(search.toLowerCase()) &&
      !selectedValues.includes(String(option)),
  );
  const addValue = (nextValue) => {
    onChange([...selectedValues, String(nextValue)]);
    setSearch("");
  };
  const removeValue = (target) => {
    const next = selectedValues.filter((item) => item !== target);
    onChange(next.length ? next : null);
  };

  return (
    <div
      className={`relative flex min-w-[260px] flex-1 flex-col gap-1 self-start sm:max-w-[340px] ${className}`}
      ref={ref}
    >
      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-0.5">
        {label}
      </span>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex min-h-[38px] items-center gap-1.5 rounded-xl border bg-white py-2 pr-2 text-xs font-medium transition-all ${open ? "border-gray-400 ring-1 ring-gray-200" : "border-gray-200"} hover:border-gray-300 focus:outline-none`}
        style={{ paddingLeft: "8px" }}
      >
        {Icon && (
          <Icon size={11} className="text-gray-400 flex-shrink-0 mr-1" />
        )}
        <span className="flex-1 text-left truncate text-gray-600">
          {selectedValues.length > 0
            ? `${selectedValues.length} selected`
            : `Add ${label}`}
        </span>
        <ChevronDown
          size={10}
          className={`text-gray-400 flex-shrink-0 ml-1 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {selectedValues.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-slate-50/90 p-2 shadow-inner">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Selected
            </span>
            <span className="text-[10px] font-semibold text-gray-500">
              {selectedValues.length}
            </span>
          </div>
          <div className="max-h-24 overflow-y-auto pr-1">
            <div className="flex flex-wrap gap-1.5">
              {selectedValues.map((item) => (
                <span
                  key={item}
                  className="inline-flex max-w-full items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  <span className="max-w-[180px] truncate">{item}</span>
                  <button
                    onClick={() => removeValue(item)}
                    className="text-white/80 hover:text-white"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl w-72 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${label}...`}
                className="w-full text-xs border border-gray-200 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder-gray-300"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-[11px] text-gray-400 text-center">
                No results
              </p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  onClick={() => addValue(opt)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-gray-50 text-gray-600"
                >
                  <span className="truncate">{String(opt)}</span>
                  <Plus size={13} style={{ color }} />
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Filter Controls ──────────────────────────────────────────────────────
const FILTER_ICONS = {
  event_status: Tag,
  degree: GraduationCap,
  subject: BookOpen,
  hobby: Heart,
  type: Filter,
  college: GraduationCap,
  members: Users,
  groups: Users,
  questions: MessageSquare,
  searchText: Search,
};

const FilterControls = ({
  section,
  filters,
  setFilters,
  sectionRows,
  degreeSubjectMap,
  hobbyOptions,
  rowFilterOptions,
}) => {
  if (!section.filters?.length) return null;
  const cur = filters[section.id] || {};

  const getOptions = (f) => {
    if (f.source === "hardcoded") return f.options ?? [];
    if (f.source === "hobbyApi") return hobbyOptions;
    if (f.source === "rowMulti") {
      const cached = rowFilterOptions?.[section.id]?.[f.key];
      if (Array.isArray(cached) && cached.length > 0) return cached;
      const col = f.rowKey ?? f.key;
      return [
        ...new Set(
          sectionRows.map((r) => r[col]).filter((v) => v != null && v !== ""),
        ),
      ]
        .sort()
        .map(String);
    }
    if (f.source === "fromRows") {
      const cached = rowFilterOptions?.[section.id]?.[f.key];
      if (Array.isArray(cached) && cached.length > 0) return cached;
      const col = f.rowKey ?? f.key;
      return [
        ...new Set(
          sectionRows.map((r) => r[col]).filter((v) => v != null && v !== ""),
        ),
      ]
        .sort()
        .map(String);
    }
    if (f.source === "degreeApi") {
      if (f.subjectFilter) {
        const selectedDegrees = Array.isArray(cur["degree"])
          ? cur["degree"]
          : cur["degree"]
            ? [cur["degree"]]
            : [];
        if (selectedDegrees.length > 0) {
          return [
            ...new Set(
              selectedDegrees.flatMap(
                (degree) => degreeSubjectMap[degree] || [],
              ),
            ),
          ].sort();
        }
        return [...new Set(Object.values(degreeSubjectMap).flat())].sort();
      }
      if (f.collegeFilter) {
        return [
          ...new Set(sectionRows.map((r) => r["College_Name"]).filter(Boolean)),
        ].sort();
      }
      return Object.keys(degreeSubjectMap).sort();
    }
    return [];
  };

  const update = (key, val) => {
    setFilters((prev) => {
      const next = { ...prev[section.id], [key]: val };
      if (key === "degree") next["subject"] = null;
      return { ...prev, [section.id]: next };
    });
  };

  return (
    <div className="flex flex-wrap items-end gap-2.5 px-4 pb-2.5 pt-2 border-b border-gray-50">
      <div className="flex items-center gap-1.5 self-center">
        <Filter size={11} className="text-gray-400" />
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
          Filters
        </span>
      </div>
      {section.filters.map((f) => {
        const Icon = FILTER_ICONS[f.key] ?? Filter;
        const val = cur[f.key] ?? null;
        const opts = getOptions(f);
        return (
          <ReportMultiSelect
            key={f.key}
            label={f.label}
            icon={Icon}
            options={opts}
            value={val}
            color={section.color}
            className={f.fullWidth ? "basis-full sm:max-w-full" : ""}
            onChange={(v) => update(f.key, v)}
          />
        );
      })}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────
const AdminReportBuilder = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [selected, setSelected] = useState({});
  const [colState, setColState] = useState(() =>
    Object.fromEntries(
      SECTIONS.map((s) => [
        s.id,
        Object.fromEntries(s.columns.map((c) => [c.key, c.default])),
      ]),
    ),
  );
  const [expanded, setExpanded] = useState({});
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const [filters, setFilters] = useState({});
  const [generating, setGenerating] = useState(false);
  const [degreeSubjectMap, setDegreeSubjectMap] = useState({});
  const [hobbyOptions, setHobbyOptions] = useState([]);
  const [rowFilterOptions, setRowFilterOptions] = useState({});

  // ── One-time lookup fetches ────────────────────────────────────────────
  useEffect(() => {
    fetch(`${baseUrl}/degreeSubject/allDegreeSubject`)
      .then((r) => r.json())
      .then((d) => {
        const map = {};
        (d.degreeSubject ?? []).forEach(({ degree_name, subject_name }) => {
          if (!map[degree_name]) map[degree_name] = [];
          if (!map[degree_name].includes(subject_name))
            map[degree_name].push(subject_name);
        });
        setDegreeSubjectMap(map);
      })
      .catch(() => {});

    fetch(`${baseUrl}/hobbies`)
      .then((r) => r.json())
      .then((d) => {
        const list = d.hobbies ?? d.data ?? d;
        setHobbyOptions(
          Array.isArray(list)
            ? list
                .map((h) => h.Hobby_Name ?? h.hobby_name ?? String(h))
                .filter(Boolean)
            : [],
        );
      })
      .catch(() => {});
  }, [baseUrl]);

  // ── Fetch a single section ────────────────────────────────────────────
  const fetchSection = useCallback(
    async (section, activeFilters) => {
      setLoading((p) => ({ ...p, [section.id]: true }));
      try {
        const body = Object.fromEntries(
          Object.entries(activeFilters || {}).filter(
            ([, v]) =>
              v !== null &&
              v !== undefined &&
              v !== "" &&
              (!Array.isArray(v) || v.length > 0),
          ),
        );
        const res = await fetch(`${baseUrl}/admin/${section.endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error(
            `[ReportBuilder] ${section.id} → HTTP ${res.status}`,
            text.slice(0, 200),
          );
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        setRowFilterOptions((prev) => {
          const next = { ...(prev[section.id] || {}) };
          (section.filters || []).forEach((filterConfig) => {
            if (
              filterConfig.source !== "rowMulti" &&
              filterConfig.source !== "fromRows"
            )
              return;
            const rowKey = filterConfig.rowKey ?? filterConfig.key;
            const options = [
              ...new Set(
                (json.rows || [])
                  .map((row) => row[rowKey])
                  .filter((value) => value != null && value !== ""),
              ),
            ]
              .sort()
              .map(String);
            if (options.length > 0) {
              next[filterConfig.key] = [
                ...new Set([...(next[filterConfig.key] || []), ...options]),
              ];
            }
          });
          return { ...prev, [section.id]: next };
        });
        console.log(
          `[ReportBuilder] ${section.id} OK — rows: ${json.rows?.length ?? "?"}`,
        );
        setData((p) => ({ ...p, [section.id]: json }));
      } catch (err) {
        console.error(`[ReportBuilder] ${section.id} failed:`, err.message);
        setData((p) => ({
          ...p,
          [section.id]: {
            summary: [],
            chartData: null,
            rows: [],
            _error: true,
            _errMsg: err.message,
          },
        }));
      } finally {
        setLoading((p) => ({ ...p, [section.id]: false }));
      }
    },
    [baseUrl],
  );

  const filtersKey = JSON.stringify(filters);
  useEffect(() => {
    SECTIONS.forEach((s) => {
      if (selected[s.id]) fetchSection(s, filters[s.id] || {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  const toggleSection = (section) => {
    const on = !selected[section.id];
    setSelected((p) => ({ ...p, [section.id]: on }));
    if (on) fetchSection(section, filters[section.id] || {});
  };

  const toggleCol = (sId, key) =>
    setColState((p) => ({ ...p, [sId]: { ...p[sId], [key]: !p[sId][key] } }));

  const toggleAllCols = (sId, section) => {
    const allOn = section.columns.every((c) => colState[sId][c.key]);
    setColState((p) => ({
      ...p,
      [sId]: Object.fromEntries(section.columns.map((c) => [c.key, !allOn])),
    }));
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  // ── PDF generation ────────────────────────────────────────────────────
  const generatePDF = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();
      let firstPage = true;

      const drawPageHeader = (label) => {
        try {
          doc.addImage(logo, "PNG", 13, 5, 26, 26);
        } catch {}
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(27, 67, 28);
        doc.text("IdeaGroove Admin Report", pw - 13, 14, { align: "right" });
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 160, 120);
        doc.text("Platform Content Report", pw - 13, 20, { align: "right" });
        doc.setFontSize(6.5);
        doc.setTextColor(180, 180, 180);
        doc.text(
          "Generated: " +
            new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          pw - 13,
          26,
          { align: "right" },
        );
        doc.setFillColor(27, 67, 28);
        doc.rect(10, 31, pw - 20, 10, "F");
        doc.setFontSize(10.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(label + " Report", pw / 2, 38, { align: "center" });
      };

      const drawFooter = () => {
        const tp = doc.internal.getNumberOfPages();
        for (let p = 1; p <= tp; p++) {
          doc.setPage(p);
          doc.setFillColor(248, 250, 248);
          doc.rect(0, ph - 10, pw, 10, "F");
          doc.setFontSize(6.5);
          doc.setTextColor(170, 170, 170);
          doc.setFont("helvetica", "normal");
          doc.text("IdeaGroove Student Collaboration Platform", 13, ph - 4);
          doc.text(`Page ${p} of ${tp}`, pw - 13, ph - 4, { align: "right" });
        }
      };

      const drawSectionTitle = (title, y, [r, g, b]) => {
        doc.setFillColor(r, g, b);
        doc.roundedRect(10, y, pw - 20, 9, 1.5, 1.5, "F");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(title, pw / 2, y + 6, { align: "center" });
        return y + 13;
      };

      const drawSummaryCards = (summary, y, [r, g, b]) => {
        if (!summary?.length) return y;
        const n = Math.min(summary.length, 5);
        const cw = (pw - 20 - (n - 1) * 3) / n;
        const bg = [
          Math.min(r * 0.12 + 235, 255),
          Math.min(g * 0.12 + 235, 255),
          Math.min(b * 0.12 + 235, 255),
        ].map(Math.round);
        summary.slice(0, n).forEach((s, i) => {
          const cx = 10 + i * (cw + 3);
          doc.setFillColor(...bg);
          doc.roundedRect(cx, y, cw, 16, 2, 2, "F");
          doc.setDrawColor(r, g, b);
          doc.setLineWidth(0.25);
          doc.roundedRect(cx, y, cw, 16, 2, 2, "S");
          doc.setFontSize(13);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(r, g, b);
          doc.text(String(s.value ?? 0), cx + cw / 2, y + 8.8, {
            align: "center",
          });
          doc.setFontSize(5.3);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(110, 110, 110);
          doc.text(s.label.toUpperCase(), cx + cw / 2, y + 13.1, {
            align: "center",
          });
        });
        return y + 19;
      };

      const drawDonutChart = (slices, cx, cy, radius) => {
        const canvas = document.createElement("canvas");
        const sz = (radius + 20) * 3.5;
        canvas.width = canvas.height = sz;
        const ctx = canvas.getContext("2d"),
          cc = sz / 2;
        const total = slices.reduce((s, x) => s + x.value, 0);
        if (!total) return;
        let angle = -Math.PI / 2;
        slices.forEach((s) => {
          const sweep = (s.value / total) * 2 * Math.PI;
          ctx.beginPath();
          ctx.moveTo(cc, cc);
          ctx.arc(cc, cc, radius * 2, angle, angle + sweep);
          ctx.closePath();
          ctx.fillStyle = s.color;
          ctx.fill();
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2.5;
          ctx.stroke();
          angle += sweep;
        });
        ctx.beginPath();
        ctx.arc(cc, cc, radius * 2 * 0.52, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.fillStyle = "#1e293b";
        ctx.font = `bold ${radius * 0.9}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(total), cc, cc - radius * 0.15);
        ctx.fillStyle = "#94a3b8";
        ctx.font = `${radius * 0.45}px Arial`;
        ctx.fillText("total", cc, cc + radius * 0.5);
        const mm = (radius + 20) * 2 * 0.265;
        doc.addImage(
          getCompressedCanvasDataUrl(canvas, 0.74),
          "JPEG",
          cx - mm / 2,
          cy - mm / 2,
          mm,
          mm,
        );
      };

      const drawBarChart = (bars, x, y, w, h, hex) => {
        if (!bars?.length) return;
        const max = Math.max(...bars.map((b) => Number(b.value) || 0), 1);
        const baselineY = y + h - 8;
        const slotWidth = w / bars.length;
        const barWidth = Math.max(4.5, slotWidth * 0.54);
        const [r, g, b] = hex
          .replace("#", "")
          .match(/.{1,2}/g)
          .map((v) => parseInt(v, 16));
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.25);
        doc.line(x, baselineY, x + w, baselineY);
        bars.forEach((bar, index) => {
          const value = Number(bar.value) || 0;
          const barHeight = max ? (value / max) * (h - 18) : 0;
          const barX = x + index * slotWidth + (slotWidth - barWidth) / 2;
          const barY = baselineY - barHeight;
          const shortLabel =
            String(bar.label || "").length > 5
              ? `${String(bar.label).slice(0, 4)}.`
              : String(bar.label || "");
          doc.setFillColor(r, g, b);
          doc.roundedRect(barX, barY, barWidth, barHeight, 1.2, 1.2, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(6.5);
          doc.setTextColor(55, 65, 81);
          doc.text(String(value), barX + barWidth / 2, barY - 1.5, {
            align: "center",
          });
          doc.setFont("helvetica", "normal");
          doc.setFontSize(5.6);
          doc.setTextColor(148, 163, 184);
          doc.text(shortLabel, barX + barWidth / 2, baselineY + 4.5, {
            align: "center",
          });
        });
      };

      const fitText = (text, maxWidth, baseSize = 6.8, minSize = 4.2) => {
        const content = text == null ? "-" : String(text);
        let fontSize = baseSize;
        while (fontSize > minSize) {
          doc.setFontSize(fontSize);
          if (doc.getTextWidth(content) <= maxWidth) break;
          fontSize -= 0.2;
        }
        doc.setFontSize(fontSize);
        if (doc.getTextWidth(content) <= maxWidth)
          return { text: content, fontSize };
        let truncated = content;
        while (truncated.length > 1) {
          const candidate = `${truncated}...`;
          if (doc.getTextWidth(candidate) <= maxWidth)
            return { text: candidate, fontSize };
          truncated = truncated.slice(0, -1);
        }
        return { text: content.slice(0, 1), fontSize };
      };

      // ── Multi-line cell renderer for PDF (answers, members, hobbies) ──
      const drawMultiLineCell = (
        doc,
        lines,
        x,
        startY,
        maxW,
        lineH = 4.5,
        baseSize = 5.8,
      ) => {
        let cy = startY;
        for (const line of lines) {
          doc.setFontSize(baseSize);
          const words = line.split(" ");
          let row = "";
          for (const word of words) {
            const test = row ? row + " " + word : word;
            if (doc.getTextWidth(test) > maxW - 1 && row) {
              doc.text(row, x, cy);
              cy += lineH;
              row = word;
            } else {
              row = test;
            }
          }
          if (row) {
            doc.text(row, x, cy);
            cy += lineH;
          }
        }
        return cy;
      };

      // ── PDF data table with dynamic row heights for rich cells ────────
      const drawDataTable = (section, rows, cols, startY) => {
        if (!rows?.length || !cols.length) return startY + 4;
        const mL = 10,
          tW = pw - 20,
          rH = 7;
        const columnWeights = cols.map((col) => getPdfColumnWeight(col.key));
        const totalWeight = columnWeights.reduce((sum, w) => sum + w, 0);
        const columnWidths = columnWeights.map((w) => (tW * w) / totalWeight);
        const columnX = columnWidths.reduce((positions, _, index) => {
          const prevX =
            index === 0 ? mL : positions[index - 1] + columnWidths[index - 1];
          positions.push(prevX);
          return positions;
        }, []);

        const drawTH = (yp) => {
          doc.setFillColor(27, 67, 28);
          doc.rect(mL, yp, tW, rH, "F");
          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          cols.forEach((col, i) => {
            const { text, fontSize } = fitText(
              col.label.toUpperCase(),
              columnWidths[i] - 4,
              6.4,
              6.4,
            );
            doc.setFontSize(fontSize);
            doc.text(text, columnX[i] + 2, yp + 4.6);
          });
          return yp + rH;
        };

        let y = drawTH(startY);

        rows.forEach((row, rowIdx) => {
          // Pre-calculate the cell content and required height per row
          const cellData = cols.map((col, ci) => {
            const raw = row[col.key];
            const colW = columnWidths[ci] - 4;

            // Question → wrap full text across lines
            if (
              col.key === "Question" ||
              col.key === "Room_Name" ||
              col.key === "Description"
            ) {
              const s = formatPdfDisplayCell(col.key, raw, row);
              if (s === "-") return { type: "text", lines: ["-"], height: rH };
              doc.setFontSize(6.1);
              const words = s.split(" ");
              const lines = [];
              let cur = "";
              for (const w of words) {
                const test = cur ? cur + " " + w : w;
                if (doc.getTextWidth(test) > colW && cur) {
                  lines.push(cur);
                  cur = w;
                } else {
                  cur = test;
                }
              }
              if (cur) lines.push(cur);
              return {
                type: "wrap",
                lines,
                height: Math.max(lines.length * 4.2 + 2, rH),
              };
            }

            // answers → multi-line blocks
            if (col.key === "all_answers") {
              if (!row.answer_count || Number(row.answer_count) === 0)
                return { type: "text", lines: ["-"], height: rH };
              const answers = parseAnswers(raw);
              if (!answers.length)
                return {
                  type: "text",
                  lines: [String(raw || "-")],
                  height: rH,
                };
              // Each answer: author header + wrapped answer text lines + gap
              let totalH = 2;
              const blocks = answers.map((a) => {
                const textLines = [];
                if (a.text) {
                  doc.setFontSize(5.8);
                  const words = a.text.split(" ");
                  let line = "";
                  for (const w of words) {
                    const test = line ? line + " " + w : w;
                    if (doc.getTextWidth(test) > colW && line) {
                      textLines.push(line);
                      line = w;
                    } else {
                      line = test;
                    }
                  }
                  if (line) textLines.push(line);
                }
                // author (4.5) + text lines (4 each) + bottom gap (3)
                const blockH = (a.author ? 4.5 : 0) + textLines.length * 4 + 3;
                totalH += blockH;
                return { author: a.author, textLines, blockH };
              });
              return {
                type: "answers",
                blocks,
                height: Math.max(totalH + 2, rH),
              };
            }

            // member_names in groups → badge list
            if (col.key === "member_names" && section.id === "groups") {
              if (!row.member_count || Number(row.member_count) === 0)
                return { type: "text", lines: ["-"], height: rH };
              const members = String(raw || "")
                .split(",")
                .map((m) => m.trim())
                .filter(Boolean);
              if (!members.length)
                return {
                  type: "text",
                  lines: [`${row.member_count} member(s)`],
                  height: rH,
                };
              // fit members onto lines
              doc.setFontSize(5.5);
              const memberLines = [];
              let cur = "";
              for (const m of members) {
                const test = cur ? cur + ", " + m : m;
                if (doc.getTextWidth(test) > colW && cur) {
                  memberLines.push(cur);
                  cur = m;
                } else {
                  cur = test;
                }
              }
              if (cur) memberLines.push(cur);
              const h = Math.max(memberLines.length * 4.2 + 2, rH);
              return { type: "members", lines: memberLines, height: h };
            }

            // hobby_name in users → comma list wrapping
            if (col.key === "hobby_name" && section.id === "users") {
              const s = formatPdfDisplayCell(col.key, raw, row);
              if (s === "-") return { type: "text", lines: ["-"], height: rH };
              doc.setFontSize(5.8);
              const words = s.split(",").map((w) => w.trim());
              const lines = [];
              let cur = "";
              for (const w of words) {
                const test = cur ? cur + ", " + w : w;
                if (doc.getTextWidth(test) > colW && cur) {
                  lines.push(cur);
                  cur = w;
                } else {
                  cur = test;
                }
              }
              if (cur) lines.push(cur);
              return {
                type: "wrap",
                lines,
                height: Math.max(lines.length * 4.2 + 2, rH),
              };
            }

            const val = formatPdfDisplayCell(col.key, raw, row);
            return { type: "text", lines: [val], height: rH };
          });

          const rowHeight = Math.max(...cellData.map((c) => c.height), rH);

          if (y + rowHeight > ph - 18) {
            doc.addPage();
            y = 15;
            y = drawTH(y);
          }

          if (rowIdx % 2 === 0) {
            doc.setFillColor(248, 252, 248);
            doc.rect(mL, y, tW, rowHeight, "F");
          }

          cols.forEach((col, j) => {
            const cd = cellData[j];
            const cx = columnX[j] + 2;
            const colW = columnWidths[j] - 4;

            if (cd.type === "answers") {
              let cy = y + 4;
              cd.blocks.forEach((block, bIdx) => {
                // separator line between answers
                if (bIdx > 0) {
                  doc.setDrawColor(200, 230, 210);
                  doc.setLineWidth(0.15);
                  doc.line(cx, cy - 1, cx + colW, cy - 1);
                }
                // Author name in green bold
                if (block.author) {
                  doc.setFontSize(5.4);
                  doc.setFont("helvetica", "bold");
                  doc.setTextColor(16, 185, 129);
                  const authorTxt =
                    block.author.length > 28
                      ? block.author.slice(0, 27) + "."
                      : block.author;
                  doc.text(authorTxt, cx, cy);
                  cy += 4.5;
                }
                // Answer text in normal dark
                doc.setFontSize(5.8);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(50, 50, 50);
                block.textLines.forEach((line) => {
                  doc.text(line, cx, cy);
                  cy += 4;
                });
                cy += 2;
              });
            } else if (cd.type === "members") {
              doc.setFontSize(5.5);
              doc.setFont("helvetica", "normal");
              doc.setTextColor(100, 80, 180);
              let cy = y + 4;
              cd.lines.forEach((line) => {
                doc.text(line, cx, cy);
                cy += 4.2;
              });
            } else if (cd.type === "wrap") {
              doc.setFontSize(5.8);
              doc.setFont("helvetica", "normal");
              doc.setTextColor(50, 50, 50);
              let cy = y + 4;
              cd.lines.forEach((line) => {
                doc.text(line, cx, cy);
                cy += 4.2;
              });
            } else {
              const raw2 = row[col.key];
              const { text, fontSize } = fitText(cd.lines[0], colW, 6.1, 6.1);
              doc.setFontSize(fontSize);
              if (col.key === "Is_Active" || col.key === "is_Active") {
                doc.setTextColor(
                  ...(raw2 === 1 ? [16, 185, 129] : [239, 68, 68]),
                );
                doc.setFont("helvetica", "bold");
              } else if (col.key === "Status") {
                doc.setTextColor(...(STATUS_COLORS[raw2] || [100, 100, 100]));
                doc.setFont("helvetica", "bold");
              } else if (col.key === "event_status") {
                doc.setTextColor(
                  ...(raw2 === "Upcoming" ? [14, 165, 233] : [148, 163, 184]),
                );
                doc.setFont("helvetica", "bold");
              } else if (col.key === "Complaint_Type") {
                doc.setTextColor(99, 102, 241);
                doc.setFont("helvetica", "bold");
              } else {
                doc.setTextColor(50, 50, 50);
                doc.setFont("helvetica", "normal");
              }
              doc.text(text, cx, y + 4.5);
            }
          });

          doc.setDrawColor(220, 230, 220);
          doc.setLineWidth(0.1);
          doc.line(mL, y + rowHeight, mL + tW, y + rowHeight);
          y += rowHeight;
        });
        return y + 6;
      };

      for (const section of SECTIONS) {
        if (
          !selected[section.id] ||
          !data[section.id] ||
          data[section.id]._error
        )
          continue;
        if (
          !Array.isArray(data[section.id].rows) ||
          data[section.id].rows.length === 0
        )
          continue;
        try {
          const sData = data[section.id];
          const summary = Array.isArray(sData.summary) ? sData.summary : [];
          const donut = Array.isArray(sData.chartData?.donut)
            ? sData.chartData.donut
            : [];
          const bars = Array.isArray(sData.chartData?.bars)
            ? sData.chartData.bars
            : [];
          const rows = Array.isArray(sData.rows) ? sData.rows : [];
          const activeCols = section.columns.filter(
            (c) => colState[section.id][c.key],
          );

          if (!firstPage) doc.addPage();
          drawPageHeader(section.label);
          firstPage = false;
          let y = 47;
          y = drawSectionTitle(
            section.label + " Detailed Report",
            y,
            section.rgb,
          );
          y += 2;
          if (summary.length) {
            y = drawSummaryCards(summary, y, section.rgb);
            y += 2;
          }

          if (donut.length || bars.length) {
            doc.setFillColor(249, 252, 249);
            doc.roundedRect(10, y, pw - 20, 68, 2, 2, "F");
            const ct = y + 4,
              hw = (pw - 26) / 2;
            doc.setFontSize(7.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...section.rgb);
            doc.text("Status Distribution", 12 + hw / 2, ct + 3, {
              align: "center",
            });
            if (donut.length) {
              drawDonutChart(donut, 12 + hw * 0.34, ct + 34, 36);
              const lx = 12 + hw * 0.66;
              donut.forEach((s, i) => {
                const ly = ct + 16 + i * 9;
                doc.setFillColor(s.color);
                doc.roundedRect(lx, ly, 3.5, 3.5, 0.5, 0.5, "F");
                doc.setFontSize(6.8);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(50, 50, 50);
                doc.text(s.label, lx + 5, ly + 2.8);
                doc.setFontSize(8);
                doc.setTextColor(...section.rgb);
                doc.text(String(s.value), lx + 5, ly + 7.2);
              });
            }
            doc.setDrawColor(220, 235, 220);
            doc.setLineWidth(0.3);
            doc.line(14 + hw, ct + 2, 14 + hw, ct + 62);
            doc.setFontSize(7.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...section.rgb);
            doc.text("Monthly Trend", 16 + hw + hw / 2, ct + 3, {
              align: "center",
            });
            if (bars.length)
              drawBarChart(bars, 16 + hw, ct + 8, hw - 4, 52, section.color);
            y += 72;
            doc.setDrawColor(210, 228, 210);
            doc.setLineWidth(0.4);
            doc.line(10, y, pw - 10, y);
            y += 6;
          }

          if (y > ph - 50) {
            doc.addPage();
            drawPageHeader(section.label);
            y = 47;
          }
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...section.rgb);
          doc.text(
            `${section.label} — ${rows.length} records, ${activeCols.length} columns`,
            10,
            y,
          );
          y += 5;
          y = drawDataTable(section, rows, activeCols, y);
        } catch (e) {
          console.error(`PDF ${section.id}:`, e);
        }
      }

      drawFooter();
      doc.save(
        `IdeaGroove_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
      );
    } catch (e) {
      console.error("PDF failed:", e);
    } finally {
      setGenerating(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <section className="flex flex-col gap-6 relative min-h-screen pb-28">
      <div className="flex justify-between items-center">
        <AdminPageHeader
          title="Report Builder"
          subtitle="Select sections, customize columns, generate a PDF"
        />
        <button
          onClick={generatePDF}
          disabled={selectedCount === 0 || generating}
          className="group flex items-center justify-center gap-2.5 bg-white border border-gray-200 hover:border-green-700 hover:bg-green-800 px-4 py-2.5 rounded-xl text-[15px] font-semibold text-gray-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed min-w-[210px]"
        >
          <div className="p-1 rounded-lg bg-green-50 group-hover:bg-white/20 transition-colors">
            {generating ? (
              <Loader2
                size={14}
                className="text-green-700 group-hover:text-white animate-spin"
              />
            ) : (
              <FileBarChart2
                size={14}
                className="text-green-700 group-hover:text-white transition-colors"
              />
            )}
          </div>
          <span>{generating ? "Generating..." : "Generate Report"}</span>
          <span className="text-[10px] font-bold bg-green-100 group-hover:bg-white/20 text-green-700 group-hover:text-white px-1.5 py-0.5 rounded-md transition-colors">
            PDF
          </span>
          {selectedCount > 0 && !generating && (
            <span className="text-[10px] font-bold bg-amber-100 group-hover:bg-white/20 text-amber-700 group-hover:text-white px-1.5 py-0.5 rounded-md transition-colors">
              {selectedCount} section{selectedCount > 1 ? "s" : ""}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-3 -mt-3">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${(selectedCount / SECTIONS.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-bold text-gray-400 w-24 text-right">
          {selectedCount}/{SECTIONS.length} sections
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {SECTIONS.map((section) => {
          const isOn = !!selected[section.id];
          const isLoad = !!loading[section.id];
          const sData = data[section.id] ?? null;
          const rows = Array.isArray(sData?.rows) ? sData.rows : [];
          const isExp = !!expanded[section.id];
          const Icon = section.icon;
          const colCount = section.columns.filter(
            (c) => colState[section.id][c.key],
          ).length;

          return (
            <div
              key={section.id}
              className={`rounded-[28px] border-2 transition-all duration-300 overflow-hidden bg-white
                ${isOn ? `${section.border} shadow-lg` : "border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md"}`}
            >
              <div className={`bg-gradient-to-r ${section.bg} px-5 py-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: section.color + "18",
                        border: `1.5px solid ${section.color}30`,
                      }}
                    >
                      <Icon size={20} style={{ color: section.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-gray-800 text-xl tracking-tight">
                          {section.label}
                        </h3>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${section.tagColor}`}
                        >
                          {section.tag}
                        </span>
                        {isOn && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/70 text-gray-500 border border-gray-200">
                            {colCount}/{section.columns.length} cols
                          </span>
                        )}
                      </div>
                      <p className="text-[15px] text-gray-500 mt-1 leading-snug">
                        {section.desc}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSection(section)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 mt-0.5 ${isOn ? "bg-[#1B431C]" : "bg-gray-200 hover:bg-gray-300"}`}
                  >
                    <div
                      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
                      style={{ left: isOn ? "calc(100% - 22px)" : "2px" }}
                    />
                  </button>
                </div>
              </div>

              {!isOn && (
                <div className="px-4 py-3 flex items-center gap-2 text-gray-300 border-t border-gray-50">
                  <EyeOff size={13} />
                  <span className="text-[15px]">
                    Toggle to preview live data and include in PDF
                  </span>
                </div>
              )}

              {isOn && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  <FilterControls
                    section={section}
                    filters={filters}
                    setFilters={setFilters}
                    sectionRows={rows}
                    degreeSubjectMap={degreeSubjectMap}
                    hobbyOptions={hobbyOptions}
                    rowFilterOptions={rowFilterOptions}
                  />

                  <div className="px-5 pt-4 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Columns size={11} className="text-gray-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                          PDF Columns
                        </span>
                      </div>
                      <button
                        onClick={() => toggleAllCols(section.id, section)}
                        className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {section.columns.every(
                          (c) => colState[section.id][c.key],
                        )
                          ? "Deselect all"
                          : "Select all"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {section.columns.map((col) => (
                        <ColChip
                          key={col.key}
                          col={col}
                          active={colState[section.id][col.key]}
                          onToggle={() => toggleCol(section.id, col.key)}
                          color={section.color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between px-5 py-3 bg-gray-50/60">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                          Live Preview
                        </span>
                        {isLoad && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Loader2 size={9} className="animate-spin" />{" "}
                            Loading...
                          </span>
                        )}
                        {!isLoad && sData && !sData._error && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                            <Zap size={9} /> Live data
                          </span>
                        )}
                        {!isLoad && sData?._error && (
                          <span className="text-xs text-red-500 font-bold">
                            HTTP error: {sData._errMsg} — check console
                          </span>
                        )}
                      </div>
                      {!isLoad && rows.length > 0 && (
                        <button
                          onClick={() =>
                            setExpanded((p) => ({ ...p, [section.id]: !isExp }))
                          }
                          className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {isExp ? (
                            <>
                              <ChevronUp size={10} /> Hide rows
                            </>
                          ) : (
                            <>
                              <ChevronDown size={10} /> Sample rows
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {isLoad ? (
                      <div className="p-4 space-y-2">
                        {[100, 80, 90].map((w, i) => (
                          <div
                            key={i}
                            className="h-2.5 bg-gray-100 rounded animate-pulse"
                            style={{ width: `${w}%` }}
                          />
                        ))}
                      </div>
                    ) : (
                      <SectionPreview section={section} sData={sData} />
                    )}

                    {isExp && rows.length > 0 && (
                      <SampleTable
                        section={section}
                        rows={rows}
                        colState={colState[section.id]}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {selectedCount === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 font-bold text-[15px]">
              Toggle sections above to build your report
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Each section loads live data, choose which columns appear in the
              PDF
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminReportBuilder;
