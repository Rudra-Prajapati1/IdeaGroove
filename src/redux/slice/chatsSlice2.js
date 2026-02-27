import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL || "/api/chats";

// ─── Async Thunks (REST calls) ────────────────────────────────────────────────

export const fetchRooms = createAsyncThunk(
  "chat/fetchRooms",
  async (studentId) => {
    const res = await fetch(`${API_URL}/rooms/${studentId}`);
    const data = await res.json();
    return data.rooms || [];
  },
);

export const fetchRoomMembers = createAsyncThunk(
  "chat/fetchRoomMembers",
  async (roomId) => {
    const res = await fetch(`${API_URL}/rooms/${roomId}/members`);
    const data = await res.json();
    return data.members || [];
  },
);

export const createDirectRoom = createAsyncThunk(
  "chat/createDirectRoom",
  async ({ studentId1, studentId2 }) => {
    const res = await fetch(`${API_URL}/direct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId1, studentId2 }),
    });
    return await res.json();
  },
);

export const createGroupRoom = createAsyncThunk(
  "chat/createGroupRoom",
  async (payload) => {
    const res = await fetch(`${API_URL}/group`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },
);

export const deleteRoom = createAsyncThunk(
  "chat/deleteRoom",
  async ({ roomId, studentId }) => {
    await fetch(`${API_URL}/rooms/${roomId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    });
    return roomId;
  },
);

export const leaveGroupRoom = createAsyncThunk(
  "chat/leaveGroupRoom",
  async ({ roomId, studentId }) => {
    await fetch(`${API_URL}/rooms/${roomId}/leave`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    });
    return roomId;
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    rooms: [],
    messages: {}, // { roomId: [...msgs] }
    typingUsers: {}, // { roomId: [studentIds] }
    onlineUsers: [],
    unreadCounts: {}, // { roomId: count }
    activeRoom: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Socket driven actions
    setActiveRoom: (state, action) => {
      state.activeRoom = action.payload;
      // Clear unread when opening a room
      if (action.payload) {
        state.unreadCounts[action.payload] = 0;
      }
    },
    setRoomHistory: (state, action) => {
      const { roomId, messages } = action.payload;
      state.messages[roomId] = messages;
    },
    addMessage: (state, action) => {
      const { roomId, message } = action.payload;
      if (!state.messages[roomId]) state.messages[roomId] = [];
      state.messages[roomId].push(message);
      // Update last message preview in rooms list
      const room = state.rooms.find((r) => r.Room_ID === roomId);
      if (room) {
        room.Last_Message = message.Message;
        room.Last_Message_At = message.Sent_On;
      }
      // Increment unread if not active room
      if (state.activeRoom !== roomId) {
        state.unreadCounts[roomId] = (state.unreadCounts[roomId] || 0) + 1;
      }
    },
    prependMessages: (state, action) => {
      const { roomId, messages } = action.payload;
      state.messages[roomId] = [...messages, ...(state.messages[roomId] || [])];
    },
    setTypingUsers: (state, action) => {
      const { roomId, studentId, isTyping } = action.payload;
      if (!state.typingUsers[roomId]) state.typingUsers[roomId] = [];
      if (isTyping) {
        if (!state.typingUsers[roomId].includes(studentId)) {
          state.typingUsers[roomId].push(studentId);
        }
      } else {
        state.typingUsers[roomId] = state.typingUsers[roomId].filter(
          (id) => id !== studentId,
        );
      }
    },
    setUserOnline: (state, action) => {
      const { studentId, status } = action.payload;
      if (status === "online") {
        if (!state.onlineUsers.includes(studentId))
          state.onlineUsers.push(studentId);
      } else {
        state.onlineUsers = state.onlineUsers.filter((id) => id !== studentId);
      }
    },
    setUnreadCounts: (state, action) => {
      state.unreadCounts = { ...state.unreadCounts, ...action.payload };
    },
    markRoomSeen: (state, action) => {
      state.unreadCounts[action.payload] = 0;
    },
    updateSeenMessages: (state, action) => {
      const { roomId, seenBy } = action.payload;
      if (state.messages[roomId]) {
        state.messages[roomId] = state.messages[roomId].map((msg) =>
          msg.Sender_ID !== seenBy ? { ...msg, Is_Seen: 1 } : msg,
        );
      }
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchRooms
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load rooms";
      });

    // createDirectRoom
    builder.addCase(createDirectRoom.fulfilled, (state) => {
      // rooms will be refreshed via fetchRooms
    });

    // deleteRoom
    builder.addCase(deleteRoom.fulfilled, (state, action) => {
      state.rooms = state.rooms.filter((r) => r.Room_ID !== action.payload);
    });

    // leaveGroupRoom
    builder.addCase(leaveGroupRoom.fulfilled, (state, action) => {
      state.rooms = state.rooms.filter((r) => r.Room_ID !== action.payload);
    });
  },
});

export const {
  setActiveRoom,
  setRoomHistory,
  addMessage,
  prependMessages,
  setTypingUsers,
  setUserOnline,
  setUnreadCounts,
  markRoomSeen,
  updateSeenMessages,
  setIsConnected,
} = chatSlice.actions;

export default chatSlice.reducer;
