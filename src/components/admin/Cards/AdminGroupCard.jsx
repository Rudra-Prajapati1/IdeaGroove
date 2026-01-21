import group_temp_image from "/images/group_temp_image.jpg";
import {
  Ban,
  CheckCircle,
  Users,
  Calendar,
  MoreVertical,
  ShieldCheck,
} from "lucide-react";

const AdminGroupCard = ({ group, onToggleBlock }) => {
  const isBlocked = group.status === "blocked";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col">
      {/* HEADER: Banner & Avatar */}
      <div className="relative h-28 w-full bg-slate-100">
        {/* Banner Overlay (Subtle Gradient) */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

        {/* Floating Status */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md ${
              isBlocked ? "bg-red-500/90" : "bg-emerald-500/90"
            }`}
          >
            {isBlocked ? "Restricted" : "Active"}
          </span>
        </div>

        {/* Group Avatar */}
        <div className="absolute -bottom-6 left-5 p-1 bg-white rounded-full shadow-sm">
          <img
            src={group_temp_image}
            alt={group.Room_Name}
            className="rounded-full h-14 w-14 object-cover border-2 border-white"
          />
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-5 pt-8 flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {group.Room_Name}
            </h3>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit uppercase tracking-tight">
              {group.Based_On}
            </span>
          </div>
          <button className="text-slate-300 hover:text-slate-500 p-1">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* METADATA */}
        <div className="mt-4 grid grid-cols-1 gap-2 border-t border-slate-50 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-slate-400" />
            <span>
              Created by{" "}
              <span className="font-semibold text-slate-700">
                {group.Created_By}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar size={14} className="text-slate-400" />
            <span>
              Started{" "}
              {new Date(group.Created_On).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* ADMIN ACTIONS (Footer) */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => onToggleBlock(group.id)}
            disabled={isBlocked}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              isBlocked
                ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                : "bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white"
            }`}
          >
            <Ban size={14} />
            Block
          </button>

          <button
            onClick={() => onToggleBlock(group.id)}
            disabled={!isBlocked}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              !isBlocked
                ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200 border border-emerald-500"
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

export default AdminGroupCard;
