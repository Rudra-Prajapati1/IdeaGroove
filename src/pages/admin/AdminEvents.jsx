import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminEventsGrid from "../../components/admin/AdminEventsGrid";

// Move initial data here to manage status globally
const initialEvents = [
  { id: 1, Description: "React Workshop", Event_Date: "2026-08-25", Added_By: "Tech Club", status: "active" },
  { id: 2, Description: "Hackathon 2026", Event_Date: "2026-09-10", Added_By: "CSI Chapter", status: "blocked" },
  { id: 3, Description: "Career Guidance Seminar", Event_Date: "2026-08-05", Added_By: "Placement Cell", status: "active" },
  { id: 4, Description: "AI & ML Bootcamp", Event_Date: "2026-10-01", Added_By: "AI Club", status: "active" },
  { id: 5, Description: "Open Source Contribution Day", Event_Date: "2026-07-20", Added_By: "Developer Society", status: "blocked" },
];

export const eventsStats = [
  { title: "Total Events", value: "128", infoText: "+6 new events", color: "green", type: "total" },
  { title: "Active Events", value: "42", infoText: "Currently ongoing", color: "yellow", type: "pending" },
  { title: "Expired Events", value: "86", infoText: "Completed", color: "red", type: "blocked" },
];

const AdminEvents = () => {
  const [events, setEvents] = useState(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- MODAL STATE ---
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null); 
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const filterOptions = ["Active", "Blocked"];

  const handleModerateRequest = (type, eventId) => {
    setSelectedAction(type);
    setTargetId(eventId);
    setModalOpen(true);
    setReason(type === "block" 
      ? "This event has been blocked due to a policy violation or incorrect details." 
      : "The event has been reviewed and reinstated successfully."
    );
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API logic
    setTimeout(() => {
      setEvents((prev) => 
        prev.map((ev) => ev.id === targetId ? { ...ev, status: selectedAction === "block" ? "blocked" : "active" } : ev)
      );

      toast.success(`Event ${selectedAction}ed successfully!`);
      setModalOpen(false);
      setLoading(false);
      setReason("");
    }, 1000);
  };

  return (
    <section className="flex flex-col gap-6 relative min-h-screen">
      <AdminPageHeader
        title="Events Management"
        subtitle="Create, monitor, and manage platform events"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        onFilter={setStatusFilter}
        filterOptions={filterOptions}
      />

      <StatsRow stats={eventsStats} />

      <AdminEventsGrid
        events={events}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onModerate={handleModerateRequest}
      />

      {/* MODERATION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 border border-gray-100">
            
            <div className={`p-6 text-white flex justify-between items-center ${selectedAction === 'block' ? 'bg-red-600' : 'bg-[#1B431C]'}`}>
              <div className="flex items-center gap-3">
                {selectedAction === 'block' ? <Ban className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                <h2 className="text-xl font-bold font-poppins capitalize">{selectedAction} Event</h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleActionSubmit} className="p-6 flex flex-col gap-5">
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3 text-xs text-blue-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Inform the event organizer why the status changed. This will be sent to their email.</p>
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

export default AdminEvents;