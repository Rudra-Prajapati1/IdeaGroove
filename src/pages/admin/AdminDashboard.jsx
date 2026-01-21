import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import DashboardUsers from "../../components/admin/DashboardUsers";
import StatsRow from "../../components/admin/StatsRow";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // These options should match the 'status' property in your user data
  const filterOptions = ["Active", "Inactive"];

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        title="Users Dashboard"
        subtitle="Overview of platform activity"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        onFilter={setStatusFilter}
        filterOptions={filterOptions}
      />

      <StatsRow stats={dashboardUserStats} />

      {/* Pass the search and filter state to the grid component */}
      <DashboardUsers searchTerm={searchTerm} filterStatus={statusFilter} />
    </section>
  );
};

export default AdminDashboard;
