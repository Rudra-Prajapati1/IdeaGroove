import event_temp_image from "/images/events_temp_image.jpg";
import {
  Ban,
  CheckCircle,
  CalendarDays,
  User,
  MoreVertical,
} from "lucide-react";

const AdminEventCard = ({ event, onToggleBlock }) => {
  const isBlocked = event.status === "blocked";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col">
      {/* IMAGE SECTION */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={event_temp_image}
          alt={event.Description}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Floating Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md ${
              isBlocked ? "bg-red-500/90" : "bg-emerald-500/90"
            }`}
          >
            {isBlocked ? "Blocked" : "Live"}
          </span>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-5 flex flex-col flex-1">
        {/* Organization Tag */}
        <div className="mb-2">
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wide">
            {event.Added_By}
          </span>
        </div>

        <h2 className="text-lg font-bold text-slate-800 line-clamp-2 leading-snug min-h-14">
          {event.Description}
        </h2>

        {/* METADATA */}
        <div className="mt-4 flex flex-col gap-2 border-t border-slate-50 pt-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <CalendarDays className="w-4 h-4 text-blue-500" />
            {new Date(event.Event_Date).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                <User size={12} className="text-slate-500" />
              </div>
              <span className="text-xs text-slate-400">
                Organized by{" "}
                <span className="font-semibold text-slate-600">
                  {event.Added_By}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ADMIN ACTIONS (Footer) */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => onToggleBlock(event.id)}
            disabled={isBlocked}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isBlocked
                ? "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
                : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100"
            }`}
          >
            <Ban size={14} />
            Block
          </button>

          <button
            onClick={() => onToggleBlock(event.id)}
            disabled={!isBlocked}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              !isBlocked
                ? "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
                : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200"
            }`}
          >
            <CheckCircle size={14} />
            Unblock
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEventCard;
