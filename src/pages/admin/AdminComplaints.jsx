import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminComplaintsGrid from "../../components/admin/AdminComplaintsGrid";

export const complaintsStats = [
  {
    title: "Total Complaints",
    value: "1,284",
    infoText: "+14 today",
    color: "green",
    type: "total",
  },
  {
    title: "Pending Complaints",
    value: "42",
    infoText: "Needs resolution",
    color: "yellow",
    type: "pending",
  },
  {
    title: "Resolved Complaints",
    value: "1,242",
    infoText: "Closed cases",
    color: "red",
    type: "blocked",
  },
];

const AdminComplaints = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categoryOptions = [
    "Resource Access",
    "Group Conflict",
    "Technical Issue",
    "Other",
  ];

  return (
    <section className="flex flex-col gap-6">
      <AdminPageHeader
        title="Complaints Resolution"
        subtitle="Track, review, and resolve user complaints"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        onFilter={setCategoryFilter}
        filterOptions={categoryOptions}
      />

      <StatsRow stats={complaintsStats} />

      <AdminComplaintsGrid
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
      />
    </section>
  );
};

export default AdminComplaints;
