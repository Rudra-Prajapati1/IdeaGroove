import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Edit2,
  Loader2,
  Trash2,
  X,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../redux/slice/authSlice";
import { deleteEvent, reactToEvent } from "../../redux/slice/eventsSlice";
import ComplaintButton from "../ComplaintButton";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { ConfirmationBox } from "../common/ConfirmationBox";

const EventCard = ({ event, onEdit }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const storageKey = `event_reaction_${event.E_ID}_${user?.S_ID || user?.id}`;

  const [userReaction, setUserReaction] = useState(
    () => localStorage.getItem(storageKey) || null,
  );

  const [counts, setCounts] = useState({
    interested: event.Interested || 0,
    not_interested: event.Not_Interested || 0,
  });

  useEffect(() => {
    setCounts({
      interested: event.Interested || 0,
      not_interested: event.Not_Interested || 0,
    });
  }, [event.Interested, event.Not_Interested]);

  const dateObj = new Date(event.Event_Date);
  const month = dateObj
    .toLocaleString("en-IN", { month: "short" })
    .toUpperCase();
  const day = dateObj.getDate();

  const isOwner =
    user && event.Added_By === (user.S_ID || user.id || user.Student_ID);

  useEffect(() => {
    if (!previewOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setPreviewOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [previewOpen]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteEvent(event.E_ID)).unwrap();
      toast.success("Event deleted successfully!");
      setIsDeleteOpen(false);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to delete event. Please try again.";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleReaction = (type) => {
    if (!isAuth) {
      toast.error("Please login to react to events");
      return;
    }

    const oppositeType =
      type === "interested" ? "not_interested" : "interested";

    if (userReaction === type) {
      setCounts((prev) => ({
        ...prev,
        [type]: Math.max(0, prev[type] - 1),
      }));
      setUserReaction(null);
      localStorage.removeItem(storageKey);
      dispatch(reactToEvent({ E_ID: event.E_ID, type, action: "remove" }));
      toast.success("Reaction removed");
    } else {
      setCounts((prev) => ({
        ...prev,
        [type]: prev[type] + 1,
        ...(userReaction
          ? { [oppositeType]: Math.max(0, prev[oppositeType] - 1) }
          : {}),
      }));

      if (userReaction) {
        dispatch(
          reactToEvent({
            E_ID: event.E_ID,
            type: userReaction,
            action: "remove",
          }),
        );
      }

      setUserReaction(type);
      localStorage.setItem(storageKey, type);
      dispatch(reactToEvent({ E_ID: event.E_ID, type, action: "add" }));

      if (type === "interested") {
        toast.success("Marked as Interested!");
      } else {
        toast.success("Marked as Not Interested");
      }
    }
  };

  return (
    <>
      <div className="group bg-white rounded-3xl overflow-hidden flex flex-col w-full max-w-[20rem] mx-auto transition-all duration-300 shadow-md hover:shadow-xl border border-gray-300">
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={event.Poster_File}
            alt={event.Description}
            onClick={() => setPreviewOpen(true)}
            className="h-full w-full object-cover cursor-pointer transition-transform duration-300 min-w-100 group-hover:scale-110"
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
              onClick={() => navigate(`/submit-complaint/event/${event.E_ID}`)}
              className="absolute top-4 right-4"
              element="event"
            />
          )}
        </div>

        <div className="p-5 flex flex-col justify-between grow">
          <div>
            <h2 className="text-xl font-bold text-gray-900 line-clamp-2 mb-4 font-poppins">
              {event.Description === "null" ? (
                <span className="text-gray-500 italic">
                  Description not available
                </span>
              ) : (
                event.Description
              )}
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">
                  {event.Start_Time || "4:00 PM"} -{" "}
                  {event.End_Time || "10:00 PM"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold shrink-0">
              By {event.Organizer_Name || event.Contact_Person || "Admin"}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleReaction("interested")}
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors
                  ${
                    userReaction === "interested"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  }`}
                title="Interested"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{counts.interested}</span>
              </button>

              <button
                onClick={() => handleReaction("not_interested")}
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors
                  ${
                    userReaction === "not_interested"
                      ? "bg-red-100 text-red-600"
                      : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  }`}
                title="Not Interested"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{counts.not_interested}</span>
              </button>
            </div>

            {isOwner && (
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(event);
                  }}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Event"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteOpen(true);
                  }}
                  disabled={deleting}
                  className={`p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors ${
                    deleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title="Delete Event"
                >
                  {deleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {previewOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewOpen(false)}
          >
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-6 right-6 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={event.Poster_File}
              alt={event.Description}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            />
          </div>,
          document.getElementById("modal-root") || document.body,
        )}

      {isDeleteOpen && (
        <ConfirmationBox
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          type="Event"
        />
      )}
    </>
  );
};

export default EventCard;
