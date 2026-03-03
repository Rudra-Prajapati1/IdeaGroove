import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectChatsByRoomId,
  selectChatsStatus,
} from "../../redux/slice/chatsSlice";
import Loading from "../common/Loading";
import {
  CheckCheck,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Check,
  FileText,
} from "lucide-react";

const EMPTY_ARRAY = [];

// Format a date into a readable label
const getDateLabel = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const DateDivider = ({ label }) => (
  <div className="flex items-center gap-3 my-2">
    <div className="flex-1 h-px bg-primary/20" />
    <span className="text-xs text-primary/50 font-inter font-medium px-2">
      {label}
    </span>
    <div className="flex-1 h-px bg-primary/20" />
  </div>
);

const ChatBody = ({
  activeRoom = null,
  currentUserId,
  typingUsers = {},
  loadMore,
  editMessage,
  deleteMessageSocket,
}) => {
  const containRef = useRef(null);
  const chatStatus = useSelector(selectChatsStatus);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  // Context menu state
  const [menuMsgId, setMenuMsgId] = useState(null);

  const chatsSelector = useMemo(() => {
    if (!activeRoom) return () => EMPTY_ARRAY;
    return selectChatsByRoomId(activeRoom.Room_ID);
  }, [activeRoom?.Room_ID]);

  const chats = useSelector(chatsSelector);

  const roomTypers = activeRoom
    ? (typingUsers[activeRoom.Room_ID] || []).filter(
        (id) => String(id) !== String(currentUserId),
      )
    : [];

  useEffect(() => {
    if (!containRef.current) return;
    containRef.current.scrollTop = containRef.current.scrollHeight;
  }, [chats, activeRoom?.Room_ID]);

  // Close context menu on outside click
  useEffect(() => {
    const close = () => setMenuMsgId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleEditSubmit = (msg) => {
    if (!editText.trim() || editText === msg.Message_Text) {
      setEditingId(null);
      return;
    }
    editMessage(activeRoom.Room_ID, msg.Message_ID, editText.trim());
    setEditingId(null);
  };

  const handleDelete = (msg) => {
    deleteMessageSocket(activeRoom.Room_ID, msg.Message_ID);
    setMenuMsgId(null);
  };

  const startEdit = (msg) => {
    setEditingId(msg.Message_ID);
    setEditText(msg.Message_Text);
    setMenuMsgId(null);
  };

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

  // Group messages by date for dividers
  const msgsWithDividers = [];
  let lastDateLabel = null;
  for (const msg of chats) {
    const label = getDateLabel(msg.Sent_On);
    if (label !== lastDateLabel) {
      msgsWithDividers.push({ type: "divider", label, id: `divider-${label}` });
      lastDateLabel = label;
    }
    msgsWithDividers.push({ type: "message", msg });
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img src="/DarkLogo.png" alt="watermark" className="w-64 opacity-30" />
      </div>

      <div
        ref={containRef}
        className="relative z-10 h-full overflow-y-auto px-6 py-4 space-y-1"
      >
        {chatStatus === "loading" && <Loading />}

        {chatStatus === "succeeded" && chats.length === 0 && (
          <p className="text-center text-primary font-semibold mt-8">
            Start the conversation by sending the first message
          </p>
        )}

        {msgsWithDividers.map((item) => {
          if (item.type === "divider") {
            return <DateDivider key={item.id} label={item.label} />;
          }

          const { msg } = item;
          const isMe = String(msg.Sender_ID) === String(currentUserId);
          const isGroup = activeRoom?.Room_Type === "group";
          const senderUsername = msg.Sender_Username || "Student";
          const isEditing = editingId === msg.Message_ID;
          const showMenu = menuMsgId === msg.Message_ID;

          return (
            <div
              key={msg.Message_ID}
              className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {/* 3-dot menu for own messages */}
              {isMe && !msg.Is_Deleted && (
                <div className="relative self-center mr-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuMsgId(showMenu ? null : msg.Message_ID);
                    }}
                    className="p-1 rounded-full hover:bg-primary/10 text-primary/40 hover:text-primary transition"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {showMenu && (
                    <div className="absolute bottom-8 right-0 bg-white border border-primary/20 rounded-xl shadow-lg z-50 overflow-hidden w-28">
                      <button
                        onClick={() => startEdit(msg)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary hover:bg-primary/10 transition"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(msg)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}

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
                      ? msg.Sender_Profile_Pic
                      : isMe
                        ? "/DarkLogo.png"
                        : "/Logo.png"
                  }
                  className={`w-8 h-8 rounded-full object-cover shrink-0 ${isMe ? "bg-white" : "bg-primary"}`}
                  alt={senderUsername}
                />

                <div className="flex flex-col font-semibold min-w-0">
                  {!isMe && isGroup && (
                    <span className="text-xs font-bold text-green-800 mb-0.5">
                      @{senderUsername}
                    </span>
                  )}

                  {/* Message content */}
                  {msg.Is_Deleted ? (
                    <em className="opacity-50 font-normal text-xs">
                      Message deleted
                    </em>
                  ) : isEditing ? (
                    // Inline edit input
                    <div className="flex items-center gap-1 mt-0.5">
                      <input
                        autoFocus
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSubmit(msg);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="bg-white/20 border border-white/40 rounded px-2 py-0.5 text-sm text-white outline-none w-full"
                      />
                      <button
                        onClick={() => handleEditSubmit(msg)}
                        className="shrink-0"
                      >
                        <Check className="w-4 h-4 text-green-300 hover:text-green-100" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="shrink-0"
                      >
                        <X className="w-4 h-4 text-red-300 hover:text-red-100" />
                      </button>
                    </div>
                  ) : msg.Message_Type === "image" ? (
                    // Image message
                    <a
                      href={msg.Message_Text}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={msg.Message_Text}
                        alt="attachment"
                        className="max-w-[200px] rounded-lg mt-1 border border-white/20"
                      />
                    </a>
                  ) : msg.Message_Type === "file" ? (
                    // PDF message
                    <a
                      href={msg.Message_Text}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 mt-1 underline underline-offset-2"
                    >
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate max-w-40">View PDF</span>
                    </a>
                  ) : (
                    <span className="wrap-break-word">{msg.Message_Text}</span>
                  )}

                  {/* Time + seen ticks */}
                  {!isEditing && (
                    <span
                      className={`text-xs flex items-center gap-1 font-light mt-0.5 ${
                        isMe ? "text-gray-300" : "text-green-700"
                      }`}
                    >
                      {new Date(msg.Sent_On).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {isMe && !msg.Is_Deleted && (
                        <CheckCheck
                          className={`w-4 h-4 ${
                            msg.Is_Seen === 1 || msg.Is_Seen === true
                              ? "text-blue-300"
                              : "text-gray-300"
                          }`}
                        />
                      )}
                      {isMe && msg.Is_Edited === 1 && !msg.Is_Deleted && (
                        <span className="text-[10px] opacity-60 ml-1">
                          edited
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {roomTypers.length > 0 && (
          <div className="flex justify-start mb-3">
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
