import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../events/EventCard";
import {
  fetchEvents,
  selectAllEvents,
  selectEventsError,
  selectEventsStatus,
} from "../../redux/slice/eventsSlice";
import ShowMoreButton from "../ShowMoreButton";
import FilledTitle from "../FilledTitle";

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
    <section className="flex flex-col px-10 py-8 items-center mt-10">
      <FilledTitle text="Events" />

      {status === "loading" && <p>Loading events...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        {status === "succeeded" &&
          events
            .filter((e) => e.Is_Active)
            .slice(0, 3)
            .map((event) => <EventCard key={event.E_ID} event={event} />)}
      </div>

      <ShowMoreButton text="View More Events" path="/events" />
    </section>
  );
};

export default EventSection;
