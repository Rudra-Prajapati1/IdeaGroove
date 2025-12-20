import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChats,
  selectChatsByRoomId,
  selectChatsStatus,
} from "../../redux/slice/chatsSlice";
import Loading from "../Loading";

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

  useEffect(() => {
    if (chatStatus === "idle") {
      dispatch(fetchChats());
    }
  }, [chatStatus, dispatch]);

  useEffect(() => {
    if (!containRef.current) return;

    containRef.current.scrollTop = containRef.current.scrollHeight;
  }, [chats, activeRoom?.Room_ID]);

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
    <div
      ref={containRef}
      className="h-full w-full overflow-y-auto px-6 py-4 space-y-4"
    >
      {chatStatus === "loading" && <Loading />}
      {chatStatus === "succeeded" && chats.length === 0 && (
        <p className="text-center text-primary">
          Start the conversation by sending the first message
        </p>
      )}

      {chats.map((msg) => {
        const isMe = msg.Sender_ID === LOGGED_IN_STUDENT_ID;

        return (
          <div
            key={msg.Message_ID}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-xl text-sm font-inter ${
                isMe
                  ? "bg-primary text-white rounded-br-none"
                  : "border text-primary rounded-bl-none"
              }`}
            >
              {msg.Message_Text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatBody;
