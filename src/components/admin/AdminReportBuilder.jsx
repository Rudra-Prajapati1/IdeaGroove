import React, { useState } from "react";
import jsPDF from "jspdf";
import logo from "/DarkLogo.png";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
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
} from "lucide-react";

// ─── Section registry ──────────────────────────────────────────────────────
const SECTIONS = [
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
    desc: "Platform events with status & organizer breakdown",
    endpoint: "events-report",
    columns: [
      { key: "Description", label: "Title", default: true },
      { key: "Event_Date", label: "Event Date", default: true },
      { key: "Added_On", label: "Added On", default: false },
      { key: "student_name", label: "Organizer", default: true },
      { key: "Degree_Name", label: "Degree", default: true },
      { key: "Is_Active", label: "Status", default: true },
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
    desc: "Study groups, member counts & activity",
    endpoint: "groups-report",
    columns: [
      { key: "Room_Name", label: "Group Name", default: true },
      { key: "Created_On", label: "Created On", default: true },
      { key: "student_name", label: "Created By", default: true },
      { key: "member_count", label: "Members", default: true },
      { key: "Degree_Name", label: "Degree", default: true },
      { key: "Is_Active", label: "Status", default: true },
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
      { key: "Description", label: "Description", default: false },
      { key: "Added_On", label: "Uploaded On", default: true },
      { key: "student_name", label: "Author", default: true },
      { key: "Subject_Name", label: "Subject", default: true },
      { key: "Degree_Name", label: "Degree", default: true },
      { key: "Is_Active", label: "Status", default: true },
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
      { key: "Subject_Name", label: "Subject", default: true },
      { key: "Degree_Name", label: "Degree", default: false },
      { key: "Is_Active", label: "Status", default: true },
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
    desc: "All complaints with status & resolution data",
    endpoint: "complaints-report",
    columns: [
      { key: "Complaint_Text", label: "Complaint", default: true },
      { key: "Date", label: "Filed On", default: true },
      { key: "student_name", label: "Student", default: true },
      { key: "Status", label: "Status", default: true },
      { key: "Degree_Name", label: "Degree", default: false },
      { key: "age_days", label: "Age (days)", default: true },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Active: [16, 185, 129],
  Blocked: [239, 68, 68],
  Resolved: [16, 185, 129],
  Pending: [245, 158, 11],
  "In-Progress": [59, 130, 246],
};

const formatCell = (key, val) => {
  if (val === null || val === undefined) return "-";
  if (key === "Is_Active") return val === 1 ? "Active" : "Blocked";
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
  return s.length > 40 ? s.slice(0, 39) + "…" : s;
};

// ─── Mini SVG Donut ──────────────────────────────────────────────────────
const MiniDonut = ({ slices, size = 72 }) => {
  const r = 24,
    c = size / 2;
  let cum = 0;
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total === 0)
    return (
      <div className="w-[72px] h-[72px] rounded-full bg-gray-100 animate-pulse" />
    );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth="9"
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
        style={{ fontSize: 10, fontWeight: 900, fill: "#1e293b" }}
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
    <div className="flex items-end gap-0.5 h-12 w-full">
      {bars.map((b, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-0.5 flex-1 min-w-0"
        >
          <span className="text-[8px] font-bold text-gray-500">{b.value}</span>
          <div
            className="w-full rounded-t-sm transition-all duration-700"
            style={{
              height: `${Math.max((b.value / max) * 32, 2)}px`,
              backgroundColor: color,
              opacity: 0.5 + (i / bars.length) * 0.5,
            }}
          />
          <span className="text-[7px] text-gray-400 truncate w-full text-center leading-none">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Section Preview ──────────────────────────────────────────────────────
const SectionPreview = ({ section, sData }) => {
  if (!sData)
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

  const { summary, chartData } = sData;

  return (
    <div className="p-4 space-y-4">
      {/* Summary stat pills */}
      {summary?.length > 0 && (
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${Math.min(summary.length, 4)}, 1fr)`,
          }}
        >
          {summary.map((s, i) => (
            <div
              key={i}
              className="rounded-xl px-3 py-2 text-center"
              style={{ backgroundColor: section.accent }}
            >
              <div
                className="text-base font-black leading-tight"
                style={{ color: section.color }}
              >
                {s.value}
              </div>
              <div className="text-[9px] font-semibold text-gray-500 leading-tight mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts row */}
      {chartData && (
        <div className="flex items-center gap-4 pt-1">
          {chartData.donut?.length > 0 && (
            <div className="flex items-center gap-3 flex-shrink-0">
              <MiniDonut slices={chartData.donut} />
              <div className="space-y-1">
                {chartData.donut.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-[9px] text-gray-500 leading-none">
                      {s.label}:{" "}
                      <strong className="text-gray-700">{s.value}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {chartData.bars?.length > 0 && (
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Monthly trend
              </div>
              <MiniBarChart bars={chartData.bars} color={section.color} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Column chip ──────────────────────────────────────────────────────────
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

// ─── Sample rows mini table ───────────────────────────────────────────────
const SampleTable = ({ section, rows, colState }) => {
  const visibleCols = section.columns.filter((c) => colState[c.key]);
  if (!visibleCols.length || !rows?.length) return null;
  return (
    <div className="px-4 pb-4 overflow-x-auto">
      <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
        Sample — first 5 rows (matching PDF columns)
      </div>
      <table className="w-full text-[10px] border-collapse min-w-max">
        <thead>
          <tr>
            {visibleCols.map((col) => (
              <th
                key={col.key}
                className="text-left py-1.5 px-2 font-black text-[9px] text-gray-400 uppercase border-b border-gray-100 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 5).map((row, i) => (
            <tr
              key={i}
              className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
            >
              {visibleCols.map((col) => (
                <td
                  key={col.key}
                  className="py-1.5 px-2 text-gray-600 whitespace-nowrap max-w-[160px] truncate"
                >
                  {col.key === "Is_Active" ? (
                    <span
                      className={`font-bold ${row[col.key] === 1 ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {row[col.key] === 1 ? "Active" : "Blocked"}
                    </span>
                  ) : col.key === "Status" ? (
                    <span
                      className={`font-bold ${
                        row[col.key] === "Resolved"
                          ? "text-emerald-600"
                          : row[col.key] === "Pending"
                            ? "text-amber-600"
                            : row[col.key] === "In-Progress"
                              ? "text-blue-600"
                              : "text-gray-500"
                      }`}
                    >
                      {row[col.key] || "-"}
                    </span>
                  ) : (
                    formatCell(col.key, row[col.key])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────
const AdminReportBuilder = () => {
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
  const [generating, setGenerating] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchSection = async (section) => {
    setLoading((p) => ({ ...p, [section.id]: true }));
    try {
      const res = await fetch(`${baseUrl}/admin/${section.endpoint}`);
      const json = await res.json();
      setData((p) => ({ ...p, [section.id]: json }));
    } catch (e) {
      console.error(`Fetch ${section.id}:`, e);
    } finally {
      setLoading((p) => ({ ...p, [section.id]: false }));
    }
  };

  const toggleSection = (section) => {
    const willBeOn = !selected[section.id];
    setSelected((p) => ({ ...p, [section.id]: willBeOn }));
    if (willBeOn && !data[section.id]) fetchSection(section);
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

  // ── PDF Generation ────────────────────────────────────────────────────────
  const generatePDF = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();
      let firstPage = true;

      // ── page header ────────────────────────────────────────
      const drawHeader = (sectionLabel) => {
        try {
          doc.addImage(logo, "PNG", 13, 5, 26, 26);
        } catch {}
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(27, 67, 28);
        doc.text("IdeaGroove — Admin Report", pw - 13, 14, { align: "right" });
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
        // Title bar
        doc.setFillColor(27, 67, 28);
        doc.rect(10, 31, pw - 20, 10, "F");
        doc.setFontSize(10.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(sectionLabel + " — Admin Intelligence Report", pw / 2, 38, {
          align: "center",
        });
      };

      // ── footer ─────────────────────────────────────────────
      const drawFooter = () => {
        const tp = doc.internal.getNumberOfPages();
        for (let p = 1; p <= tp; p++) {
          doc.setPage(p);
          doc.setFillColor(248, 250, 248);
          doc.rect(0, ph - 10, pw, 10, "F");
          doc.setFontSize(6.5);
          doc.setTextColor(170, 170, 170);
          doc.setFont("helvetica", "normal");
          doc.text(
            "IdeaGroove Student Collaboration Platform — Confidential Admin Report",
            13,
            ph - 4,
          );
          doc.text(`Page ${p} of ${tp}`, pw - 13, ph - 4, { align: "right" });
        }
      };

      // ── section title bar ───────────────────────────────────
      const drawSectionTitle = (title, y, [r, g, b]) => {
        doc.setFillColor(r, g, b);
        doc.roundedRect(10, y, pw - 20, 9, 1.5, 1.5, "F");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(title, pw / 2, y + 6, { align: "center" });
        return y + 13;
      };

      // ── summary stat cards row ──────────────────────────────
      const drawSummaryCards = (summary, y, [r, g, b]) => {
        if (!summary?.length) return y;
        const n = Math.min(summary.length, 5);
        const cw = (pw - 20 - (n - 1) * 3) / n;
        // pastel background tint
        const tR = Math.min(Math.round(r * 0.12 + 235), 255);
        const tG = Math.min(Math.round(g * 0.12 + 235), 255);
        const tB = Math.min(Math.round(b * 0.12 + 235), 255);
        summary.slice(0, n).forEach((s, i) => {
          const cx = 10 + i * (cw + 3);
          doc.setFillColor(tR, tG, tB);
          doc.roundedRect(cx, y, cw, 20, 2, 2, "F");
          doc.setDrawColor(r, g, b);
          doc.setLineWidth(0.25);
          doc.roundedRect(cx, y, cw, 20, 2, 2, "S");
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(r, g, b);
          doc.text(String(s.value ?? 0), cx + cw / 2, y + 11, {
            align: "center",
          });
          doc.setFontSize(6);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(110, 110, 110);
          doc.text(s.label.toUpperCase(), cx + cw / 2, y + 16.5, {
            align: "center",
          });
        });
        return y + 24;
      };

      // ── donut chart via canvas ──────────────────────────────
      const drawDonutChart = (slices, cx, cy, radius, doc) => {
        const canvas = document.createElement("canvas");
        const sz = (radius + 12) * 2 * 2; // 2x for crispness
        canvas.width = canvas.height = sz;
        const ctx = canvas.getContext("2d");
        const cc = sz / 2;
        const total = slices.reduce((s, x) => s + x.value, 0);
        if (total === 0 || !slices.length) return;
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
        // donut hole
        ctx.beginPath();
        ctx.arc(cc, cc, radius * 2 * 0.52, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        // center text
        ctx.fillStyle = "#1e293b";
        ctx.font = `bold ${radius * 0.9}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(total), cc, cc - radius * 0.15);
        ctx.fillStyle = "#94a3b8";
        ctx.font = `${radius * 0.45}px Arial`;
        ctx.fillText("total", cc, cc + radius * 0.5);
        const mmSize = (radius + 12) * 2 * 0.265;
        doc.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          cx - mmSize / 2,
          cy - mmSize / 2,
          mmSize,
          mmSize,
        );
        return mmSize;
      };

      // ── bar chart via canvas ────────────────────────────────
      const drawBarChart = (bars, x, y, w, h, hexColor, doc) => {
        if (!bars || bars.length === 0) return;
        const canvas = document.createElement("canvas");
        canvas.width = w * 5;
        canvas.height = h * 5;
        const ctx = canvas.getContext("2d");
        const max = Math.max(...bars.map((b) => Number(b.value) || 0), 1);
        const bw = (canvas.width / bars.length) * 0.58;
        const gap = (canvas.width / bars.length) * 0.42;
        bars.forEach((b, i) => {
          const bh = (b.value / max) * canvas.height * 0.72;
          const bx = i * (bw + gap) + gap * 0.5;
          const by = canvas.height * 0.82 - bh;
          const grad = ctx.createLinearGradient(bx, by, bx, by + bh);
          grad.addColorStop(0, hexColor);
          grad.addColorStop(1, hexColor + "55");
          ctx.fillStyle = grad;
          ctx.beginPath();
          // roundRect polyfill for older browsers
          const rrFn = (cx2, cy2, cw2, ch2, r2) => {
            ctx.moveTo(cx2 + r2, cy2);
            ctx.lineTo(cx2 + cw2 - r2, cy2);
            ctx.quadraticCurveTo(cx2 + cw2, cy2, cx2 + cw2, cy2 + r2);
            ctx.lineTo(cx2 + cw2, cy2 + ch2);
            ctx.lineTo(cx2, cy2 + ch2);
            ctx.lineTo(cx2, cy2 + r2);
            ctx.quadraticCurveTo(cx2, cy2, cx2 + r2, cy2);
            ctx.closePath();
          };
          rrFn(bx, by, bw, Math.max(bh, 1), 3);
          ctx.fill();
          // value
          ctx.fillStyle = "#374151";
          ctx.font = `bold ${canvas.width * 0.058}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(String(b.value), bx + bw / 2, by - 3);
          // label
          ctx.fillStyle = "#9ca3af";
          ctx.font = `${canvas.width * 0.048}px Arial`;
          ctx.textBaseline = "top";
          const lbl = b.label.length > 5 ? b.label.slice(0, 4) + "." : b.label;
          ctx.fillText(lbl, bx + bw / 2, canvas.height * 0.84);
        });
        doc.addImage(canvas.toDataURL("image/png"), "PNG", x, y, w, h);
      };

      // ── data table — pure doc.text() (no autoTable dependency) ─
      const drawDataTable = (rows, cols, startY) => {
        if (!rows?.length || !cols.length) return startY + 4;

        const marginL = 10;
        const tableW = pw - 20;
        const rowH = 8;
        const colW = tableW / cols.length;

        // ── draw header row ──
        const drawHeader = (yPos) => {
          doc.setFillColor(27, 67, 28);
          doc.rect(marginL, yPos, tableW, rowH, "F");
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          cols.forEach((col, i) => {
            const cellX = marginL + i * colW + 2;
            const txt = col.label.toUpperCase();
            const maxChars = Math.floor(colW / 2.2);
            doc.text(
              txt.length > maxChars ? txt.slice(0, maxChars - 1) + "…" : txt,
              cellX,
              yPos + 5.5,
            );
          });
          return yPos + rowH;
        };

        let y = drawHeader(startY);

        // ── draw each data row ──
        rows.forEach((row, i) => {
          // page break
          if (y > ph - 18) {
            doc.addPage();
            y = 15;
            y = drawHeader(y);
          }

          // alternating row background
          if (i % 2 === 0) {
            doc.setFillColor(248, 252, 248);
            doc.rect(marginL, y, tableW, rowH, "F");
          }

          cols.forEach((col, j) => {
            const raw = row[col.key];
            const cellVal =
              raw === null || raw === undefined
                ? "-"
                : formatCell(col.key, raw);

            const cellX = marginL + j * colW + 2;
            const maxChars = Math.floor(colW / 1.9);
            const display =
              cellVal.length > maxChars
                ? cellVal.slice(0, maxChars - 1) + "…"
                : cellVal;

            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");

            // colour-code status columns
            if (col.key === "Is_Active") {
              const isActive = raw === 1;
              doc.setTextColor(...(isActive ? [16, 185, 129] : [239, 68, 68]));
              doc.setFont("helvetica", "bold");
            } else if (col.key === "Status") {
              const c = STATUS_COLORS[raw] || [100, 100, 100];
              doc.setTextColor(...c);
              doc.setFont("helvetica", "bold");
            } else {
              doc.setTextColor(50, 50, 50);
            }

            doc.text(display, cellX, y + 5.5);
          });

          // thin divider line
          doc.setDrawColor(220, 230, 220);
          doc.setLineWidth(0.1);
          doc.line(marginL, y + rowH, marginL + tableW, y + rowH);

          y += rowH;
        });

        return y + 6;
      };

      // ── iterate sections ────────────────────────────────────
      for (const section of SECTIONS) {
        if (!selected[section.id] || !data[section.id]) continue;
        try {
          const sData = data[section.id];
          const activeCols = section.columns.filter(
            (c) => colState[section.id][c.key],
          );
          const rgb = section.rgb;
          const hexColor = section.color;

          if (!firstPage) doc.addPage();
          drawHeader(section.label);
          firstPage = false;
          let y = 47;

          // section title bar
          y = drawSectionTitle(section.label + " — Detailed Report", y, rgb);
          y += 2;

          // summary stat cards
          if (sData.summary?.length) {
            y = drawSummaryCards(sData.summary, y, rgb);
            y += 2;
          }

          // charts — bigger donut (radius 30), taller bar zone (52mm), total height 70mm
          if (
            sData.chartData &&
            (sData.chartData.donut?.length || sData.chartData.bars?.length)
          ) {
            // light background panel behind the whole chart row
            doc.setFillColor(249, 252, 249);
            doc.roundedRect(10, y, pw - 20, 80, 2, 2, "F");
            doc.setDrawColor(220, 235, 220);
            doc.setLineWidth(0.2);
            doc.roundedRect(10, y, pw - 20, 80, 2, 2, "S");

            const chartTop = y + 4; // 4mm inner padding
            const halfW = (pw - 26) / 2;

            // ── Left panel: donut ──────────────────────────────
            doc.setFontSize(7.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...rgb);
            doc.text("Status Distribution", 12 + halfW / 2, chartTop + 3, {
              align: "center",
            });

            if (sData.chartData.donut?.length) {
              // bigger donut: radius 30 → drawn at centre (12 + halfW*0.38, chartTop+37)
              const donutCX = 12 + halfW * 0.38;
              const donutCY = chartTop + 40;
              drawDonutChart(sData.chartData.donut, donutCX, donutCY, 34, doc);

              // legend — vertically centred next to donut
              const legX = 12 + halfW * 0.66;
              const legStartY = chartTop + 22;
              sData.chartData.donut.forEach((s, i) => {
                const ly = legStartY + i * 12;
                doc.setFillColor(s.color);
                doc.roundedRect(legX, ly, 4, 4, 0.5, 0.5, "F");
                doc.setFontSize(7.5);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(50, 50, 50);
                doc.text(`${s.label}`, legX + 6, ly + 3.2);
                doc.setFontSize(9);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(...rgb);
                doc.text(`${s.value}`, legX + 6, ly + 9);
              });
            }

            // vertical divider between panels
            doc.setDrawColor(220, 235, 220);
            doc.setLineWidth(0.3);
            doc.line(14 + halfW, chartTop + 2, 14 + halfW, chartTop + 74);

            // ── Right panel: bar chart ─────────────────────────
            doc.setFontSize(7.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...rgb);
            doc.text("Monthly Trend", 16 + halfW + halfW / 2, chartTop + 3, {
              align: "center",
            });

            if (sData.chartData.bars?.length) {
              // taller bar area so value numbers at top are clearly readable
              drawBarChart(
                sData.chartData.bars,
                16 + halfW,
                chartTop + 8,
                halfW - 4,
                64, // 64mm tall — matches taller panel
                hexColor,
                doc,
              );
            }

            y = y + 84; // 80mm panel + 4mm gap

            // divider before table
            doc.setDrawColor(210, 228, 210);
            doc.setLineWidth(0.4);
            doc.line(10, y, pw - 10, y);
            y += 6;
          }

          // table — add new page if less than 50mm left on current page
          if (y > ph - 50) {
            doc.addPage();
            drawHeader(section.label);
            y = 47;
          }

          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...rgb);
          doc.text(
            `${section.label} Records — ${sData.rows?.length || 0} total · ${activeCols.length} columns selected`,
            10,
            y,
          );
          y += 5;

          // data table
          y = drawDataTable(sData.rows || [], activeCols, y);
        } catch (sectionErr) {
          console.error(`PDF section ${section.id} failed:`, sectionErr);
        }
      }

      drawFooter();
      doc.save(
        `IdeaGroove_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
      );
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <section className="flex flex-col gap-6 relative min-h-screen pb-28">
      {/* Header row */}
      <div className="flex justify-between items-center">
        <AdminPageHeader
          title="Report Builder"
          subtitle="Select sections · customize columns · generate a PDF"
        />
        <button
          onClick={generatePDF}
          disabled={selectedCount === 0 || generating}
          className="group flex items-center gap-2 bg-white border border-gray-200 hover:border-green-700 hover:bg-green-800 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <div className="p-1 rounded-lg bg-green-50 group-hover:bg-white/20 transition-colors">
            {generating ? (
              <Loader2
                size={13}
                className="text-green-700 group-hover:text-white animate-spin transition-colors"
              />
            ) : (
              <FileBarChart2
                size={13}
                className="text-green-700 group-hover:text-white transition-colors"
              />
            )}
          </div>
          <span>{generating ? "Generating…" : "Generate Report"}</span>
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

      {/* Progress bar */}
      <div className="flex items-center gap-3 -mt-3">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${(selectedCount / SECTIONS.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-bold text-gray-400 w-20 text-right">
          {selectedCount}/{SECTIONS.length} sections
        </span>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {SECTIONS.map((section) => {
          const isOn = !!selected[section.id];
          const isLoad = !!loading[section.id];
          const hasData = !!data[section.id];
          const isExp = !!expanded[section.id];
          const Icon = section.icon;
          const activeColCount = section.columns.filter(
            (c) => colState[section.id][c.key],
          ).length;

          return (
            <div
              key={section.id}
              className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden bg-white
                ${
                  isOn
                    ? `${section.border} shadow-lg`
                    : "border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md"
                }`}
            >
              {/* ── Card header gradient strip ── */}
              <div className={`bg-gradient-to-r ${section.bg} p-4`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: section.color + "18",
                        border: `1.5px solid ${section.color}30`,
                      }}
                    >
                      <Icon size={19} style={{ color: section.color }} />
                    </div>
                    {/* Title + tags */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-gray-800 text-sm tracking-tight">
                          {section.label}
                        </h3>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${section.tagColor}`}
                        >
                          {section.tag}
                        </span>
                        {isOn && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/70 text-gray-500 border border-gray-200">
                            {activeColCount}/{section.columns.length} cols
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        {section.desc}
                      </p>
                    </div>
                  </div>

                  {/* Toggle switch */}
                  <button
                    onClick={() => toggleSection(section)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 mt-0.5
                      ${isOn ? "bg-[#1B431C]" : "bg-gray-200 hover:bg-gray-300"}`}
                    aria-label={`Toggle ${section.label}`}
                  >
                    <div
                      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
                      style={{ left: isOn ? "calc(100% - 22px)" : "2px" }}
                    />
                  </button>
                </div>
              </div>

              {/* ── Inactive hint ── */}
              {!isOn && (
                <div className="px-4 py-3 flex items-center gap-2 text-gray-300 border-t border-gray-50">
                  <EyeOff size={13} />
                  <span className="text-xs">
                    Toggle to preview live data & include in PDF
                  </span>
                </div>
              )}

              {/* ── Active section body ── */}
              {isOn && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {/* Column selector */}
                  <div className="px-4 pt-3 pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Columns size={11} className="text-gray-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          PDF Columns
                        </span>
                      </div>
                      <button
                        onClick={() => toggleAllCols(section.id, section)}
                        className="text-[9px] font-bold text-gray-400 hover:text-gray-600 transition-colors"
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

                  {/* Live preview */}
                  <div>
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          Live Preview
                        </span>
                        {isLoad && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Loader2 size={9} className="animate-spin" />{" "}
                            Loading…
                          </span>
                        )}
                        {!isLoad && hasData && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                            <Zap size={9} /> Live data
                          </span>
                        )}
                      </div>
                      {hasData && data[section.id]?.rows?.length > 0 && (
                        <button
                          onClick={() =>
                            setExpanded((p) => ({
                              ...p,
                              [section.id]: !p[section.id],
                            }))
                          }
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors"
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
                      <SectionPreview
                        section={section}
                        sData={data[section.id]}
                      />
                    )}

                    {/* Expandable sample rows */}
                    {isExp && hasData && (
                      <SampleTable
                        section={section}
                        rows={data[section.id]?.rows}
                        colState={colState[section.id]}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {selectedCount === 0 && (
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 font-bold text-sm">
              Toggle sections above to build your report
            </p>
            <p className="text-gray-300 text-xs mt-1">
              Each section loads live data · choose which columns appear in the
              PDF
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminReportBuilder;
