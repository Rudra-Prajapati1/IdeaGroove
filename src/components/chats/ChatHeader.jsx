import { Info } from "lucide-react";
import React from "react";

const ChatHeader = ({
  activeRoom = null,
  isConnected,
  onlineUsers = [],
  currentUserId,
}) => {
  if (!activeRoom) {
    return (
      <div className="h-20 w-full bg-primary rounded-tr-lg border-b border-primary"></div>
    );
  }

  // For direct chats: check if the other person is online
  const isGroup = activeRoom.Room_Type === "group";
  const otherMember = !isGroup
    ? activeRoom.Members?.find(
        (m) => String(m.Student_ID) !== String(currentUserId),
      )
    : null;
  const otherOnline = otherMember
    ? onlineUsers.includes(String(otherMember.Student_ID))
    : false;

  const displayName = isGroup
    ? activeRoom.Room_Name || "Group"
    : otherMember?.name || otherMember?.username || "Direct Chat";

  const statusText = isGroup
    ? `${activeRoom.Members?.length || 0} members`
    : otherOnline
      ? "Online"
      : "Offline";

  return (
    <div className="h-20 w-full flex items-center justify-between px-6 border-b border-primary bg-primary">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="h-12 w-12 rounded-full border border-white flex items-center justify-center font-semibold text-white text-lg">
            {displayName?.[0]?.toUpperCase() || "?"}
          </div>
          {!isGroup && otherOnline && (
            <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-primary" />
          )}
        </div>

        <div>
          <h3 className="font-semibold font-poppins text-white">
            {displayName}
          </h3>
          <p
            className={`text-sm font-inter ${otherOnline && !isGroup ? "text-green-300" : "text-white/60"}`}
          >
            {statusText}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isConnected
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {isConnected ? "Connected" : "Reconnecting..."}
        </span>

        <div className="h-10 w-10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10 rounded-lg transition">
          <Info className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
