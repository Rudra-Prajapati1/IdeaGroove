import { Send } from "lucide-react";
import React, { useState } from "react";

const ChatInput = ({
  activeRoom = null,
  sendMessage,
  startTyping,
  stopTyping,
}) => {
  const [message, setMessage] = useState("");

  if (!activeRoom) return null;

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(activeRoom.Room_ID, message);
    if (stopTyping) stopTyping(activeRoom.Room_ID);
    setMessage("");
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (startTyping) startTyping(activeRoom.Room_ID);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t flex items-center gap-3">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className="px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <Send />
      </button>
    </div>
  );
};

export default ChatInput;
