import React from "react";
import ChatsSidebar from "../components/chats/ChatsSidebar";
import ChatHeader from "../components/chats/ChatHeader";
import ChatBody from "../components/chats/ChatBody";
import ChatInput from "../components/chats/ChatInput";

const Chats = () => {
  return (
    <section className="flex gap-6 px-6 py-8 mt-30 h-[calc(100vh-8rem)]">
      <ChatsSidebar />

      <div className="flex flex-col flex-1 border-5 border-primary rounded-2xl">
        <ChatHeader />
        <div className="flex-1 overflow-hidden">
          <ChatBody />
        </div>
        <ChatInput />
      </div>
    </section>
  );
};

export default Chats;
