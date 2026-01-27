import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChats,
  selectChatsByRoomId,
  selectChatsStatus,
} from "../../redux/slice/chatsSlice";
import Loading from "../Loading";
import { CheckCheck } from "lucide-react";

/* 🔥 TEMPORARY STATIC USER MAP (REMOVE LATER) */
const USERNAME_MAP = {
  101: "rudra",
  102: "sejal",
  103: "khushal",
};

const LOGGED_IN_STUDENT_ID = 101;
const EMPTY_ARRAY = [];

const ChatBody = ({ activeRoom = null }) => {
  const dispatch = useDispatch();
  const containRef = useRef(null);

  const chatStatus = useSelector(selectChatsStatus);

  const selectEmptyChats = () => EMPTY_ARRAY;

  const chatsSelector = useMemo(() => {
    if (!activeRoom) return selectEmptyChats;
    return selectChatsByRoomId(activeRoom.Room_ID);
  }, [activeRoom?.Room_ID]);

  const chats = useSelector(chatsSelector);

  /* Fetch chats */
  useEffect(() => {
    if (chatStatus === "idle") {
      dispatch(fetchChats());
    }
  }, [chatStatus, dispatch]);

  /* Auto scroll to bottom */
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
      {/* 🔹 ABSOLUTE BACKGROUND WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/DarkLogo.png"
          alt="IdeaGroove watermark"
          className="w-64 opacity-30"
        />
      </div>

      {/* 🔹 CHAT CONTENT */}
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
          const isMe = msg.Sender_ID === LOGGED_IN_STUDENT_ID;
          const isGroup = activeRoom?.Room_Type === "group";
          const senderUsername = USERNAME_MAP[msg.Sender_ID] || "student";

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
                  src={isMe ? "/DarkLogo.png" : "/Logo.png"}
                  className={`w-8 h-8 rounded-full object-cover ${
                    isMe ? "bg-white" : "bg-primary"
                  }`}
                />

                <div className="flex flex-col font-semibold">
                  {/* 🔹 USERNAME (GROUP + INCOMING ONLY) */}
                  {!isMe && isGroup && (
                    <span className="text-xs font-bold text-green-800">
                      @{senderUsername}
                    </span>
                  )}

                  {/* 🔹 MESSAGE */}
                  <span>{msg.Message_Text}</span>

                  {/* 🔹 TIME + STATUS */}
                  <span
                    className={`text-xs flex items-center gap-2 font-light ${
                      isMe ? "text-gray-300" : "text-green-700"
                    }`}
                  >
                    {new Date(msg.Sent_On).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {isMe && <CheckCheck className="w-4 h-4" />}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatBody;
