import React from "react";
import event_temp_image from "/images/events_temp_image.jpg";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const handleReportClick = (e) => {
    e.stopPropagation();

    navigate(`/submitComplaint/event/${event.E_ID}`);
  };
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
        <button
          onClick={handleReportClick}
          className="flex justify-center items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
          title="Report an issue with this event"
        >
          <AlertTriangle className="pt-1 w-4 h-4" />
          <p className="pt-1">Raise a Complaint</p>
        </button>
      </div>
    </div>
  );
};

export default EventCard;
