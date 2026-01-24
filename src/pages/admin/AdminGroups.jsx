import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminGroupsGrid from "../../components/admin/AdminGroupsGrid";

const initialGroups = [
  {
    id: 1,
    Room_Name: "DSA Warriors",
    Room_Type: "group",
    Based_On: "Competitive Programming",
    Degree: "B.Tech",
    Created_By: 101,
    Created_By_Name: "Ankit Patel",
    Created_On: "2025-01-10T10:00:00",
    status: "active",
  },

  {
    id: 2,
    Room_Name: "Final Year Projects",
    Room_Type: "group",
    Based_On: "Academics",
    Degree: "B.Tech",
    Created_By: 102,
    Created_By_Name: "College Admin",
    Created_On: "2024-11-02T09:30:00",
    status: "active",
  },

  {
    id: 3,
    Room_Name: "Old Syllabus Help",
    Room_Type: "group",
    Based_On: "Academics",
    Degree: "B.Tech",
    Created_By: 103,
    Created_By_Name: "Unknown",
    Created_On: "2024-05-18T14:45:00",
    status: "blocked",
  },

  {
    id: 4,
    Room_Name: "AI Enthusiasts",
    Room_Type: "group",
    Based_On: "Artificial Intelligence",
    Degree: "B.Tech",
    Created_By: 104,
    Created_By_Name: "Neha Patel",
    Created_On: "2025-03-01T16:10:00",
    status: "active",
  },

  {
    id: 5,
    Room_Name: "Web Dev Circle",
    Room_Type: "group",
    Based_On: "Web Development",
    Degree: "BCA",
    Created_By: 105,
    Created_By_Name: "Rohan Sharma",
    Created_On: "2025-02-14T11:20:00",
    status: "blocked",
  },
];

export const groupsStats = [
  {
    title: "Total Groups",
    value: "324",
    infoText: "+18 new groups",
    color: "green",
    type: "total",
  },
  {
    title: "Active Groups",
    value: "286",
    infoText: "Engaging groups",
    color: "yellow",
    type: "pending",
  },
  {
    title: "Inactive Groups",
    value: "38",
    infoText: "No recent activity",
    color: "red",
    type: "blocked",
  },
];

const AdminGroups = () => {
  const [groups, setGroups] = useState(initialGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // --- MODAL STATE ---
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const degreeOptions = ["B.Tech", "BCA", "MCA", "M.Tech"];
  const categoryOptions = [
    "Competitive Programming",
    "Academics",
    "Artificial Intelligence",
    "Web Development",
  ];

  const handleModerateRequest = (type, groupId) => {
    setSelectedAction(type);
    setTargetId(groupId);
    setModalOpen(true);
    setReason(
      type === "block"
        ? "This group has been restricted due to inactivity or violation of community standards."
        : "This group has been reviewed and reinstated for community engagement.",
    );
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API logic
    setTimeout(() => {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === targetId
            ? {
                ...g,
                status: selectedAction === "block" ? "blocked" : "active",
              }
            : g,
        ),
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
        degreeOptions={degreeOptions}
        subjectOptions={categoryOptions}
        onDegreeFilter={setDegreeFilter}
        onSubjectFilter={setCategoryFilter}
        secondTitle="All Hobbies"
      />

      <StatsRow stats={groupsStats} />
      <AdminGroupsGrid
        groups={groups}
        searchTerm={searchTerm}
        filterDegree={degreeFilter}
        filterCategory={categoryFilter}
        onModerate={handleModerateRequest}
      />

      {/* MODERATION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 border border-gray-100">
            <div
              className={`p-6 text-white flex justify-between items-center ${selectedAction === "block" ? "bg-red-600" : "bg-[#1B431C]"}`}
            >
              <div className="flex items-center gap-3">
                {selectedAction === "block" ? (
                  <Ban className="w-6 h-6" />
                ) : (
                  <CheckCircle className="w-6 h-6" />
                )}
                <h2 className="text-xl font-bold font-poppins capitalize">
                  {selectedAction} Group
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleActionSubmit}
              className="p-6 flex flex-col gap-5"
            >
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3 text-xs text-blue-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  Inform the group creator why the status changed. This will be
                  sent to their dashboard notifications.
                </p>
              </div>
              <textarea
                rows="4"
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none focus:border-[#1B431C]/40 text-sm resize-none font-inter"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 font-bold text-gray-400 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all ${selectedAction === "block" ? "bg-red-600 shadow-red-100" : "bg-[#1B431C] shadow-green-100"}`}
                >
                  {loading ? (
                    "Updating..."
                  ) : (
                    <>
                      Send <Send className="ml-2 w-4 h-4 inline" />
                    </>
                  )}
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
