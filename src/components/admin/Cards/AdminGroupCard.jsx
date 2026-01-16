import group_temp_image from "/images/group_temp_image.jpg";
import { Ban, CheckCircle, Users } from "lucide-react";

const AdminGroupCard = ({ group, onToggleBlock }) => {
  const isBlocked = group.status === "blocked";

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <img
          src={group_temp_image}
          alt={group.Room_Name}
          className="rounded-full h-16 w-16 object-cover border"
        />

        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800">
            {group.Room_Name}
          </h3>
          <p className="text-sm text-slate-500">
            Hobby: <span className="font-medium">{group.Based_On}</span>
          </p>
        </div>

        {/* STATUS */}
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isBlocked
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isBlocked ? "Blocked" : "Active"}
        </span>
      </div>

      {/* META */}
      <div className="text-sm text-slate-600 flex flex-col gap-1">
        <p>
          Created by <span className="font-medium">{group.Created_By}</span>
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-400">
          <Users className="w-4 h-4" />
          {new Date(group.Created_On).toLocaleDateString()}
        </p>
      </div>

      {/* ACTION */}
      <button
        onClick={() => onToggleBlock(group.id)}
        className={`mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
          isBlocked
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {isBlocked ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Unblock Group
          </>
        ) : (
          <>
            <Ban className="w-4 h-4" />
            Block Group
          </>
        )}
      </button>
    </div>
  );
};

export default AdminGroupCard;
