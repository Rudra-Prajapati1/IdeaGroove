// import React from "react";
// import jsPDF from "jspdf";
// import logo from "/DarkLogo.png";
// import "jspdf-autotable";

// const ReportGeneration = ({
//   recentActivities = [],
//   statsData = {},
//   contributorData = [],
//   categories = [],
// }) => {
//   const generatePDF = async () => {
//     const doc = new jsPDF("p", "mm", "a4");
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();

//     // ── Helper: load image as circular base64 ───────────────────
//     const loadCircularImage = (url) =>
//       new Promise((resolve) => {
//         const img = new Image();
//         img.crossOrigin = "anonymous";
//         img.onload = () => {
//           const size = 100;
//           const canvas = document.createElement("canvas");
//           canvas.width = size;
//           canvas.height = size;
//           const ctx = canvas.getContext("2d");
//           ctx.beginPath();
//           ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
//           ctx.clip();
//           ctx.drawImage(img, 0, 0, size, size);
//           resolve(canvas.toDataURL("image/png"));
//         };
//         img.onerror = () => resolve(null);
//         img.src = url;
//       });

//     // ═══════════════════════════════════════════════════
//     // HEADER
//     // ═══════════════════════════════════════════════════
//     try {
//       doc.addImage(logo, "PNG", 15, 5, 35, 35);
//     } catch (e) {
//       console.error("Not able to load logo: ", e.message);
//     }

//     doc.setFontSize(16);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(27, 67, 28);
//     doc.text("IdeaGroove - Student Collaboration System", pageWidth - 20, 18, {
//       align: "right",
//     });

//     doc.setFontSize(13);
//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(80, 120, 80);
//     doc.text("Contact us: theideagroove@gmail.com", pageWidth - 20, 25, {
//       align: "right",
//     });

//     doc.setFontSize(8);
//     doc.setTextColor(150, 150, 150);
//     doc.text(
//       `Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
//       pageWidth - 20,
//       31,
//       { align: "right" },
//     );

//     // Title bar
//     doc.setFillColor(27, 67, 28);
//     doc.rect(10, 42, pageWidth - 20, 10, "F");
//     doc.setFontSize(13);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(255, 255, 255);
//     doc.text("Platform Analytics Report", pageWidth / 2, 49, {
//       align: "center",
//     });

//     // ═══════════════════════════════════════════════════
//     // SECTION LABELS
//     // ═══════════════════════════════════════════════════
//     const sectionY = 62;

//     // LEFT — Content Distribution label
//     doc.setFontSize(11);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(27, 67, 28);
//     doc.text("Content Distribution", 12, sectionY);
//     doc.setDrawColor(27, 67, 28);
//     doc.setLineWidth(0.4);
//     doc.line(12, sectionY + 2, 100, sectionY + 2);

//     // RIGHT — Top Contributors label (starts at x=108)
//     doc.text("Top Contributors", 108, sectionY);
//     doc.line(108, sectionY + 2, pageWidth - 12, sectionY + 2);

//     // ═══════════════════════════════════════════════════
//     // PIE CHART — left column (x: 12–100)
//     // ═══════════════════════════════════════════════════
//     const pieColors = [
//       [225, 29, 72],
//       [37, 235, 99],
//       [245, 158, 11],
//       [124, 58, 237],
//     ];

//     const totalUploads = categories.reduce((sum, c) => sum + c.count, 0);

//     const pieCanvas = document.createElement("canvas");
//     pieCanvas.width = 320;
//     pieCanvas.height = 320;
//     const ctx = pieCanvas.getContext("2d");
//     const cx = 160,
//       cy = 160,
//       radius = 140;

//     let startAngle = -Math.PI / 2;
//     categories.forEach((cat, i) => {
//       const slice =
//         totalUploads > 0
//           ? (cat.count / totalUploads) * 2 * Math.PI
//           : Math.PI / 2;
//       ctx.beginPath();
//       ctx.moveTo(cx, cy);
//       ctx.arc(cx, cy, radius, startAngle, startAngle + slice);
//       ctx.closePath();
//       ctx.fillStyle = `rgb(${pieColors[i].join(",")})`;
//       ctx.fill();
//       ctx.strokeStyle = "#fff";
//       ctx.lineWidth = 3;
//       ctx.stroke();

//       if (cat.percentage > 5) {
//         const mid = startAngle + slice / 2;
//         const lx = cx + radius * 0.65 * Math.cos(mid);
//         const ly = cy + radius * 0.65 * Math.sin(mid);
//         ctx.fillStyle = "#fff";
//         ctx.font = "bold 20px Arial";
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         ctx.fillText(`${cat.percentage}%`, lx, ly);
//       }
//       startAngle += slice;
//     });

//     // Donut hole
//     ctx.beginPath();
//     ctx.arc(cx, cy, radius * 0.42, 0, 2 * Math.PI);
//     ctx.fillStyle = "#fff";
//     ctx.fill();
//     ctx.fillStyle = "#1a1a1a";
//     ctx.font = "bold 36px Arial";
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillText(String(totalUploads), cx, cy - 12);
//     ctx.font = "14px Arial";
//     ctx.fillStyle = "#888";
//     ctx.fillText("Total Uploads", cx, cy + 16);

//     // Pie chart placed at x:18, y:68, size 65x65
//     doc.addImage(pieCanvas.toDataURL("image/png"), "PNG", 18, 68, 65, 65);

//     // Legend below pie chart
//     const legendStartX = 18;
//     const legendStartY = 138;
//     const colGap = 42; // horizontal gap between col 1 and col 2
//     const rowGap = 14; // vertical gap between rows

//     categories.forEach((cat, i) => {
//       const [r, g, b] = pieColors[i];

//       const col = i % 2; // 0 = left, 1 = right
//       const row = Math.floor(i / 2); // 0 = top, 1 = bottom

//       const lx = legendStartX + col * colGap;
//       const ly = legendStartY + row * rowGap;

//       doc.setFillColor(r, g, b);
//       doc.roundedRect(lx, ly - 3, 4, 4, 1, 1, "F");

//       doc.setFontSize(8);
//       doc.setFont("helvetica", "bold");
//       doc.setTextColor(50, 50, 50);
//       doc.text(cat.name, lx + 6, ly);

//       doc.setFontSize(7);
//       doc.setFont("helvetica", "normal");
//       doc.setTextColor(110, 110, 110);
//       doc.text(`${cat.count} (${cat.percentage}%)`, lx + 6, ly + 5);
//     });

//     const podiumBaseY = 145; // bottom baseline of all bars
//     const barWidth = 22;
//     const avatarSize = 14; // diameter in mm

//     const podiumSlots = [
//       {
//         studentIdx: 1,
//         rank: 2,
//         xCenter: 127,
//         barH: 25,
//         color: [148, 163, 184],
//       }, // silver — left
//       { studentIdx: 0, rank: 1, xCenter: 153, barH: 42, color: [245, 158, 11] }, // gold   — center
//       { studentIdx: 2, rank: 3, xCenter: 179, barH: 18, color: [249, 115, 22] }, // bronze — right
//     ];

//     for (const slot of podiumSlots) {
//       const student = contributorData[slot.studentIdx];
//       if (!student) continue;

//       const { xCenter, barH, color, rank } = slot;
//       const [r, g, b] = color;

//       // Bar
//       doc.setFillColor(r, g, b);
//       doc.roundedRect(
//         xCenter - barWidth / 2,
//         podiumBaseY - barH,
//         barWidth,
//         barH,
//         2,
//         2,
//         "F",
//       );

//       // Rank number centered in bar
//       doc.setFontSize(12);
//       doc.setFont("helvetica", "bold");
//       doc.setTextColor(255, 255, 255);
//       doc.text(`#${rank}`, xCenter, podiumBaseY - barH / 2 + 2, {
//         align: "center",
//       });

//       // Avatar sits directly on top of bar
//       const avatarCenterY = podiumBaseY - barH - avatarSize / 2 - 1;

//       if (student.Profile_Pic) {
//         const circImg = await loadCircularImage(student.Profile_Pic);
//         if (circImg) {
//           doc.addImage(
//             circImg,
//             "PNG",
//             xCenter - avatarSize / 2,
//             avatarCenterY - avatarSize / 2,
//             avatarSize,
//             avatarSize,
//           );
//         } else {
//           drawInitialCircle(doc, xCenter, avatarCenterY, student.Name, r, g, b);
//         }
//       } else {
//         drawInitialCircle(doc, xCenter, avatarCenterY, student.Name, r, g, b);
//       }

//       // Crown ONLY on rank 1
//       if (rank === 1) {
//         drawCrown(doc, xCenter, avatarCenterY - avatarSize / 2 - 6, r, g, b);
//       }

//       // Name below bar
//       doc.setFontSize(7.5);
//       doc.setFont("helvetica", "bold");
//       doc.setTextColor(40, 40, 40);
//       doc.text(student.Name?.split(" ")[0] || "", xCenter, podiumBaseY + 5, {
//         align: "center",
//       });

//       doc.setFontSize(6.5);
//       doc.setFont("helvetica", "normal");
//       doc.setTextColor(120, 120, 120);
//       doc.text(
//         `${student.grand_total} contributions`,
//         xCenter,
//         podiumBaseY + 10,
//         { align: "center" },
//       );
//     }

//     // ═══════════════════════════════════════════════════
//     // RECENT ACTIVITIES TABLE
//     // ═══════════════════════════════════════════════════
//     let y = podiumBaseY + 20;

//     // doc.setFontSize(11);
//     // doc.setFont("helvetica", "bold");
//     // doc.setTextColor(27, 67, 28);
//     // doc.text("Recent Activities", 12, y);
//     // doc.setDrawColor(27, 67, 28);
//     // doc.setLineWidth(0.4);
//     // doc.line(12, y + 2, pageWidth - 12, y + 2);

//     doc.setFillColor(27, 67, 28);
//     doc.rect(10, y, pageWidth - 20, 10, "F");
//     doc.setFontSize(13);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(255, 255, 255);
//     doc.text("Recent Activities Report", pageWidth / 2, y + 7, {
//       align: "center",
//     });
//     y += 14;

//     const headers = ["#", "Student", "Activity", "Type", "Date", "Status"];
//     const colX = [12, 22, 55, 122, 152, 178];
//     const rowHeight = 8;

//     const drawTableHeader = (yPos) => {
//       doc.setFillColor(27, 67, 28);
//       doc.rect(10, yPos - 6, pageWidth - 20, 8, "F");
//       doc.setTextColor(255, 255, 255);
//       doc.setFontSize(8);
//       doc.setFont("helvetica", "bold");
//       headers.forEach((h, i) => doc.text(h, colX[i], yPos, { align: "left" }));
//     };

//     drawTableHeader(y);
//     y += 8;

//     recentActivities.forEach((row, i) => {
//       if (y > pageHeight - 20) {
//         doc.addPage();
//         y = 20;
//         drawTableHeader(y);
//         y += 8;
//       }

//       if (i % 2 === 0) {
//         doc.setFillColor(245, 250, 245);
//         doc.rect(10, y - 5, pageWidth - 20, rowHeight, "F");
//       }

//       const isActive = row.status === 1;
//       const values = [
//         String(i + 1),
//         row.student_name || "-",
//         (row.title_or_action || "-").substring(0, 40) +
//           ((row.title_or_action?.length || 0) > 40 ? "..." : ""),
//         row.activity_type || "-",
//         new Date(row.created_at).toLocaleDateString("en-IN", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         }),
//         isActive ? "Active" : "Blocked",
//       ];

//       values.forEach((val, j) => {
//         if (j === 5) {
//           doc.setTextColor(
//             isActive ? 22 : 185,
//             isActive ? 101 : 28,
//             isActive ? 52 : 28,
//           );
//           doc.setFont("helvetica", "bold");
//         } else {
//           doc.setTextColor(50, 50, 50);
//           doc.setFont("helvetica", "normal");
//         }
//         doc.text(String(val), colX[j], y, { align: "left" });
//       });

//       doc.setDrawColor(220, 220, 220);
//       doc.setLineWidth(0.1);
//       doc.line(10, y + 3, pageWidth - 10, y + 3);
//       y += rowHeight;
//     });

//     doc.setFontSize(8);
//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(120, 120, 120);
//     doc.text(`Total Records: ${recentActivities.length}`, 12, y + 8);

//     // Footer
//     const totalPagesCount = doc.internal.getNumberOfPages();
//     for (let p = 1; p <= totalPagesCount; p++) {
//       doc.setPage(p);
//       doc.setFontSize(7);
//       doc.setTextColor(150, 150, 150);
//       doc.setFont("helvetica", "normal");
//       doc.text("IdeaGroove - Student Collaboration System", 15, pageHeight - 8);
//       doc.text(
//         `Page ${p} of ${totalPagesCount}`,
//         pageWidth - 15,
//         pageHeight - 8,
//         { align: "right" },
//       );
//     }

//     doc.save(`IdeaGroove_Report_${Date.now()}.pdf`);
//   };

//   const drawInitialCircle = (doc, cx, cy, name, r, g, b) => {
//     doc.setFillColor(r, g, b);
//     doc.circle(cx, cy, 7, "F");
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(9);
//     doc.setFont("helvetica", "bold");
//     doc.text((name?.charAt(0) || "?").toUpperCase(), cx, cy + 1.5, {
//       align: "center",
//     });
//   };

//   const drawCrown = (doc, cx, topY, r, g, b) => {
//     doc.setFillColor(r, g, b);
//     doc.rect(cx - 5, topY + 3, 10, 2.5, "F"); // base
//     doc.triangle(cx - 5, topY + 3, cx - 5, topY - 1, cx - 2.5, topY + 3, "F"); // left spike
//     doc.triangle(cx - 1.5, topY + 3, cx, topY - 3, cx + 1.5, topY + 3, "F"); // center spike
//     doc.triangle(cx + 5, topY + 3, cx + 5, topY - 1, cx + 2.5, topY + 3, "F"); // right spike
//     // White dots on spike tips
//     doc.setFillColor(255, 255, 255);
//     doc.circle(cx - 5, topY - 1, 0.8, "F");
//     doc.circle(cx, topY - 3, 0.8, "F");
//     doc.circle(cx + 5, topY - 1, 0.8, "F");
//   };

//   return (
//     <button
//       onClick={generatePDF}
//       className="group flex items-center gap-2 bg-white border border-gray-200 hover:border-green-700 hover:bg-green-800 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
//     >
//       <div className="p-1 rounded-lg bg-green-50 group-hover:bg-white/20 transition-colors">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="13"
//           height="13"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="text-green-700 group-hover:text-white transition-colors"
//         >
//           <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//           <polyline points="7 10 12 15 17 10" />
//           <line x1="12" y1="15" x2="12" y2="3" />
//         </svg>
//       </div>
//       <span>Export Report</span>
//       <span className="text-[10px] font-bold bg-green-100 group-hover:bg-white/20 text-green-700 group-hover:text-white px-1.5 py-0.5 rounded-md transition-colors">
//         PDF
//       </span>
//     </button>
//   );
// };

// export default ReportGeneration;
import React, { useState } from "react";
import jsPDF from "jspdf";
import logo from "/DarkLogo.png";
import "jspdf-autotable";
import ReportConfigModal from "./ReportConfigModel";

const ReportGeneration = ({
  recentActivities = [],
  statsData = {},
  contributorData = [],
  categories = [],
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Filter any array of objects by created_at / Event_Date / Added_On
  const filterByDate = (arr, dateRange, dateKey = "created_at") => {
    if (!dateRange.from) return arr;
    return arr.filter((item) => {
      const d = new Date(
        item[dateKey] || item.created_at || item.Added_On || item.Event_Date,
      );
      return d >= dateRange.from && d <= dateRange.to;
    });
  };

  const generatePDF = async (sections, dateRange, presetId) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    try {
      doc.addImage(logo, "PNG", 15, 5, 35, 35);
    } catch (e) {
      console.error("Not able to load logo: ", e.message);
    }

    // Filter all data by chosen date range
    const filteredActivities = filterByDate(
      recentActivities,
      dateRange,
      "created_at",
    );

    // Rebuild top contributors from filtered activities when date filter is active
    const filteredContributors = dateRange.from
      ? Object.values(
          filteredActivities.reduce((acc, row) => {
            const id = row.student_id;
            if (!id) return acc;
            if (!acc[id])
              acc[id] = {
                S_ID: id,
                Name: row.student_name || "Unknown",
                Profile_Pic: row.profile_pic || null,
                grand_total: 0,
              };
            acc[id].grand_total++;
            return acc;
          }, {}),
        )
          .sort((a, b) => b.grand_total - a.grand_total)
          .slice(0, 3)
      : contributorData;

    // Rebuild categories from filtered activities if date is set
    const filteredCategories = dateRange.from
      ? categories
          .map((cat) => {
            const count = filteredActivities.filter(
              (a) => a.activity_type?.toUpperCase() === cat.name.toUpperCase(),
            ).length;
            return { ...cat, count };
          })
          .map((cat, _, arr) => {
            const total = arr.reduce((s, c) => s + c.count, 0);
            return {
              ...cat,
              percentage: total > 0 ? Math.round((cat.count / total) * 100) : 0,
            };
          })
      : categories;

    const loadCircularImage = (url) =>
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const size = 100;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          ctx.beginPath();
          ctx.arc(50, 50, 50, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(img, 0, 0, size, size);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => resolve(null);
        img.src = url;
      });

    // ── HEADER ─────────────────────────────────────────────────
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
    doc.text("Platform Analytics Report", pageWidth / 2, 49, {
      align: "center",
    });

    // Date range badge just below title bar
    if (presetId !== "all" && dateRange.from) {
      doc.setFillColor(230, 245, 230);
      doc.roundedRect(10, 54, pageWidth - 20, 7, 1, 1, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(27, 67, 28);
      const fromStr = dateRange.from.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const toStr = dateRange.to.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      doc.text("Date Range: " + fromStr + "  to  " + toStr, pageWidth / 2, 59, {
        align: "center",
      });
    }

    let y = presetId !== "all" ? 66 : 58;

    // ── PLATFORM STATS ──────────────────────────────────────────
    if (sections.platformStats) {
      const statsCards = [
        {
          label: "Total Users",
          value: statsData?.totalUsers || 0,
          color: [27, 67, 28],
        },
        {
          label: "Total Notes",
          value: statsData?.totalNotes || 0,
          color: [225, 29, 72],
        },
        {
          label: "Questions",
          value: statsData?.totalQuestions || 0,
          color: [37, 99, 235],
        },
        {
          label: "Active Groups",
          value: statsData?.activeGroups || 0,
          color: [124, 58, 237],
        },
        {
          label: "Events",
          value: statsData?.upcomingEvents || 0,
          color: [245, 158, 11],
        },
        {
          label: "Complaints",
          value: statsData?.complaints || 0,
          color: [239, 68, 68],
        },
      ];
      const cw = (pageWidth - 25) / 6;
      let cx = 12;
      statsCards.forEach(({ label, value, color }) => {
        const [r, g, b] = color;
        doc.setFillColor(r, g, b);
        doc.roundedRect(cx, y, cw - 2, 16, 2, 2, "F");
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(String(value), cx + (cw - 2) / 2, y + 7, { align: "center" });
        doc.setFontSize(5.5);
        doc.setFont("helvetica", "normal");
        doc.text(label.toUpperCase(), cx + (cw - 2) / 2, y + 12, {
          align: "center",
        });
        cx += cw;
      });

      // Stats disclaimer when date filter is active
      if (dateRange.from) {
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(180, 180, 180);
        doc.text(
          "* Platform-wide totals — not affected by date filter",
          12,
          y + 19,
        );
      }

      y += dateRange.from ? 25 : 22;
    }

    // ── PIE + PODIUM ────────────────────────────────────────────
    const showPie = sections.contentDistribution;
    const showPodium = sections.topContributors;

    if (showPie || showPodium) {
      const sectionY = y;
      if (showPie && showPodium) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(27, 67, 28);
        doc.text("Content Distribution", 12, sectionY);
        doc.setDrawColor(27, 67, 28);
        doc.setLineWidth(0.4);
        doc.line(12, sectionY + 2, 100, sectionY + 2);
        doc.text("Top Contributors", 108, sectionY);
        doc.line(108, sectionY + 2, pageWidth - 12, sectionY + 2);
      } else {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(27, 67, 28);
        doc.text(
          showPie ? "Content Distribution" : "Top Contributors",
          12,
          sectionY,
        );
        doc.setDrawColor(27, 67, 28);
        doc.setLineWidth(0.4);
        doc.line(12, sectionY + 2, pageWidth - 12, sectionY + 2);
      }
      y = sectionY + 8;

      if (showPie) {
        const pieColors = [
          [225, 29, 72],
          [37, 235, 99],
          [245, 158, 11],
          [124, 58, 237],
        ];
        const totalUploads = filteredCategories.reduce(
          (s, c) => s + c.count,
          0,
        );
        const pc = document.createElement("canvas");
        pc.width = 320;
        pc.height = 320;
        const pctx = pc.getContext("2d");
        let sa = -Math.PI / 2;
        filteredCategories.forEach((cat, i) => {
          const slice =
            totalUploads > 0
              ? (cat.count / totalUploads) * 2 * Math.PI
              : Math.PI / 2;
          pctx.beginPath();
          pctx.moveTo(160, 160);
          pctx.arc(160, 160, 140, sa, sa + slice);
          pctx.closePath();
          pctx.fillStyle = "rgb(" + pieColors[i].join(",") + ")";
          pctx.fill();
          pctx.strokeStyle = "#fff";
          pctx.lineWidth = 3;
          pctx.stroke();
          if (cat.percentage > 5) {
            const mid = sa + slice / 2;
            pctx.fillStyle = "#fff";
            pctx.font = "bold 20px Arial";
            pctx.textAlign = "center";
            pctx.textBaseline = "middle";
            pctx.fillText(
              cat.percentage + "%",
              160 + 91 * Math.cos(mid),
              160 + 91 * Math.sin(mid),
            );
          }
          sa += slice;
        });
        pctx.beginPath();
        pctx.arc(160, 160, 58, 0, 2 * Math.PI);
        pctx.fillStyle = "#fff";
        pctx.fill();
        pctx.fillStyle = "#1a1a1a";
        pctx.font = "bold 36px Arial";
        pctx.textAlign = "center";
        pctx.textBaseline = "middle";
        pctx.fillText(String(totalUploads), 160, 148);
        pctx.font = "14px Arial";
        pctx.fillStyle = "#888";
        pctx.fillText("Total Uploads", 160, 174);
        doc.addImage(pc.toDataURL("image/png"), "PNG", 18, y, 65, 65);

        const lsx = 18,
          lsy = y + 68,
          cg = 42,
          rg = 14;
        filteredCategories.forEach((cat, i) => {
          const [r, g, b] = pieColors[i];
          const col = i % 2,
            row = Math.floor(i / 2);
          const lx = lsx + col * cg,
            ly = lsy + row * rg;
          doc.setFillColor(r, g, b);
          doc.roundedRect(lx, ly - 3, 4, 4, 1, 1, "F");
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(50, 50, 50);
          doc.text(cat.name, lx + 6, ly);
          doc.setFontSize(7);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(110, 110, 110);
          doc.text(cat.count + " (" + cat.percentage + "%)", lx + 6, ly + 5);
        });
      }

      if (showPodium) {
        const podiumBaseY = y + 72;
        const barWidth = 22,
          avatarSize = 14;
        const podiumX = showPie ? [127, 153, 179] : [60, 105, 150];
        const podiumSlots = [
          {
            studentIdx: 1,
            rank: 2,
            xCenter: podiumX[0],
            barH: 25,
            color: [148, 163, 184],
          },
          {
            studentIdx: 0,
            rank: 1,
            xCenter: podiumX[1],
            barH: 42,
            color: [245, 158, 11],
          },
          {
            studentIdx: 2,
            rank: 3,
            xCenter: podiumX[2],
            barH: 18,
            color: [249, 115, 22],
          },
        ];
        for (const slot of podiumSlots) {
          const student = filteredContributors[slot.studentIdx];
          if (!student) continue;
          const { xCenter, barH, color, rank } = slot;
          const [r, g, b] = color;
          doc.setFillColor(r, g, b);
          doc.roundedRect(
            xCenter - barWidth / 2,
            podiumBaseY - barH,
            barWidth,
            barH,
            2,
            2,
            "F",
          );
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.text("#" + rank, xCenter, podiumBaseY - barH / 2 + 2, {
            align: "center",
          });
          const avy = podiumBaseY - barH - avatarSize / 2 - 1;
          if (student.Profile_Pic) {
            const ci = await loadCircularImage(student.Profile_Pic);
            if (ci)
              doc.addImage(
                ci,
                "PNG",
                xCenter - avatarSize / 2,
                avy - avatarSize / 2,
                avatarSize,
                avatarSize,
              );
            else drawInitialCircle(doc, xCenter, avy, student.Name, r, g, b);
          } else drawInitialCircle(doc, xCenter, avy, student.Name, r, g, b);
          if (rank === 1)
            drawCrown(doc, xCenter, avy - avatarSize / 2 - 6, r, g, b);
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(40, 40, 40);
          doc.text(
            (student.Name || "").split(" ")[0],
            xCenter,
            podiumBaseY + 5,
            { align: "center" },
          );
          doc.setFontSize(6.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(120, 120, 120);
          doc.text(
            student.grand_total + " contributions",
            xCenter,
            podiumBaseY + 10,
            { align: "center" },
          );
        }
        y = podiumBaseY + 18;
      } else {
        y += 80;
      }
    }

    // ── RECENT ACTIVITIES ───────────────────────────────────────
    if (sections.recentActivities) {
      doc.setFillColor(27, 67, 28);
      doc.rect(10, y, pageWidth - 20, 10, "F");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("Recent Activities", pageWidth / 2, y + 7, { align: "center" });
      y += 14;

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(130, 130, 130);
      doc.text(
        "Total Records: " +
          filteredActivities.length +
          (dateRange.from ? "  (filtered by date range)" : ""),
        12,
        y,
      );
      y += 8;

      const headers = ["#", "Student", "Activity", "Type", "Date", "Status"];
      const colX = [12, 22, 55, 122, 152, 178];
      const rowH = 8;

      const drawTH = (yp) => {
        doc.setFillColor(27, 67, 28);
        doc.rect(10, yp - 6, pageWidth - 20, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        headers.forEach((h, i) => doc.text(h, colX[i], yp, { align: "left" }));
      };
      drawTH(y);
      y += 8;

      filteredActivities.forEach((row, i) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
          drawTH(y);
          y += 8;
        }
        if (i % 2 === 0) {
          doc.setFillColor(245, 250, 245);
          doc.rect(10, y - 5, pageWidth - 20, rowH, "F");
        }
        const isActive = row.status === 1;
        const vals = [
          String(i + 1),
          row.student_name || "-",
          (row.title_or_action || "-").substring(0, 40) +
            ((row.title_or_action?.length || 0) > 40 ? "..." : ""),
          row.activity_type || "-",
          new Date(row.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          isActive ? "Active" : "Blocked",
        ];
        vals.forEach((val, j) => {
          doc.setFontSize(7.5);
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
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.1);
        doc.line(10, y + 3, pageWidth - 10, y + 3);
        y += rowH;
      });
    }

    // ── FOOTER ──────────────────────────────────────────────────
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

    doc.save("IdeaGroove_Report_" + Date.now() + ".pdf");
  };

  const drawInitialCircle = (doc, cx, cy, name, r, g, b) => {
    doc.setFillColor(r, g, b);
    doc.circle(cx, cy, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text((name?.charAt(0) || "?").toUpperCase(), cx, cy + 1.5, {
      align: "center",
    });
  };

  const drawCrown = (doc, cx, topY, r, g, b) => {
    doc.setFillColor(r, g, b);
    doc.rect(cx - 5, topY + 3, 10, 2.5, "F");
    doc.triangle(cx - 5, topY + 3, cx - 5, topY - 1, cx - 2.5, topY + 3, "F");
    doc.triangle(cx - 1.5, topY + 3, cx, topY - 3, cx + 1.5, topY + 3, "F");
    doc.triangle(cx + 5, topY + 3, cx + 5, topY - 1, cx + 2.5, topY + 3, "F");
    doc.setFillColor(255, 255, 255);
    doc.circle(cx - 5, topY - 1, 0.8, "F");
    doc.circle(cx, topY - 3, 0.8, "F");
    doc.circle(cx + 5, topY - 1, 0.8, "F");
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
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

      <ReportConfigModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onGenerate={generatePDF}
      />
    </>
  );
};

export default ReportGeneration;
