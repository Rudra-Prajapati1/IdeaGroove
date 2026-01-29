import React from "react";
import event_temp_image from "/images/events_temp_image.jpg";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  MapPin,
  Edit2, // Import Edit Icon
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../redux/slice/authSlice";
import ComplaintButton from "../ComplaintButton";

const EventCard = ({ event }) => {
  const isAuth = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  // const handleReportClick = (e) => {
  //   e.stopPropagation();
  //   navigate(`/submitComplaint/event/${event.E_ID}`);
  // };

  // Date formatting for the Badge
  const dateObj = new Date(event.Event_Date);
  const month = dateObj
    .toLocaleString("en-IN", { month: "short" })
    .toUpperCase();
  const day = dateObj.getDate();

  let MOCK_CURRENT_USER_ID = 0;
  if (isAuth) {
    MOCK_CURRENT_USER_ID = 104;
  }

  const isOwner = event.Added_By === MOCK_CURRENT_USER_ID;

  const handleEdit = (e) => {
    e.stopPropagation();
    console.log("Edit Event:", event.E_ID);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this event?")) {
      console.log("Delete Event:", event.E_ID);
      // Call your delete API here
    }
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden flex flex-col w-full max-w-[20rem] mx-auto transition-all duration-300 shadow-md hover:shadow-xl border border-gray-300">
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={event_temp_image}
          alt={event.Description}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-2 min-w-14 flex flex-col items-center shadow-md border border-white/20">
          <span className="text-[10px] font-bold text-green-600 tracking-wider leading-none">
            {month}
          </span>
          <span className="text-2xl font-black text-gray-800 leading-none mt-1">
            {day}
          </span>
        </div>

        {!isOwner && (
          <ComplaintButton
            onClick={() => navigate(`/submitComplaint/event/${event.E_ID}`)}
            className="absolute top-4 right-4"
            element="event"
          />
        )}
      </div>

      {/* 2. Content Section */}
      <div className="p-5 flex flex-col justify-between grow">
        <div>
          <h2 className="text-xl font-bold text-gray-900 line-clamp-2 mb-4 font-poppins">
            {event.Description || "Description not available"}
          </h2>

          {/* Event Details with Icons */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">
                {event.Start_Time || "4:00 PM"} - {event.End_Time || "10:00 PM"}
              </span>
            </div>
          </div>
        </div>

        {/* Small separator or extra detail can go here if needed */}
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Added by {event.Added_By || "Admin"}
          </p>

          {/* ✅ EDIT & DELETE BUTTONS (Visible only to Owner) */}
          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Event"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
