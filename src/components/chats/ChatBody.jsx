import React, { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import {
  selectChatsByRoomId,
  selectChatsStatus,
} from "../../redux/slice/chatsSlice";
import Loading from "../common/Loading";
import { CheckCheck } from "lucide-react";

const EMPTY_ARRAY = [];

const ChatBody = ({
  activeRoom = null,
  currentUserId,
  typingUsers = {},
  loadMore,
}) => {
  const containRef = useRef(null);

  const chatStatus = useSelector(selectChatsStatus);

  const selectEmptyChats = () => EMPTY_ARRAY;

  const chatsSelector = useMemo(() => {
    if (!activeRoom) return selectEmptyChats;
    return selectChatsByRoomId(activeRoom.Room_ID);
  }, [activeRoom?.Room_ID]);

  const chats = useSelector(chatsSelector);

  // Who is typing in this room (excluding current user)
  const roomTypers = activeRoom
    ? (typingUsers[activeRoom.Room_ID] || []).filter(
        (id) => String(id) !== String(currentUserId),
      )
    : [];

  /* Auto scroll to bottom on new messages */
  useEffect(() => {
    if (!containRef.current) return;
    containRef.current.scrollTop = containRef.current.scrollHeight;
  }, [chats, activeRoom?.Room_ID]);

  /* Empty room state */
  if (!activeRoom) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <img
          src="./Logo.png"
          alt="IdeaGroove Logo"
          className="bg-primary rounded-2xl animate-wiggle hover:scale-110 duration-300"
        />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/DarkLogo.png"
          alt="IdeaGroove watermark"
          className="w-64 opacity-30"
        />
      </div>

      {/* Chat content */}
      <div
        ref={containRef}
        className="relative z-10 h-full overflow-y-auto px-6 py-4 space-y-4"
      >
        {chatStatus === "loading" && <Loading />}

        {chatStatus === "succeeded" && chats.length === 0 && (
          <p className="text-center text-primary font-semibold">
            Start the conversation by sending the first message
          </p>
        )}

        {chats.map((msg) => {
          const isMe = String(msg.Sender_ID) === String(currentUserId);
          const isGroup = activeRoom?.Room_Type === "group";
          const senderUsername = msg.Sender_Username || "Student";

          return (
            <div
              key={msg.Message_ID}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-xl flex items-start gap-3 text-sm font-inter ${
                  isMe
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-white border border-primary text-primary rounded-bl-none"
                }`}
              >
                <img
                  src={
                    msg.Sender_Profile_Pic
                      ? `/uploads/${msg.Sender_Profile_Pic}`
                      : isMe
                        ? "/DarkLogo.png"
                        : "/Logo.png"
                  }
                  className={`w-8 h-8 rounded-full object-cover ${
                    isMe ? "bg-white" : "bg-primary"
                  }`}
                  alt={senderUsername}
                />

                <div className="flex flex-col font-semibold">
                  {/* Username for incoming group messages */}
                  {!isMe && isGroup && (
                    <span className="text-xs font-bold text-green-800">
                      @{senderUsername}
                    </span>
                  )}

                  {/* Message text */}
                  <span>
                    {msg.Is_Deleted ? (
                      <em className="opacity-60">Message deleted</em>
                    ) : (
                      msg.Message_Text
                    )}
                  </span>

                  {/* Time + seen status */}
                  <span
                    className={`text-xs flex items-center gap-2 font-light ${
                      isMe ? "text-gray-300" : "text-green-700"
                    }`}
                  >
                    {new Date(msg.Sent_On).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {isMe && (
                      <CheckCheck
                        className={`w-4 h-4 ${msg.Is_Seen ? "text-blue-300" : "text-gray-300"}`}
                      />
                    )}
                    {isMe && msg.Is_Edited && (
                      <span className="text-[10px] opacity-60">edited</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {roomTypers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-white border border-primary text-primary px-4 py-2 rounded-xl rounded-bl-none text-sm font-inter flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
              <span className="text-xs opacity-70">
                {roomTypers.length === 1
                  ? "Someone is typing..."
                  : "Multiple people are typing..."}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBody;
