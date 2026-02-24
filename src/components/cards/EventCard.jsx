import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Edit2, Loader2, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../redux/slice/authSlice";
import { deleteEvent } from "../../redux/slice/eventsSlice";
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isModalOpen,setIsModalOpen] = useState(false);

  const dateObj = new Date(event.Event_Date);
  const month = dateObj
    .toLocaleString("en-IN", { month: "short" })
    .toUpperCase();
  const day = dateObj.getDate();

  // Use correct field name – check what your user object has
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
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      await dispatch(deleteEvent(event.E_ID)).unwrap();
      toast.success("Event deleted successfully!");
      setShowConfirm(false);
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

  return (
    <>
      <div className="group bg-white rounded-3xl overflow-hidden flex flex-col w-full max-w-[20rem] mx-auto transition-all duration-300 shadow-md hover:shadow-xl border border-gray-300">
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={event.Poster_File || event_temp_image}
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
              {event.Description || "Description not available"}
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

          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              Added by {event.Organizer_Name || event.Contact_Person || "Admin"}
            </p>

            {isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(event);
                  }}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Event"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                  disabled={deleting}
                  className={`p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ${
                    deleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title="Delete Event"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
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
              src={event.Poster_File || event_temp_image}
              alt={event.Description}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            />
          </div>,
          document.getElementById("modal-root") || document.body,
        )}

      {isModalOpen && 
        <ConfirmationBox
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
          type = "Event"
        />
      }
    </>
  );
};

export default EventCard;
