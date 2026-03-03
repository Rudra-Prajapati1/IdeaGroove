import React from "react";
import jsPDF from "jspdf";
import logo from "/DarkLogo.png";
import "jspdf-autotable";

const EventsReportGeneration = ({ events = [], eventsStats = [] }) => {
  const generatePDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const today = new Date();

    const canvasToPDF = (canvas, x, y, w, h) =>
      doc.addImage(canvas.toDataURL("image/png"), "PNG", x, y, w, h);

    const upcomingCount = events.filter(
      (e) => new Date(e.Event_Date) > today,
    ).length;
    const pastCount = events.length - upcomingCount;
    const activeCount = events.filter((e) => e.status === 1).length;
    const blockedCount = events.filter((e) => e.status !== 1).length;

    // Header
    try {
      doc.addImage(logo, "PNG", 15, 5, 35, 35);
    } catch (e) {}
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(27, 67, 28);
    doc.text("IdeaGroove - Student Collaboration System", pageWidth - 20, 18, {
      align: "right",
    });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 120, 80);
    doc.text("theideagroove@gmail.com", pageWidth - 20, 25, { align: "right" });
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "Generated: " +
        new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      pageWidth - 20,
      31,
      { align: "right" },
    );
    doc.setFillColor(27, 67, 28);
    doc.rect(10, 42, pageWidth - 20, 10, "F");
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Events Management Report", pageWidth / 2, 49, {
      align: "center",
    });

    // Stats cards
    const statCards = [
      { label: "Total Events", value: events.length, color: [27, 67, 28] },
      { label: "Active Events", value: activeCount, color: [22, 101, 52] },
      { label: "Blocked Events", value: blockedCount, color: [185, 28, 28] },
      { label: "Upcoming", value: upcomingCount, color: [146, 64, 14] },
    ];
    const cardW = (pageWidth - 25) / 4;
    let cardX = 12;
    statCards.forEach(({ label, value, color }) => {
      const [r, g, b] = color;
      doc.setFillColor(r, g, b);
      doc.roundedRect(cardX, 58, cardW - 2, 18, 2, 2, "F");
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(String(value), cardX + (cardW - 2) / 2, 66, { align: "center" });
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.text(label.toUpperCase(), cardX + (cardW - 2) / 2, 72, {
        align: "center",
      });
      cardX += cardW;
    });

    // Charts label
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(27, 67, 28);
    doc.text("Visual Analytics", 12, 86);
    doc.setDrawColor(27, 67, 28);
    doc.setLineWidth(0.4);
    doc.line(12, 88, pageWidth - 12, 88);

    // Chart 1: Upcoming vs Past donut
    const pieC = document.createElement("canvas");
    pieC.width = 300;
    pieC.height = 300;
    const pc = pieC.getContext("2d");
    const pData = [
      { value: upcomingCount, color: [34, 197, 94] },
      { value: pastCount, color: [148, 163, 184] },
    ];
    const pTotal = upcomingCount + pastCount || 1;
    let sa = -Math.PI / 2;
    pData.forEach(({ value, color }) => {
      const slice = (value / pTotal) * 2 * Math.PI;
      pc.beginPath();
      pc.moveTo(150, 150);
      pc.arc(150, 150, 110, sa, sa + slice);
      pc.closePath();
      pc.fillStyle = "rgb(" + color.join(",") + ")";
      pc.fill();
      pc.strokeStyle = "#fff";
      pc.lineWidth = 3;
      pc.stroke();
      if (value > 0) {
        const mid = sa + slice / 2;
        pc.fillStyle = "#fff";
        pc.font = "bold 22px Arial";
        pc.textAlign = "center";
        pc.textBaseline = "middle";
        pc.fillText(
          Math.round((value / pTotal) * 100) + "%",
          150 + 72 * Math.cos(mid),
          150 + 72 * Math.sin(mid),
        );
      }
      sa += slice;
    });
    pc.beginPath();
    pc.arc(150, 150, 46, 0, 2 * Math.PI);
    pc.fillStyle = "#fff";
    pc.fill();
    pc.fillStyle = "#1a1a1a";
    pc.font = "bold 30px Arial";
    pc.textAlign = "center";
    pc.textBaseline = "middle";
    pc.fillText(String(pTotal), 150, 140);
    pc.font = "13px Arial";
    pc.fillStyle = "#888";
    pc.fillText("Events", 150, 164);
    canvasToPDF(pieC, 12, 92, 58, 58);

    const pieLegend = [
      { label: "Upcoming", color: [34, 197, 94], value: upcomingCount },
      { label: "Past", color: [148, 163, 184], value: pastCount },
    ];
    let legY = 100;
    pieLegend.forEach(({ label, color, value }) => {
      const [r, g, b] = color;
      doc.setFillColor(r, g, b);
      doc.roundedRect(73, legY - 3, 4, 4, 1, 1, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(50, 50, 50);
      doc.text(label, 80, legY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(110, 110, 110);
      doc.text(value + " events", 80, legY + 5);
      legY += 14;
    });
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(27, 67, 28);
    doc.text("Upcoming vs Past", 35, 153, { align: "center" });

    // Chart 2: Active vs Blocked horizontal bars
    const barC = document.createElement("canvas");
    barC.width = 400;
    barC.height = 220;
    const bc = barC.getContext("2d");
    const bData = [
      { label: "Active", value: activeCount, color: [34, 197, 94] },
      { label: "Blocked", value: blockedCount, color: [239, 68, 68] },
    ];
    const bMax = Math.max(activeCount, blockedCount, 1);
    bData.forEach(({ label, value, color }, i) => {
      const [r, g, b] = color;
      const bw = (value / bMax) * 280;
      const by = 30 + i * 85;
      bc.fillStyle = "#f1f5f9";
      bc.beginPath();
      bc.roundRect(80, by, 280, 55, 8);
      bc.fill();
      bc.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      bc.beginPath();
      bc.roundRect(80, by, Math.max(bw, 8), 55, 8);
      bc.fill();
      bc.fillStyle = "#374151";
      bc.font = "bold 18px Arial";
      bc.textAlign = "right";
      bc.textBaseline = "middle";
      bc.fillText(label, 72, by + 27);
      bc.fillStyle =
        value > bMax * 0.3 ? "#fff" : "rgb(" + r + "," + g + "," + b + ")";
      bc.font = "bold 24px Arial";
      bc.textAlign = "left";
      bc.fillText(String(value), 90, by + 27);
    });
    canvasToPDF(barC, 104, 92, 88, 55);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(27, 67, 28);
    doc.text("Active vs Blocked", 148, 153, { align: "center" });

    // Chart 3: Monthly distribution
    const mC = document.createElement("canvas");
    mC.width = 540;
    mC.height = 300;
    const mc = mC.getContext("2d");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const mCounts = Array(12).fill(0);
    events.forEach((e) => {
      if (e.Event_Date) mCounts[new Date(e.Event_Date).getMonth()]++;
    });
    const mMax = Math.max(...mCounts, 1);
    const mBW = 28,
      mGap = 14,
      mSX = 18,
      mBY = 235,
      mMH = 185;
    for (let g = 0; g <= 4; g++) {
      const gy = mBY - (g / 4) * mMH;
      mc.strokeStyle = "#e5e7eb";
      mc.lineWidth = 1;
      mc.setLineDash([4, 4]);
      mc.beginPath();
      mc.moveTo(mSX, gy);
      mc.lineTo(mSX + 12 * (mBW + mGap), gy);
      mc.stroke();
    }
    mc.setLineDash([]);
    mCounts.forEach((count, i) => {
      const bh = (count / mMax) * mMH;
      const bx = mSX + i * (mBW + mGap);
      const by = mBY - bh;
      if (count > 0) {
        const grad = mc.createLinearGradient(0, by, 0, mBY);
        grad.addColorStop(0, "rgb(34,197,94)");
        grad.addColorStop(1, "rgb(27,67,28)");
        mc.fillStyle = grad;
      } else {
        mc.fillStyle = "#f1f5f9";
      }
      mc.beginPath();
      mc.roundRect(bx, by, mBW, bh || 4, 4);
      mc.fill();
      if (count > 0) {
        mc.fillStyle = "#1f2937";
        mc.font = "bold 14px Arial";
        mc.textAlign = "center";
        mc.textBaseline = "bottom";
        mc.fillText(String(count), bx + mBW / 2, by - 2);
      }
      mc.fillStyle = "#6b7280";
      mc.font = "13px Arial";
      mc.textAlign = "center";
      mc.textBaseline = "top";
      mc.fillText(months[i], bx + mBW / 2, mBY + 6);
    });
    canvasToPDF(mC, 200, 90, 100, 60);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(27, 67, 28);
    doc.text("Monthly Event Distribution", 250, 153, { align: "center" });

    // Divider
    doc.setDrawColor(220, 230, 220);
    doc.setLineWidth(0.3);
    doc.line(12, 157, pageWidth - 12, 157);

    // Table
    let y = 164;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(27, 67, 28);
    doc.text("Events List", 12, y);
    doc.setDrawColor(27, 67, 28);
    doc.setLineWidth(0.4);
    doc.line(12, y + 2, pageWidth - 12, y + 2);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(130, 130, 130);
    doc.text("Total: " + events.length + " events", 12, y + 8);
    y += 14;

    const headers = [
      "#",
      "Event Title",
      "Organizer",
      "Event Date",
      "Added On",
      "Timing",
      "Status",
    ];
    const colX = [12, 22, 82, 132, 156, 175, 192];
    const rowH = 9;

    const drawTH = (yp) => {
      doc.setFillColor(27, 67, 28);
      doc.rect(10, yp - 6, pageWidth - 20, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      headers.forEach((h, i) => doc.text(h, colX[i], yp, { align: "left" }));
    };
    drawTH(y);
    y += 8;

    events.forEach((event, i) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
        drawTH(y);
        y += 8;
      }
      if (i % 2 === 0) {
        doc.setFillColor(245, 250, 245);
        doc.rect(10, y - 6, pageWidth - 20, rowH, "F");
      }
      const isActive = event.status === 1;
      const isUpcoming = new Date(event.Event_Date) > today;
      const fmt = (d) =>
        d
          ? new Date(d).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-";
      const vals = [
        String(i + 1),
        (event.Description || "-").substring(0, 28) +
          ((event.Description?.length || 0) > 28 ? "..." : ""),
        (event.Organizer_Name || "-").substring(0, 16) +
          ((event.Organizer_Name?.length || 0) > 16 ? "..." : ""),
        fmt(event.Event_Date),
        fmt(event.Added_On),
        isUpcoming ? "Upcoming" : "Past",
        isActive ? "Active" : "Blocked",
      ];
      vals.forEach((val, j) => {
        doc.setFontSize(7.5);
        if (j === 6) {
          doc.setTextColor(
            isActive ? 22 : 185,
            isActive ? 101 : 28,
            isActive ? 52 : 28,
          );
          doc.setFont("helvetica", "bold");
        } else if (j === 5) {
          doc.setTextColor(
            isUpcoming ? 22 : 100,
            isUpcoming ? 101 : 100,
            isUpcoming ? 52 : 100,
          );
          doc.setFont("helvetica", "bold");
        } else {
          doc.setTextColor(50, 50, 50);
          doc.setFont("helvetica", "normal");
        }
        doc.text(String(val), colX[j], y, { align: "left" });
      });
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.1);
      doc.line(10, y + 3, pageWidth - 10, y + 3);
      y += rowH;
    });

    // Footer
    const tp = doc.internal.getNumberOfPages();
    for (let p = 1; p <= tp; p++) {
      doc.setPage(p);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "normal");
      doc.text("IdeaGroove - Student Collaboration System", 15, pageHeight - 8);
      doc.text("Page " + p + " of " + tp, pageWidth - 15, pageHeight - 8, {
        align: "right",
      });
    }
    doc.save("Events_Report_" + Date.now() + ".pdf");
  };

  return (
    <button
      onClick={generatePDF}
      className="group flex items-center gap-2 bg-white border border-gray-200 hover:border-green-700 hover:bg-green-800 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <div className="p-1 rounded-lg bg-green-50 group-hover:bg-white/20 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-700 group-hover:text-white transition-colors"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
      <span>Export Report</span>
      <span className="text-[10px] font-bold bg-green-100 group-hover:bg-white/20 text-green-700 group-hover:text-white px-1.5 py-0.5 rounded-md transition-colors">
        PDF
      </span>
    </button>
  );
};

export default EventsReportGeneration;
