import React, { useState } from "react";
import EventCard from "@/components/cards/EventCard";
import GroupCard from "@/components/cards/GroupCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserEvents,
  selectUserEvents,
  selectUserEventsError,
  selectUserEventsStatus,
} from "../../redux/slice/eventsSlice";
import {
  fetchUserGroups,
  selectUserGroups,
  selectUserGroupsError,
  selectUserGroupsStatus,
} from "../../redux/slice/chatRoomsSlice";
import {
  fetchUserQuestions,
  selectUserQuestions,
  selectUserQuestionsError,
  selectUserQuestionsStatus,
} from "../../redux/slice/qnaSlice";
import {
  fetchUserNotes,
  selectUserNotes,
  selectUserNotesError,
  selectUserNotesStatus,
} from "../../redux/slice/notesSlice";
import {
  CalendarDays,
  LucideGroup,
  MessageSquare,
  NotebookPen,
  UploadIcon,
  Users,
} from "lucide-react";
import DiscussionForum from "./DiscussionForum";
import NotesSection from "./NotesSection";
import { selectIsAuthenticated, selectUser } from "../../redux/slice/authSlice";
import Controls from "../common/Controls";
import AddEventOverlay from "../events/AddEvent";
import AddGroupOverlay from "../groups/AddGroup";

const USER_ACTIVITY_LIMIT = 1000;

const ActivitySection = ({ isPublic, userId }) => {
  const dispatch = useDispatch();

  const optionList = [
    { key: 1, label: "Events", icon: CalendarDays },
    { key: 2, label: "Groups", icon: Users },
    { key: 3, label: "QnA", icon: MessageSquare },
    { key: 4, label: "Notes", icon: NotebookPen },
  ];

  const [option, setOption] = useState("Events");
  const [eventSearch, setEventSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [groupSearch, setGroupSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [qnaSearch, setQnaSearch] = useState("");
  const [qnaFilter, setQnaFilter] = useState("all");
  const [qnaDegree, setQnaDegree] = useState("");
  const [qnaSubject, setQnaSubject] = useState("");
  const [notesSearch, setNotesSearch] = useState("");
  const [notesFilter, setNotesFilter] = useState("all");
  const [notesDegree, setNotesDegree] = useState("");
  const [notesSubject, setNotesSubject] = useState("");
  const [addEvent, setAddEvent] = useState(false);
  const [addGroup, setAddGroup] = useState(false);

  const isAuth = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectUser);
  const currentUserId = currentUser?.S_ID || currentUser?.id || null;
  const isOwnDashboard =
    currentUserId && userId
      ? Number(currentUserId) === Number(userId)
      : false;

  const userEvents = useSelector(selectUserEvents);
  const eventsStatus = useSelector(selectUserEventsStatus);
  const userEventsError = useSelector(selectUserEventsError);

  const userGroups = useSelector(selectUserGroups);
  const groupsStatus = useSelector(selectUserGroupsStatus);
  const groupsError = useSelector(selectUserGroupsError);

  const userQuestions = useSelector(selectUserQuestions);
  const qnaStatus = useSelector(selectUserQuestionsStatus);
  const qnaError = useSelector(selectUserQuestionsError);

  const userNotes = useSelector(selectUserNotes);
  const notesStatus = useSelector(selectUserNotesStatus);
  const notesError = useSelector(selectUserNotesError);

  const refetchUserEvents = () => {
    if (!userId) return;
    dispatch(
      fetchUserEvents({ userId, page: 1, limit: USER_ACTIVITY_LIMIT }),
    );
  };

  const refetchUserGroups = () => {
    if (!userId) return;
    dispatch(
      fetchUserGroups({ userId, page: 1, limit: USER_ACTIVITY_LIMIT }),
    );
  };

  const refetchUserQuestions = () => {
    if (!userId) return;
    dispatch(fetchUserQuestions(userId));
  };

  const refetchUserNotes = () => {
    if (!userId) return;
    dispatch(
      fetchUserNotes({ userId, page: 1, limit: USER_ACTIVITY_LIMIT }),
    );
  };

  const filteredEvents = userEvents.filter((event) => {
    const eventDate = new Date(event.Event_Date);
    const today = new Date();
    const searchValue = eventSearch.toLowerCase();
    const matchesSearch = searchValue
      ? event?.Description?.toLowerCase().includes(searchValue) ||
        event?.Contact_Person?.toLowerCase().includes(searchValue) ||
        false
      : true;

    if (eventFilter === "upcoming" && eventDate < today) return false;
    if (eventFilter === "past" && eventDate >= today) return false;

    return matchesSearch;
  });

  const filteredGroups = userGroups
    .filter((group) => {
      const searchValue = groupSearch.toLowerCase();
      if (!searchValue) {
        return true;
      }

      return (
        group?.Room_Name?.toLowerCase().includes(searchValue) ||
        group?.Description?.toLowerCase().includes(searchValue) ||
        group?.Hobby_Name?.toLowerCase().includes(searchValue) ||
        false
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.Activity_On || a.Created_On);
      const dateB = new Date(b.Activity_On || b.Created_On);

      if (groupFilter === "newest_to_oldest") return dateB - dateA;
      if (groupFilter === "oldest_to_newest") return dateA - dateB;

      return 0;
    });

  const filteredQuestions = userQuestions
    .filter((question) => {
      const searchValue = qnaSearch.toLowerCase();
      const matchesSearch = searchValue
        ? question?.Question?.toLowerCase().includes(searchValue) ||
          question?.Subject_Name?.toLowerCase().includes(searchValue) ||
          false
        : true;
      const matchesDegree = qnaDegree
        ? String(question?.Degree_ID) === String(qnaDegree)
        : true;
      const matchesSubject = qnaSubject
        ? String(question?.Subject_ID) === String(qnaSubject)
        : true;

      return matchesSearch && matchesDegree && matchesSubject;
    })
    .sort((a, b) => {
      const dateA = new Date(a.Activity_On || a.Added_On);
      const dateB = new Date(b.Activity_On || b.Added_On);

      if (qnaFilter === "oldest_to_newest") return dateA - dateB;
      if (qnaFilter === "newest_to_oldest") return dateB - dateA;

      return 0;
    });

  const filteredNotes = userNotes
    .filter((note) => {
      const searchValue = notesSearch.toLowerCase();
      const matchesSearch = searchValue
        ? note?.Description?.toLowerCase().includes(searchValue) ||
          note?.File_Name?.toLowerCase().includes(searchValue) ||
          note?.Subject_Name?.toLowerCase().includes(searchValue) ||
          note?.Degree_Name?.toLowerCase().includes(searchValue) ||
          false
        : true;
      const matchesDegree = notesDegree
        ? String(note?.Degree_ID) === String(notesDegree)
        : true;
      const matchesSubject = notesSubject
        ? String(note?.Subject_ID) === String(notesSubject)
        : true;

      return matchesSearch && matchesDegree && matchesSubject;
    })
    .sort((a, b) => {
      const dateA = new Date(a.Added_on);
      const dateB = new Date(b.Added_on);

      if (notesFilter === "oldest_to_newest") return dateA - dateB;
      if (notesFilter === "newest_to_oldest") return dateB - dateA;

      return 0;
    });

  const getEventLabel = () => {
    if (!isOwnDashboard) return null;
    return "Uploaded by you";
  };

  const getGroupLabel = (group) => {
    if (!isOwnDashboard) return null;
    return group?.Group_Relationship === "created"
      ? "Created by you"
      : "Joined by you";
  };

  const getQuestionLabel = (question) => {
    if (!isOwnDashboard) return null;
    if (Number(question?.Is_Own_Question) === 1) return "Asked by you";
    if (Number(question?.Has_User_Answer) === 1) return "Answered by you";
    return null;
  };

  const getNoteLabel = () => {
    if (!isOwnDashboard) return null;
    return "Uploaded by you";
  };

  return (
    <section>
      <div className="text-primary py-4 px-16 mt-4">
        <div className="font-poppins font-light flex flex-row items-center justify-between w-9/10 lg:h-40 md:h-20 sm:h-10 m-auto mb-12">
          {optionList.map((op) => {
            const Icon = op.icon;
            return (
              <div
                key={op.key}
                onClick={() => setOption(op.label)}
                className={`cursor-pointer flex flex-col gap-5 items-center justify-center 
                  lg:text-4xl md:text-3xl sm:text-2xl xs:text-xl 
                  w-1/5 h-full rounded-lg transition-all duration-300
                  ${
                    option === op.label
                      ? "bg-primary text-white shadow-2xl border-4 border-primary"
                      : "bg-[#a3ffa9] text-primary hover:shadow-xl hover:scale-105"
                  }`}
              >
                <Icon className="w-10 h-10" />
                <div>{op.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {option === "Events" && (
        <div className="mt-16 w-10/12 m-auto bg-[#fffbeb] px-12 py-12 rounded-2xl">
          {(eventsStatus === "loading" || (eventsStatus === "idle" && userId)) && (
            <p>Loading Events...</p>
          )}
          {eventsStatus === "failed" && (
            <p>Error loading Events: {userEventsError}</p>
          )}
          {eventsStatus === "succeeded" && (
            <>
              {addEvent && (
                <AddEventOverlay
                  onClose={() => setAddEvent(false)}
                  onSuccess={refetchUserEvents}
                />
              )}
              <div className="max-w-6xl mx-auto px-4 -mt-20 flex justify-between items-center mb-8">
                <Controls
                  search={eventSearch}
                  setSearch={setEventSearch}
                  filter={eventFilter}
                  setFilter={setEventFilter}
                  searchPlaceholder="Search events..."
                  filterOptions={{
                    All: "all",
                    Upcoming: "upcoming",
                    Past: "past",
                  }}
                />
                {!isPublic && (
                  <button
                    disabled={!isAuth}
                    onClick={() => setAddEvent(!addEvent)}
                    className={`${!isAuth && "cursor-not-allowed"} flex items-center gap-2 bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm`}
                  >
                    <UploadIcon className="w-4 h-4" />
                    Upload Events
                  </button>
                )}
              </div>

              {filteredEvents.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-2xl font-semibold">No Events Found</p>
                  <p>Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.E_ID}
                      event={event}
                      authorLabel={getEventLabel()}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {option === "Groups" && (
        <div className="mt-16 w-10/12 m-auto bg-[#fffbeb] px-12 py-12 rounded-2xl">
          {(groupsStatus === "loading" || (groupsStatus === "idle" && userId)) && (
            <p>Loading Groups...</p>
          )}
          {groupsStatus === "failed" && (
            <p>Error loading Groups: {groupsError}</p>
          )}
          {groupsStatus === "succeeded" && (
            <>
              {addGroup && (
                <AddGroupOverlay
                  onClose={() => setAddGroup(false)}
                  onSuccess={refetchUserGroups}
                />
              )}

              <div className="max-w-6xl mx-auto px-4 -mt-20 flex justify-between items-center mb-8">
                <Controls
                  search={groupSearch}
                  setSearch={setGroupSearch}
                  filter={groupFilter}
                  setFilter={setGroupFilter}
                  searchPlaceholder="Search groups..."
                  filterOptions={{
                    All: "all",
                    "Newest to Oldest": "newest_to_oldest",
                    "Oldest to Newest": "oldest_to_newest",
                  }}
                />
                {!isPublic && (
                  <button
                    disabled={!isAuth}
                    onClick={() => setAddGroup(!addGroup)}
                    className={`${
                      !isAuth ? "cursor-not-allowed" : "cursor-pointer"
                    } flex items-center gap-2 bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm`}
                  >
                    <LucideGroup className="w-4 h-4" />
                    Create Group
                  </button>
                )}
              </div>

              {filteredGroups.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-2xl font-semibold">No Groups Found</p>
                  <p>Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredGroups.map((group) => (
                    <GroupCard
                      key={group.Room_ID}
                      group={group}
                      onDeleteSuccess={refetchUserGroups}
                      ownerLabel={getGroupLabel(group)}
                      dateLabel={
                        isOwnDashboard &&
                        group?.Group_Relationship === "joined"
                          ? "Joined on"
                          : undefined
                      }
                      dateValue={
                        isOwnDashboard &&
                        group?.Group_Relationship === "joined"
                          ? group?.Joined_On
                          : group?.Created_On
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {option === "QnA" && (
        <div className="mt-8">
          {(qnaStatus === "loading" || (qnaStatus === "idle" && userId)) && (
            <div className="w-10/12 m-auto py-12">
              <p>Loading QnA...</p>
            </div>
          )}
          {qnaStatus === "failed" && (
            <div className="w-10/12 m-auto py-12">
              <p>Error loading QnA: {qnaError}</p>
            </div>
          )}
          {qnaStatus === "succeeded" && (
            <DiscussionForum
              discussions={filteredQuestions}
              search={qnaSearch}
              filter={qnaFilter}
              selectedDegree={qnaDegree}
              selectedSubject={qnaSubject}
              onSearchChange={setQnaSearch}
              onFilterChange={setQnaFilter}
              onDegreeChange={setQnaDegree}
              onSubjectChange={setQnaSubject}
              onClearFilters={() => {
                setQnaSearch("");
                setQnaFilter("all");
                setQnaDegree("");
                setQnaSubject("");
              }}
              onRefetch={refetchUserQuestions}
              isRefetching={qnaStatus === "loading"}
              showAskAction={!isPublic}
              getDiscussionLabel={getQuestionLabel}
            />
          )}
        </div>
      )}

      {option === "Notes" && (
        <div className="mt-8">
          {(notesStatus === "loading" || (notesStatus === "idle" && userId)) && (
            <div className="w-10/12 m-auto py-12">
              <p>Loading Notes...</p>
            </div>
          )}
          {notesStatus === "failed" && (
            <div className="w-10/12 m-auto py-12">
              <p>Error loading Notes: {notesError}</p>
            </div>
          )}
          {notesStatus === "succeeded" && (
            <NotesSection
              notes={filteredNotes}
              search={notesSearch}
              filter={notesFilter}
              selectedDegree={notesDegree}
              selectedSubject={notesSubject}
              onSearchChange={setNotesSearch}
              onFilterChange={setNotesFilter}
              onDegreeChange={setNotesDegree}
              onSubjectChange={setNotesSubject}
              onClearFilters={() => {
                setNotesSearch("");
                setNotesFilter("all");
                setNotesDegree("");
                setNotesSubject("");
              }}
              isRefetching={notesStatus === "loading"}
              onRefetch={refetchUserNotes}
              showUploadAction={!isPublic}
              getNoteLabel={getNoteLabel}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default ActivitySection;
