import React from "react";
import Title from "../Title";
import EventCard from "../events/EventCard";

const EventSection = () => {
  return (
    <section className="flex flex-col px-10 py-8 justify-center items-center mt-20">
      <Title text="Events" />
      <div className="flex gap-5">
        {[1, 2, 3].map((n) => (
          <EventCard />
        ))}
      </div>
    </section>
  );
};

export default EventSection;
