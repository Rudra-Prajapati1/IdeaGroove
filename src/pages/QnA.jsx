import React from "react";
import DiscussionForum from "../components/dashboard/DiscussionForum";
import FilledTitle from "../components/FilledTitle";
import { ArrowLeft } from "lucide-react";
import PageHeader from "../components/PageHeader";

const QnA = () => {
  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <PageHeader title="QnA" />

      <div className="mx-auto px-6 relative z-30 mt-10">
        <DiscussionForum />
      </div>
    </div>
  );
};

export default QnA;
