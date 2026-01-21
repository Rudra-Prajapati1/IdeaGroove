import { MoreVertical, Shield, User, Calendar } from "lucide-react"; // Assuming Lucide-React for icons

const UserCard = ({ user, onToggleBlock }) => {
  const isActive = user.status === "active";

  return (
    <div className="group bg-white border border-gray-100 rounded-lg p-4 flex items-center justify-between hover:border-blue-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-600 font-bold">
          {user.name.charAt(0)}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900 leading-tight">
              {user.name}
            </h4>
          </div>
          <p className="text-sm text-gray-500 mb-1">{user.email}</p>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> Joined Jan 2024
            </span>
            <span className="flex items-center gap-1">
              <Shield size={12} />
              User ID: #{user.id}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="flex flex-col items-end gap-2">
          <span
            className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
              isActive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`}
            />
            {isActive ? "Active" : "Blocked"}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBlock(user.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                isActive
                  ? "text-red-600 hover:bg-red-50 border border-transparent"
                  : "text-emerald-600 hover:bg-emerald-50 border border-transparent"
              }`}
            >
              {isActive ? "Block Account" : "Unblock User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
