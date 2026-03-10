import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminComplaintsGrid from "../../components/admin/AdminComplaintsGrid";
import toast from "react-hot-toast";
import ComplaintEmail from "../../components/admin/ComplaintEmail";
import { useEffect } from "react";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [complaintsStats, setComplaintsStats] = useState([
    { title: "Total Complaints", value: "0", color: "green", type: "total" },
    { title: "Resolved", value: "0", color: "yellow", type: "pending" },
    { title: "Pending", value: "0", color: "red", type: "blocked" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/complaints`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const complaintsArray = Array.isArray(data)
          ? data
          : data.complaints || data.data || [];
        setComplaintsStats([
          { ...complaintsStats[0], value: complaintsArray.length },
          {
            ...complaintsStats[1],
            value: complaintsArray.filter((c) => c.Status === "Resolved")
              .length,
          },
          {
            ...complaintsStats[2],
            value: complaintsArray.filter(
              (c) => c.Status === "Pending" || c.Status === "In-Progress",
            ).length,
          },
        ]);
        setComplaints(complaintsArray);
      } catch (err) {
        console.error("Not able to fetch complaints: ", err);
      }
    };
    fetchComplaints();
  }, []);

  console.log(complaints);

  const handleStatusRequest = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.Status);
    setModalOpen(true);
    setReason("");
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Update status in DB
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/complaints/update-status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedComplaint.Complaint_ID,
            status: newStatus,
            reason: reason,
          }),
        },
      );

      const data = await res.json();

      if (data.message) {
        // 2. Update local state
        setComplaints((prev) =>
          prev.map((c) =>
            c.Complaint_ID === selectedComplaint.Complaint_ID
              ? { ...c, Status: newStatus }
              : c,
          ),
        );

        // 3. Update stats
        setComplaintsStats((prevStats) => {
          const updatedList = complaints.map((c) =>
            c.Complaint_ID === selectedComplaint.Complaint_ID
              ? { ...c, Status: newStatus }
              : c,
          );
          return [
            { ...prevStats[0] },
            {
              ...prevStats[1],
              value: updatedList.filter((c) => c.Status === "Resolved").length,
            },
            {
              ...prevStats[2],
              value: updatedList.filter(
                (c) => c.Status === "Pending" || c.Status === "In-Progress",
              ).length,
            },
          ];
        });

        toast.success(
          `Complaint marked as ${newStatus} — email sent to student!`,
        );
        setModalOpen(false);
        setReason("");
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 relative min-h-screen">
      <AdminPageHeader
        title="Complaints Resolution"
        subtitle="Track and resolve student grievances"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        degreeOptions={["Notes", "QnA", "User", "Groups", "Other"]}
        subjectOptions={["Pending", "In-Progress", "Resolved"]}
        onDegreeFilter={setTypeFilter}
        onSubjectFilter={setStatusFilter}
        firstTitle="All Types"
        secondTitle="All Progress"
      />

      <StatsRow stats={complaintsStats} />
      <AdminComplaintsGrid
        complaints={complaints}
        searchTerm={searchTerm}
        filterType={typeFilter}
        filterStatus={statusFilter}
        onStatusRequest={handleStatusRequest}
      />

      <ComplaintEmail
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleStatusUpdate}
        actionType="update"
        targetType="Complaint Status"
        loading={loading}
      >
        <select
          className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none text-sm font-bold focus:border-[#1B431C]/30"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </ComplaintEmail>
    </section>
  );
};

export default AdminComplaints;
