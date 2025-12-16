import React from "react";
import event_temp_image from "/images/events_temp_image.jpg";

const EventCard = ({ event }) => {
  return (
    <div
      className="
        border-3 border-primary text-primary font-inter 
        py-6 px-4 rounded-2xl flex flex-col gap-5 
        shadow-md hover:shadow-lg/30 hover:-translate-y-2 duration-300
        w-full max-w-[20rem] mx-auto
      "
    >
      <img
        src={event_temp_image}
        alt={event.Description}
        className="
          rounded-2xl 
          h-50 w-full object-cover
        "
      />

      <div className="flex flex-col justify-between h-full">
        <h2 className="text-xl text-center underline font-semibold line-clamp-2">
          {event.Description}
        </h2>

        <div>
          <p className="mt-4">
            Event Date:{" "}
            <span>{new Date(event.Event_Date).toLocaleDateString()}</span>
          </p>

          <p>
            Added By: <span>{event.Added_By}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
