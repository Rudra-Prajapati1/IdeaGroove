import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./slice/eventsSlice";
import chatRoomsReducer from "./slice/chatRoomsSlice";
import chatRoomMembersReducer from "./slice/chatRoomMembersSlice";
import notesReducer from "./slice/notesSlice";
import questionsReducer from "./slice/questionsSlice";
import answerReducer from "./slice/answerSlice";

export default configureStore({
  reducer: {
    events: eventsReducer,
    chatRooms: chatRoomsReducer,
    chatRoomMembers: chatRoomMembersReducer,
    notes: notesReducer,
    questions: questionsReducer,
    answers: answerReducer,
  },
});
