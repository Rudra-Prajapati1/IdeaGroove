import React from "react";
import event_temp_image from "/images/events_temp_image.jpg";

const EventCard = ({ event }) => {
  return (
    <div
      className="
        border-1 border-primary text-primary font-inter rounded-2xl flex flex-col gap-3
        shadow-md hover:shadow-lg/20 hover:-translate-y-2 duration-300
        w-full max-w-[20rem] mx-auto
      "
    >
      <img
        src={event_temp_image}
        alt={event.Description}
        className="
          rounded-t-2xl
          h-56 w-full object-cover 
        "
      />

      <div className="flex flex-col justify-around h-full p-4">
        <h2 className="text-xl text-center font-semibold line-clamp-2">
          {event.Description}
        </h2>

        <div>
          <p className="mt-2">
            Event Date:{" "}
            <span className="font-bold">
              {new Date(event.Event_Date).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
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
