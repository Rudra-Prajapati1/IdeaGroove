import React from 'react';
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { 
  Users, 
  AlertTriangle, 
  FileText, 
  UsersRound, 
  Calendar, 
  MessageSquare, 
  Search, 
  Bell, 
  CircleHelp,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Circle,
  Notebook
} from 'lucide-react';

const AdminDash = () => {
  const categories = [
    { name: 'Notes', percentage: 45, color: 'bg-green-900', stroke: '#14532d' },
    { name: 'Question', percentage: 30, color: 'bg-green-700', stroke: '#15803d' },
    { name: 'Events', percentage: 15, color: 'bg-green-400', stroke: '#4ade80' },
    { name: 'Groups', percentage: 10, color: 'bg-green-100', stroke: '#dcfce7' },
  ];

  const stats = [
    { label: 'Total Users', value: '5,240', trend: '+2.5%', color: 'text-green-600', icon: Users },
    { label: 'Notes', value: '12', trend: 'Pending', color: 'text-red-500', icon: Notebook, isAlert: true },
    { label: 'Questions', value: '1,200', trend: '+5%', color: 'text-green-600', icon: FileText },
    { label: 'Groups', value: '85', trend: '0%', color: 'text-gray-400', icon: UsersRound },
    { label: 'Events', value: '14', trend: '+2 New', color: 'text-green-600', icon: Calendar },
    { label: 'Complaints', value: '450', trend: '+8%', color: 'text-green-600', icon: AlertTriangle },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 font-sans text-slate-700">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Overview of platform activity"
      />

      {/* --- Top Scorecards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((card, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                  <card.icon size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-500">{card.label}</span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-slate-900">{card.value}</div>
              {/* <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-opacity-10`}>
                {card.isAlert ? <AlertTriangle size={12} /> : <TrendingUp size={12} />}
                {card.trend}
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {/* --- Main Middle Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Post Distribution Section */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-green-900 text-white px-6 py-4 font-bold text-sm flex items-center gap-2">
            <FileText size={16} />
            Post Distribution by Category
          </div>
          <div className="p-8 flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#f3f4f6" strokeWidth="3"></circle>
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#14532d" strokeWidth="3.5" strokeDasharray="45 100" strokeDashoffset="0"></circle>
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#15803d" strokeWidth="3.5" strokeDasharray="30 100" strokeDashoffset="-45"></circle>
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#4ade80" strokeWidth="3.5" strokeDasharray="15 100" strokeDashoffset="-75"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-slate-800">1,200</span>
                <span className="text-[10px] uppercase text-gray-400 font-extrabold tracking-widest">Total Posts</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
              {categories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${cat.color} group-hover:scale-125 transition-transform`}></div>
                    <span className="text-gray-600 font-semibold text-sm">{cat.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top 3 Students */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-green-900 text-white px-6 py-4 font-bold text-sm flex items-center gap-2">
            <TrendingUp size={16} />
            Top 3 Students
          </div>
          <div className="p-4 space-y-3">
            {[
              { name: 'Alex Johnson', dept: 'Computer Science Dept.', pts: 980, rank: 1, color: 'border-yellow-400' },
              { name: 'Sarah Chen', dept: 'Business Management', pts: 945, rank: 2, color: 'border-slate-300' },
              { name: 'Michael Brown', dept: 'Biotechnology', pts: 910, rank: 3, color: 'border-orange-400' },
            ].map((student, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full border-2 ${student.color} p-0.5`}>
                       <img className="w-full h-full rounded-full object-cover bg-gray-100" src={`https://i.pravatar.cc/150?u=${student.name}`} alt="avatar" />
                    </div>
                    <span className={`absolute -bottom-1 -right-1 text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white text-white ${i === 0 ? 'bg-yellow-400' : 'bg-slate-400'}`}>
                      {student.rank}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 leading-tight">{student.name}</p>
                    <p className="text-[11px] text-gray-400 font-medium">{student.dept}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-800 font-black text-sm">{student.pts}</p>
                  <p className="text-[8px] uppercase font-bold text-gray-300 tracking-tighter">Points</p>
                </div>
              </div>
            ))}
            <button className="w-full mt-2 py-2.5 border-2 border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-2">
              View Full Leaderboard <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* --- Recent Activities Table --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-green-900 text-white px-6 py-4 font-bold text-sm flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Recent Activities</span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 bg-green-800 px-3 py-1.5 rounded-lg text-xs hover:bg-green-700 transition-colors">
              <Filter size={12} /> Filter
            </button>
            <button className="flex items-center gap-1.5 bg-green-800 px-3 py-1.5 rounded-lg text-xs hover:bg-green-700 transition-colors">
              <Download size={12} /> Export
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
              {[
                { user: 'Elena Gilbert', action: 'Created new study group: "Finals Prep"', cat: 'ACADEMIC', catColor: 'bg-blue-50 text-blue-600 border-blue-100', time: '2 mins ago', status: 'Live', statusColor: 'text-green-600' },
                { user: 'Tyler Lockwood', action: 'Reported a post in "Social"', cat: 'COMPLAINT', catColor: 'bg-red-50 text-red-600 border-red-100', time: '14 mins ago', status: 'Pending', statusColor: 'text-orange-500' },
                { user: 'Damon Salvatore', action: 'Updated portfolio in "Career Hub"', cat: 'CAREER', catColor: 'bg-emerald-50 text-emerald-600 border-emerald-100', time: '45 mins ago', status: 'Live', statusColor: 'text-green-600' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200" src={`https://i.pravatar.cc/100?u=${row.user}`} alt="" />
                      <span className="font-bold text-slate-700">{row.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{row.action}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md border ${row.catColor}`}>{row.cat}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs font-medium">{row.time}</td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 font-bold text-xs ${row.statusColor}`}>
                      <Circle size={8} fill="currentColor" /> {row.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="p-4 flex justify-between items-center border-t border-gray-100 bg-gray-50/30">
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Showing 3 of 1,200 activities</span>
          <div className="flex gap-2">
            <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-white hover:text-gray-600 transition-all"><ChevronLeft size={16} /></button>
            <button className="px-3 py-1 bg-green-900 text-white rounded-lg text-xs font-bold shadow-sm shadow-green-200">1</button>
            <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-white hover:text-gray-600 transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;