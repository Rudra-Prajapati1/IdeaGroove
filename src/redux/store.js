import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./slice/eventsSlice";
import chatRoomsReducer from "./slice/chatRoomsSlice";
import notesReducer from "./slice/notesSlice";
import questionsReducer from "./slice/questionsSlice";

export default configureStore({
  reducer: {
    events: eventsReducer,
    chatRooms: chatRoomsReducer,
    notes: notesReducer,
    questions: questionsReducer,
  },
});
