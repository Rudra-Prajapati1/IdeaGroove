import React, { useMemo } from "react";
import Loading from "../common/Loading";

const ChatList = ({
  search,
  filter,
  onSelectRoom,
  activeRoom,
  rooms = [],
  roomsStatus = "idle",
  unreadCounts = {},
  onlineUsers = [],
  currentUserId,
}) => {
  const filteredRooms = useMemo(() => {
    let result = rooms;

    // Filter by type
    if (filter === "groups") {
      result = result.filter((r) => r.Room_Type === "group");
    } else if (filter === "individuals") {
      result = result.filter((r) => r.Room_Type === "direct");
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => {
        if (r.Room_Type === "group") {
          return r.Room_Name?.toLowerCase().includes(q);
        }
        // For direct chats, search by the other person's username/name
        const other = r.Members?.find((m) => m.Student_ID !== currentUserId);
        return (
          other?.username?.toLowerCase().includes(q) ||
          other?.name?.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [rooms, filter, search, currentUserId]);

  // Helper: get display name for a room
  const getRoomDisplayName = (room) => {
    if (room.Room_Type === "group") return room.Room_Name || "Group";
    const other = room.Members?.find((m) => m.Student_ID !== currentUserId);
    return other?.name || other?.username || "Direct Chat";
  };

  // Helper: get avatar letter
  const getAvatarLetter = (room) => {
    const name = getRoomDisplayName(room);
    return name?.[0]?.toUpperCase() || "?";
  };

  // Helper: is the other person in a direct chat online?
  const isOtherOnline = (room) => {
    if (room.Room_Type !== "direct") return false;
    const other = room.Members?.find((m) => m.Student_ID !== currentUserId);
    return other ? onlineUsers.includes(String(other.Student_ID)) : false;
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4">
      {roomsStatus === "loading" && (
        <div className="flex justify-center">
          <Loading text="Loading chats..." />
        </div>
      )}

      {roomsStatus === "failed" && (
        <p className="text-center text-red-500 text-sm mt-4">
          Failed to load chats. Please refresh.
        </p>
      )}

      {(roomsStatus === "idle" || roomsStatus === "succeeded") &&
        filteredRooms.length === 0 && (
          <div className="my-20 flex flex-col items-center gap-3 text-primary">
            <p className="text-xl font-semibold font-poppins">No Chats Found</p>
            <p className="text-md opacity-70 font-inter">
              Try adjusting your search or filters
            </p>
          </div>
        )}

      {filteredRooms.map((room) => {
        const isActive = activeRoom?.Room_ID === room.Room_ID;
        const unread = unreadCounts[room.Room_ID] || 0;
        const online = isOtherOnline(room);

        return (
          <div
            key={room.Room_ID}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelectRoom(room)}
            onClick={() => !isActive && onSelectRoom(room)}
            className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer border-primary transition mb-1 ${
              isActive ? "bg-primary text-white" : "hover:bg-primary/10"
            }`}
          >
            {/* Avatar */}
            <div className="relative h-10 w-10 shrink-0">
              <div
                className={`h-10 w-10 rounded-full border flex items-center justify-center font-semibold text-sm ${
                  isActive
                    ? "border-white text-white"
                    : "border-primary text-primary"
                }`}
              >
                {getAvatarLetter(room)}
              </div>
              {/* Online dot for direct chats */}
              {online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
              )}
            </div>

            {/* Room info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold font-inter truncate text-sm">
                  {getRoomDisplayName(room)}
                </h4>
                {/* Unread badge */}
                {unread > 0 && !isActive && (
                  <span className="ml-2 shrink-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </div>
              <p
                className={`text-xs truncate ${
                  isActive ? "text-white/70" : "text-gray-400"
                }`}
              >
                {room.Last_Message ||
                  (room.Room_Type === "group"
                    ? "Group chat"
                    : "Direct message")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
