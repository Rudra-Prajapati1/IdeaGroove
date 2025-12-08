import React from "react";
import Title from "../Title";
import QnACard from "../qna/QnACard";

const QnASection = () => {
  return (
    <section className="flex flex-col px-10 py-8 justify-center items-center mt-20">
      <Title text="QnA" />
      <div className="flex gap-5">
        {[1, 2, 3].map((n) => (
          <QnACard />
        ))}
      </div>
    </section>
  );
};

export default QnASection;
