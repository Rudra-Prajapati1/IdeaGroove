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
import { ArrowLeft, UploadIcon } from "lucide-react";
import AddEventOverlay from "../components/events/AddEvent";
import { selectIsAuthenticated } from "../redux/slice/authSlice";
import Controls from "../components/Controls";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { toast } from "react-hot-toast";
import ActionButton from "../components/ActionButton";

const Events = () => {
  const navigate = useNavigate();

  const isAuth = useSelector(selectIsAuthenticated);

  const dispatch = useDispatch();
  const [addEvent, setAddEvent] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingEvent, setEditingEvent] = useState(null);
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
      <PageHeader title="Events" />

      {(addEvent || editingEvent) && (
        <AddEventOverlay
          onClose={() => {
            setAddEvent(false);
            setEditingEvent(null);
          }}
          initialData={editingEvent} // Pass the event being edited
        />
      )}
      {/* Controls Section (Search & Filter) */}

      {addEvent && <AddEventOverlay onClose={() => setAddEvent(false)} />}


      <div className="max-w-6xl  mx-auto px-6 relative z-30 mt-10">
        <div className="flex justify-between items-center">
          <Controls
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            searchPlaceholder="Search events..."
            filterOptions={{
              All: "all",
              Upcoming: "upcoming",
              Past: "past",
            }}
          />
          <ActionButton
            label="Upload Events"
            icon={UploadIcon}
            disabled={!isAuth}
            disabledMessage="Please login to upload an event"
            onClick={() => setAddEvent(true)}
          />
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
                <EventCard
                  key={event.E_ID}
                  event={event}
                  onEdit={() => setEditingEvent(event)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
