import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminComplaintsGrid from "../../components/admin/AdminComplaintsGrid";

// Data Dictionary Aligned Mock Data
const initialComplaintsData = [
  {
    Complaint_ID: 1, // PRIMARY KEY
    Student_ID: 101, // FOREIGN KEY
    Student_Name: "Alex Thompson",
    degreeName: "B.Tech", // Linked via student_tbl
    Complaint_Text: "Unable to access data science modules from hostel Wi-Fi.", // TEXT
    Date: "2025-10-24T10:30:00", // DATETIME
    Status: "Pending", // Default
    Is_Active: true, // BOOLEAN
  },
  {
    Complaint_ID: 2,
    Student_ID: 105,
    Student_Name: "Sarah Jenkins",
    degreeName: "BCA",
    Complaint_Text:
      "Conflict in BCA group project regarding task distribution.",
    Date: "2025-10-22T14:15:00",
    Status: "In-Progress",
    Is_Active: true,
  },
  {
    Complaint_ID: 4,
    Student_ID: 110,
    Student_Name: "Michael Chen",
    degreeName: "B.Tech",
    Complaint_Text: "Portal login credentials reset manually.",
    Date: "2025-10-20T16:45:00",
    Status: "Resolved",
    Is_Active: true,
  },
];

export const complaintsStats = [
  { title: "Total Complaints", value: "1,284", color: "green", type: "total" },
  { title: "Pending", value: "42", color: "yellow", type: "pending" },
  { title: "Resolved", value: "1,242", color: "red", type: "blocked" },
];

const AdminComplaints = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const degreeOptions = ["B.Tech", "BCA", "MCA"];
  const statusOptions = ["Pending", "In-Progress", "Resolved"]; // From DD

  return (
    <section className="flex flex-col gap-6 relative min-h-screen">
      <AdminPageHeader
        title="Complaints Resolution"
        subtitle="Track and resolve student grievances"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        degreeOptions={degreeOptions}
        subjectOptions={statusOptions}
        onDegreeFilter={setDegreeFilter}
        onSubjectFilter={setStatusFilter}
        secondTitle="All Types"
      />

      <StatsRow stats={complaintsStats} />

      <AdminComplaintsGrid
        complaints={initialComplaintsData}
        searchTerm={searchTerm}
        filterDegree={degreeFilter}
        filterStatus={statusFilter}
      />
    </section>
  );
};

export default AdminComplaints;
