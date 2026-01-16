import event_temp_image from "/images/events_temp_image.jpg";
import { Ban, CheckCircle, CalendarDays } from "lucide-react";

const AdminEventCard = ({ event, onToggleBlock }) => {
  const isBlocked = event.status === "blocked";

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      {/* IMAGE */}
      <img
        src={event_temp_image}
        alt={event.Description}
        className="h-44 w-full object-cover"
      />

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* TITLE */}
        <h2 className="text-lg font-bold text-slate-800 line-clamp-2">
          {event.Description}
        </h2>

        {/* META */}
        <div className="text-sm text-slate-600 flex flex-col gap-1">
          <p className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-slate-500" />
            {new Date(event.Event_Date).toLocaleDateString("en-IN", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>

          <p>
            Added by{" "}
            <span className="font-medium text-slate-700">{event.Added_By}</span>
          </p>
        </div>

        {/* STATUS */}
        <span
          className={`w-fit text-xs font-semibold px-2 py-1 rounded-full ${
            isBlocked
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isBlocked ? "Blocked" : "Active"}
        </span>

        {/* ACTION */}
        <button
          onClick={() => onToggleBlock(event.id)}
          className={`mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            isBlocked
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {isBlocked ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Unblock
            </>
          ) : (
            <>
              <Ban className="w-4 h-4" />
              Block
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminEventCard;
