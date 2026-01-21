import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import StatsRow from "../../components/admin/StatsRow";
import AdminQnAGrid from "../../components/admin/AdminQnAGrid";

export const qnaStats = [
  {
    title: "Total Questions",
    value: "1,240",
    infoText: "+22 today",
    color: "green",
    type: "total",
  },
  {
    title: "Unanswered",
    value: "48",
    infoText: "Needs attention",
    color: "yellow",
    type: "pending",
  },
  {
    title: "Reported Questions",
    value: "19",
    infoText: "Policy review",
    color: "red",
    type: "blocked",
  },
];

const AdminQnA = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  // Options extracted from your initial data subjects
  const subjectOptions = [
    "Web Development",
    "Linear Algebra",
    "Thermodynamics",
    "Data Structures",
  ];

  return (
    <section className="flex flex-col gap-6">
      <AdminPageHeader
        title="QnA Moderation"
        subtitle="Review questions, answers, and reported content"
        searchValue={searchTerm}
        onSearch={setSearchTerm}
        onFilter={setSubjectFilter}
        filterOptions={subjectOptions}
      />

      <StatsRow stats={qnaStats} />

      {/* Passing search and filter values to the grid */}
      <AdminQnAGrid searchTerm={searchTerm} filterSubject={subjectFilter} />
    </section>
  );
};

export default AdminQnA;
