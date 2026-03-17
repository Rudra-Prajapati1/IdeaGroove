import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Send, Ban, CheckCircle, AlertCircle } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminGroupsGrid from "../../components/admin/AdminGroupsGrid";
import EmailConfirmationModal from "../../components/admin/EmailConfirmationModal";

const AdminGroups = () => {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hobbyFilter, setHobbyFilter] = useState("all");
  const [hobbyOptions, setHobbyOptions] = useState([]);

  // --- MODAL STATE ---
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [groupsStats, setGroupsStats] = useState([
    {
      title: "Total Groups",
      value: 0,
      infoText: "All groups in system",
      color: "green",
      type: "total",
    },
    {
      title: "Active Groups",
      value: 0,
      infoText: "Engaging groups",
      color: "yellow",
      type: "pending",
    },
    {
      title: "Inactive Groups",
      value: 0,
      infoText: "Blocked & Deleted",
      color: "red",
      type: "blocked",
    },
  ]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/groups?page=1&limit=1000",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();

        const formattedGroups = data.data.map((group) => ({
          id: group.Room_ID,
          Name: group.Room_Name,
          Based_On: group.Hobby_Name,
          Based_On_id: group.Based_On,
          Creator_ID: group.Creator_ID,
          Creator_Name: group.Creator_Name,
          Created_On: group.Created_On,
          Member_Count: group.Member_Count,
          Description: group.Description,
          status: group.Is_Active === 1 ? "active" : "blocked",
        }));

        const totalGroups = data.pagination.total || formattedGroups.length;
        const activeGroups = formattedGroups.filter(
          (g) => g.status === "active",
        );
        const blockedGroups = formattedGroups.filter(
          (g) => g.status === "blocked",
        );

        setGroupsStats([
          {
            title: "Total Groups",
            value: totalGroups,
            infoText: `${activeGroups.length} active communities`,
            color: "green",
            type: "total",
          },
          {
            title: "Active Groups",
            value: activeGroups.length,
            infoText: `${totalGroups ? Math.round((activeGroups.length / totalGroups) * 100) : 0}% currently active`,
            color: "yellow",
            type: "pending",
          },
          {
            title: "Inactive Groups",
            value: blockedGroups.length,
            infoText: `${blockedGroups.length} blocked or archived`,
            color: "red",
            type: "blocked",
          },
        ]);
        setGroups(formattedGroups);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/hobbies");

        if (!response.ok) {
          throw new Error("Failed to fetch hobbies");
        }

        const data = await response.json();

        const hobbyNames = data.hobbies.map((hobby) => hobby.Hobby_Name);
        setHobbyOptions(hobbyNames);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHobbies();
  }, []);

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

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/toggle-block`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "group", // Backend expects this type
            id: targetId,
            reason: reason,
          }),
        },
      );

      const data = await res.json();

      if (data.status) {
        // Update local state directly
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

        // Update stats directly without refetching
        setGroupsStats((prevStats) => {
          const newStats = [...prevStats];
          newStats[1].value = groups.filter((g) =>
            g.id === targetId
              ? selectedAction !== "block"
              : g.status === "active",
          ).length;
          newStats[2].value = groups.filter((g) =>
            g.id === targetId
              ? selectedAction === "block"
              : g.status === "blocked",
          ).length;
          return newStats;
        });

        toast.success(`Group ${selectedAction}ed successfully! Email sent.`);
        setModalOpen(false);
        setReason("");
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (err) {
      console.error("Moderation error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 relative min-h-screen">
      <AdminPageHeader
        title="Groups Management"
        subtitle="Manage student groups and monitor engagement"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        hobbyOptions={hobbyOptions}
        onHobbyFilter={setHobbyFilter}
        thirdTitle="All Hobbies"
      />

      <StatsRow stats={groupsStats} />
      <AdminGroupsGrid
        groups={groups}
        searchTerm={searchTerm}
        filterHobby={hobbyFilter}
        onModerate={handleModerateRequest}
      />

      <EmailConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleActionSubmit}
        actionType={selectedAction}
        targetType="Group"
        reason={reason}
        setReason={setReason}
        loading={loading}
      />
    </section>
  );
};

export default AdminGroups;
