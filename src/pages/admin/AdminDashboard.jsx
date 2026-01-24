import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import DashboardUsers from "../../components/admin/DashboardUsers";

// Initial user data moved here to allow global state management
const initialUsersData = [
  {
    id: 1,
    name: "Rohan Sharma",
    username: "rohan_s", // Mapping to Username (VARCHAR 25)
    rollNo: "CS2024001", // Mapping to Roll_No (VARCHAR 15)
    email: "rohan@gmail.com",
    year: 3, // Mapping to Year (INT)
    degree: "B.Tech", // Mapping to Degree_ID Reference
    status: "active", // Mapping to is_Active (BOOLEAN)
  },
  {
    id: 2,
    name: "Aisha Khan",
    username: "aisha_k",
    rollNo: "CS2024002",
    email: "aisha@gmail.com",
    year: 2,
    degree: "BCA",
    status: "inactive",
  },

  {
    id: 3,
    name: "Kunal Verma",
    username: "kunalVV",
    rollNo: "BCA17326",
    email: "kunal@gmail.com",
    year: 2,
    degree: "BCA",
    status: "inactive",
  },
  {
    id: 4,
    name: "Neha Patel",
    username: "nehapatel", // Mapping to Username (VARCHAR 25)
    rollNo: "23BCA001", // Mapping to Roll_No (VARCHAR 15)
    email: "patelneha@gmail.com",
    year: 3, // Mapping to Year (INT)
    degree: "BCA", // Mapping to Degree_ID Reference
    status: "active", // Mapping to is_Active (BOOLEAN)
  },
  {
    id: 2,
    name: "Arjun Mehta",
    username: "mehta_arjun",
    rollNo: "CS2024010",
    email: "mehta@gmail.com",
    year: 2,
    degree: "BCA",
    status: "inactive",
  },
];

export const dashboardUserStats = [
  {
    title: "Total Users",
    value: "1,240",
    infoText: "+5% this month",
    color: "green",
    type: "total",
  },
  {
    title: "Active Users",
    value: "980",
    infoText: "Currently active",
    color: "yellow",
    type: "pending",
  },
  {
    title: "Inactive Users",
    value: "260",
    infoText: "Needs attention",
    color: "red",
    type: "blocked",
  },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState(initialUsersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const degreeOptions = ["B.Tech", "BCA", "MCA"];
  const yearOptions = ["1", "2", "3", "4"];

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleModerateRequest = (type, userId) => {
    setSelectedAction(type);
    setTargetId(userId);
    setModalOpen(true);
    setReason(
      type === "block"
        ? "Your account access has been restricted due to a violation of our community standards or platform policies."
        : "Your account access has been reviewed and reinstated. You can now log in normally.",
    );
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetId
            ? {
                ...u,
                status: selectedAction === "block" ? "inactive" : "active",
              }
            : u,
        ),
      );

      toast.success(
        `User ${selectedAction === "block" ? "Blocked" : "Unblocked"} successfully!`,
      );
      setModalOpen(false);
      setLoading(false);
      setReason("");
    }, 1000);
  };

  return (
    <section className="flex flex-col gap-8 relative min-h-screen">
      <AdminPageHeader
        title="Users Management"
        subtitle="Comprehensive Student Directory"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        degreeOptions={degreeOptions}
        subjectOptions={yearOptions}
        onDegreeFilter={setDegreeFilter}
        onSubjectFilter={setYearFilter}
        secondTitle="All Years"
      />

      <StatsRow stats={dashboardUserStats} />

      <DashboardUsers
        users={users}
        searchTerm={searchTerm}
        filterDegree={degreeFilter}
        filterYear={yearFilter}
        onModerate={handleModerateRequest}
      />

      {/* --- CONSISTENT MODERATION MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 border border-gray-100 font-inter">
            {/* Header: Red for Block, Green for Unblock */}
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
                  {selectedAction} User
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-all"
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
                  An automated notice will be sent to the user regarding this
                  status change.
                </p>
              </div>

              <textarea
                rows="4"
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none focus:border-[#1B431C]/40 text-sm resize-none"
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
                  disabled={loading}
                  className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all ${selectedAction === "block" ? "bg-red-600 shadow-red-100" : "bg-[#1B431C] shadow-green-100"}`}
                >
                  {loading ? (
                    "Updating..."
                  ) : (
                    <>
                      Confirm & Send <Send className="ml-2 w-4 h-4 inline" />
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

export default AdminDashboard;
