import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminGroupsGrid from "../../components/admin/AdminGroupsGrid";
import EmailConfirmationModal from "../../components/admin/EmailConfirmationModal";

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

      <EmailConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleActionSubmit}
        actionType={selectedAction}
        targetType="Notes"
        reason={reason}
        setReason={setReason}
        loading={loading}
      />
    </section>
  );
};

export default AdminGroups;
