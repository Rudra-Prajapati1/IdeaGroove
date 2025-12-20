import React from "react";

const ChatBody = ({ activeRoom = null }) => {
  if (!activeRoom) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <img
          alt="IdeaGroove Logo with a title text and arrows with a light bub and a stack of books"
          src="./Logo.png"
          className="bg-primary rounded-2xl object-cover animate-wiggle hover:scale-110 duration-300"
        />
      </div>
    );
  }

  return <div></div>;
};

export default ChatBody;
