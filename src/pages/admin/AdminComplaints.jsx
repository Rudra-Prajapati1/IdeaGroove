import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminComplaintsGrid from "../../components/admin/AdminComplaintsGrid";
import EmailConfirmationModal from "../../components/admin/EmailConfirmationModal";
import toast from "react-hot-toast";

export const complaintsStats = [
  { title: "Total Complaints", value: "1,284", color: "green", type: "total" },
  { title: "Pending", value: "42", color: "yellow", type: "pending" },
  { title: "Resolved", value: "1,242", color: "red", type: "blocked" },
];

const initialComplaintsData = [
  {
    Complaint_ID: 1,
    Student_Name: "Alex Thompson",
    complaintType: "Notes",
    Complaint_Text: "Php notes by @khushal are not valid and contain errors.",
    Date: "2025-10-24T10:30:00",
    Status: "Pending",
  },
  {
    Complaint_ID: 2,
    Student_Name: "Sarah Jenkins",
    complaintType: "QnA",
    Complaint_Text: "QnA by @sejal contains incorrect mathematical formulas.",
    Date: "2025-10-22T14:15:00",
    Status: "In-Progress",
  },
  {
    Complaint_ID: 3,
    Student_Name: "Michael Chen",
    complaintType: "Other",
    Complaint_Text: "Some features are not accessible on mobile browsers.",
    Date: "2025-10-20T16:45:00",
    Status: "Resolved",
  },
  {
    Complaint_ID: 4,
    Student_Name: "Rohan Gupta",
    complaintType: "Groups",
    Complaint_Text: "Spam messages in the 'React Developers' group.",
    Date: "2025-10-19T09:00:00",
    Status: "Pending",
  },
  {
    Complaint_ID: 5,
    Student_Name: "Priya Das",
    complaintType: "User",
    Complaint_Text: "User @john_doe is using abusive language in threads.",
    Date: "2025-10-18T11:20:00",
    Status: "In-Progress",
  },
  {
    Complaint_ID: 6,
    Student_Name: "Kevin Hart",
    complaintType: "Notes",
    Complaint_Text: "The PDF for Biology notes is corrupted.",
    Date: "2025-10-17T15:30:00",
    Status: "Pending",
  },
  {
    Complaint_ID: 7,
    Student_Name: "Aisha Ray",
    complaintType: "QnA",
    Complaint_Text: "Duplicate questions appearing in the Java section.",
    Date: "2025-10-16T12:00:00",
    Status: "Resolved",
  },
  {
    Complaint_ID: 8,
    Student_Name: "Vikram Singh",
    complaintType: "Groups",
    Complaint_Text: "Unable to join the 'Placement Prep' group.",
    Date: "2025-10-15T08:45:00",
    Status: "In-Progress",
  },
  {
    Complaint_ID: 9,
    Student_Name: "Sana Mir",
    complaintType: "User",
    Complaint_Text: "Reporting fake profile of professor Smith.",
    Date: "2025-10-14T14:10:00",
    Status: "Pending",
  },
  {
    Complaint_ID: 10,
    Student_Name: "Liam Neeson",
    complaintType: "Other",
    Complaint_Text: "Profile picture upload failing repeatedly.",
    Date: "2025-10-13T10:00:00",
    Status: "Resolved",
  },
  {
    Complaint_ID: 11,
    Student_Name: "Deepak J.",
    complaintType: "Notes",
    Complaint_Text: "Maths notes are missing page 5 to 10.",
    Date: "2025-10-12T17:20:00",
    Status: "Pending",
  },
  {
    Complaint_ID: 12,
    Student_Name: "Meera K.",
    complaintType: "QnA",
    Complaint_Text: "Wrong answer marked as 'best' in C++ thread.",
    Date: "2025-10-11T13:45:00",
    Status: "In-Progress",
  },
  {
    Complaint_ID: 13,
    Student_Name: "Chris E.",
    complaintType: "Groups",
    Complaint_Text: "Admin of 'Gaming' group is inactive.",
    Date: "2025-10-10T09:30:00",
    Status: "Pending",
  },
  {
    Complaint_ID: 14,
    Student_Name: "Tom H.",
    complaintType: "User",
    Complaint_Text: "User @hacker123 trying to phish in DMs.",
    Date: "2025-10-09T18:00:00",
    Status: "Pending",
  },
  {
    Complaint_ID: 15,
    Student_Name: "Robert D.",
    complaintType: "Other",
    Complaint_Text: "Notification sound not working on Android.",
    Date: "2025-10-08T11:15:00",
    Status: "Resolved",
  },
  {
    Complaint_ID: 16,
    Student_Name: "Scarlett J.",
    complaintType: "Notes",
    Complaint_Text: "History notes are irrelevant to syllabus.",
    Date: "2025-10-07T14:50:00",
    Status: "In-Progress",
  },
  {
    Complaint_ID: 17,
    Student_Name: "Mark R.",
    complaintType: "QnA",
    Complaint_Text: "Search bar doesn't find old questions.",
    Date: "2025-10-06T10:10:00",
    Status: "Pending",
  },
  {
    Complaint_ID: 18,
    Student_Name: "Jeremy R.",
    complaintType: "Groups",
    Complaint_Text: "Group 'Study' should be private.",
    Date: "2025-10-05T12:40:00",
    Status: "Resolved",
  },
  {
    Complaint_ID: 19,
    Student_Name: "Elizabeth O.",
    complaintType: "User",
    Complaint_Text: "Unauthorized use of my project files by @user9.",
    Date: "2025-10-04T16:25:00",
    Status: "In-Progress",
  },
  {
    Complaint_ID: 20,
    Student_Name: "Paul B.",
    complaintType: "Other",
    Complaint_Text: "Request to add Dark Mode to the admin panel.",
    Date: "2025-10-03T09:55:00",
    Status: "Pending",
  },
];

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState(initialComplaintsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStatusRequest = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.Status);
    setModalOpen(true);
    setReason("");
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setComplaints((prev) =>
        prev.map((c) =>
          c.Complaint_ID === selectedComplaint.Complaint_ID
            ? { ...c, Status: newStatus }
            : c,
        ),
      );
      toast.success("Status updated successfully");
      setModalOpen(false);
      setLoading(false);
    }, 1000);
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

      <EmailConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleStatusUpdate}
        actionType="update"
        targetType="Complaint Status"
        reason={reason}
        setReason={setReason}
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
      </EmailConfirmationModal>
    </section>
  );
};

export default AdminComplaints;
