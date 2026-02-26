import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import DashboardUsers from "../../components/admin/DashboardUsers";
import EmailConfirmationModal from "../../components/admin/EmailConfirmationModal";

export const dashboardUserStats = [
  {
    title: "Total Users",
    value: "",
    infoText: "+5% this month",
    color: "green",
    type: "total",
  },
  {
    title: "Active Users",
    value: "",
    infoText: "Currently active",
    color: "yellow",
    type: "pending",
  },
  {
    title: "Inactive Users",
    value: "",
    infoText: "Needs attention",
    color: "red",
    type: "blocked",
  },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(dashboardUserStats);
  const [degreeOptions, setDegreeOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/students/all");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        const activeCount = data.filter((u) => u.is_Active === 1).length;
        const inactiveCount = data.filter((u) => u.is_Active !== 1).length;
        const formattedYears = [
          ...new Set(
            data.map((d) => {
              const year = String(d.Year);

              if (year.length === 4) {
                const start = "20" + year.slice(0, 2);
                const end = "20" + year.slice(2, 4);
                return `${start}-${end}`;
              }

              return year; // fallback if already formatted
            }),
          ),
        ];

        setYearOptions(formattedYears);
        setStats([
          { ...stats[0], value: data.length },
          { ...stats[1], value: activeCount },
          { ...stats[2], value: inactiveCount },
        ]);

        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchDegree = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/degreeSubject/allDegreeSubject`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch degrees");
        }

        const data = await response.json();
        const formattedDegrees = [
          ...new Set(data.degreeSubject.map((d) => d.degree_name)),
        ];

        setDegreeOptions(formattedDegrees);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDegree();
  }, []);

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
          u.S_ID === targetId
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

      <StatsRow stats={stats} />

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
