const UserCard = ({ user, onToggleBlock }) => {
  return (
    <div className="bg-white border rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition">
      {/* USER INFO */}
      <div className="flex flex-col gap-1">
        <h4 className="font-semibold text-gray-800">{user.name}</h4>
        <p className="text-sm text-gray-500">{user.email}</p>

        <span
          className={`text-xs font-semibold w-fit px-2 py-1 rounded-full ${
            user.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.status}
        </span>
      </div>

      {/* ACTION */}
      <button
        onClick={() => onToggleBlock(user.id)}
        className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
          user.status === "active"
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {user.status === "active" ? "Block" : "Unblock"}
      </button>
    </div>
  );
};

export default UserCard;
