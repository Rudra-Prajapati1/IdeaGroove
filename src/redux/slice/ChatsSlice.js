import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ─── Entity Adapter ──────────────────────────────────────────────────────── */
// Stores messages keyed by Message_ID, sorted oldest-first
const messagesAdapter = createEntityAdapter({
  selectId: (msg) => msg.Message_ID,
  sortComparer: (a, b) => new Date(a.Sent_On) - new Date(b.Sent_On),
});

/* ─── Initial State ──────────────────────────────────────────────────────── */
const initialState = {
  // Messages per room: { [roomId]: EntityState }
  // We store all rooms' messages in a flat adapter; filtering is done via selector
  messages: messagesAdapter.getInitialState(),

  // Chat rooms list (fetched from REST on connect)
  rooms: [],
  roomsStatus: "idle",
  roomsError: null,

  // Active room ID
  activeRoom: null,

  // Typing indicators: { [roomId]: [studentId, ...] }
  typingUsers: {},

  // Online users: [studentId, ...]
  onlineUsers: [],

  // Unread counts: { [roomId]: number }
  unreadCounts: {},

  // Socket connection status
  isConnected: false,

  // Legacy status field kept so ChatBody still works without change
  status: "idle",
  error: null,
};

/* ─── Async Thunk: Fetch Rooms via REST ───────────────────────────────────── */
export const fetchUserChatRooms = createAsyncThunk(
  "chats/fetchUserChatRooms",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/chats/my-rooms");
      return data.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch rooms",
      );
    }
  },
);

/* ─── Slice ───────────────────────────────────────────────────────────────── */
const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    /* ── Socket-driven ── */

    // Called when socket connects/disconnects
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },

    // Set the active room and clear its unread count
    setActiveRoom: (state, action) => {
      state.activeRoom = action.payload;
      if (action.payload) {
        state.unreadCounts[action.payload] = 0;
      }
    },

    // Replace messages for a room (on room:history from socket)
    setRoomHistory: (state, action) => {
      const { roomId, messages } = action.payload;
      // Remove old messages for this room then add new ones
      const oldIds = messagesAdapter
        .getSelectors()
        .selectAll(state.messages)
        .filter((m) => m.Room_ID === Number(roomId))
        .map((m) => m.Message_ID);

      messagesAdapter.removeMany(state.messages, oldIds);
      messagesAdapter.upsertMany(state.messages, messages);

      // Also mark status as succeeded (ChatBody checks this)
      state.status = "succeeded";
    },

    // Append a single new message (on message:new from socket)
    addMessage: (state, action) => {
      const { roomId, message } = action.payload;
      messagesAdapter.upsertOne(state.messages, message);

      // Update last message preview on the rooms list
      const room = state.rooms.find((r) => r.Room_ID === Number(roomId));
      if (room) {
        room.Last_Message = message.Message_Text;
        room.Last_Message_At = message.Sent_On;
      }

      // Increment unread count if this isn't the active room
      if (state.activeRoom !== Number(roomId)) {
        state.unreadCounts[roomId] = (state.unreadCounts[roomId] || 0) + 1;
      }
    },

    // Prepend older messages (on message:more — load more / pagination)
    prependMessages: (state, action) => {
      const { messages } = action.payload;
      messagesAdapter.upsertMany(state.messages, messages);
    },

    // Typing indicator update
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

    // Online/offline status
    setUserOnline: (state, action) => {
      const { studentId, status } = action.payload;
      if (status === "online") {
        if (!state.onlineUsers.includes(studentId)) {
          state.onlineUsers.push(studentId);
        }
      } else {
        state.onlineUsers = state.onlineUsers.filter((id) => id !== studentId);
      }
    },

    // Bulk unread counts update
    setUnreadCounts: (state, action) => {
      state.unreadCounts = { ...state.unreadCounts, ...action.payload };
    },

    // Zero out unread for a room (when user opens it)
    markRoomSeen: (state, action) => {
      state.unreadCounts[action.payload] = 0;
    },

    // Mark messages in a room as seen (tick update)
    updateSeenMessages: (state, action) => {
      const { roomId, seenBy } = action.payload;
      const allMsgs = messagesAdapter.getSelectors().selectAll(state.messages);
      const updates = allMsgs
        .filter((m) => m.Room_ID === Number(roomId) && m.Sender_ID !== seenBy)
        .map((m) => ({ id: m.Message_ID, changes: { Is_Seen: 1 } }));
      messagesAdapter.updateMany(state.messages, updates);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserChatRooms.pending, (state) => {
        state.roomsStatus = "loading";
        state.roomsError = null;
      })
      .addCase(fetchUserChatRooms.fulfilled, (state, action) => {
        state.roomsStatus = "succeeded";
        state.rooms = action.payload;
      })
      .addCase(fetchUserChatRooms.rejected, (state, action) => {
        state.roomsStatus = "failed";
        state.roomsError = action.payload;
      });
  },
});

/* ─── Actions ─────────────────────────────────────────────────────────────── */
export const {
  setIsConnected,
  setActiveRoom,
  setRoomHistory,
  addMessage,
  prependMessages,
  setTypingUsers,
  setUserOnline,
  setUnreadCounts,
  markRoomSeen,
  updateSeenMessages,
} = chatsSlice.actions;

/* ─── Selectors ───────────────────────────────────────────────────────────── */

// Raw adapter selectors on state.chats.messages
const messageSelectors = messagesAdapter.getSelectors(
  (state) => state.chats.messages,
);

export const selectAllMessages = messageSelectors.selectAll;

// Memoised per-room selector (kept same API as before so ChatBody still works)
export const selectChatsByRoomId = (roomId) =>
  createSelector([messageSelectors.selectAll], (msgs) =>
    msgs.filter((m) => m.Room_ID === Number(roomId) && m.Is_Deleted === 0),
  );

// Rooms list
export const selectChatRooms = (state) => state.chats.rooms;
export const selectChatRoomsStatus = (state) => state.chats.roomsStatus;
export const selectChatRoomsError = (state) => state.chats.roomsError;

// Legacy selectors kept for ChatBody compatibility
export const selectChatsStatus = (state) => state.chats.status;
export const selectChatsError = (state) => state.chats.error;

// Socket state
export const selectIsConnected = (state) => state.chats.isConnected;
export const selectActiveRoom = (state) => state.chats.activeRoom;
export const selectTypingUsers = (state) => state.chats.typingUsers;
export const selectOnlineUsers = (state) => state.chats.onlineUsers;
export const selectUnreadCounts = (state) => state.chats.unreadCounts;

export default chatsSlice.reducer;
