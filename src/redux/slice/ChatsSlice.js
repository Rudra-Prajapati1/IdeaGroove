import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

const chatsAdapter = createEntityAdapter({
  selectId: (chat) => chat.Message_ID,
  sortComparer: (a, b) => new Date(a.Sent_On) - new Date(b.Sent_On),
});

const initialState = chatsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchChats = createAsyncThunk(
  "chats/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      // const { data } = await api.get(
      //   `/collections/${
      //     import.meta.env.VITE_MOCKMAN_API_KEY
      //   }/69465f4fb6dbbbd14cf931bf/documents`
      // );

      return data.map((d) => d.data);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch chats");
    }
  },
);

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.status = "succeeded";
        chatsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  selectAll: selectAllChats,
  selectById: selectChatById,
  selectIds: selectChatIds,
} = chatsAdapter.getSelectors((state) => state.chats);

export const selectChatsByRoomId = (roomId) =>
  createSelector([selectAllChats], (chats) =>
    chats.filter(
      (chat) => chat.Room_ID === roomId && chat.Is_Deleted === false,
    ),
  );

export const selectChatsStatus = (state) => state.chats.status;
export const selectChatsError = (state) => state.chats.error;

export default chatsSlice.reducer;
