import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./slice/eventsSlice";
import chatRoomsReducer from "./slice/chatRoomsSlice";

export default configureStore({
  reducer: {
    events: eventsReducer,
    chatRooms: chatRoomsReducer,
  },
});
