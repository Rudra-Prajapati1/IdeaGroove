import React from "react";
import Title from "../Title";
import GroupCard from "../groups/GroupCard";

const GroupSection = () => {
  return (
    <section className="flex flex-col px-10 py-8 justify-center items-center mt-20">
      <Title text="Groups" />
      <div className="flex gap-5">
        {[1, 2, 3].map((n) => (
          <GroupCard key={n} />
        ))}
      </div>
    </section>
  );
};

export default GroupSection;
