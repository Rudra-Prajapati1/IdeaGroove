import { configureStore } from "@reduxjs/toolkit";

import eventsReducer from "./slice/eventsSlice";
import chatRoomsReducer from "./slice/chatRoomsSlice";
import chatsReducer from "./slice/chatsSlice";
import notesReducer from "./slice/notesSlice";
import qnaReducer from "./slice/qnaSlice";
import authReducer from "./slice/authSlice";
import studentsReducer from "./slice/studentsSlice";
import degreeSubjectReducer from "./slice/degreeSubjectSlice";
import hobbyReducer from "./slice/hobbySlice";
import complaintReducer from "./slice/complaintsSlice";

export default configureStore({
  reducer: {
    events: eventsReducer,
    groups: chatRoomsReducer,
    chats: chatsReducer,
    notes: notesReducer,
    qna: qnaReducer,
    auth: authReducer,
    students: studentsReducer,
    degreeSubject: degreeSubjectReducer,
    hobby: hobbyReducer,
    complaints: complaintReducer,
  },
  devTools: import.meta.env.DEV,
});
