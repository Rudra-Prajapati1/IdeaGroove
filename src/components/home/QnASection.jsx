import React from "react";
import QnACard from "../qna/QnACard";
import FilledTitle from "../FilledTitle";

const QnASection = () => {
  return (
    <section className="flex flex-col px-10 py-8 items-center">
      <FilledTitle text="QnA" />
      <div className="flex gap-5">
        {[1, 2, 3].map((n) => (
          <QnACard key={n} />
        ))}
      </div>
    </section>
  );
};

export default QnASection;
