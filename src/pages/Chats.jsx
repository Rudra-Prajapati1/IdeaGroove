import React, { useState, useEffect } from "react";
import ChatsSidebar from "../components/chats/ChatsSidebar";
import ChatHeader from "../components/chats/ChatHeader";
import ChatBody from "../components/chats/ChatBody";
import ChatInput from "../components/chats/ChatInput";
import PageHeader from "../components/common/PageHeader";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slice/authSlice";
import { useChat } from "../hooks/useChat";
import { selectAllMessages } from "../redux/slice/chatsSlice";

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

  const allMessages = useSelector(selectAllMessages);
  useEffect(() => {
    if (!activeRoom?.Room_ID) return;
    markSeen(activeRoom.Room_ID);
  }, [allMessages.length, activeRoom?.Room_ID]);

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
