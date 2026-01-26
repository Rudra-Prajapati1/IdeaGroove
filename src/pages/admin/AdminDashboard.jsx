import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import DashboardUsers from "../../components/admin/DashboardUsers";
import EmailConfirmationModal from "../../components/admin/EmailConfrimationModal";

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

     <EmailConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleActionSubmit}
        actionType={selectedAction}
        targetType="User"
        reason={reason}
        setReason={setReason}
        loading={loading}
      />
    </section>
  );
};

export default AdminDashboard;
