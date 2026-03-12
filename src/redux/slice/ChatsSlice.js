import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ─── Entity Adapter ──────────────────────────────────────────────────────── */
const messagesAdapter = createEntityAdapter({
  selectId: (msg) => msg.Message_ID,
  sortComparer: (a, b) => new Date(a.Sent_On) - new Date(b.Sent_On),
});

const DELETED_MESSAGE_PREVIEW = "Message deleted";

/* ─── Initial State ──────────────────────────────────────────────────────── */
const initialState = {
  messages: messagesAdapter.getInitialState(),
  rooms: [],
  roomsStatus: "idle",
  roomsError: null,
  activeRoom: null, // currently open Room_ID as a number
  currentUserId: null, // logged-in student ID
  typingUsers: {},
  onlineUsers: [],
  unreadCounts: {},
  isConnected: false,
  status: "idle",
  error: null,
};

const getLastMessagePreview = (room, currentUserId) => {
  if (!room) return "";

  const preview =
    room.Last_Is_Deleted
      ? DELETED_MESSAGE_PREVIEW
      : room.Last_Type && room.Last_Type !== "text"
      ? `Sent a ${room.Last_Type}`
      : room.Last_Message_Raw || room.Last_Message || "";

  if (!preview || room.Room_Type !== "group") {
    return preview;
  }

  const isCurrentUser =
    currentUserId != null &&
    String(room.Last_Sender_ID) === String(currentUserId);
  const senderLabel = isCurrentUser
    ? "You"
    : room.Last_Sender_Name || room.Last_Sender_Username || "";

  return senderLabel ? `${senderLabel}: ${preview}` : preview;
};

const hydrateRoomPreview = (room, currentUserId) => ({
  ...room,
  Last_Is_Deleted: room.Last_Is_Deleted ? 1 : 0,
  Last_Is_Seen: room.Last_Is_Seen ? 1 : 0,
  Last_Message_Raw: room.Last_Is_Deleted
    ? DELETED_MESSAGE_PREVIEW
    : room.Last_Message_Raw || room.Last_Message || "",
  Last_Message: getLastMessagePreview(room, currentUserId),
});

const syncRoomPreviewFromMessages = (state, roomId) => {
  const roomIndex = state.rooms.findIndex(
    (room) => room.Room_ID === Number(roomId),
  );
  if (roomIndex === -1) return;

  const roomMessages = messagesAdapter
    .getSelectors()
    .selectAll(state.messages)
    .filter((message) => message.Room_ID === Number(roomId));

  const lastMessage = roomMessages[roomMessages.length - 1];

  if (!lastMessage) {
    state.rooms[roomIndex] = hydrateRoomPreview(
      {
        ...state.rooms[roomIndex],
        Last_Message: "",
        Last_Message_Raw: "",
        Last_Type: null,
        Last_Message_At: null,
        Last_Sender_ID: null,
        Last_Sender_Name: null,
        Last_Sender_Username: null,
        Last_Is_Deleted: 0,
        Last_Is_Seen: 0,
      },
      state.currentUserId,
    );
    return;
  }

  state.rooms[roomIndex] = hydrateRoomPreview(
    {
      ...state.rooms[roomIndex],
      Last_Message: lastMessage.Is_Deleted
        ? DELETED_MESSAGE_PREVIEW
        : lastMessage.Message_Text || "",
      Last_Message_Raw: lastMessage.Is_Deleted
        ? DELETED_MESSAGE_PREVIEW
        : lastMessage.Message_Text || "",
      Last_Type: lastMessage.Message_Type,
      Last_Message_At: lastMessage.Sent_On,
      Last_Sender_ID: lastMessage.Sender_ID,
      Last_Sender_Name: lastMessage.Sender_Name || null,
      Last_Sender_Username: lastMessage.Sender_Username || null,
      Last_Is_Deleted: lastMessage.Is_Deleted ? 1 : 0,
      Last_Is_Seen: lastMessage.Is_Seen ? 1 : 0,
    },
    state.currentUserId,
  );
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
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },

    setCurrentUserId: (state, action) => {
      state.currentUserId = action.payload;
      state.rooms = state.rooms.map((room) =>
        hydrateRoomPreview(room, state.currentUserId),
      );
    },

    setActiveRoom: (state, action) => {
      const roomId = action.payload ? Number(action.payload) : null;
      state.activeRoom = roomId;
      if (roomId) {
        state.unreadCounts[roomId] = 0;
      }
    },

    setRoomHistory: (state, action) => {
      const { roomId, messages } = action.payload;
      const oldIds = messagesAdapter
        .getSelectors()
        .selectAll(state.messages)
        .filter((m) => m.Room_ID === Number(roomId))
        .map((m) => m.Message_ID);

      messagesAdapter.removeMany(state.messages, oldIds);
      messagesAdapter.upsertMany(state.messages, messages);
      syncRoomPreviewFromMessages(state, roomId);
      state.status = "succeeded";
    },

    addMessage: (state, action) => {
      const { roomId, message, skipUnread = false } = action.payload;
      messagesAdapter.upsertOne(state.messages, message);

      // Replace the room object so React detects the change and re-renders sidebar
      const roomIndex = state.rooms.findIndex(
        (r) => r.Room_ID === Number(roomId),
      );
      if (roomIndex !== -1) {
        const nextRoom = {
          ...state.rooms[roomIndex],
          Last_Message: message.Is_Deleted
            ? DELETED_MESSAGE_PREVIEW
            : message.Message_Text,
          Last_Message_Raw: message.Is_Deleted
            ? DELETED_MESSAGE_PREVIEW
            : message.Message_Text || "",
          Last_Type: message.Message_Type,
          Last_Message_At: message.Sent_On,
          Last_Sender_ID: message.Sender_ID,
          Last_Sender_Name: message.Sender_Name || null,
          Last_Sender_Username: message.Sender_Username || null,
          Last_Is_Deleted: message.Is_Deleted ? 1 : 0,
          Last_Is_Seen: message.Is_Seen ? 1 : 0,
        };
        state.rooms[roomIndex] = hydrateRoomPreview(
          nextRoom,
          state.currentUserId,
        );
      }

      const isActiveRoom = state.activeRoom === Number(roomId);
      if (!isActiveRoom && !skipUnread) {
        state.unreadCounts[roomId] = (state.unreadCounts[roomId] || 0) + 1;
      }
    },

    prependMessages: (state, action) => {
      const { messages } = action.payload;
      messagesAdapter.upsertMany(state.messages, messages);
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

    // FIX: always store as string so onlineUsers.includes(String(id)) always matches
    setUserOnline: (state, action) => {
      const { studentId, status } = action.payload;
      const sid = String(studentId);
      if (status === "online") {
        if (!state.onlineUsers.includes(sid)) {
          state.onlineUsers.push(sid);
        }
      } else {
        state.onlineUsers = state.onlineUsers.filter((id) => id !== sid);
      }
    },

    // Bulk-set online users list (received on connect)
    setOnlineUsersList: (state, action) => {
      state.onlineUsers = action.payload.map(String);
    },

    setUnreadCounts: (state, action) => {
      state.unreadCounts = { ...state.unreadCounts, ...action.payload };
    },

    markRoomSeen: (state, action) => {
      state.unreadCounts[action.payload] = 0;
    },

    updateSeenMessages: (state, action) => {
      const { roomId, seenBy } = action.payload;
      const allMsgs = messagesAdapter.getSelectors().selectAll(state.messages);
      const updates = allMsgs
        .filter((m) => m.Room_ID === Number(roomId) && m.Sender_ID !== seenBy)
        .map((m) => ({ id: m.Message_ID, changes: { Is_Seen: 1 } }));
      messagesAdapter.updateMany(state.messages, updates);
      syncRoomPreviewFromMessages(state, roomId);
    },

    updateMessage: (state, action) => {
      const { messageId, changes } = action.payload;
      const currentMessage = state.messages.entities[messageId];
      messagesAdapter.updateOne(state.messages, { id: messageId, changes });
      if (currentMessage?.Room_ID) {
        syncRoomPreviewFromMessages(state, currentMessage.Room_ID);
      }
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
        state.rooms = action.payload.map((room) =>
          hydrateRoomPreview(room, state.currentUserId),
        );

        const counts = {};
        action.payload.forEach((room) => {
          if (state.unreadCounts[room.Room_ID] === undefined) {
            counts[room.Room_ID] = room.Unread_Count || 0;
          }
        });
        state.unreadCounts = { ...counts, ...state.unreadCounts };
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
  setCurrentUserId,
  setActiveRoom,
  setRoomHistory,
  addMessage,
  prependMessages,
  setTypingUsers,
  setUserOnline,
  setOnlineUsersList,
  setUnreadCounts,
  markRoomSeen,
  updateSeenMessages,
  updateMessage,
} = chatsSlice.actions;

/* ─── Selectors ───────────────────────────────────────────────────────────── */
const messageSelectors = messagesAdapter.getSelectors(
  (state) => state.chats.messages,
);

export const selectAllMessages = messageSelectors.selectAll;

// ✅ FIX: Removed `&& m.Is_Deleted === 0` filter so deleted messages are kept
// in the list. ChatBody already renders "Message deleted" when Is_Deleted is
// truthy, so both sender AND receiver now see the WhatsApp-style placeholder.
export const selectChatsByRoomId = (roomId) =>
  createSelector([messageSelectors.selectAll], (msgs) =>
    msgs.filter((m) => m.Room_ID === Number(roomId)),
  );

export const selectChatRooms = (state) => state.chats.rooms;
export const selectChatRoomsStatus = (state) => state.chats.roomsStatus;
export const selectChatRoomsError = (state) => state.chats.roomsError;
export const selectChatsStatus = (state) => state.chats.status;
export const selectChatsError = (state) => state.chats.error;
export const selectIsConnected = (state) => state.chats.isConnected;
export const selectActiveRoom = (state) => state.chats.activeRoom;
export const selectTypingUsers = (state) => state.chats.typingUsers;
export const selectOnlineUsers = (state) => state.chats.onlineUsers;
export const selectUnreadCounts = (state) => state.chats.unreadCounts;
export const selectCurrentUserId = (state) => state.chats.currentUserId;
export const selectMessageById = (messageId) => (state) =>
  messageSelectors.selectById(state, messageId);

export default chatsSlice.reducer;
