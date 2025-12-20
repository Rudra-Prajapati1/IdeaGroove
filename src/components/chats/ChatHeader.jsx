import { Info } from "lucide-react";
import React from "react";

const ChatHeader = ({ activeRoom = null }) => {
  if (!activeRoom) {
    return (
      <div className="h-20 w-full bg-primary rounded-tr-lg border-b border-primary"></div>
    );
  }

  return (
    <div className="h-20 w-full flex items-center justify-between px-6 border-b border-primary bg-primary">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full border flex items-center justify-center font-semibold text-white">
          {activeRoom.Room_Type === "group"
            ? activeRoom.Room_Name?.[0] || "G"
            : "D"}
        </div>

        <div>
          <h3 className="font-semibold font-poppins text-white">
            {activeRoom.Room_Type === "group"
              ? activeRoom.Room_Name
              : "Direct Chat"}
          </h3>
          <p className="text-sm text-secondary/70 font-inter">
            Select to know more about the{" "}
            {activeRoom.Room_Type === "group" ? "group" : "chat"}
          </p>
        </div>
      </div>
      <div className="h-10 w-10 flex items-center justify-center text-white cursor-pointer hover:bg-secondary/10 transition">
        <Info className="w-8 h-8" />
      </div>
    </div>
  );
};

export default ChatHeader;
