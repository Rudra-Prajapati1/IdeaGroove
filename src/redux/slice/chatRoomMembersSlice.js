import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

const chatRoomMembersAdapter = createEntityAdapter({
  selectId: (chatRoomMember) => chatRoomMember.Member_ID,
});

const initialState = chatRoomMembersAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchChatRoomMembers = createAsyncThunk(
  "chatRoomMembers/fetchChatRoomMembers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/collections/${
          import.meta.env.VITE_MOCKMAN_API_KEY
        }/69454dbbb6dbbbd14cf92bb7/documents`
      );
      return data.map((d) => d.data);
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to fetch chat room members"
      );
    }
  }
);

const chatRoomMembersSlice = createSlice({
  name: "chatRoomMembers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatRoomMembers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchChatRoomMembers.fulfilled, (state, action) => {
        state.status = "succeeded";
        chatRoomMembersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchChatRoomMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  selectAll: selectAllChatRoomMembers,
  selectById: selectChatRoomMemberById,
  selectIds: selectChatRoomMemberIds,
  selectEntities: selectChatRoomMemberEntities,
} = chatRoomMembersAdapter.getSelectors((state) => state.chatRoomMembers);

export const selectMembersByRoomId = (roomId) =>
  createSelector([selectAllChatRoomMembers], (members) =>
    members.filter(
      (member) => member.Room_ID === roomId && member.Is_Active === true
    )
  );

export const selectRoomIdsForStudent = (studentId) =>
  createSelector([selectAllChatRoomMembers], (members) =>
    members
      .filter(
        (member) => member.Student_ID === studentId && member.Is_Active === true
      )
      .map((member) => member.Room_ID)
  );

export const selectIsUserAdminOfRoom = (roomId, studentId) =>
  createSelector([selectAllChatRoomMembers], (members) =>
    members.some(
      (member) =>
        member.Room_ID === roomId &&
        member.Student_ID === studentId &&
        member.Role === "admin" &&
        member.Is_Active === true
    )
  );

export const selectRoomMemberCount = (roomId) =>
  createSelector(
    [selectAllChatRoomMembers],
    (members) =>
      members.filter(
        (member) => member.Room_ID === roomId && member.Is_Active === true
      ).length
  );

export const selectChatRoomMemberStatus = (state) =>
  state.chatRoomMembers.status;
export const selectChatRoomMemberError = (state) => state.chatRoomMembers.error;

export default chatRoomMembersSlice.reducer;
