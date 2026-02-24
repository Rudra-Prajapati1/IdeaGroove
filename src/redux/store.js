import { configureStore } from "@reduxjs/toolkit";

import eventsReducer from "./slice/eventsSlice";
import chatRoomsReducer from "./slice/chatRoomsSlice";
import chatRoomMembersReducer from "./slice/chatRoomMembersSlice";
import chatsReducer from "./slice/chatsSlice";
import notesReducer from "./slice/notesSlice";
import qnaReducer from "./slice/qnaSlice";
import authReducer from "./slice/authSlice";
import studentsReducer from "./slice/studentsSlice";
import degreeSubjectReducer from "./slice/degreeSubjectSlice";

export default configureStore({
  reducer: {
    events: eventsReducer,
    groups: chatRoomsReducer,
    chatRoomMembers: chatRoomMembersReducer,
    chats: chatsReducer,
    notes: notesReducer,
    qna: qnaReducer,
    auth: authReducer,
    students: studentsReducer,
    degreeSubject: degreeSubjectReducer,
  },
  devTools: import.meta.env.DEV,
});
