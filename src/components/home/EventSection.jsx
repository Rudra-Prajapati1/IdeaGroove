import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../cards/EventCard";
import {
  fetchPreviewEvents,
  selectPreviewError,
  selectPreviewEvents,
  selectPreviewStatus,
} from "../../redux/slice/eventsSlice";
import ShowMoreButton from "../common/ShowMoreButton";
import FilledTitle from "../common/FilledTitle";
import Loading from "../common/Loading";

const EventSection = () => {
  const dispatch = useDispatch();

  const previewEvents = useSelector(selectPreviewEvents);
  const previewStatus = useSelector(selectPreviewStatus);
  const previewError = useSelector(selectPreviewError);

  useEffect(() => {
    if (previewStatus === "idle") {
      dispatch(fetchPreviewEvents());
    }
  }, [previewStatus, dispatch]);

  console.log(previewEvents);

  return (
    <section className="flex flex-col px-6 sm:px-10 py-8 items-center mt-10 bg-[#FFFBEB]">
      <FilledTitle text="Events" />

      {previewStatus === "loading" && <Loading text="loading events" />}

      {previewStatus === "failed" && (
        <p className="text-red-500 mt-4">Error: {previewError}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        {previewStatus === "succeeded" &&
          previewEvents?.map((event) => (
            <EventCard key={event.E_ID} event={event} />
          ))}
      </div>

      <ShowMoreButton text="View More Events" path="/events" />
    </section>
  );
};

export default EventSection;
