import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ListFilter, 
  Filter, 
  Edit3, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Moon 
} from 'lucide-react';

const ComplaintDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [scrolled, setScrolled] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tempStatus, setTempStatus] = useState("");
  const [currentTab, setCurrentTab] = useState("Admin");

  // 1. PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Show 4 rows at a time

  const [complaints, setComplaints] = useState([
    { id: '#CMP-4582', name: 'Alex Thompson', category: 'Resource Access', date: 'Oct 24, 2023', status: 'PENDING' },
    { id: '#CMP-4579', name: 'Sarah Jenkins', category: 'Group Conflict', date: 'Oct 22, 2023', status: 'IN PROGRESS' },
    { id: '#CMP-4575', name: 'Michael Chen', category: 'Technical Issue', date: 'Oct 20, 2023', status: 'RESOLVED' },
    { id: '#CMP-4570', name: 'Emma Rodriguez', category: 'Other', date: 'Oct 18, 2023', status: 'HIGH PRIORITY' },
    { id: '#CMP-4565', name: 'John Doe', category: 'Technical', date: 'Oct 15, 2023', status: 'RESOLVED' },
    { id: '#CMP-4560', name: 'Jane Smith', category: 'Academic', date: 'Oct 12, 2023', status: 'PENDING' },
  ]);

  // --- 2. PAGINATION LOGIC ---
  const totalPages = Math.ceil(complaints.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = complaints.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // --- SCROLL EFFECT ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- HELPERS ---
  const getStatusStyles = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]';
      case 'IN PROGRESS': return 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]';
      case 'RESOLVED': return 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
      case 'HIGH PRIORITY': return 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSave = (id) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: tempStatus } : c));
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins max-h-max">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#1A3C20] overflow-hidden pt-60">

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[100px]">
            <path fill="#FFFBEB" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* 2. TABLE SECTION */}
      <div className="max-w-6xl mx-auto -mt-20 relative z-30 mb-20 px-4 md:px-0">
        {currentTab === "Admin" ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-[#1A3C20] p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-white font-bold tracking-widest uppercase text-[30px]">Complaint Management</h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                  <input placeholder="Search complaints..." className="bg-white/10 border border-white/20 rounded-lg py-1.5 pl-9 pr-4 text-[11px] text-white placeholder:text-white/40 focus:outline-none" />
                </div>
                <button className="flex items-center gap-2 bg-white text-[#1A3C20] px-4 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-sm"><ListFilter size={14} /> Category</button>
                <button className="flex items-center gap-2 bg-white text-[#1A3C20] px-4 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-sm"><Filter size={14} /> Filter</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Complaint ID</th>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentComplaints.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-bold text-[#1A3C20]">{item.id}</td>
                      <td className="px-6 py-5 text-sm text-gray-700 font-medium">{item.name}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{item.category}</td>
                      
                      <td className="px-6 py-5">
                        {editingId === item.id ? (
                          <div className="relative inline-block w-40 animate-in fade-in duration-200">
                            <select 
                              value={tempStatus} 
                              onChange={(e) => setTempStatus(e.target.value)}
                              className={`w-full appearance-none px-4 py-1.5 rounded-full text-[10px] font-black border-2 outline-none cursor-pointer pr-10 ${getStatusStyles(tempStatus)}`}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="IN PROGRESS">IN PROGRESS</option>
                              <option value="RESOLVED">RESOLVED</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                          </div>
                        ) : (
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border tracking-wider inline-block min-w-[110px] text-center ${getStatusStyles(item.status)}`}>
                            {item.status}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-right">
                        {editingId === item.id ? (
                          <div className="flex justify-end gap-3 items-center">
                            <button onClick={() => handleSave(item.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-bold shadow-md hover:bg-blue-700 transition-all">Save</button>
                            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 text-[10px] font-bold">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingId(item.id); setTempStatus(item.status); }} className="text-gray-300 hover:text-[#1A3C20] transition-colors"><Edit3 size={18} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- WORKING PAGINATION FOOTER --- */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase">
              <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, complaints.length)} of {complaints.length}</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`p-1 rounded border border-transparent transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:border-gray-200 text-[#1A3C20]'}`}
                >
                  <ChevronLeft size={14}/>
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-2.5 py-1 rounded transition-all ${currentPage === index + 1 ? 'bg-[#1A3C20] text-white' : 'hover:bg-white text-gray-600'}`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-1 rounded border border-transparent transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:border-gray-200 text-[#1A3C20]'}`}
                >
                  <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-20 text-center shadow-2xl">
             <h2 className="text-[#1A3C20] font-black text-2xl uppercase tracking-widest">Navigation Menu</h2>
          </div>
        )}
      </div>

      <footer className="py-12 text-center text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">
        © 2026 IDEA GROOVE COLLABORATIVE PLATFORM ● ADMIN PORTAL
      </footer>
    </div>
  );
};

export default ComplaintDashboard;