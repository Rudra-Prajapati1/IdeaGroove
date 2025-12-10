import React, { useEffect, useState } from "react";
import Title from "../Title";
import EventCard from "../events/EventCard";
import api from "../api/axios";

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get(
        `/collections/${VITE_MOCKMAN_API_KEY}/6939538eb6dbbbd14cf90439/documents`
      );

      const eventsArray = data.map((doc) => doc.data);

      setEvents(eventsArray);
      console.log(eventsArray);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <section className="flex flex-col px-10 py-8 justify-center items-center mt-20">
      <Title text="Events" />
      <div className="flex gap-5">
        {!loading &&
          events
            .splice(1, 3)
            .map((event) => <EventCard key={event.E_ID} event={event} />)}
      </div>
    </section>
  );
};

export default EventSection;
