import React from "react";
import DiscussionForum from "../components/dashboard/DiscussionForum";
import FilledTitle from "../components/FilledTitle";

const QnA = () => {
  return (
    <section className="flex flex-col px-10 py-8 items-center mt-20">
      <FilledTitle text="QnA" />

      <DiscussionForum />
    </section>
  );
};

export default QnA;
