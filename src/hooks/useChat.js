import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import api from "../api/axios";
import {
  setRoomHistory,
  addMessage,
  prependMessages,
  setTypingUsers,
  setUserOnline,
  setUnreadCounts,
  markRoomSeen,
  updateSeenMessages,
  setIsConnected,
  setActiveRoom,
  setCurrentUserId,
  fetchUserChatRooms,
  updateMessage,
  selectChatRooms,
  selectChatRoomsStatus,
  selectChatRoomsError,
  selectIsConnected,
  selectTypingUsers,
  selectOnlineUsers,
  selectUnreadCounts,
  selectAllMessages,
  setOnlineUsersList,
} from "../redux/slice/chatsSlice";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export function useChat(studentId) {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const typingTimeouts = useRef({});
  const subscribedRooms = useRef(new Set());
  const roomsRef = useRef([]);

  const rooms = useSelector(selectChatRooms);
  const roomsStatus = useSelector(selectChatRoomsStatus);
  const roomsError = useSelector(selectChatRoomsError);
  const isConnected = useSelector(selectIsConnected);
  const typingUsers = useSelector(selectTypingUsers);
  const onlineUsers = useSelector(selectOnlineUsers);
  const unreadCounts = useSelector(selectUnreadCounts);
  const messages = useSelector(selectAllMessages);

  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);

  useEffect(() => {
    if (studentId) {
      dispatch(setCurrentUserId(String(studentId)));
    }
  }, [studentId, dispatch]);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchUserChatRooms());
    }
  }, [studentId, dispatch]);

  const subscribeToAllRooms = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected) return;
    roomsRef.current.forEach((room) => {
      const roomId = room.Room_ID;
      if (!subscribedRooms.current.has(roomId)) {
        socket.emit("room:subscribe", { roomId });
        subscribedRooms.current.add(roomId);
      }
    });
  }, []);

  useEffect(() => {
    subscribeToAllRooms();
  }, [rooms, subscribeToAllRooms]);

  useEffect(() => {
    if (isConnected) {
      subscribeToAllRooms();
    }
  }, [isConnected, subscribeToAllRooms]);

  useEffect(() => {
    if (!studentId) return;

    const socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
    });
    socketRef.current = socket;
    subscribedRooms.current = new Set();
    socket.connect();

    socket.on("connect", () => {
      console.log("[Socket] Connected");
      dispatch(setIsConnected(true));
      socket.emit("user:online", { studentId });
      subscribedRooms.current = new Set();
    });

    socket.on("disconnect", () => {
      console.log("[Socket] Disconnected");
      dispatch(setIsConnected(false));
    });

    socket.on("room:history", ({ roomId, messages: msgs }) => {
      console.log(`[Socket] room:history for room ${roomId}:`, msgs.length);
      dispatch(setRoomHistory({ roomId, messages: msgs }));
    });

    socket.on("message:new", ({ roomId, message }) => {
      console.log("[Socket] message:new", message);
      const isMine = String(message.Sender_ID) === String(studentId);
      dispatch(addMessage({ roomId, message, skipUnread: isMine }));
    });

    socket.on("message:more", ({ roomId, messages: msgs }) => {
      console.log("[Socket] message:more", msgs.length);
      dispatch(prependMessages({ roomId, messages: msgs }));
    });

    socket.on("typing:update", ({ roomId, studentId: typerId, isTyping }) => {
      dispatch(setTypingUsers({ roomId, studentId: typerId, isTyping }));
    });

    socket.on("user:status", ({ studentId: uid, status }) => {
      dispatch(setUserOnline({ studentId: uid, status }));
    });

    socket.on("users:online_list", ({ onlineUserIds }) => {
      dispatch(setOnlineUsersList(onlineUserIds));
    });

    socket.on("message:seen_update", ({ roomId, seenBy }) => {
      console.log("[Socket] message:seen_update", roomId, seenBy);
      dispatch(updateSeenMessages({ roomId, seenBy }));
    });

    socket.on("rooms:unread_counts", (counts) => {
      dispatch(setUnreadCounts(counts));
    });

    socket.on("message:edited", ({ messageId, newText }) => {
      console.log("[Socket] message:edited", messageId);
      dispatch(
        updateMessage({
          messageId,
          changes: { Message_Text: newText, Is_Edited: 1 },
        }),
      );
    });

    socket.on("message:deleted", ({ messageId }) => {
      console.log("[Socket] message:deleted", messageId);
      dispatch(updateMessage({ messageId, changes: { Is_Deleted: 1 } }));
    });

    socket.on("error", (error) => {
      console.error("[Socket] Error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [studentId, dispatch]);

  const joinRoom = useCallback(
    (roomId) => {
      console.log("[Chat] Joining room", roomId);
      dispatch(setActiveRoom(roomId));
      dispatch(markRoomSeen(roomId));
      socketRef.current?.emit("room:join", { roomId, studentId });
    },
    [studentId, dispatch],
  );

  const leaveRoom = useCallback(
    (roomId) => {
      console.log("[Chat] Leaving room", roomId);
      dispatch(setActiveRoom(null));
      socketRef.current?.emit("room:leave", { roomId });
    },
    [dispatch],
  );

  const sendMessage = useCallback((roomId, message) => {
    if (!message?.trim()) return;
    console.log("[Chat] Sending message", roomId);
    socketRef.current?.emit("message:send", {
      roomId,
      message: message.trim(),
    });
  }, []);

  // ✅ FIX: Accept and pass fileName to socket
  const sendFileMessage = useCallback((roomId, fileUrl, messageType, fileName) => {
    console.log("[Chat] Sending file", roomId, messageType, fileName);
    socketRef.current?.emit("message:send_file", {
      roomId,
      fileUrl,
      messageType,
      fileName: fileName || null,
    });
  }, []);

  const editMessage = useCallback((roomId, messageId, newText) => {
    console.log("[Chat] Editing message", messageId);
    socketRef.current?.emit("message:edit", { roomId, messageId, newText });
  }, []);

  const deleteMessageSocket = useCallback((roomId, messageId) => {
    console.log("[Chat] Deleting message", messageId);
    socketRef.current?.emit("message:delete", { roomId, messageId });
  }, []);

  const markSeenViaRest = useCallback(async (roomId) => {
    try {
      await api.post("/chats/mark-seen", { room_id: roomId });
      console.log("[Chat] Marked seen via REST API");
    } catch (err) {
      console.error("[Chat] Failed to mark seen via REST:", err);
    }
  }, []);

  const markSeen = useCallback(
    (roomId) => {
      console.log("[Chat] Mark seen", roomId);
      dispatch(markRoomSeen(roomId));
      if (socketRef.current?.connected) {
        socketRef.current.emit("message:seen", { roomId });
      } else {
        markSeenViaRest(roomId);
      }
    },
    [dispatch, markSeenViaRest],
  );

  const startTyping = useCallback((roomId) => {
    socketRef.current?.emit("typing:start", { roomId });
    clearTimeout(typingTimeouts.current[roomId]);
    typingTimeouts.current[roomId] = setTimeout(() => {
      socketRef.current?.emit("typing:stop", { roomId });
    }, 2000);
  }, []);

  const stopTyping = useCallback((roomId) => {
    clearTimeout(typingTimeouts.current[roomId]);
    socketRef.current?.emit("typing:stop", { roomId });
  }, []);

  const loadMore = useCallback((roomId, offset) => {
    console.log("[Chat] Load more", roomId, offset);
    socketRef.current?.emit("message:load_more", { roomId, offset });
  }, []);

  const getUnreadCounts = useCallback((roomIds) => {
    socketRef.current?.emit("rooms:unread_counts", { roomIds });
  }, []);

  return {
    rooms,
    roomsStatus,
    roomsError,
    messages,
    typingUsers,
    onlineUsers,
    unreadCounts,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendFileMessage,
    editMessage,
    deleteMessageSocket,
    markSeen,
    startTyping,
    stopTyping,
    loadMore,
    getUnreadCounts,
  };
}