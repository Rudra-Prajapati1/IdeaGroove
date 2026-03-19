import { Search, SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";
import ChatList from "./ChatList";

const FILTER_LABELS = {
  all: "All chats",
  groups: "Groups",
  individuals: "Individuals",
};

const ChatsSidebar = ({
  onSelectRoom,
  activeRoom,
  rooms,
  roomsStatus,
  typingUsers,
  unreadCounts,
  onlineUsers,
  currentUserId,
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <aside className="relative flex w-full min-w-0 flex-col rounded-2xl border-4 text-primary md:max-w-[360px] md:min-w-[280px] md:rounded-r-none md:border-5 md:rounded-l-2xl">
      <h1 className="bg-primary py-4 text-center font-poppins text-xl font-bold text-white sm:py-6 sm:text-2xl md:border-b-5">
        CHATS
      </h1>

      <div className="p-2 relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full border rounded-xl pl-9 pr-3 py-1.5 shadow-sm
                         focus:outline-none focus:ring-1 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="border rounded-xl p-2 hover:bg-gray-100 transition cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2 px-1">
          <span className="text-xs text-primary/50">Showing</span>
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
            {FILTER_LABELS[filter]}
          </span>
        </div>

        {showFilters && (
          <div className="absolute right-3 mt-2 w-40 bg-white border rounded-xl shadow-lg p-3 z-20">
            {["all", "groups", "individuals"].map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 py-1 cursor-pointer capitalize text-sm"
              >
                <input
                  type="radio"
                  name="chatFilter"
                  value={type}
                  checked={filter === type}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setShowFilters(false);
                  }}
                  className="accent-primary"
                />
                {type}
              </label>
            ))}
          </div>
        )}
      </div>

      <ChatList
        search={search}
        filter={filter}
        onSelectRoom={onSelectRoom}
        activeRoom={activeRoom}
        rooms={rooms}
        roomsStatus={roomsStatus}
        typingUsers={typingUsers}
        unreadCounts={unreadCounts}
        onlineUsers={onlineUsers}
        currentUserId={currentUserId}
      />
    </aside>
  );
};

export default ChatsSidebar;
