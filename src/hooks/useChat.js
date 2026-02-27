import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
export function useChat(studentId) {
  const socketRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setRooms((prev) =>
        prev.map((room) =>
          room.Room_ID === roomId
            ? {
                ...room,
                Last_Message: message.Message,
                Last_Message_At: message.Sent_On,
              }
            : room,
        ),
      );
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

    socket.on("message:seen_update", ({ roomId, seenBy }) => {
      setMessages((prev) => ({
        ...prev,
        [roomId]: (prev[roomId] || []).map((msg) =>
          msg.Sender_ID !== seenBy ? { ...msg, Is_Seen: 1 } : msg,
        ),
      }));
    });

    socket.on("rooms:unread_counts", (counts) => {
      setUnreadCounts(counts);
    });

    return () => socket.disconnect();
  }, [studentId]);

  const fetchRooms = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/rooms/${studentId}`);
      const data = await res.json();
      setRooms(data.rooms || []);

      // After fetching rooms, get unread counts for all of them
      const roomIds = data.rooms.map((r) => r.Room_ID);
      if (roomIds.length > 0) {
        socketRef.current?.emit("rooms:unread_counts", { roomIds });
      }
    } catch (err) {
      setError("Failed to load rooms");
      console.error("fetchRooms error:", err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  // ─── REST: Fetch members of a room ───────────────────────────────────────
  const fetchRoomMembers = useCallback(async (roomId) => {
    try {
      const res = await fetch(`${API_URL}/rooms/${roomId}/members`);
      const data = await res.json();
      return data.members || [];
    } catch (err) {
      console.error("fetchRoomMembers error:", err);
      return [];
    }
  }, []);

  // ─── REST: Create direct room ─────────────────────────────────────────────
  const createDirectRoom = useCallback(
    async (studentId2) => {
      setError(null);
      try {
        const res = await fetch(`${API_URL}/direct`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId1: studentId, studentId2 }),
        });
        const data = await res.json();
        // Refresh rooms list
        await fetchRooms();
        return data.roomId;
      } catch (err) {
        setError("Failed to create direct room");
        console.error("createDirectRoom error:", err);
      }
    },
    [studentId, fetchRooms],
  );

  // ─── REST: Create group room ──────────────────────────────────────────────
  const createGroupRoom = useCallback(
    async ({ roomName, description, basedOn, memberIds }) => {
      setError(null);
      try {
        const res = await fetch(`${API_URL}/group`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creatorId: studentId,
            roomName,
            description,
            basedOn,
            memberIds,
          }),
        });
        const data = await res.json();
        // Refresh rooms list
        await fetchRooms();
        return data.roomId;
      } catch (err) {
        setError("Failed to create group room");
        console.error("createGroupRoom error:", err);
      }
    },
    [studentId, fetchRooms],
  );

  // ─── REST: Delete room ────────────────────────────────────────────────────
  const deleteRoom = useCallback(
    async (roomId) => {
      setError(null);
      try {
        await fetch(`${API_URL}/rooms/${roomId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId }),
        });
        // Remove from local state
        setRooms((prev) => prev.filter((r) => r.Room_ID !== roomId));
      } catch (err) {
        setError("Failed to delete room");
        console.error("deleteRoom error:", err);
      }
    },
    [studentId],
  );

  // ─── REST: Leave group room ───────────────────────────────────────────────
  const leaveGroupRoom = useCallback(
    async (roomId) => {
      setError(null);
      try {
        await fetch(`${API_URL}/rooms/${roomId}/leave`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId }),
        });
        // Remove from local state
        setRooms((prev) => prev.filter((r) => r.Room_ID !== roomId));
      } catch (err) {
        setError("Failed to leave room");
        console.error("leaveGroupRoom error:", err);
      }
    },
    [studentId],
  );

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
    rooms,
    messages,
    typingUsers,
    onlineUsers,
    unreadCounts,
    loading,
    error,

    fetchRooms,
    fetchRoomMembers,
    createDirectRoom,
    createGroupRoom,
    deleteRoom,
    leaveGroupRoom,

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
