import React from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminEventsGrid from "../../components/admin/AdminEventsGrid";

export const eventsStats = [
  {
    title: "Total Events",
    value: "128",
    infoText: "+6 new events",
    color: "green",
    type: "total",
  },
  {
    title: "Active Events",
    value: "42",
    infoText: "Currently ongoing",
    color: "yellow",
    type: "pending",
  },
  {
    title: "Expired Events",
    value: "86",
    infoText: "Completed",
    color: "red",
    type: "blocked",
  },
];

const AdminEvents = () => {
  return (
    <section className="flex flex-col gap-6">
      <AdminPageHeader
        title="Events Management"
        subtitle="Create, monitor, and manage platform events"
      />

      <StatsRow stats={eventsStats} />

      <AdminEventsGrid />
    </section>
  );
};

export default AdminEvents;
