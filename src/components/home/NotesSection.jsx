import React from "react";
import Title from "../Title";
import NotesCard from "../notes/NotesCard";

const NotesSection = () => {
  return (
    <section className="flex flex-col px-10 py-8 items-center">
      <Title text="Notes" />
      <div className="flex gap-5">
        {[1, 2, 3].map((n) => (
          <NotesCard key={n} />
        ))}
      </div>
    </section>
  );
};

export default NotesSection;
