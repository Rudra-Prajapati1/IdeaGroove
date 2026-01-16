import React from "react";
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
  return (
    <section className="flex flex-col gap-6">
      <AdminPageHeader
        title="QnA Moderation"
        subtitle="Review questions, answers, and reported content"
      />

      <StatsRow stats={qnaStats} />

      <AdminQnAGrid />
    </section>
  );
};

export default AdminQnA;
