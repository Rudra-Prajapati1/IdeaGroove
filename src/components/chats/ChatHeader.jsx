import { CalendarDays, Info, Users } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import GradientAvatar from "../common/GradientAvatar";

const ChatHeader = ({
  activeRoom = null,
  onlineUsers = [],
  currentUserId,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef(null);

  useClickOutside(detailsRef, () => setShowDetails(false));

  useEffect(() => {
    setShowDetails(false);
  }, [activeRoom?.Room_ID]);

  if (!activeRoom) {
    return (
      <div className="h-20 w-full bg-primary rounded-tr-lg border-b border-primary"></div>
    );
  }

  const isGroup = activeRoom.Room_Type === "group";
  const otherMember = !isGroup
    ? activeRoom.Members?.find(
        (m) => String(m.Student_ID) !== String(currentUserId),
      )
    : null;
  const otherOnline = otherMember
    ? onlineUsers.includes(String(otherMember.Student_ID))
    : false;

  const displayName = isGroup
    ? activeRoom.Room_Name || "Group"
    : otherMember?.name || otherMember?.username || "Direct Chat";
  const avatarSrc = !isGroup ? otherMember?.Profile_Pic || "" : "";

  const statusText = isGroup
    ? `${activeRoom.Members?.length || 0} members`
    : otherOnline
      ? "Online"
      : "Offline";

  const createdOn = activeRoom.Created_On
    ? new Date(activeRoom.Created_On).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const visibleMembers = (activeRoom.Members || []).map((member) => ({
    ...member,
    isOnline: onlineUsers.includes(String(member.Student_ID)),
  }));

  return (
    <div className="h-20 w-full flex items-center justify-between px-6 border-b border-primary bg-primary">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="h-12 w-12 overflow-hidden rounded-full border border-white flex items-center justify-center font-semibold text-white text-lg">
            {isGroup ? (
              <div className="flex h-full w-full items-center justify-center bg-white/10 text-white">
                {displayName?.[0]?.toUpperCase() || "?"}
              </div>
            ) : (
              <GradientAvatar
                name={displayName}
                imageSrc={avatarSrc}
                alt={displayName}
                className="rounded-full"
                textClassName="text-lg"
              />
            )}
          </div>
          {!isGroup && otherOnline && (
            <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-primary" />
          )}
        </div>

        <div>
          <h3 className="font-semibold font-poppins text-white">
            {displayName}
          </h3>
          <p
            className={`text-sm font-inter ${otherOnline && !isGroup ? "text-green-300" : "text-white/60"}`}
          >
            {statusText}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={detailsRef}>
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="h-10 w-10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10 rounded-lg transition"
          >
            <Info className="w-8 h-8" />
          </button>

          {showDetails && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-xl shadow-lg p-4 z-30 text-primary">
              <div className="flex items-start justify-between gap-3 border-b border-primary/10 pb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-primary/50">
                    {isGroup ? "Group details" : "Chat details"}
                  </p>
                  <h4 className="font-semibold font-poppins text-base mt-1">
                    {displayName}
                  </h4>
                  <p className="text-sm text-primary/60 mt-0.5">
                    {statusText}
                  </p>
                </div>
              </div>

              {isGroup ? (
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-xl bg-[#FFFBEB] border border-primary/10 p-3">
                      <p className="text-primary/50 text-xs">Created by</p>
                      <p className="font-medium mt-1">
                        {activeRoom.Creator_Name ||
                          activeRoom.Creator_Username ||
                          "Group admin"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#FFFBEB] border border-primary/10 p-3">
                      <p className="text-primary/50 text-xs">Members</p>
                      <p className="font-medium mt-1">
                        {activeRoom.Members?.length || 0}
                      </p>
                    </div>
                  </div>

                  {createdOn && (
                    <div className="flex items-center gap-2 text-sm text-primary/70">
                      <CalendarDays className="w-4 h-4" />
                      <span>Created on {createdOn}</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4" />
                      <p className="font-medium text-sm">About</p>
                    </div>
                    <div className="rounded-xl bg-[#FFFBEB] border border-primary/10 p-3 text-sm text-primary/70 leading-relaxed">
                      {activeRoom.Description || "No group description added yet."}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4" />
                      <p className="font-medium text-sm">Members</p>
                    </div>
                    <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                      {visibleMembers.map((member) => {
                        const memberName =
                          member.name || member.username || "Member";
                        const isCurrentUser =
                          String(member.Student_ID) === String(currentUserId);

                        return (
                          <div
                            key={member.Student_ID}
                            className="flex items-center justify-between rounded-xl border border-primary/10 bg-[#FFFBEB] px-3 py-2"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative h-9 w-9 shrink-0">
                                {member.Profile_Pic ? (
                                  <img
                                    src={member.Profile_Pic}
                                    alt={memberName}
                                    className="h-9 w-9 rounded-full object-cover border border-primary/10"
                                  />
                                ) : (
                                  <div className="h-9 w-9 overflow-hidden rounded-full border border-primary/20">
                                    <GradientAvatar
                                      name={memberName}
                                      alt={memberName}
                                      className="rounded-full"
                                      textClassName="text-sm"
                                    />
                                  </div>
                                )}
                                {member.isOnline && (
                                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-white" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {isCurrentUser ? "You" : memberName}
                                </p>
                                <p className="text-xs text-primary/50 truncate">
                                  @{member.username || "member"}
                                </p>
                              </div>
                            </div>

                            <span className="text-[11px] uppercase tracking-wide text-primary/50">
                              {member.role || "member"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  <div className="rounded-xl bg-[#FFFBEB] border border-primary/10 p-3">
                    <p className="text-xs text-primary/50">Participant</p>
                    <p className="font-medium mt-1">
                      {otherMember?.name || otherMember?.username || "Direct chat"}
                    </p>
                    <p className="text-sm text-primary/60 mt-1">
                      @{otherMember?.username || "member"}
                    </p>
                  </div>

                  {createdOn && (
                    <div className="flex items-center gap-2 text-sm text-primary/70">
                      <CalendarDays className="w-4 h-4" />
                      <span>Started on {createdOn}</span>
                    </div>
                  )}

                  <div className="rounded-xl bg-[#FFFBEB] border border-primary/10 p-3 text-sm">
                    <p className="text-primary/50 text-xs mb-1">Status</p>
                    <p className={otherOnline ? "text-green-700" : "text-primary/70"}>
                      {otherOnline ? "Currently online" : "Currently offline"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
