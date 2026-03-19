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
import { useLocation, useNavigate } from "react-router-dom";

const Chats = () => {
  const currentUser = useSelector(selectUser);
  const [activeRoom, setActiveRoom] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleSelectRoom = React.useCallback(
    (room) => {
      if (!room?.Room_ID) return;
      if (
        activeRoom?.Room_ID &&
        Number(activeRoom.Room_ID) !== Number(room.Room_ID)
      ) {
        leaveRoom(activeRoom.Room_ID);
      }
      setActiveRoom(room);
      joinRoom(room.Room_ID);
    },
    [activeRoom?.Room_ID, joinRoom, leaveRoom],
  );

  const targetRoomId = location.state?.roomId
    ? Number(location.state.roomId)
    : null;

  const clearTargetRoomState = React.useCallback(() => {
    if (!location.state?.roomId) return;
    const nextState = { ...location.state };
    delete nextState.roomId;
    navigate(location.pathname, {
      replace: true,
      state: Object.keys(nextState).length > 0 ? nextState : null,
    });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!targetRoomId || roomsStatus !== "succeeded") return;

    const targetRoom = rooms.find(
      (room) => Number(room.Room_ID) === Number(targetRoomId),
    );

    if (!targetRoom) return;

    if (Number(activeRoom?.Room_ID) !== Number(targetRoom.Room_ID)) {
      handleSelectRoom(targetRoom);
    }

    clearTargetRoomState();
  }, [
    activeRoom?.Room_ID,
    clearTargetRoomState,
    handleSelectRoom,
    rooms,
    roomsStatus,
    targetRoomId,
  ]);

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins">
      <PageHeader title="Chats" />
      <section className="mt-8 flex min-h-[calc(100vh-12rem)] flex-col gap-4 px-4 py-6 sm:px-6 md:mt-12 md:h-[calc(100vh-8rem)] md:flex-row md:gap-[0.1rem] md:py-8">
        <ChatsSidebar
          onSelectRoom={handleSelectRoom}
          activeRoom={activeRoom}
          rooms={rooms}
          roomsStatus={roomsStatus}
          typingUsers={typingUsers}
          unreadCounts={unreadCounts}
          onlineUsers={onlineUsers}
          currentUserId={studentId}
        />
        <div className="flex min-h-[60vh] flex-1 flex-col rounded-2xl border-4 border-primary md:rounded-l-none md:rounded-r-2xl md:border-5">
          <ChatHeader
            activeRoom={activeRoom}
            onlineUsers={onlineUsers}
            currentUserId={studentId}
          />
          <div className="flex-1 overflow-hidden">
            <ChatBody
              activeRoom={activeRoom}
              currentUserId={studentId}
              isConnected={isConnected}
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
