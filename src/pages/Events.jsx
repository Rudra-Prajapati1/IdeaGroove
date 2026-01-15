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
  <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
    {/* Hero Section */}
    <section className="relative bg-[#1A3C20] pt-40 pb-32">
      <div className="max-w-6xl mx-auto px-4 relative z-30">
        <h1 className="text-5xl font-extrabold text-[#FFFBEB]">Events</h1>
      </div>
      
      {/* Wave SVG */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[100px]">
          <path fill="#FFFBEB" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>

    {/* Controls Section (Search & Filter) */}
    <div className="max-w-6xl mx-auto px-4 -mt-25 relative z-40">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A3C20]/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-6">
          <span className="text-[#1A3C20] font-bold">Filters:</span>
          {['all', 'upcoming', 'past'].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer capitalize">
              <input
                type="radio"
                name="eventFilter"
                value={type}
                checked={filter === type}
                onChange={(e) => setFilter(e.target.value)}
                className="w-4 h-4 accent-[#1A3C20]"
              />
              <span className="text-sm font-medium">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status Messages */}
      <div className="mt-10">
        {status === "loading" && <Loading text="loading events" />}
        
        {status === "failed" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">
            <p className="font-semibold">Authentication Error (401)</p>
            <p className="text-sm">Please log in again to view events.</p>
          </div>
        )}

        {status === "succeeded" && filteredEvents.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-2xl font-semibold">No Events Found</p>
            <p>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Events Grid */}
        {status === "succeeded" && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.E_ID} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)};

export default Events;
