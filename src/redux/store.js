import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./slice/eventsSlice";

export default configureStore({
  reducer: {
    events: eventsReducer,
  },
});
