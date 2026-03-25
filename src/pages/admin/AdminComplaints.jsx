import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminComplaintsGrid from "../../components/admin/AdminComplaintsGrid";
import toast from "react-hot-toast";
import ComplaintEmail from "../../components/admin/ComplaintEmail";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminComplaints,
  selectAdminComplaints,
  selectAdminComplaintsActionStatus,
  selectAdminComplaintsStats,
  updateAdminComplaintStatus,
} from "../../redux/adminSlice/adminComplaintsSlice";

const AdminComplaints = () => {
  const dispatch = useDispatch();
  const complaints = useSelector(selectAdminComplaints);
  const complaintsStats = useSelector(selectAdminComplaintsStats);
  const actionStatus = useSelector(selectAdminComplaintsActionStatus);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    dispatch(fetchAdminComplaints());
  }, [dispatch]);

  const handleStatusRequest = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.Status);
    setModalOpen(true);
    setReason("");
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateAdminComplaintStatus({
          id: selectedComplaint.Complaint_ID,
          status: newStatus,
          reason,
        }),
      ).unwrap();

        // 2. Update local state


        toast.success(
          `Complaint marked as ${newStatus} — email sent to student!`,
        );
        setModalOpen(false);
        setReason("");
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };

  return (
    <section className="flex flex-col gap-6 relative min-h-screen">
      <AdminPageHeader
        title="Complaints Resolution"
        subtitle="Track and resolve student grievances"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        degreeOptions={[
          "Event",
          "Question",
          "Answer",
          "Notes",
          "Groups",
          "User",
          "Other",
        ]}
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
        loading={actionStatus === "loading"}
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
