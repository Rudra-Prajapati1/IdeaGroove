import React from "react";
import jsPDF from "jspdf";
import logo from "/DarkLogo.png";
import "jspdf-autotable";

const ReportGeneration = ({ recentActivities = [] }) => {
  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    try {
      doc.addImage(logo, "PNG", 15, 5, 40, 40);
    } catch (e) {
      console.warn("Logo missing");
    }

    doc.setFontSize(17);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(27, 67, 28);
    doc.text("IdeaGroove - Student Collaboration System", pageWidth - 20, 20, {
      align: "right",
    });

    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(27, 67, 28);
    doc.text(`Contact us: theideagroove@gmail.com`, pageWidth - 20, 27, {
      align: "right",
    });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
      pageWidth - 20,
      35,
      { align: "right" },
    );

    // ── Title Bar ─────────────────────────────────────────
    doc.setFillColor(27, 67, 28);
    doc.rect(10, 50, pageWidth - 20, 10, "F");
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Recent Activity Report", pageWidth / 2, 57, { align: "center" });

    // ── Summary Line ──────────────────────────────────────
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Total Records: ${recentActivities.length}`, 15, 67);

    // ── Table Headers ─────────────────────────────────────
    const headers = ["#", "Student", "Activity", "Type", "Date", "Status"];
    const colX = [12, 22, 50, 110, 150, 178];
    const rowHeight = 8;

    let y = 75;

    const drawHeader = (yPos) => {
      doc.setFillColor(27, 67, 28);
      doc.rect(10, yPos - 6, pageWidth - 20, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      headers.forEach((h, i) => {
        doc.text(h, colX[i], yPos, { align: "left" });
      });
    };

    drawHeader(y);
    y += 8;

    // ── Rows ──────────────────────────────────────────────
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    recentActivities.forEach((row, i) => {
      // New page if needed
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
        drawHeader(y);
        y += 8;
      }

      // Alternating row background
      if (i % 2 === 0) {
        doc.setFillColor(245, 250, 245);
        doc.rect(10, y - 5, pageWidth - 20, rowHeight, "F");
      }

      // Status color
      const isActive = row.status === 1;

      const values = [
        String(i + 1),
        row.student_name || "-",
        (row.title_or_action || "-").substring(0, 35) +
          ((row.title_or_action?.length || 0) > 35 ? "..." : ""),
        row.activity_type || "-",
        new Date(row.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        isActive ? "Active" : "Blocked",
      ];

      values.forEach((val, j) => {
        // Status column colored
        if (j === 5) {
          doc.setTextColor(
            isActive ? 22 : 185,
            isActive ? 101 : 28,
            isActive ? 52 : 28,
          );
          doc.setFont("helvetica", "bold");
        } else {
          doc.setTextColor(50, 50, 50);
          doc.setFont("helvetica", "normal");
        }
        doc.text(String(val), colX[j], y, { align: "left" });
      });

      // Row separator
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.1);
      doc.line(10, y + 3, pageWidth - 10, y + 3);

      y += rowHeight;
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "normal");
      doc.text("IdeaGroove - Student Collaboration System", 15, pageHeight - 8);
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - 15, pageHeight - 8, {
        align: "right",
      });
    }

    doc.save(`Recent_Activity_Report_${Date.now()}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="flex items-center gap-1.5 bg-green-800 px-4 py-1.5 rounded-lg text-sm text-white hover:bg-green-700 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Export
    </button>
  );
};

export default ReportGeneration;
