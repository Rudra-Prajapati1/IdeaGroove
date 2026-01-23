import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvents,
  selectAllEvents,
  selectEventsError,
  selectEventsStatus,
} from "../redux/slice/eventsSlice";

// Components
import EventCard from "../components/events/EventCard";
import Loading from "../components/Loading";
import Controls from "../components/Controls"; // The new component
import { UploadIcon } from "lucide-react";

const Events = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const events = useSelector(selectAllEvents);
  const status = useSelector(selectEventsStatus);
  const error = useSelector(selectEventsError);

  // Filtering Logic
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
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="block w-full h-[100px]"
          >
            <path
              fill="#FFFBEB"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Controls Section (Search & Filter) */}
      <div className="max-w-6xl mx-auto px-4 -mt-25 relative z-40">
        <div className="flex justify-between items-center">
          <Controls
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            searchPlaceholder="Search events..."
          />
          <button
            onClick={() => setAddNotes(!addNotes)}
            className="flex items-center gap-2 bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
          >
            <UploadIcon className="w-4 h-4" />
            Upload Events
          </button>
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
  );
};

export default Events;
