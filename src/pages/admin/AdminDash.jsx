import React, { useEffect, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import {
  Users,
  AlertTriangle,
  FileText,
  UsersRound,
  Calendar,
  Notebook,
  Activity,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Circle,
  Filter,
  CalendarCheck2,
  MessageSquareText,
  NotepadText,
  ShieldAlert,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import StudentProfile from "../../components/admin/StudentProfile";
import ActivityFilterPanel from "../../components/admin/ActivityFilterPanel";
import ReportGeneration from "../../components/admin/ReportGeneration";
import {
  fetchAdminOverview,
  selectAdminDashboardCategories,
  selectAdminDashboardStatsData,
  selectAdminRecentActivities,
  selectAdminTopContributors,
} from "../../redux/adminSlice/adminOverviewSlice";

const AdminDash = () => {
  const dispatch = useDispatch();
  const statsData = useSelector(selectAdminDashboardStatsData);
  const contributorData = useSelector(selectAdminTopContributors);
  const recentActivities = useSelector(selectAdminRecentActivities);
  const categories = useSelector(selectAdminDashboardCategories);
  const totalUploads = categories.reduce((sum, category) => sum + category.count, 0);

  const [tooltip, setTooltip] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    types: [], // e.g. ["EVENT", "NOTE"]
    statuses: [], // e.g. ["Active", "Blocked"]
    studentName: "",
    dateFrom: "",
    dateTo: "",
  });
  const [selectedActivityStudentId, setSelectedActivityStudentId] =
    useState(null);
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const ACTIVITIES_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when activities change
  useEffect(() => {
    setCurrentPage(1);
  }, [recentActivities]);

  useEffect(() => {
    dispatch(fetchAdminOverview());
  }, [dispatch]);

  const filteredActivities = recentActivities.filter((row) => {
    const { types, statuses, studentName, dateFrom, dateTo } = appliedFilters;

    // Filter by type
    if (types.length > 0 && !types.includes(row.activity_type)) return false;

    // Filter by status
    if (statuses.length > 0) {
      const rowStatus = row.status === 1 ? "Active" : "Blocked";
      if (!statuses.includes(rowStatus)) return false;
    }

    // Filter by student name
    if (studentName?.trim()) {
      if (!row.student_name?.toLowerCase().includes(studentName.toLowerCase()))
        return false;
    }

    // Filter by date range
    if (dateFrom) {
      if (new Date(row.created_at) < new Date(dateFrom)) return false;
    }
    if (dateTo) {
      if (new Date(row.created_at) > new Date(dateTo + "T23:59:59"))
        return false;
    }

    return true;
  });

  // Paginated slice
  const totalPages = Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ACTIVITIES_PER_PAGE,
    currentPage * ACTIVITIES_PER_PAGE,
  );

  const stats = [
    {
      label: "Total Students",
      value: statsData?.totalUsers || 0,
      color: "emerald",
      icon: Users,
    },
    {
      label: "Total Notes",
      value: statsData?.totalNotes || 0,
      color: "rose",
      icon: Notebook,
    },
    {
      label: "Total Questions",
      value: statsData?.totalQuestions || 0,
      color: "blue",
      icon: FileText,
    },
    {
      label: "Active Groups",
      value: statsData?.activeGroups || 0,
      color: "purple",
      icon: UsersRound,
    },
    {
      label: "Upcoming Events",
      value: statsData?.upcomingEvents || 0,
      color: "amber",
      icon: Calendar,
    },
    {
      label: "Complaints",
      value: statsData?.complaints || 0,
      color: "orange",
      icon: AlertTriangle,
    },
  ];

  const getTheme = (color) => {
    const themes = {
      emerald: {
        text: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        bar: "bg-emerald-500",
      },
      rose: {
        text: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-100",
        bar: "bg-rose-500",
      },
      blue: {
        text: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
        bar: "bg-blue-500",
      },
      purple: {
        text: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-100",
        bar: "bg-purple-500",
      },
      amber: {
        text: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        bar: "bg-amber-500",
      },
      orange: {
        text: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-100",
        bar: "bg-orange-500",
      },
    };
    return themes[color] || themes.emerald;
  };

  const getActivityBadgeColor = (type) => {
    switch (type?.toUpperCase()) {
      case "EVENT":
        return "bg-amber-100 text-amber-600 border-amber-200";
      case "QUESTION":
        return "bg-[#25eb63]/20 text-green-700 border-green-200";
      case "NOTE":
        return "bg-rose-100 text-rose-600 border-rose-200";
      case "GROUP":
        return "bg-purple-100 text-purple-600 border-purple-200";
      case "COMPLAINT":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getActivityIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "EVENT":
        return CalendarCheck2;
      case "QUESTION":
        return MessageSquareText;
      case "NOTE":
        return NotepadText;
      case "GROUP":
        return UsersRound;
      case "COMPLAINT":
        return ShieldAlert;
      default:
        return Activity;
    }
  };

  return (
    <section className="flex flex-col gap-6 relative min-h-screen">
      <div className="flex justify-between items-center">
        <AdminPageHeader
          title="Admin Overview"
          subtitle="Real-time analytics & platform health"
        />
        <ReportGeneration
          recentActivities={filteredActivities}
          statsData={statsData}
          contributorData={contributorData}
          categories={categories}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((card, idx) => {
          const theme = getTheme(card.color);
          return (
            <div
              key={idx}
              className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${theme.bg} ${theme.text} transition-transform group-hover:scale-110 duration-300`}
                  >
                    <card.icon size={22} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {card.label}
                  </p>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    {card.value}
                  </h2>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50">
                <div
                  className={`h-full transition-all duration-1000 w-0 group-hover:w-full ${theme.bar}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
          <div className="p-6 border-b bg-primary border-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity size={22} className="text-emerald-400" />
              <h3 className="text-lg font-bold text-white font-poppins">
                Content Distribution
              </h3>
            </div>
          </div>
          <div className="p-8 flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="relative w-52 h-52 transition-transform duration-500 group-hover:rotate-12">
              <svg
                viewBox="0 0 36 36"
                className="w-full h-full transform -rotate-90"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth="3"
                ></circle>
                {categories.map((cat, index) => {
                  const offset = categories
                    .slice(0, index)
                    .reduce((acc, item) => acc + item.percentage, 0);

                  return (
                    <circle
                      key={cat.name}
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="transparent"
                      strokeWidth="4"
                      strokeDasharray={`${cat.percentage} 100`}
                      strokeDashoffset={`-${offset}`}
                      stroke={
                        cat.color === "bg-rose-600"
                          ? "#E11D48"
                          : cat.color === "bg-[#25eb63]"
                            ? "#25eb63"
                            : cat.color === "bg-amber-500"
                              ? "#f59e0b"
                              : "#7c3aed"
                      }
                      onMouseEnter={() => setTooltip(cat)}
                      onMouseLeave={() => setTooltip(null)}
                      className="cursor-pointer"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-slate-800 tracking-tighter">
                  {totalUploads}
                </span>
                <span className="text-[9px] uppercase text-slate-400 font-black tracking-[0.2em]">
                  Total Uploads
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
              {categories.map((cat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${cat.color}`}
                      ></div>
                      <span className="text-slate-600 font-bold text-xs uppercase tracking-wider">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-800">
                      {cat.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {tooltip && (
              <div className="absolute top-0 right-0 bg-white shadow-lg rounded-xl p-3 text-xs border z-50">
                <p className="font-bold">{tooltip.name}</p>
                <p>{tooltip.percentage}%</p>
                <p>{tooltip.count} uploads</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-primary border-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp size={22} className="text-emerald-400" />
              <span className="text-lg font-bold text-white font-poppins">
                Top Contributors
              </span>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {contributorData.map((student, index) => (
              <div>
                <div
                  key={index}
                  onClick={() => setSelectedStudentId(student.S_ID)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 hover:bg-slate-50/50 hover:border-emerald-100 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {student?.Profile_Pic ? (
                        <img
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-md group-hover:scale-110 transition-transform"
                          src={`${student.Profile_Pic}`}
                          alt="avatar"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-md group-hover:scale-110 transition-transform flex items-center justify-center`}
                        >
                          {student.Name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div
                        className={`absolute -top-2 -right-2 w-6 h-6 ${index == 0 ? "bg-yellow-400" : index == 1 ? "bg-slate-300" : "bg-orange-400"} text-white text-[10px] font-black rounded-lg flex items-center justify-center border-2 border-white shadow-sm`}
                      >
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-800 tracking-tight">
                        {student.Name?.charAt(0).toUpperCase() +
                          student.Name?.slice(1)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        {student.Degree_Name}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-emerald-600">
                    {student.grand_total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedStudentId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedStudentId(null)
          }
        >
          <div className="relative bg-[#f8faf8] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden">
            <StudentProfile
              id={selectedStudentId}
              onClose={() => setSelectedStudentId(null)}
            />
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-primary border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <Calendar size={16} />

            <span className="text-lg font-bold font-poppins">
              Recent Activities
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterOpen(true)}
              className="relative flex items-center gap-1.5 bg-green-800 px-4 py-1.5 rounded-lg text-sm text-white hover:bg-green-700 transition-colors"
            >
              <Filter size={12} /> Filter
              {/* Active filter badge */}
              {Object.values(appliedFilters).some((v) =>
                Array.isArray(v) ? v.length > 0 : v,
              ) && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] uppercase text-gray-400 font-black bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">User</th>

                <th className="px-6 py-4">Action</th>

                <th className="px-6 py-4">Category</th>

                <th className="px-6 py-4">Timestamp</th>

                <th className="px-6 py-4">Status</th>

                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-gray-50">
              {paginatedActivities.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {row?.profile_pic ? (
                        <img
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-md group-hover:scale-110 transition-transform"
                          src={`${row.profile_pic}`}
                          alt=""
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-md group-hover:scale-110 transition-transform flex items-center justify-center`}
                        >
                          {row.student_name?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <span className="font-bold text-slate-700">
                        {row.student_name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const ActivityIcon = getActivityIcon(row.activity_type);
                        return (
                          <ActivityIcon size={16} className="text-gray-400" />
                        );
                      })()}
                      <span>{row.title_or_action}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-black px-2 py-1 rounded-md border ${getActivityBadgeColor(row.activity_type)}`}
                    >
                      {row.activity_type}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-400 text-xs font-medium">
                    {new Date(row.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-1.5 font-bold text-xs ${row.status == 1 ? "text-green-300" : "text-red-300"}`}
                    >
                      <Circle size={8} fill="currentColor" />{" "}
                      {row.status ? "Active" : "Blocked"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                      onClick={() =>
                        setSelectedActivityStudentId(row.student_id)
                      }
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedActivityStudentId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setSelectedActivityStudentId(null)
            }
          >
            <div className="relative bg-[#f8faf8] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <StudentProfile
                id={selectedActivityStudentId}
                onClose={() => setSelectedActivityStudentId(null)}
              />
            </div>
          </div>
        )}
        {paginatedActivities.length > 0 && (
          <div className="p-4 flex justify-between items-center border-t border-gray-100 bg-gray-50/30">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
              Showing{" "}
              <span className="text-gray-600">
                {filteredActivities.length === 0
                  ? 0
                  : (currentPage - 1) * ACTIVITIES_PER_PAGE + 1}
                –
                {Math.min(
                  currentPage * ACTIVITIES_PER_PAGE,
                  filteredActivities.length,
                )}
              </span>{" "}
              of{" "}
              <span className="text-gray-600">{filteredActivities.length}</span>{" "}
              activities
              {filteredActivities.length !== recentActivities.length && (
                <span className="text-amber-500 ml-1">
                  (filtered from {recentActivities.length})
                </span>
              )}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-white hover:text-gray-600 transition-all disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Smart Pagination with ellipsis */}
              {(() => {
                const getPageNumbers = () => {
                  const pages = [];

                  if (totalPages <= 5) {
                    // Show all pages if 5 or less
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    // Always show first page
                    pages.push(1);

                    if (currentPage > 3) pages.push("...");

                    // Show pages around current
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);
                    for (let i = start; i <= end; i++) pages.push(i);

                    if (currentPage < totalPages - 2) pages.push("...");

                    // Always show last page
                    pages.push(totalPages);
                  }

                  return pages;
                };

                return getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="h-8 w-8 flex items-center justify-center text-xs text-gray-400 font-bold"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all
          ${
            currentPage === page
              ? "bg-green-900 text-white shadow-sm shadow-green-200"
              : "text-gray-500 hover:bg-gray-100 border border-gray-200"
          }`}
                    >
                      {page}
                    </button>
                  ),
                );
              })()}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-white hover:text-gray-600 transition-all disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      <ActivityFilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={() => {
          setAppliedFilters(filters);
          setCurrentPage(1);
        }}
        onReset={() => {
          const empty = {
            types: [],
            statuses: [],
            studentName: "",
            dateFrom: "",
            dateTo: "",
          };
          setFilters(empty);
          setAppliedFilters(empty);
          setCurrentPage(1);
        }}
      />
    </section>
  );
};

export default AdminDash;
