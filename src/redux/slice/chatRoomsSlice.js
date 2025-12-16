import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

const chatRoomsAdapter = createEntityAdapter({
  selectId: (chatRoom) => chatRoom.Room_ID,
});

const initialState = chatRoomsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchChatRooms = createAsyncThunk(
  "chatRooms/fetchChatRooms",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/collections/${
          import.meta.env.VITE_MOCKMAN_API_KEY
        }/693eada4b6dbbbd14cf90b14/documents`
      );

      return data.map((d) => d.data);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch chat rooms");
    }
  }
);

export const chatRoomsSlice = createSlice({
  name: "chatRooms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatRooms.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.status = "succeeded";
        chatRoomsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  selectAll: selectAllChatRooms,
  selectById: selectChatRoomById,
  selectIds: selectChatRoomIds,
  selectEntities: selectChatRoomEntities,
} = chatRoomsAdapter.getSelectors((state) => state.chatRooms);

export const selectGroupChatRooms = createSelector(
  [selectAllChatRooms],
  (chatRooms) => chatRooms.filter((room) => room.Room_Type === "group")
);

export const selectRandomGroupChatRooms = createSelector(
  [selectGroupChatRooms],
  (groups) => {
    const shuffled = [...groups];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 3);
  }
);

export const selectDirectChatRooms = createSelector(
  [selectAllChatRooms],
  (chatRooms) => chatRooms.filter((room) => room.Room_Type === "direct")
);

export const selectChatRoomStatus = (state) => state.chatRooms.status;
export const selectChatRoomError = (state) => state.chatRooms.error;

export default chatRoomsSlice.reducer;
