import React, { useState, useEffect, useRef } from "react";
import ChatsSidebar from "../components/chats/ChatsSidebar";
import ChatHeader from "../components/chats/ChatHeader";
import ChatBody from "../components/chats/ChatBody";
import ChatInput from "../components/chats/ChatInput";
import PageHeader from "../components/common/PageHeader";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slice/authSlice";
import { useChat } from "../hooks/useChat";
import { selectChatsByRoomId } from "../redux/slice/chatsSlice";

const Chats = () => {
  const currentUser = useSelector(selectUser);
  const [activeRoom, setActiveRoom] = useState(null);

  const studentId = currentUser
    ? String(currentUser.S_ID ?? currentUser.id ?? "")
    : null;

  const {
    rooms,
    roomsStatus,
    isConnected,
    typingUsers,
    onlineUsers,
    unreadCounts,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendFileMessage,
    editMessage,
    deleteMessageSocket,
    startTyping,
    stopTyping,
    loadMore,
    markSeen,
  } = useChat(studentId);

  // ✅ FIX: Build a selector scoped to the active room only.
  // Previously selectAllMessages was used here — that includes ALL rooms, so
  // any incoming message from any room triggered markSeen on the active room,
  // which also zeroed counts for rooms the user hadn't even looked at yet via
  // the socket seen event. Now we only watch the active room's messages.
  const activeRoomId = activeRoom?.Room_ID ?? null;
  const activeRoomChatsSelector = React.useMemo(
    () => selectChatsByRoomId(activeRoomId ?? -1),
    [activeRoomId],
  );
  const activeRoomChats = useSelector(activeRoomChatsSelector);

  // ✅ FIX: Only fire markSeen when a new message arrives IN the active room,
  // not whenever any message arrives in any room.
  const prevLengthRef = useRef(0);
  useEffect(() => {
    if (!activeRoomId) return;
    const currentLength = activeRoomChats.length;
    if (currentLength !== prevLengthRef.current) {
      prevLengthRef.current = currentLength;
      markSeen(activeRoomId);
    }
  }, [activeRoomChats.length, activeRoomId, markSeen]);

  // Reset the length ref when switching rooms so we don't skip the first markSeen
  useEffect(() => {
    prevLengthRef.current = 0;
  }, [activeRoomId]);

  const handleSelectRoom = (room) => {
    if (activeRoom?.Room_ID) leaveRoom(activeRoom.Room_ID);
    setActiveRoom(room);
    joinRoom(room.Room_ID);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins">
      <PageHeader title="Chats" />
      <section className="flex gap-[0.1rem] px-6 py-8 mt-30 h-[calc(100vh-8rem)]">
        <ChatsSidebar
          onSelectRoom={handleSelectRoom}
          activeRoom={activeRoom}
          rooms={rooms}
          roomsStatus={roomsStatus}
          unreadCounts={unreadCounts}
          onlineUsers={onlineUsers}
          currentUserId={studentId}
        />
        <div className="flex flex-col flex-1 border-5 border-primary rounded-r-2xl">
          <ChatHeader
            activeRoom={activeRoom}
            isConnected={isConnected}
            onlineUsers={onlineUsers}
            currentUserId={studentId}
          />
          <div className="flex-1 overflow-hidden">
            <ChatBody
              activeRoom={activeRoom}
              currentUserId={studentId}
              typingUsers={typingUsers}
              loadMore={loadMore}
              editMessage={editMessage}
              deleteMessageSocket={deleteMessageSocket}
            />
          </div>
          <ChatInput
            activeRoom={activeRoom}
            sendMessage={sendMessage}
            sendFileMessage={sendFileMessage}
            startTyping={startTyping}
            stopTyping={stopTyping}
          />
        </div>
      </section>
    </div>
  );
};

export default Chats;
