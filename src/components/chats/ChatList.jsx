import React from "react";

const ChatList = () => {
  const chats = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    name: `ABC ${i + 1}`,
    lastMessage: "Hey, how are you?",
    time: "12:00 PM",
  }));

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-gray-100 transition"
        >
          <div className="h-10 w-10 rounded-full border flex items-center justify-center font-semibold">
            {chat.name[0]}
          </div>

          <div className="flex-1">
            <h4 className="font-semibold font-inter">{chat.name}</h4>
            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
          </div>

          <span className="text-xs text-gray-400">{chat.time}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
