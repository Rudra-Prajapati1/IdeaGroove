import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./slice/eventsSlice";
import chatRoomsReducer from "./slice/chatRoomsSlice";
import chatRoomMembersReducer from "./slice/chatRoomMembersSlice";
import chatsReducer from "./slice/chatsSlice";
import notesReducer from "./slice/notesSlice";
import questionsReducer from "./slice/questionsSlice";
import answerReducer from "./slice/answerSlice";
import authReducer from "./slice/authSlice";

export default configureStore({
  reducer: {
    events: eventsReducer,
    chatRooms: chatRoomsReducer,
    chatRoomMembers: chatRoomMembersReducer,
    chats: chatsReducer,
    notes: notesReducer,
    questions: questionsReducer,
    answers: answerReducer,
    auth: authReducer,
  },
});
