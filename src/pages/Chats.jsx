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
    isConnected,
    messages,
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
  } = useChat(currentUser.id);

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins">
      <PageHeader title="Chats" />
      <section className="flex gap-[0.1rem] px-6 py-8 mt-30 h-[calc(100vh-8rem)]">
        <ChatsSidebar onSelectRoom={setActiveRoom} activeRoom={activeRoom} />

        <div className="flex flex-col flex-1 border-5 border-primary rounded-r-2xl">
          <ChatHeader activeRoom={activeRoom} />
          <div className="flex-1 overflow-hidden">
            <ChatBody activeRoom={activeRoom} />
          </div>
          <ChatInput activeRoom={activeRoom} />
        </div>
      </section>
    </div>
  );
};

export default Chats;
