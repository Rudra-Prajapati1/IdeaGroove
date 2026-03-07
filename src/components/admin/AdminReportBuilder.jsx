import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "/DarkLogo.png";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import {
  ActivitySquare,
  AlertOctagon,
  BarChart3,
  FileBarChart2,
  ChevronRight,
  Download,
  EyeOff,
  Flame,
  HeartPulse,
  Loader2,
  Settings2,
  Sparkles,
  UserX,
  Zap,
} from "lucide-react";

// ─── Section registry ───────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "healthScore",
    label: "Platform Health Score",
    icon: HeartPulse,
    color: "#10b981",
    bg: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-200",
    tag: "UNIQUE",
    tagColor: "bg-emerald-100 text-emerald-700",
    desc: "A 0–100 wellness gauge with live breakdown",
    endpoint: "platform-health-score",
  },
  {
    id: "atRisk",
    label: "At-Risk Students",
    icon: Flame,
    color: "#f59e0b",
    bg: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-200",
    tag: "INSIGHT",
    tagColor: "bg-amber-100 text-amber-700",
    desc: "Students who went quiet after being active",
    endpoint: "at-risk-students",
    hasConfig: true,
    configLabel: "Silence threshold",
    configKey: "atRiskDays",
    configDefault: 30,
    configOptions: [7, 14, 30, 60, 90],
  },
  {
    id: "inactive",
    label: "Inactive Students",
    icon: UserX,
    color: "#6366f1",
    bg: "from-indigo-500/10 to-purple-500/10",
    border: "border-indigo-200",
    tag: "AUDIT",
    tagColor: "bg-indigo-100 text-indigo-700",
    desc: "Students who never posted a single thing",
    endpoint: "inactive-students",
    hasConfig: true,
    configLabel: "Account age threshold",
    configKey: "inactiveDays",
    configDefault: 60,
    configOptions: [30, 60, 90, 180],
  },
  {
    id: "complained",
    label: "Most Complained Students",
    icon: AlertOctagon,
    color: "#ef4444",
    bg: "from-red-500/10 to-rose-500/10",
    border: "border-red-200",
    tag: "MODERATION",
    tagColor: "bg-red-100 text-red-700",
    desc: "Ranked students by complaint count & blocked content",
    endpoint: "most-complained-students",
  },
  {
    id: "blockIndex",
    label: "Content Block Index",
    icon: BarChart3,
    color: "#8b5cf6",
    bg: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-200",
    tag: "QUALITY",
    tagColor: "bg-violet-100 text-violet-700",
    desc: "Block ratios by subject & degree — find problem areas",
    endpoint: "content-block-index",
  },
];

// ─── Mini preview cards rendered inside the builder ─────────────────────────
const HealthPreview = ({ data }) => {
  if (!data) return <SkeletonPreview />;
  const { totalScore, healthLabel, breakdown } = data;
  const color =
    totalScore >= 80
      ? "#10b981"
      : totalScore >= 60
        ? "#3b82f6"
        : totalScore >= 40
          ? "#f59e0b"
          : "#ef4444";

  const bars = [
    {
      label: "Activity Rate",
      score: breakdown.activityScore,
      max: 30,
      pct: breakdown.activityRate,
    },
    {
      label: "Content Quality",
      score: breakdown.qualityScore,
      max: 25,
      pct: breakdown.qualityRate,
    },
    {
      label: "Complaint Score",
      score: breakdown.complaintScore,
      max: 25,
      pct: 100 - breakdown.complaintRate,
    },
    {
      label: "Engagement Depth",
      score: breakdown.depthScore,
      max: 20,
      pct: Math.min((breakdown.avgContributions / 5) * 100, 100),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Gauge */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeDasharray={`${totalScore * 0.94} 94`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-gray-800">
              {totalScore}
            </span>
            <span className="text-[8px] font-bold text-gray-400 uppercase">
              /100
            </span>
          </div>
        </div>
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-0.5">
            Health Status
          </div>
          <div className="text-xl font-black" style={{ color }}>
            {healthLabel}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">
            {data.meta?.totalUsers} users · {data.meta?.totalContributions}{" "}
            contributions
          </div>
        </div>
      </div>
      {/* Breakdown bars */}
      <div className="space-y-2">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] font-semibold text-gray-500">
                {b.label}
              </span>
              <span className="text-[10px] font-black text-gray-700">
                {b.score}/{b.max}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(b.score / b.max) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AtRiskPreview = ({ data }) => {
  if (!data) return <SkeletonPreview />;
  const top = data.students?.slice(0, 4) || [];
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl font-black text-amber-600">{data.count}</span>
        <span className="text-xs text-gray-500">
          students went silent in the last <strong>{data.days}</strong> days
        </span>
      </div>
      <div className="space-y-2">
        {top.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-100"
          >
            <div className="w-7 h-7 rounded-full bg-amber-200 flex items-center justify-center text-[10px] font-black text-amber-700 flex-shrink-0">
              {s.Name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-700 truncate">
                {s.Name}
              </div>
              <div className="text-[10px] text-gray-400">{s.Degree_Name}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-black text-amber-600">
                {s.days_silent}d
              </div>
              <div className="text-[9px] text-gray-400">silent</div>
            </div>
          </div>
        ))}
        {data.count > 4 && (
          <div className="text-center text-[10px] text-gray-400 font-semibold pt-1">
            +{data.count - 4} more in PDF
          </div>
        )}
      </div>
    </div>
  );
};

const InactivePreview = ({ data }) => {
  if (!data) return <SkeletonPreview />;
  const top = data.students?.slice(0, 4) || [];
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl font-black text-indigo-600">
          {data.count}
        </span>
        <span className="text-xs text-gray-500">
          students never posted after joining <strong>{data.days}+</strong> days
          ago
        </span>
      </div>
      <div className="space-y-2">
        {top.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50 border border-indigo-100"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-200 flex items-center justify-center text-[10px] font-black text-indigo-700 flex-shrink-0">
              {s.Name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-700 truncate">
                {s.Name}
              </div>
              <div className="text-[10px] text-gray-400">{s.Degree_Name}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-black text-indigo-600">
                {s.days_since_joined}d
              </div>
              <div className="text-[9px] text-gray-400">member</div>
            </div>
          </div>
        ))}
        {data.count > 4 && (
          <div className="text-center text-[10px] text-gray-400 font-semibold pt-1">
            +{data.count - 4} more in PDF
          </div>
        )}
      </div>
    </div>
  );
};

const ComplainedPreview = ({ data }) => {
  if (!data) return <SkeletonPreview />;
  const top = data.students?.slice(0, 4) || [];
  return (
    <div className="p-4">
      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
        Top offenders
      </div>
      <div className="space-y-2">
        {top.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-100"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 ${i === 0 ? "bg-red-500" : i === 1 ? "bg-red-400" : "bg-red-300"}`}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-700 truncate">
                {s.Name}
              </div>
              <div className="text-[10px] text-gray-400">{s.Degree_Name}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-black text-red-600">
                {s.total_complaints}
              </div>
              <div className="text-[9px] text-gray-400">complaints</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BlockIndexPreview = ({ data }) => {
  if (!data) return <SkeletonPreview />;
  const top = data.bySubject?.slice(0, 5) || [];
  const maxRate = Math.max(...top.map((s) => s.block_rate_pct), 1);
  return (
    <div className="p-4">
      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
        Highest block rate subjects
      </div>
      <div className="space-y-2.5">
        {top.map((s, i) => (
          <div key={i}>
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] font-semibold text-gray-600 truncate max-w-[140px]">
                {s.Subject_Name}
              </span>
              <span className="text-[10px] font-black text-violet-700">
                {s.block_rate_pct}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-700"
                style={{ width: `${(s.block_rate_pct / maxRate) * 100}%` }}
              />
            </div>
            <div className="text-[9px] text-gray-400 mt-0.5">
              {s.total_notes} notes · {s.blocked_notes} blocked ·{" "}
              {s.Degree_Name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkeletonPreview = () => (
  <div className="p-4 space-y-3">
    {[80, 60, 90, 50].map((w, i) => (
      <div key={i} className="animate-pulse space-y-1">
        <div
          className="h-2.5 bg-gray-100 rounded-full"
          style={{ width: `${w}%` }}
        />
        <div
          className="h-1.5 bg-gray-100 rounded-full"
          style={{ width: `${w - 20}%` }}
        />
      </div>
    ))}
  </div>
);

const PREVIEW_MAP = {
  healthScore: HealthPreview,
  atRisk: AtRiskPreview,
  inactive: InactivePreview,
  complained: ComplainedPreview,
  blockIndex: BlockIndexPreview,
};

// ─── Main Component ──────────────────────────────────────────────────────────
const AdminReportBuilder = () => {
  const [selected, setSelected] = useState({});
  const [configs, setConfigs] = useState({ atRiskDays: 30, inactiveDays: 60 });
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const [generating, setGenerating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch data for a section
  const fetchSection = async (section) => {
    setLoading((prev) => ({ ...prev, [section.id]: true }));
    try {
      let url = `${baseUrl}/admin/${section.endpoint}`;
      if (section.id === "atRisk") url += `?days=${configs.atRiskDays}`;
      if (section.id === "inactive") url += `?days=${configs.inactiveDays}`;
      const res = await fetch(url);
      const json = await res.json();
      setData((prev) => ({ ...prev, [section.id]: json }));
    } catch (e) {
      console.error(`Failed to fetch ${section.id}:`, e);
    } finally {
      setLoading((prev) => ({ ...prev, [section.id]: false }));
    }
  };

  // Toggle section on/off and fetch if toggling on
  const toggleSection = (section) => {
    const isOn = !selected[section.id];
    setSelected((prev) => ({ ...prev, [section.id]: isOn }));
    if (isOn && !data[section.id]) fetchSection(section);
  };

  // Re-fetch when config changes
  const handleConfigChange = (key, val, section) => {
    setConfigs((prev) => ({ ...prev, [key]: val }));
    if (selected[section.id]) {
      setData((prev) => ({ ...prev, [section.id]: null }));
      setTimeout(
        () => fetchSection({ ...section, endpoint: section.endpoint }),
        50,
      );
    }
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  // ── PDF generation ─────────────────────────────────────────────────────────
  const generatePDF = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();

      const addHeader = (subtitle) => {
        try {
          doc.addImage(logo, "PNG", 13, 5, 30, 30);
        } catch {}
        doc.setFontSize(15);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(27, 67, 28);
        doc.text("IdeaGroove — Admin Intelligence Report", pw - 15, 16, {
          align: "right",
        });
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 140, 100);
        doc.text(subtitle, pw - 15, 22, { align: "right" });
        doc.setFontSize(7);
        doc.setTextColor(170, 170, 170);
        doc.text(
          "Generated: " +
            new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          pw - 15,
          27,
          { align: "right" },
        );
        // Title bar
        doc.setFillColor(27, 67, 28);
        doc.rect(10, 38, pw - 20, 11, "F");
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("Admin Intelligence Report", pw / 2, 46, { align: "center" });
      };

      const addFooter = () => {
        const tp = doc.internal.getNumberOfPages();
        for (let p = 1; p <= tp; p++) {
          doc.setPage(p);
          doc.setFillColor(248, 250, 248);
          doc.rect(0, ph - 12, pw, 12, "F");
          doc.setFontSize(7);
          doc.setTextColor(160, 160, 160);
          doc.setFont("helvetica", "normal");
          doc.text(
            "IdeaGroove Student Collaboration Platform — Confidential Admin Report",
            15,
            ph - 5,
          );
          doc.text("Page " + p + " of " + tp, pw - 15, ph - 5, {
            align: "right",
          });
        }
      };

      const sectionTitle = (doc, title, y, color = [27, 67, 28]) => {
        doc.setFillColor(...color);
        doc.roundedRect(10, y, pw - 20, 9, 1, 1, "F");
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(title, pw / 2, y + 6.2, { align: "center" });
        return y + 13;
      };

      let firstPage = true;
      let y = 54;

      // ── 1. PLATFORM HEALTH SCORE ──────────────────────────────
      if (selected.healthScore && data.healthScore) {
        if (!firstPage) {
          doc.addPage();
          y = 54;
        }
        addHeader("Platform Health Score");
        firstPage = false;
        const d = data.healthScore;
        const score = d.totalScore;
        const hColor =
          score >= 80
            ? [16, 185, 129]
            : score >= 60
              ? [59, 130, 246]
              : score >= 40
                ? [245, 158, 11]
                : [239, 68, 68];

        y = sectionTitle(doc, "Platform Health Score", y, [27, 67, 28]);

        // Big score circle via canvas
        const gc = document.createElement("canvas");
        gc.width = 220;
        gc.height = 220;
        const gctx = gc.getContext("2d");
        // Outer ring
        gctx.beginPath();
        gctx.arc(110, 110, 90, 0, 2 * Math.PI);
        gctx.strokeStyle = "#f1f5f9";
        gctx.lineWidth = 16;
        gctx.stroke();
        // Score arc
        gctx.beginPath();
        gctx.arc(
          110,
          110,
          90,
          -Math.PI / 2,
          -Math.PI / 2 + (score / 100) * 2 * Math.PI,
        );
        gctx.strokeStyle = `rgb(${hColor.join(",")})`;
        gctx.lineWidth = 16;
        gctx.lineCap = "round";
        gctx.stroke();
        // Score text
        gctx.fillStyle = "#1e293b";
        gctx.font = "bold 52px Arial";
        gctx.textAlign = "center";
        gctx.textBaseline = "middle";
        gctx.fillText(String(score), 110, 100);
        gctx.font = "16px Arial";
        gctx.fillStyle = "#94a3b8";
        gctx.fillText("out of 100", 110, 135);
        gctx.font = `bold 20px Arial`;
        gctx.fillStyle = `rgb(${hColor.join(",")})`;
        gctx.fillText(d.healthLabel, 110, 162);

        doc.addImage(gc.toDataURL("image/png"), "PNG", pw / 2 - 28, y, 56, 56);
        y += 60;

        // Breakdown cards — 4 in a row
        const breakdown = [
          {
            label: "Activity Rate",
            score: d.breakdown.activityScore,
            max: 30,
            extra: d.breakdown.activityRate + "% users posted",
          },
          {
            label: "Content Quality",
            score: d.breakdown.qualityScore,
            max: 25,
            extra: d.breakdown.qualityRate + "% content active",
          },
          {
            label: "Complaint Score",
            score: d.breakdown.complaintScore,
            max: 25,
            extra: d.breakdown.complaintRate + "% complaints unresolved",
          },
          {
            label: "Engagement Depth",
            score: d.breakdown.depthScore,
            max: 20,
            extra: d.breakdown.avgContributions + " avg contributions",
          },
        ];
        const cw = (pw - 25) / 4;
        breakdown.forEach(({ label, score: s, max, extra }, i) => {
          const cx = 12 + i * (cw + 1);
          const pct = Math.round((s / max) * 100);
          const [r, g, b] = hColor;
          doc.setFillColor(r, g, b, 0.1);
          doc.setFillColor(245, 251, 245);
          doc.roundedRect(cx, y, cw, 22, 2, 2, "F");
          doc.setDrawColor(r, g, b);
          doc.setLineWidth(0.3);
          doc.roundedRect(cx, y, cw, 22, 2, 2, "S");
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(r, g, b);
          doc.text(`${s}/${max}`, cx + cw / 2, y + 9, { align: "center" });
          doc.setFontSize(6.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(80, 80, 80);
          doc.text(label.toUpperCase(), cx + cw / 2, y + 14, {
            align: "center",
          });
          doc.setFontSize(6);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(140, 140, 140);
          doc.text(extra, cx + cw / 2, y + 18.5, { align: "center" });
          // Mini progress bar
          doc.setFillColor(230, 230, 230);
          doc.roundedRect(cx + 2, y + 20, cw - 4, 1.5, 0.5, 0.5, "F");
          doc.setFillColor(r, g, b);
          doc.roundedRect(
            cx + 2,
            y + 20,
            ((cw - 4) * pct) / 100,
            1.5,
            0.5,
            0.5,
            "F",
          );
        });
        y += 28;

        // Meta stats row
        const meta = [
          ["Total Users", d.meta.totalUsers],
          ["Active Posters", d.meta.activePosters],
          ["Total Content", d.meta.totalContent],
          ["Blocked", d.meta.blockedContent],
          ["Complaints", d.meta.totalComplaints],
          ["Unresolved", d.meta.unresolvedComplaints],
        ];
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(150, 150, 150);
        meta.forEach(([label, val], i) => {
          const mx = 12 + i * 33;
          doc.setTextColor(27, 67, 28);
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text(String(val), mx + 14, y + 6, { align: "center" });
          doc.setFontSize(6);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(150, 150, 150);
          doc.text(label, mx + 14, y + 10.5, { align: "center" });
        });
        y += 16;
      }

      // ── 2. AT-RISK STUDENTS ───────────────────────────────────
      if (selected.atRisk && data.atRisk) {
        if (!firstPage && y > ph - 60) {
          doc.addPage();
          y = 54;
          addHeader("At-Risk Students");
        } else if (firstPage) {
          addHeader("At-Risk Students");
          firstPage = false;
        }
        const d = data.atRisk;
        y = sectionTitle(
          doc,
          `At-Risk Students — Silent for ${d.days}+ Days (${d.count} found)`,
          y,
          [245, 158, 11],
        );

        if (d.students?.length === 0) {
          doc.setFontSize(9);
          doc.setTextColor(120, 120, 120);
          doc.setFont("helvetica", "italic");
          doc.text(
            "No at-risk students found for this threshold.",
            pw / 2,
            y + 8,
            { align: "center" },
          );
          y += 16;
        } else {
          // Cards in 2-col grid
          const cols = 2,
            cw = (pw - 26) / 2;
          d.students.forEach((s, i) => {
            if (y > ph - 30) {
              doc.addPage();
              y = 20;
            }
            const col = i % cols,
              row = Math.floor(i / cols);
            if (col === 0 && row > 0) y += 22;
            const cx = 12 + col * (cw + 2);
            const cy = y;

            // Card background — color intensity by urgency
            const urgency = Math.min(s.days_silent / 90, 1);
            const r = Math.round(255 * urgency + 254 * (1 - urgency));
            const g = Math.round(237 * urgency + 243 * (1 - urgency));
            const b = Math.round(213 * urgency + 199 * (1 - urgency));
            doc.setFillColor(r, g, b);
            doc.roundedRect(cx, cy, cw, 20, 2, 2, "F");
            doc.setDrawColor(245, 158, 11);
            doc.setLineWidth(0.2);
            doc.roundedRect(cx, cy, cw, 20, 2, 2, "S");

            // Avatar circle
            doc.setFillColor(245, 158, 11);
            doc.circle(cx + 9, cy + 10, 6, "F");
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.text(
              (s.Name?.charAt(0) || "?").toUpperCase(),
              cx + 9,
              cy + 12,
              { align: "center" },
            );

            // Info
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(40, 40, 40);
            doc.text(s.Name || "Unknown", cx + 18, cy + 8);
            doc.setFontSize(6.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 100, 100);
            doc.text(
              (s.Degree_Name || "-") + " · " + (s.Year || ""),
              cx + 18,
              cy + 13,
            );
            doc.setFontSize(6);
            doc.setTextColor(130, 130, 130);
            doc.text(
              `${s.total_contributions} contributions lifetime`,
              cx + 18,
              cy + 17.5,
            );

            // Days badge
            doc.setFillColor(239, 68, 68);
            doc.roundedRect(cx + cw - 22, cy + 5, 19, 10, 2, 2, "F");
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.text(`${s.days_silent}d`, cx + cw - 12.5, cy + 11.5, {
              align: "center",
            });
            doc.setFontSize(5);
            doc.setFont("helvetica", "normal");
            doc.text("silent", cx + cw - 12.5, cy + 14.5, { align: "center" });
          });
          if (d.students.length % 2 !== 0) y += 22;
          y += 22;
        }
      }

      // ── 3. INACTIVE STUDENTS ──────────────────────────────────
      if (selected.inactive && data.inactive) {
        if (y > ph - 60) {
          doc.addPage();
          y = 20;
        }
        const d = data.inactive;
        y = sectionTitle(
          doc,
          `Inactive Students — Never Posted, ${d.days}+ Days Old (${d.count} found)`,
          y,
          [99, 102, 241],
        );

        if (d.students?.length === 0) {
          doc.setFontSize(9);
          doc.setTextColor(120, 120, 120);
          doc.setFont("helvetica", "italic");
          doc.text(
            "No inactive students found for this threshold.",
            pw / 2,
            y + 8,
            { align: "center" },
          );
          y += 16;
        } else {
          // Summary stat
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 100, 100);
          doc.text(
            `${d.count} registered students have never made a single contribution to the platform.`,
            pw / 2,
            y,
            { align: "center" },
          );
          y += 7;

          const cols = 3,
            cw2 = (pw - 28) / 3;
          d.students.forEach((s, i) => {
            if (y > ph - 25) {
              doc.addPage();
              y = 20;
            }
            const col = i % cols;
            if (col === 0 && i > 0) y += 16;
            const cx = 12 + col * (cw2 + 2);

            doc.setFillColor(238, 242, 255);
            doc.roundedRect(cx, y, cw2, 14, 1.5, 1.5, "F");
            doc.setDrawColor(165, 180, 252);
            doc.setLineWidth(0.2);
            doc.roundedRect(cx, y, cw2, 14, 1.5, 1.5, "S");

            doc.setFillColor(99, 102, 241);
            doc.circle(cx + 7, y + 7, 4.5, "F");
            doc.setFontSize(6.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.text(
              (s.Name?.charAt(0) || "?").toUpperCase(),
              cx + 7,
              y + 8.5,
              { align: "center" },
            );

            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(50, 50, 50);
            doc.text(
              (s.Name || "Unknown").length > 14
                ? s.Name.slice(0, 13) + "…"
                : s.Name || "Unknown",
              cx + 14,
              y + 6,
            );
            doc.setFontSize(5.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(130, 130, 130);
            doc.text(s.Degree_Name || "-", cx + 14, y + 10);
            doc.setFontSize(6);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(99, 102, 241);
            doc.text(`${s.days_since_joined}d`, cx + cw2 - 10, y + 7.5, {
              align: "center",
            });
          });
          if (d.students.length % cols !== 0) y += 16;
          y += 16;
        }
      }

      // ── 4. MOST COMPLAINED STUDENTS ───────────────────────────
      if (selected.complained && data.complained) {
        if (y > ph - 70) {
          doc.addPage();
          y = 20;
        }
        const d = data.complained;
        y = sectionTitle(
          doc,
          "Most Complained-About Students",
          y,
          [239, 68, 68],
        );

        d.students?.slice(0, 10).forEach((s, i) => {
          if (y > ph - 22) {
            doc.addPage();
            y = 20;
          }
          const isTop3 = i < 3;
          const bgR = isTop3 ? 254 : 249;
          const bgG = isTop3 ? 242 : 245;
          const bgB = isTop3 ? 242 : 245;
          doc.setFillColor(bgR, bgG, bgB);
          doc.roundedRect(10, y, pw - 20, 18, 1.5, 1.5, "F");
          if (isTop3) {
            doc.setDrawColor(239, 68, 68);
            doc.setLineWidth(0.4);
            doc.roundedRect(10, y, pw - 20, 18, 1.5, 1.5, "S");
          }

          // Rank badge
          const rankColor =
            i === 0
              ? [239, 68, 68]
              : i === 1
                ? [249, 115, 22]
                : i === 2
                  ? [245, 158, 11]
                  : [156, 163, 175];
          doc.setFillColor(...rankColor);
          doc.roundedRect(13, y + 4, 10, 10, 1, 1, "F");
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.text(`#${i + 1}`, 18, y + 10.5, { align: "center" });

          // Avatar
          doc.setFillColor(200, 200, 200);
          doc.circle(32, y + 9, 6, "F");
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.text((s.Name?.charAt(0) || "?").toUpperCase(), 32, y + 10.8, {
            align: "center",
          });

          // Name + degree
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 30, 30);
          doc.text(s.Name || "Unknown", 42, y + 8);
          doc.setFontSize(6.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(120, 120, 120);
          doc.text(
            (s.Degree_Name || "-") +
              (s.is_Active === 0 ? " · BLOCKED ACCOUNT" : ""),
            42,
            y + 13,
          );

          // Stats on the right
          const stats = [
            {
              label: "Complaints",
              val: s.total_complaints,
              color: [239, 68, 68],
            },
            { label: "Resolved", val: s.resolved, color: [16, 185, 129] },
            { label: "Pending", val: s.pending, color: [245, 158, 11] },
            {
              label: "Blocked Content",
              val: s.blocked_content_count,
              color: [99, 102, 241],
            },
          ];
          stats.forEach(({ label, val, color }, si) => {
            const sx = pw - 15 - (3 - si) * 38;
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...color);
            doc.text(String(val || 0), sx, y + 9, { align: "center" });
            doc.setFontSize(5.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(150, 150, 150);
            doc.text(label, sx, y + 13.5, { align: "center" });
          });
          y += 21;
        });
      }

      // ── 5. CONTENT BLOCK INDEX ────────────────────────────────
      if (selected.blockIndex && data.blockIndex) {
        if (y > ph - 80) {
          doc.addPage();
          y = 20;
        }
        const d = data.blockIndex;
        y = sectionTitle(
          doc,
          "Content Block Index — Subject & Degree Quality Analysis",
          y,
          [139, 92, 246],
        );

        // By Degree — horizontal bar chart
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80, 80, 80);
        doc.text("Block Rate by Degree", 12, y + 1);
        y += 5;

        const maxDegRate = Math.max(
          ...(d.byDegree?.map((r) => r.overall_block_rate_pct) || [1]),
          1,
        );
        d.byDegree?.forEach((row, i) => {
          if (y > ph - 16) {
            doc.addPage();
            y = 20;
          }
          const barW = Math.max(
            (row.overall_block_rate_pct / maxDegRate) * (pw - 80),
            1,
          );
          const intensity = row.overall_block_rate_pct / 100;
          const r = Math.round(139 + (239 - 139) * intensity);
          const g = Math.round(92 + (68 - 92) * intensity);
          const b = Math.round(246 + (68 - 246) * intensity);

          doc.setFontSize(7);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          const degLabel =
            (row.Degree_Name || "").length > 22
              ? row.Degree_Name.slice(0, 21) + "…"
              : row.Degree_Name || "-";
          doc.text(degLabel, 12, y + 4.5);
          doc.setFillColor(240, 240, 240);
          doc.roundedRect(58, y + 1, pw - 80, 5, 1, 1, "F");
          doc.setFillColor(r, g, b);
          doc.roundedRect(58, y + 1, barW, 5, 1, 1, "F");
          doc.setFontSize(6.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(r, g, b);
          doc.text(`${row.overall_block_rate_pct}%`, pw - 18, y + 5, {
            align: "right",
          });
          doc.setFontSize(5.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(160, 160, 160);
          doc.text(
            `${row.total_content} total · ${row.total_blocked} blocked`,
            pw - 18,
            y + 9,
            { align: "right" },
          );
          y += 11;
        });

        // By Subject — top 8 cards
        if (y > ph - 60) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80, 80, 80);
        doc.text("Highest Block Rate Subjects", 12, y + 1);
        y += 7;

        const top8 = d.bySubject?.slice(0, 8) || [];
        const scw = (pw - 26) / 4;
        top8.forEach((s, i) => {
          if (y > ph - 22) {
            doc.addPage();
            y = 20;
          }
          const col = i % 4;
          if (col === 0 && i > 0) y += 22;
          const cx = 12 + col * (scw + 2);
          const pct = s.block_rate_pct;
          const cardR = pct > 30 ? 254 : pct > 15 ? 255 : 245;
          const cardG = pct > 30 ? 226 : pct > 15 ? 243 : 243;
          const cardB = pct > 30 ? 226 : pct > 15 ? 199 : 255;
          doc.setFillColor(cardR, cardG, cardB);
          doc.roundedRect(cx, y, scw, 20, 2, 2, "F");
          doc.setFontSize(13);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(
            pct > 30 ? 185 : pct > 15 ? 161 : 109,
            pct > 30 ? 28 : pct > 15 ? 80 : 40,
            pct > 30 ? 28 : pct > 15 ? 11 : 217,
          );
          doc.text(`${pct}%`, cx + scw / 2, y + 9, { align: "center" });
          doc.setFontSize(5.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(80, 80, 80);
          const subLabel =
            (s.Subject_Name || "").length > 16
              ? s.Subject_Name.slice(0, 15) + "…"
              : s.Subject_Name || "-";
          doc.text(subLabel, cx + scw / 2, y + 13.5, { align: "center" });
          doc.setFontSize(5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(150, 150, 150);
          doc.text(
            `${s.total_notes} notes · ${s.blocked_notes} blocked`,
            cx + scw / 2,
            y + 17.5,
            { align: "center" },
          );
        });
        if (top8.length % 4 !== 0) y += 22;
        y += 22;
      }

      addFooter();
      doc.save(`IdeaGroove_Intelligence_Report_${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 relative min-h-screen">
      {/* ── Header row: title + export button (mirrors AdminDash pattern) ── */}
      <div className="flex justify-between items-center">
        <AdminPageHeader
          title="Report Builder"
          subtitle="Select sections, preview live data, generate a custom PDF"
        />

        {/* Export button — same style as ReportGeneration.jsx */}
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
          {selectedCount}/{SECTIONS.length} selected
        </span>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {SECTIONS.map((section) => {
          const isOn = !!selected[section.id];
          const isLoad = loading[section.id];
          const hasData = !!data[section.id];
          const Icon = section.icon;
          const Preview = PREVIEW_MAP[section.id];

          return (
            <div
              key={section.id}
              className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden bg-white
                ${
                  isOn
                    ? `${section.border} shadow-lg`
                    : "border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md"
                }`}
            >
              {/* Card header */}
              <div className={`p-4 bg-gradient-to-r ${section.bg}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: section.color + "20" }}
                    >
                      <Icon size={18} style={{ color: section.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-gray-800 text-sm">
                          {section.label}
                        </h3>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${section.tagColor}`}
                        >
                          {section.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {section.desc}
                      </p>
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => toggleSection(section)}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ml-2
                      ${isOn ? "bg-[#1B431C]" : "bg-gray-200"}`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300
                      ${isOn ? "left-5.5 translate-x-0.5" : "left-0.5"}`}
                      style={{ left: isOn ? "calc(100% - 22px)" : "2px" }}
                    />
                  </button>
                </div>

                {/* Config options */}
                {section.hasConfig && isOn && (
                  <div className="mt-3 flex items-center gap-2">
                    <Settings2
                      size={11}
                      className="text-gray-400 flex-shrink-0"
                    />
                    <span className="text-[10px] font-bold text-gray-500">
                      {section.configLabel}:
                    </span>
                    <div className="flex gap-1">
                      {section.configOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() =>
                            handleConfigChange(section.configKey, opt, section)
                          }
                          className={`text-[9px] font-black px-2 py-0.5 rounded-md transition-all
                            ${
                              configs[section.configKey] === opt
                                ? "bg-[#1B431C] text-white"
                                : "bg-white/60 text-gray-500 hover:bg-white"
                            }`}
                        >
                          {opt}d
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Live preview */}
              {isOn && (
                <div className="border-t border-gray-100">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Live Preview
                    </span>
                    {isLoad ? (
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Loader2 size={10} className="animate-spin" />
                        Loading…
                      </div>
                    ) : hasData ? (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                        <Zap size={10} />
                        Live data
                      </div>
                    ) : null}
                  </div>
                  <div className="min-h-[120px]">
                    {isLoad ? (
                      <SkeletonPreview />
                    ) : (
                      <Preview data={data[section.id]} />
                    )}
                  </div>
                </div>
              )}

              {/* Disabled state overlay hint */}
              {!isOn && (
                <div className="p-4 flex items-center gap-2 text-gray-300">
                  <EyeOff size={14} />
                  <span className="text-xs">
                    Toggle to preview & include in PDF
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {selectedCount === 0 && (
          <div className="lg:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 font-bold text-sm">
              Toggle sections above to build your report
            </p>
            <p className="text-gray-300 text-xs mt-1">
              Each section loads live data and shows a preview
            </p>
          </div>
        )}
      </div>

      {/* Sticky bottom bar when sections selected */}
      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-4 bg-[#1B431C] text-white px-6 py-3.5 rounded-2xl shadow-2xl shadow-green-900/40">
            <div className="flex items-center gap-2">
              <ActivitySquare size={16} className="text-emerald-300" />
              <span className="text-sm font-bold">
                {selectedCount} section{selectedCount > 1 ? "s" : ""} ready
              </span>
            </div>
            <div className="w-px h-5 bg-white/20" />
            <div className="flex gap-1">
              {SECTIONS.filter((s) => selected[s.id]).map((s) => (
                <div
                  key={s.id}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
              ))}
            </div>
            <div className="w-px h-5 bg-white/20" />
            <button
              onClick={generatePDF}
              disabled={generating}
              className="flex items-center gap-1.5 bg-white text-[#1B431C] font-black text-sm px-4 py-1.5 rounded-xl hover:bg-emerald-50 transition-all disabled:opacity-60"
            >
              {generating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {generating ? "Generating…" : "Export PDF"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminReportBuilder;
