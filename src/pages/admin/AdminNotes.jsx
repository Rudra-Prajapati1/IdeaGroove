import React from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminNotesGrid from "../../components/admin/AdminNotesGrid";

export const notesStats = [
  {
    title: "Total Notes Uploaded",
    value: "12,450",
    infoText: "+12% this month",
    color: "green",
    type: "total",
  },
  {
    title: "Pending Review",
    value: "84",
    infoText: "Priority items",
    color: "yellow",
    type: "pending",
  },
  {
    title: "Blocked Content",
    value: "312",
    infoText: "Compliance removal",
    color: "red",
    type: "blocked",
  },
];

const AdminNotes = () => {
  return (
    <section className="flex flex-col gap-6">
      <AdminPageHeader
        title="Notes Moderation"
        subtitle="Review, approve, and manage user-uploaded notes"
      />

      <StatsRow stats={notesStats} />

      <AdminNotesGrid />
    </section>
  );
};

export default AdminNotes;
