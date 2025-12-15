import React from "react";
import NotesCard from "../notes/NotesCard";
import FilledTitle from "../FilledTitle";

const NotesSection = () => {
  return (
    <section className="flex flex-col px-10 py-8 items-center">
      <FilledTitle text="Notes" />
      <div className="flex gap-5">
        {[1, 2, 3].map((n) => (
          <NotesCard key={n} />
        ))}
      </div>
    </section>
  );
};

export default NotesSection;
