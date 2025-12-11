import React, { useEffect, useState } from "react";
import Title from "../Title";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../events/EventCard";
import {
  fetchEvents,
  selectAllEvents,
  selectEventsError,
  selectEventsStatus,
} from "../../redux/slice/eventsSlice";

const EventSection = () => {
  const dispatch = useDispatch();

  const events = useSelector(selectAllEvents);
  const status = useSelector(selectEventsStatus);
  const error = useSelector(selectEventsError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);

  return (
    <section className="flex flex-col px-10 py-8 justify-center items-center mt-20">
      <Title text="Events" />

      {status === "loading" && <p>Loading events...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      <div className="flex gap-5">
        {status === "succeeded" &&
          events
            .slice(0, 3)
            .map((event) => <EventCard key={event.E_ID} event={event} />)}
      </div>
    </section>
  );
};

export default EventSection;
