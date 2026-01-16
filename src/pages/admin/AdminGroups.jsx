import React from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminGroupsGrid from "../../components/admin/AdminGroupsGrid";

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
  return (
    <section className="flex flex-col gap-6">
      <AdminPageHeader
        title="Groups Management"
        subtitle="Manage student groups and monitor engagement"
      />

      <StatsRow stats={groupsStats} />

      <AdminGroupsGrid />
    </section>
  );
};

export default AdminGroups;
