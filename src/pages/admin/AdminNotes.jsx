import React, { useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const subjectOptions = [
    "OS",
    "DBMS",
    "CN",
    "Web Dev",
    "AI",
    "Physics",
    "Math",
  ];

  return (
    <section className="flex flex-col gap-8">
      <AdminPageHeader
        title="Notes Moderation"
        subtitle="Review, approve, and manage user-uploaded notes"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        onFilter={setSubjectFilter}
        filterOptions={subjectOptions}
      />

      <StatsRow stats={notesStats} />

      <AdminNotesGrid searchTerm={searchTerm} filterSubject={subjectFilter} />
    </section>
  );
};

export default AdminNotes;
