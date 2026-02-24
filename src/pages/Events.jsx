import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvents,
  selectAllEvents,
  selectEventsError,
  selectEventsStatus,
  selectEventsPagination,
} from "../redux/slice/eventsSlice";

// Components
import EventCard from "../components/cards/EventCard";
import Loading from "../components/common/Loading";
import { UploadIcon } from "lucide-react";
import AddEventOverlay from "../components/events/AddEvent";
import { selectIsAuthenticated } from "../redux/slice/authSlice";
import Controls from "../components/common/Controls";
import PageHeader from "../components/common/PageHeader";
import ActionButton from "../components/common/ActionButton";

const Events = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuthenticated);

  const events = useSelector(selectAllEvents);
  const status = useSelector(selectEventsStatus);
  const error = useSelector(selectEventsError);
  const { totalPages } = useSelector(selectEventsPagination);

  const [currentPage, setCurrentPage] = useState(1);
  const [addEvent, setAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const updateDebouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
      setCurrentPage(1); // reset to page 1 on new search
    }, 300),
    [],
  );

  const handleSearchChange = (value) => {
    setSearch(value); // instant UI update
    updateDebouncedSearch(value); // delayed API call
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  /* ================= FETCH ON PAGE CHANGE ================= */
  useEffect(() => {
    dispatch(
      fetchEvents({
        page: currentPage,
        limit: 9,
        search: debouncedSearch,
        filter,
      }),
    );
  }, [dispatch, currentPage, debouncedSearch, filter]);

  /* ================= FILTERING ================= */
  const eventsToShow = events;

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <PageHeader title="Events" />

      {(addEvent || editingEvent) && (
        <AddEventOverlay
          onClose={() => {
            setAddEvent(false);
            setEditingEvent(null);
          }}
          onSuccess={() => {
            dispatch(fetchEvents({ page: currentPage, limit: 9 }));
          }}
          initialData={editingEvent}
        />
      )}

      <div className="max-w-6xl mx-auto px-6 relative mt-10">
        <div className="flex justify-between items-center">
          <Controls
            search={search}
            setSearch={handleSearchChange}
            filter={filter}
            setFilter={handleFilterChange}
            searchPlaceholder="Search events..."
            filterOptions={{ All: "all", Upcoming: "upcoming", Past: "past" }}
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
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {status === "succeeded" && eventsToShow.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-2xl font-semibold">No Events Found</p>
              <p>Try adjusting your search or filters</p>
            </div>
          )}

          {status === "succeeded" && eventsToShow.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventsToShow.map((event) => (
                <EventCard
                  key={event.E_ID}
                  event={event}
                  onEdit={() => setEditingEvent(event)}
                />
              ))}
            </div>
          )}

          {/* SIMPLE PAGINATION (No UI change style) */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="font-semibold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
