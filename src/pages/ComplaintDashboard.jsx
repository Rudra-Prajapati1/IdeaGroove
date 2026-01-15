import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ListFilter, 
  Filter, 
  Edit3, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  MessageCircle,
  Clock,
  User,
  Calendar
} from 'lucide-react';

const ComplaintDashboard = () => {
  const [editingId, setEditingId] = useState(null);
  const [tempStatus, setTempStatus] = useState("");
  const [currentTab, setCurrentTab] = useState("Admin");
  
  // --- STATE FOR EXPANSION ---
  const [expandedId, setExpandedId] = useState(null);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [complaints, setComplaints] = useState([
    { id: '#CMP-4582', name: 'Alex Thompson', category: 'Resource Access', date: 'Oct 24, 2023', status: 'PENDING', description: "The student is unable to access the data science modules from the hostel Wi-Fi. It keeps showing a 403 Forbidden error." },
    { id: '#CMP-4579', name: 'Sarah Jenkins', category: 'Group Conflict', date: 'Oct 22, 2023', status: 'IN PROGRESS', description: "Conflict in BCA group project regarding task distribution. Sarah reports that other members are not contributing to the coding phase." },
    { id: '#CMP-4575', name: 'Michael Chen', category: 'Technical Issue', date: 'Oct 20, 2023', status: 'RESOLVED', description: "Login credentials for the PagePause admin portal were not working. Password has been reset manually." },
    { id: '#CMP-4570', name: 'Emma Rodriguez', category: 'Other', date: 'Oct 18, 2023', status: 'HIGH PRIORITY', description: "Request for an urgent meeting regarding scholarship documentation deadlines." },
    { id: '#CMP-4565', name: 'John Doe', category: 'Technical', date: 'Oct 15, 2023', status: 'RESOLVED', description: "Lab 3 computer #14 monitor flickering issue resolved." },
    { id: '#CMP-4560', name: 'Jane Smith', category: 'Academic', date: 'Oct 12, 2023', status: 'PENDING', description: "Query regarding credit transfer from previous semester." },
  ]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(complaints.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = complaints.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedId(null); // Close any expanded row when moving to a new page
  };

  const toggleRow = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]';
      case 'IN PROGRESS': return 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]';
      case 'RESOLVED': return 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
      case 'HIGH PRIORITY': return 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <section className="relative bg-[#1A3C20] pt-40 pb-20">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[100px]">
            <path fill="#FFFBEB" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      <div className="max-w-6xl mx-auto -mt-20 relative z-30 px-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#1A3C20] p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-white font-bold tracking-widest uppercase text-xl">Complaint Management</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                <input placeholder="Search complaints..." className="bg-white/10 border border-white/20 rounded-lg py-1.5 pl-9 pr-4 text-[11px] text-white placeholder:text-white/40 focus:outline-none" />
              </div>
              <button className="flex items-center gap-2 bg-white text-[#1A3C20] px-4 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-sm"><ListFilter size={14} /> Category</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4 w-10"></th>
                  <th className="px-6 py-4">Complaint ID</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentComplaints.map((item) => (
                  <React.Fragment key={item.id}>
                    {/* Main Row */}
                    <tr 
                      onClick={() => toggleRow(item.id)}
                      className={`cursor-pointer transition-all duration-200 ${expandedId === item.id ? 'bg-green-50/30' : 'hover:bg-gray-50/50'}`}
                    >
                      <td className="px-6 py-5">
                        <div className={`p-1 rounded-full transition-all duration-300 ${expandedId === item.id ? 'rotate-90 bg-[#1A3C20] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <ChevronRight size={14} />
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-[#1A3C20]">{item.id}</td>
                      <td className="px-6 py-5 text-sm text-gray-700 font-medium">{item.name}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{item.category}</td>
                      <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border tracking-wider inline-block min-w-[110px] text-center ${getStatusStyles(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button className="text-gray-300 hover:text-[#1A3C20] transition-colors"><Edit3 size={18} /></button>
                      </td>
                    </tr>

                    {/* Expandable Details Area */}
                    {expandedId === item.id && (
                      <tr className="bg-gray-50/50">
                        <td colSpan="6" className="px-12 py-8 border-l-4 border-l-[#1A3C20] animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex flex-col gap-6">
                            <div>
                              <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                <MessageCircle size={14} /> Issue Details
                              </h4>
                              <p className="text-gray-700 text-sm leading-relaxed bg-white p-5 rounded-2xl border border-gray-100 shadow-sm max-w-4xl">
                                {item.description}
                              </p>
                            </div>
                            <div className="flex gap-10">
                              <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                  <Calendar size={12} /> Filed On
                                </h4>
                                <p className="text-xs font-bold text-[#1A3C20]">{item.date}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- RESTORED PAGINATION FOOTER --- */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, complaints.length)} of {complaints.length} Entries</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white text-[#1A3C20]'}`}
              >
                <ChevronLeft size={16}/>
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-8 h-8 rounded-lg transition-all ${currentPage === index + 1 ? 'bg-[#1A3C20] text-white shadow-lg' : 'hover:bg-white text-gray-400'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white text-[#1A3C20]'}`}
              >
                <ChevronRight size={16}/>
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-12 text-center text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">
        © 2026 IDEA GROOVE COLLABORATIVE PLATFORM ● ADMIN PORTAL
      </footer>
    </div>
  );
};

export default ComplaintDashboard;