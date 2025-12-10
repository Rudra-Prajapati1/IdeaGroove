import React from "react";
import Title from "../Title";
import NotesCard from "../notes/NotesCard";

const NotesSection = () => {
  return (
    <section className="flex flex-col px-10 py-8 justify-center items-center mt-20">
      <Title text="Notes" />
      <div className="flex gap-5">
        {[1, 2, 3].map((n) => (
          <NotesCard />
        ))}
      </div>
    </section>
  );
};

export default NotesSection;
