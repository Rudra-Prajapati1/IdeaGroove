import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
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
  fetchUserChatRooms,
} from "../redux/slice/chatsSlice";
import {
  selectChatRooms,
  selectChatRoomsStatus,
  selectChatRoomsError,
  selectIsConnected,
  selectTypingUsers,
  selectOnlineUsers,
  selectUnreadCounts,
  selectAllMessages,
} from "../redux/slice/chatsSlice";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export function useChat(studentId) {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const typingTimeouts = useRef({});

  // ── Redux state ────────────────────────────────────────────────────────────
  const rooms = useSelector(selectChatRooms);
  const roomsStatus = useSelector(selectChatRoomsStatus);
  const roomsError = useSelector(selectChatRoomsError);
  const isConnected = useSelector(selectIsConnected);
  const typingUsers = useSelector(selectTypingUsers);
  const onlineUsers = useSelector(selectOnlineUsers);
  const unreadCounts = useSelector(selectUnreadCounts);
  const messages = useSelector(selectAllMessages); // flat array of all messages

  // ── Socket Setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!studentId) return;

    const socket = io(SOCKET_URL, { autoConnect: false });
    socketRef.current = socket;
    socket.connect();

    socket.on("connect", () => {
      dispatch(setIsConnected(true));
      socket.emit("user:online", { studentId });
      // Fetch rooms list via REST once connected
      dispatch(fetchUserChatRooms());
    });

    socket.on("disconnect", () => {
      dispatch(setIsConnected(false));
    });

    // Room history (after joining a room)
    socket.on("room:history", ({ roomId, messages: msgs }) => {
      dispatch(setRoomHistory({ roomId, messages: msgs }));
    });

    // New incoming message
    socket.on("message:new", ({ roomId, message }) => {
      dispatch(addMessage({ roomId, message }));
    });

    // Older messages loaded (load more)
    socket.on("message:more", ({ roomId, messages: msgs }) => {
      dispatch(prependMessages({ roomId, messages: msgs }));
    });

    // Typing updates
    socket.on("typing:update", ({ roomId, studentId: typerId, isTyping }) => {
      dispatch(setTypingUsers({ roomId, studentId: typerId, isTyping }));
    });

    // Online / offline status
    socket.on("user:status", ({ studentId: uid, status }) => {
      dispatch(setUserOnline({ studentId: uid, status }));
    });

    // Seen receipts
    socket.on("message:seen_update", ({ roomId, seenBy }) => {
      dispatch(updateSeenMessages({ roomId, seenBy }));
    });

    // Bulk unread counts
    socket.on("rooms:unread_counts", (counts) => {
      dispatch(setUnreadCounts(counts));
    });

    return () => {
      socket.disconnect();
    };
  }, [studentId, dispatch]);

  // ── Socket Actions ──────────────────────────────────────────────────────────

  const joinRoom = useCallback(
    (roomId) => {
      socketRef.current?.emit("room:join", { roomId, studentId });
      dispatch(markRoomSeen(roomId));
    },
    [studentId, dispatch],
  );

  const leaveRoom = useCallback((roomId) => {
    socketRef.current?.emit("room:leave", { roomId });
  }, []);

  const sendMessage = useCallback((roomId, message) => {
    if (!message?.trim()) return;
    socketRef.current?.emit("message:send", {
      roomId,
      message: message.trim(),
    });
  }, []);

  const markSeen = useCallback(
    (roomId) => {
      socketRef.current?.emit("message:seen", { roomId });
      dispatch(markRoomSeen(roomId));
    },
    [dispatch],
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
    socketRef.current?.emit("message:load_more", { roomId, offset });
  }, []);

  const getUnreadCounts = useCallback((roomIds) => {
    socketRef.current?.emit("rooms:unread_counts", { roomIds });
  }, []);

  return {
    // State
    rooms,
    roomsStatus,
    roomsError,
    messages,
    typingUsers,
    onlineUsers,
    unreadCounts,
    isConnected,

    // Socket actions
    joinRoom,
    leaveRoom,
    sendMessage,
    markSeen,
    startTyping,
    stopTyping,
    loadMore,
    getUnreadCounts,
  };
}
