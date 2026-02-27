import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export function useChat(studentId) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});
  const typingTimeouts = useRef({});

  useEffect(() => {
    if (!studentId) return;

    const socket = io(SOCKET_URL, { autoConnect: false });
    socketRef.current = socket;
    socket.connect();

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("user:online", { studentId });
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("room:history", ({ roomId, messages: msgs }) => {
      setMessages((prev) => ({ ...prev, [roomId]: msgs }));
    });

    socket.on("messages:new", ({ roomId, message }) => {
      setMessages((prev) => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), message],
      }));
      setUnreadCounts((prev) => ({
        ...prev,
        [roomId]: (prev[roomId] || 0) + 1,
      }));
    });

    socket.on("message:more", ({ roomId, messages: msgs }) => {
      setMessages((prev) => ({
        ...prev,
        [roomId]: [...msgs, ...(prev[roomId] || [])],
      }));
    });

    socket.on("typing:update", ({ roomId, studentId: typerId, isTyping }) => {
      setTypingUsers((prev) => {
        const roomTypers = new Set(prev[roomId] || []);
        isTyping ? roomTypers.add(typerId) : roomTypers.delete(typerId);
        return { ...prev, [roomId]: roomTypers };
      });
    });

    socket.on("user:status", ({ studentId: uid, status }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        status === "online" ? next.add(uid) : next.delete(uid);
        return next;
      });
    });

    socket.on("rooms:unread_counts", (counts) => {
      setUnreadCounts(counts);
    });

    return () => socket.disconnect();
  }, [studentId]);

  const joinRoom = useCallback(
    (roomId) => {
      socketRef.current?.emit("room:join", { roomId, studentId });
      setUnreadCounts((prev) => ({ ...prev, [roomId]: 0 }));
    },
    [studentId],
  );

  const leaveRoom = useCallback((roomId) => {
    socketRef.current?.emit("room:leave", { roomId });
  }, []);

  const sendMessage = useCallback((roomId, message) => {
    socketRef.current?.emit("message:send", { roomId, message });
  }, []);

  const markSeen = useCallback((roomId) => {
    socketRef.current?.emit("message:seen", { roomId });
    setUnreadCounts((prev) => ({ ...prev, [roomId]: 0 }));
  }, []);

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
    getUnreadCounts,
  };
}
