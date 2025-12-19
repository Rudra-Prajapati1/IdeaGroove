import { Search, SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";
import ChatList from "./ChatList";

const ChatsSidebar = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <aside className="w-[25%] min-w-[280px] max-w-[360px] border-5 rounded-2xl flex flex-col text-primary relative">
      <h1 className="font-poppins font-bold text-2xl text-center py-6 border-b-5">
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
                         focus:outline-none focus:ring-2 focus:ring-primary"
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

      <ChatList search={search} filter={filter} />
    </aside>
  );
};

export default ChatsSidebar;
