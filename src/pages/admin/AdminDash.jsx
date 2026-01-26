import React from "react";
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
  // Added icons for the table
  Eye,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminDash = () => {
  const categories = [
    { name: "Notes", percentage: 45, color: "bg-rose-600" },
    { name: "Question", percentage: 30, color: "bg-blue-600" },
    { name: "Events", percentage: 15, color: "bg-amber-500" },
    { name: "Groups", percentage: 10, color: "bg-purple-600" },
  ];

  const stats = [
    { label: "Total Users", value: "5,240", color: "emerald", icon: Users, desc: "Active scholars" },
    { label: "Total Notes", value: "1,248", color: "rose", icon: Notebook, desc: "Notes Uploaded" },
    { label: "Total Questions", value: "1,200", color: "blue", icon: FileText, desc: "Community queries" },
    { label: "Active Groups", value: "85", color: "purple", icon: UsersRound, desc: "Study circles" },
    { label: "Upcoming Events", value: "14", color: "amber", icon: Calendar, desc: "Next 7 days" },
    { label: "Complaints", value: "450", color: "orange", icon: AlertTriangle, desc: "Unresolved issues" },
  ];

  // --- Data for Recent Activities Table ---
  const recentActivities = [
    {
      id: 1,
      user: "Elena Gilbert",
      action: 'Created new study group: "Finals Prep"',
      category: "Groups",
      timestamp: "2 mins ago",
      avatar: "https://i.pravatar.cc/150?u=Elena",
    },
    {
      id: 2,
      user: "Tyler Lockwood",
      action: 'Reported a post in "Social"',
      category: "COMPLAINT",
      timestamp: "14 mins ago",
      status: "Pending Review",
      avatar: "https://i.pravatar.cc/150?u=Tyler",
    },
    {
      id: 3,
      user: "Damon Salvatore",
      action: 'Uploaded a notes "Python"',
      category: "Notes",
      timestamp: "45 mins ago",
      status: "Live",
      avatar: "https://i.pravatar.cc/150?u=Damon",
    },
  ];

  const getTheme = (color) => {
    const themes = {
      emerald: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", bar: "bg-emerald-500" },
      rose: { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", bar: "bg-rose-500" },
      blue: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", bar: "bg-blue-500" },
      purple: { text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", bar: "bg-purple-500" },
      amber: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", bar: "bg-amber-500" },
      orange: { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", bar: "bg-orange-500" },
    };
    return themes[color] || themes.emerald;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-8 font-sans text-slate-700">
      <AdminPageHeader title="Admin Overview" subtitle="Real-time analytics & platform health" />

      {/* --- Scorecards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((card, idx) => {
          const theme = getTheme(card.color);
          return (
            <div key={idx} className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${theme.bg} ${theme.text} transition-transform group-hover:scale-110 duration-300`}>
                    <card.icon size={22} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">{card.value}</h2>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium italic">{card.desc}</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50">
                <div className={`h-full transition-all duration-1000 w-0 group-hover:w-full ${theme.bar}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Content Distribution Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
          <div className="bg-[#062D1C] text-white px-6 py-4 font-bold text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" />
              Content Distribution
            </div>
          </div>
          <div className="p-8 flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="relative w-52 h-52 transition-transform duration-500 group-hover:rotate-12">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#F1F5F9" strokeWidth="3"></circle>
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#E11D48" strokeWidth="4" strokeDasharray="45 100" strokeDashoffset="0"></circle>
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#2563eb" strokeWidth="4" strokeDasharray="30 100" strokeDashoffset="-45"></circle>
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-75"></circle>
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#7c3aed" strokeWidth="4" strokeDasharray="10 100" strokeDashoffset="-90"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-slate-800 tracking-tighter">1.2k</span>
                <span className="text-[9px] uppercase text-slate-400 font-black tracking-[0.2em]">Total Uploads</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
              {categories.map((cat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                      <span className="text-slate-600 font-bold text-xs uppercase tracking-wider">{cat.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-800">{cat.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} transition-all duration-1000 ease-out`} style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Contributors Leaderboard */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-[#062D1C] text-white px-6 py-4 font-bold text-sm flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" />
            Top Contributors
          </div>
          <div className="p-4 space-y-4">
            {[
              { name: "Alex Johnson", dept: "CS Dept.", pts: 980, rank: 1, color: "bg-yellow-400" },
              { name: "Sarah Chen", dept: "Business", pts: 945, rank: 2, color: "bg-slate-300" },
              { name: "Michael Brown", dept: "Biotech", pts: 910, rank: 3, color: "bg-orange-400" },
            ].map((student, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 hover:bg-slate-50/50 hover:border-emerald-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-md group-hover:scale-110 transition-transform" src={`https://i.pravatar.cc/150?u=${student.name}`} alt="avatar" />
                    <div className={`absolute -top-2 -right-2 w-6 h-6 ${student.color} text-white text-[10px] font-black rounded-lg flex items-center justify-center border-2 border-white shadow-sm`}>{student.rank}</div>
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-800 tracking-tight">{student.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{student.dept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- NEW: Recent Activities Table --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#062D1C] text-white px-6 py-4 font-bold text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            Recent Activities
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs transition-colors">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs transition-colors">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 font-black">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentActivities.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.avatar} alt="" className="w-8 h-8 rounded-full object-cover shadow-sm" />
                      <span className="font-bold text-sm text-slate-700">{item.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {item.action}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-md tracking-tighter
                      ${item.category === 'Notes' ? 'bg-blue-50 text-blue-600' : 
                        item.category === 'COMPLAINT' ? 'bg-rose-50 text-rose-600' : 
                        'bg-emerald-50 text-emerald-600'}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-bold">
                    {item.timestamp}
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs text-slate-400 font-medium">
            Showing <span className="text-slate-700 font-bold">3</span> of <span className="text-slate-700 font-bold">1,200</span> activities
          </p>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-black px-3 text-slate-800">1</span>
            <button className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;