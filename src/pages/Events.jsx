import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvents,
  selectAllEvents,
  selectEventsError,
  selectEventsStatus,
} from "../redux/slice/eventsSlice";
import EventCard from "../components/events/EventCard";
import FilledTitle from "../components/FilledTitle";
import Loading from "../components/Loading";

const Events = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const events = useSelector(selectAllEvents);
  const status = useSelector(selectEventsStatus);
  const error = useSelector(selectEventsError);

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.Event_Date);
    const today = new Date();

    const matchesSearch =
      event?.Description.toLowerCase().includes(search.toLowerCase()) ?? false;

    if (filter === "upcoming" && eventDate < today) return false;
    if (filter === "past" && eventDate >= today) return false;

    return matchesSearch;
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);

  return (
    <section className="flex flex-col px-10 py-8 items-center mt-20">
      <FilledTitle text="Events" />

      <div className="flex justify-around w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />

          <input
            type="text"
            placeholder="Search events..."
            className="border border-gray-300 rounded-xl pl-10 pr-4 py-2 w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-6 mt-4">
          <span className="text-primary font-semibold font-poppins">
            Filters:
          </span>
          <label className="flex items-center gap-2 cursor-pointer font-inter text-primary">
            <input
              type="radio"
              name="eventFilter"
              value="all"
              checked={filter === "all"}
              onChange={(e) => setFilter(e.target.value)}
              className="accent-primary"
            />
            <span>All</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-inter text-primary">
            <input
              type="radio"
              name="eventFilter"
              value="upcoming"
              checked={filter === "upcoming"}
              onChange={(e) => setFilter(e.target.value)}
              className="accent-primary"
            />
            <span>Upcoming</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-inter text-primary">
            <input
              type="radio"
              name="eventFilter"
              value="past"
              checked={filter === "past"}
              onChange={(e) => setFilter(e.target.value)}
              className="accent-primary"
            />
            <span>Past</span>
          </label>
        </div>
      </div>

      {status === "loading" && <Loading text="loading events" />}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && filteredEvents.length === 0 && (
        <div className="my-20 flex flex-col items-center gap-3 text-primary">
          <p className="text-2xl font-semibold font-poppins">No Events Found</p>
          <p className="text-lg opacity-70 font-inter">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {status === "succeeded" && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {filteredEvents.map((event) => (
            <EventCard key={event.E_ID} event={event} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Events;
