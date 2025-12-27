import { Send } from "lucide-react";
import React, { useState } from "react";

const ChatInput = ({ activeRoom = null }) => {
  if (!activeRoom) {
    return null;
  }

  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    alert("Message sent");
    console.log("Message sent:", message);

    setMessage("");
  };

  return (
    <div className="p-4 border-t flex items-center gap-3">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:opacity-90"
      >
        <Send />
      </button>
    </div>
  );
};

export default ChatInput;
