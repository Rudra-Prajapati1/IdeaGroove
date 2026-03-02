import React, { useState } from "react";
import ChatsSidebar from "../components/chats/ChatsSidebar";
import ChatHeader from "../components/chats/ChatHeader";
import ChatBody from "../components/chats/ChatBody";
import ChatInput from "../components/chats/ChatInput";
import PageHeader from "../components/common/PageHeader";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slice/authSlice";
import { useChat } from "../hooks/useChat";

const Chats = () => {
  const currentUser = useSelector(selectUser);
  const [activeRoom, setActiveRoom] = useState(null);

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
    markSeen,
    startTyping,
    stopTyping,
    loadMore,
    getUnreadCounts,
  } = useChat(currentUser?.S_ID || currentUser?.id);

  // When a room is selected: leave old room, join new one
  const handleSelectRoom = (room) => {
    if (activeRoom?.Room_ID) {
      leaveRoom(activeRoom.Room_ID);
    }
    setActiveRoom(room);
    joinRoom(room.Room_ID);
    markSeen(room.Room_ID);
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
          currentUserId={currentUser?.S_ID || currentUser?.id}
        />

        <div className="flex flex-col flex-1 border-5 border-primary rounded-r-2xl">
          <ChatHeader
            activeRoom={activeRoom}
            isConnected={isConnected}
            onlineUsers={onlineUsers}
            currentUserId={currentUser?.S_ID || currentUser?.id}
          />
          <div className="flex-1 overflow-hidden">
            <ChatBody
              activeRoom={activeRoom}
              currentUserId={currentUser?.S_ID || currentUser?.id}
              typingUsers={typingUsers}
              loadMore={loadMore}
            />
          </div>
          <ChatInput
            activeRoom={activeRoom}
            sendMessage={sendMessage}
            startTyping={startTyping}
            stopTyping={stopTyping}
          />
        </div>
      </section>
    </div>
  );
};

export default Chats;
