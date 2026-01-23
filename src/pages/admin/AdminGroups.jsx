import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminGroupsGrid from "../../components/admin/AdminGroupsGrid";

// Move initial data here to manage status globally
const initialGroups = [
  { id: 1, Room_Name: "DSA Warriors", Based_On: "Competitive Programming", Created_By: "Ankit Patel", Created_On: "2025-01-10", status: "active" },
  { id: 2, Room_Name: "Final Year Projects", Based_On: "Academics", Created_By: "College Admin", Created_On: "2024-11-02", status: "active" },
  { id: 3, Room_Name: "Old Syllabus Help", Based_On: "Academics", Created_By: "Unknown", Created_On: "2024-05-18", status: "blocked" },
  { id: 4, Room_Name: "AI Enthusiasts", Based_On: "Artificial Intelligence", Created_By: "Neha Patel", Created_On: "2025-03-01", status: "active" },
  { id: 5, Room_Name: "Web Dev Circle", Based_On: "Web Development", Created_By: "Rohan Sharma", Created_On: "2025-02-14", status: "blocked" },
];

export const groupsStats = [
  { title: "Total Groups", value: "324", infoText: "+18 new groups", color: "green", type: "total" },
  { title: "Active Groups", value: "286", infoText: "Engaging groups", color: "yellow", type: "pending" },
  { title: "Inactive Groups", value: "38", infoText: "No recent activity", color: "red", type: "blocked" },
];

const AdminGroups = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // --- MODAL STATE ---
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null); 
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const filterOptions = ["Competitive Programming", "Academics", "Artificial Intelligence", "Web Development"];

  const handleModerateRequest = (type, groupId) => {
    setSelectedAction(type);
    setTargetId(groupId);
    setModalOpen(true);
    setReason(type === "block" 
      ? "This group has been restricted due to inactivity or violation of community standards." 
      : "This group has been reviewed and reinstated for community engagement."
    );
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API logic
    setTimeout(() => {
      setGroups((prev) => 
        prev.map((g) => g.id === targetId ? { ...g, status: selectedAction === "block" ? "blocked" : "active" } : g)
      );

      toast.success(`Group ${selectedAction}ed successfully!`);
      setModalOpen(false);
      setLoading(false);
      setReason("");
    }, 1000);
  };

  return (
    <section className="flex flex-col gap-6 relative min-h-screen">
      <AdminPageHeader
        title="Groups Management"
        subtitle="Manage student groups and monitor engagement"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        onFilter={setCategoryFilter}
        filterOptions={filterOptions}
      />

      <StatsRow stats={groupsStats} />

      <AdminGroupsGrid
        groups={groups}
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        onModerate={handleModerateRequest}
      />

      {/* MODERATION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 border border-gray-100">
            
            <div className={`p-6 text-white flex justify-between items-center ${selectedAction === 'block' ? 'bg-red-600' : 'bg-[#1B431C]'}`}>
              <div className="flex items-center gap-3">
                {selectedAction === 'block' ? <Ban className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                <h2 className="text-xl font-bold font-poppins capitalize">{selectedAction} Group</h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleActionSubmit} className="p-6 flex flex-col gap-5">
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3 text-xs text-blue-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Inform the group creator why the status changed. This will be sent to their dashboard notifications.</p>
              </div>
              <textarea 
                rows="4"
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none focus:border-[#1B431C]/40 text-sm resize-none font-inter"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 font-bold text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                <button className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all ${selectedAction === 'block' ? 'bg-red-600 shadow-red-100' : 'bg-[#1B431C] shadow-green-100'}`}>
                  {loading ? "Updating..." : <>Send <Send className="ml-2 w-4 h-4 inline" /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminGroups;