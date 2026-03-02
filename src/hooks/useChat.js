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
  updateMessage,
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

  const rooms = useSelector(selectChatRooms);
  const roomsStatus = useSelector(selectChatRoomsStatus);
  const roomsError = useSelector(selectChatRoomsError);
  const isConnected = useSelector(selectIsConnected);
  const typingUsers = useSelector(selectTypingUsers);
  const onlineUsers = useSelector(selectOnlineUsers);
  const unreadCounts = useSelector(selectUnreadCounts);
  const messages = useSelector(selectAllMessages);

  // FIX 401: fetch rooms on mount directly, not inside socket connect event
  useEffect(() => {
    if (studentId) {
      dispatch(fetchUserChatRooms());
    }
  }, [studentId, dispatch]);

  useEffect(() => {
    if (!studentId) return;

    const socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
    });
    socketRef.current = socket;
    socket.connect();

    socket.on("connect", () => {
      dispatch(setIsConnected(true));
      socket.emit("user:online", { studentId });
    });

    socket.on("disconnect", () => dispatch(setIsConnected(false)));

    socket.on("room:history", ({ roomId, messages: msgs }) => {
      dispatch(setRoomHistory({ roomId, messages: msgs }));
    });

    socket.on("message:new", ({ roomId, message }) => {
      dispatch(addMessage({ roomId, message }));
    });

    socket.on("message:more", ({ roomId, messages: msgs }) => {
      dispatch(prependMessages({ roomId, messages: msgs }));
    });

    socket.on("typing:update", ({ roomId, studentId: typerId, isTyping }) => {
      dispatch(setTypingUsers({ roomId, studentId: typerId, isTyping }));
    });

    socket.on("user:status", ({ studentId: uid, status }) => {
      dispatch(setUserOnline({ studentId: uid, status }));
    });

    socket.on("message:seen_update", ({ roomId, seenBy }) => {
      dispatch(updateSeenMessages({ roomId, seenBy }));
    });

    socket.on("rooms:unread_counts", (counts) => {
      dispatch(setUnreadCounts(counts));
    });

    socket.on("message:edited", ({ messageId, newText }) => {
      dispatch(
        updateMessage({
          messageId,
          changes: { Message_Text: newText, Is_Edited: 1 },
        }),
      );
    });

    socket.on("message:deleted", ({ messageId }) => {
      dispatch(updateMessage({ messageId, changes: { Is_Deleted: 1 } }));
    });

    return () => socket.disconnect();
  }, [studentId, dispatch]);

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

  const sendFileMessage = useCallback((roomId, fileUrl, messageType) => {
    socketRef.current?.emit("message:send_file", {
      roomId,
      fileUrl,
      messageType,
    });
  }, []);

  const editMessage = useCallback((roomId, messageId, newText) => {
    socketRef.current?.emit("message:edit", { roomId, messageId, newText });
  }, []);

  const deleteMessageSocket = useCallback((roomId, messageId) => {
    socketRef.current?.emit("message:delete", { roomId, messageId });
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
