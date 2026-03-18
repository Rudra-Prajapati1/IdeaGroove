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
import adminMetaReducer from "./adminSlice/adminMetaSlice";
import adminOverviewReducer from "./adminSlice/adminOverviewSlice";
import adminUsersReducer from "./adminSlice/adminUsersSlice";
import adminNotesReducer from "./adminSlice/adminNotesSlice";
import adminGroupsReducer from "./adminSlice/adminGroupsSlice";
import adminEventsReducer from "./adminSlice/adminEventsSlice";
import adminQnaReducer from "./adminSlice/adminQnaSlice";
import adminComplaintsReducer from "./adminSlice/adminComplaintsSlice";

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
    adminMeta: adminMetaReducer,
    adminOverview: adminOverviewReducer,
    adminUsers: adminUsersReducer,
    adminNotes: adminNotesReducer,
    adminGroups: adminGroupsReducer,
    adminEvents: adminEventsReducer,
    adminQna: adminQnaReducer,
    adminComplaints: adminComplaintsReducer,
  },
  devTools: import.meta.env.DEV,
});
