import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
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

const EventCard = ({ event, onEdit, authorLabel }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

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
    user &&
    Number(event.Added_By) === Number(user.S_ID || user.id || user.Student_ID);
  const organizerId = event.Organizer_ID || event.Added_By || null;
  const organizerName =
    event.Organizer_Username ||
    event.Organizer_UserName ||
    event.Organizer_Name ||
    event.Contact_Person ||
    "Admin";
  const displayOrganizerName =
    organizerId &&
    String(organizerId) === String(user?.S_ID || user?.id || user?.Student_ID)
      ? "You"
      : organizerName;
  const uploadedDate = event.Added_On
    ? new Date(event.Added_On).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently uploaded";
  const eventDescription =
    event.Description === "null"
      ? "Description not available"
      : event.Description || "Description not available";
  const shouldShowDescriptionToggle = eventDescription.length > 90;

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
            alt={eventDescription}
            onClick={() => setPreviewOpen(true)}
            className="h-full w-full object-cover cursor-pointer transition-transform duration-300 min-w-100 group-hover:scale-110"
          />

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:bg-black/75"
          >
            View Full Details
          </button>

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
              onClick={() =>
                    navigate(
                  `/submit-complaint/event/${event.E_ID}/${eventDescription}`,
                )
              }
              className="absolute top-4 right-4"
              element="event"
            />
          )}
        </div>

        <div className="p-5 flex flex-col justify-between grow">
          <div>
            <h2
              className={`text-xl font-bold text-gray-900 mb-2 font-poppins ${
                showFullDescription ? "" : "line-clamp-2"
              }`}
            >
              {event.Description === "null" ? (
                <span className="text-gray-500 italic">{eventDescription}</span>
              ) : (
                eventDescription
              )}
            </h2>
            {shouldShowDescriptionToggle && (
              <div className="mb-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowFullDescription((prev) => !prev)}
                  className="text-xs font-semibold text-green-700 hover:underline"
                >
                  {showFullDescription ? "View Less" : "View More"}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 hover:underline"
                >
                  Click image for full details
                </button>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">
                  Uploaded Date: {uploadedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold shrink-0">
              {authorLabel ? (
                authorLabel
              ) : (
                <>
                  By{" "}
                  {organizerId ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          String(organizerId) ===
                            String(user?.S_ID || user?.id || user?.Student_ID)
                            ? "/dashboard"
                            : `/dashboard/${organizerId}`,
                        );
                      }}
                      className="hover:underline"
                    >
                      {displayOrganizerName.toUpperCase()}
                    </button>
                  ) : (
                    <span>{displayOrganizerName}</span>
                  )}
                </>
              )}
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

            <div
              onClick={(e) => e.stopPropagation()}
              className="grid w-[min(92vw,72rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-[#102611] text-white shadow-[0_30px_80px_-25px_rgba(0,0,0,0.7)] lg:grid-cols-[minmax(18rem,24rem)_1fr]"
            >
              <div className="flex flex-col justify-between gap-6 bg-linear-to-br from-[#173919] via-[#153416] to-[#102611] px-6 py-7">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-green-300">
                    Event Details
                  </p>
                  <div className="mb-5 inline-flex w-fit items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                    {month} {day}
                  </div>
                  <h3 className="text-2xl font-black leading-tight text-white">
                    {eventDescription}
                  </h3>
                </div>

                <div className="space-y-3 text-sm text-white/80">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                      Uploaded On
                    </p>
                    <p className="mt-1 font-medium text-white">{uploadedDate}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                      Hosted By
                    </p>
                    <p className="mt-1 font-medium text-white">
                      {displayOrganizerName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center bg-black/20 p-4 sm:p-6">
                <img
                  src={event.Poster_File}
                  alt={eventDescription}
                  className="max-h-[72vh] w-full rounded-[1.5rem] object-contain shadow-2xl"
                />
              </div>
            </div>
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
