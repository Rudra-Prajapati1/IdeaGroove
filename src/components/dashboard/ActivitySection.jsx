import React, { useEffect, useState } from "react";
import EventCard from "../events/EventCard";
import GroupCard from "../groups/GroupCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEvents,
  selectAllEvents,
  selectEventsStatus,
} from "../../redux/slice/eventsSlice";
import {
  fetchChatRooms,
  selectAllChatRooms,
  selectChatRoomError,
  selectChatRoomStatus,
} from "../../redux/slice/chatRoomsSlice";
import FilledTitle from "../FilledTitle";
import QnACard from "../qna/QnACard";
import {
  fetchQuestions,
  selectAllQuestions,
  // selectQuestionsError,
  selectQuestionsStatus,
} from "../../redux/slice/questionsSlice";
import {
  fetchAnswers,
  selectAnswersStatus,
} from "../../redux/slice/answerSlice";
import {
  fetchNotes,
  selectAllNotes,
  selectNotesError,
  selectNotesStatus,
} from "../../redux/slice/notesSlice";
import NotesCard from "../notes/NotesCard";
import {
  CalendarDays,
  LucideGroup,
  MessageSquare,
  NotebookPen,
  Upload,
  UploadIcon,
  Users,
} from "lucide-react";
import DiscussionForum from "./DiscussionForum";
import NotesSection from "./NotesSection";
import { selectIsAuthenticated } from "../../redux/slice/authSlice";
import Controls from "../Controls";
import AddEventOverlay from "../events/AddEvent";
import AddGroupOverlay from "../groups/AddGroup";

const ActivitySection = () => {
  const optionList = [
    {
      key: 1,
      label: "Events",
      icon: CalendarDays,
    },
    {
      key: 2,
      label: "Groups",
      icon: Users,
    },
    {
      key: 3,
      label: "QnA",
      icon: MessageSquare,
    },
    {
      key: 4,
      label: "Notes",
      icon: NotebookPen,
    },
  ];
  const [option, setOption] = useState("Events");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [addEvent, setAddEvent] = useState(false);
  const isAuth = useSelector(selectIsAuthenticated);

  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);
  const eventsStatus = useSelector(selectEventsStatus); // optional: for loading/error states
  // 1. Identify the Owner (Using your ID 104)
  const MOCK_CURRENT_USER_ID = 104;

  // Events Filter (Already mostly correct in your code)
  const filteredEvents = events.filter((event) => {
    // Ensure 'author' matches the ID 104
    const isOwnerEvent = event.author === MOCK_CURRENT_USER_ID;
    if (!isOwnerEvent) return false;

    const eventDate = new Date(event.Event_Date);
    const today = new Date();
    const matchesSearch =
      event?.Description.toLowerCase().includes(search.toLowerCase()) ?? false;

    if (filter === "upcoming" && eventDate < today) return false;
    if (filter === "past" && eventDate >= today) return false;

    return matchesSearch;
  });

  useEffect(() => {
    if (eventsStatus === "idle") {
      dispatch(fetchEvents());
    }
  }, [eventsStatus, dispatch]);

  const groups = useSelector(selectAllChatRooms);
  const groupsStatus = useSelector(selectChatRoomStatus);
  const groupsError = useSelector(selectChatRoomError);
  const [addGroup, setAddGroup] = useState(false);

  const filteredGroups = groups
    .filter((group) => {
      // Assuming 'Admin_ID' or 'author' is the key for the group creator
      const isOwnerGroup = group.Admin_ID === MOCK_CURRENT_USER_ID;
      if (!isOwnerGroup) return false;

      return (
        group?.Room_Name.toLowerCase().includes(search.toLowerCase()) ?? false
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (filter === "newest_to_oldest") {
        return dateB - dateA; // Descending Order (New dates first)
      }

      if (filter === "oldest_to_newest") {
        return dateA - dateB; // Ascending Order (Old dates first)
      }

      return 0; // Default: Don't change order if no sort filter is selected
    });

  useEffect(() => {
    if (groupsStatus === "idle") {
      dispatch(fetchChatRooms());
    }
  }, [groupsStatus, dispatch]);

  const questions = useSelector(selectAllQuestions);
  const questionsStatus = useSelector(selectQuestionsStatus);
  const answerStatus = useSelector(selectAnswersStatus);
  //const questionsError = useSelector(selectQuestionsError);

  useEffect(() => {
    if (questionsStatus === "idle") {
      dispatch(fetchQuestions());
    }
  }, [questionsStatus, dispatch]);

  useEffect(() => {
    if (answerStatus === "idle") {
      dispatch(fetchAnswers());
    }
  }, [answerStatus, dispatch]);

  const notes = useSelector(selectAllNotes);
  const notesStatus = useSelector(selectNotesStatus);
  const notesError = useSelector(selectNotesError);

  useEffect(() => {
    if (notesStatus === "idle") {
      dispatch(fetchNotes());
    }
  }, [notesStatus, dispatch]);

  // QnA Filter (Filtering the questions array before passing it)
  const ownedQuestions = questions.filter(
    (q) => q.author === MOCK_CURRENT_USER_ID,
  );

  // Notes Filter (Filtering the notes array before passing it)
  const ownedNotes = notes.filter((n) => n.author === MOCK_CURRENT_USER_ID);

  return (
    <section>
      <div className="text-primary py-4 px-16 mt-4">
        <div className="font-poppins font-light flex flex-row items-center justify-between w-9/10 lg:h-40 md:h-20 sm:h-10 m-auto mb-12">
          {optionList.map((op) => {
            const Icon = op.icon;
            return (
              <div
                key={op.key}
                value={op.label}
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

      {/* Events */}
      {option === "Events" && (
        <div className="w-10/12 m-auto bg-white px-12 py-12 rounded-2xl">
          <div>
            {eventsStatus === "loading" && <p>Loading Events...</p>}
            {eventsStatus === "failed" && <p>Error loading Events</p>}
            {eventsStatus === "succeeded" && (
              <>
                {addEvent && (
                  <AddEventOverlay onClose={() => setAddEvent(false)} />
                )}
                <div className="max-w-6xl mx-auto px-4 -mt-20 flex justify-between items-center mb-8">
                  <Controls
                    search={search}
                    setSearch={setSearch}
                    filter={filter}
                    setFilter={setFilter}
                    searchPlaceholder="Search events..."
                    filterOptions={{
                      All: "all",
                      Upcoming: "upcoming",
                      Past: "past",
                    }}
                  />
                  <button
                    disabled={!isAuth}
                    onClick={() => setAddEvent(!addEvent)}
                    className={`${!isAuth && "cursor-not-allowed"} flex items-center gap-2 bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm`}
                  >
                    <UploadIcon className="w-4 h-4" />
                    Upload Events
                  </button>
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
                        className="bg-amber-50"
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Groups */}
      {option === "Groups" && (
        <div className="w-10/12 m-auto bg-white px-12 py-12 rounded-2xl">
          <div>
            {groupsStatus === "loading" && <p>Loading Groups...</p>}
            {groupsStatus === "failed" && <p>Error: {groupsError}</p>}
            {groupsStatus === "succeeded" && (
              <>
                {addGroup && (
                  <AddGroupOverlay onClose={() => setAddGroup(false)} />
                )}
                <div className="max-w-6xl mx-auto px-4 -mt-20 flex justify-between items-center mb-8">
                  <Controls
                    search={search}
                    setSearch={setSearch}
                    filter={filter}
                    setFilter={setFilter}
                    searchPlaceholder="Search groups..."
                    filterOptions={{
                      All: "all",
                      "Newest to Oldest": "newest_to_oldest",
                      "Oldest to Newest": "oldest_to_newest",
                    }}
                  />
                  <button
                    disabled={!isAuth}
                    onClick={() => setAddGroup(!addGroup)}
                    className={`${!isAuth ? "cursor-not-allowed" : "cursor-pointer"} flex items-center gap-2 bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm`}
                  >
                    <LucideGroup className="w-4 h-4" />
                    Create Group
                  </button>
                </div>
                {filteredGroups.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <p className="text-2xl font-semibold">No Groups Found</p>
                    <p>Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredGroups.map((group) => (
                      <GroupCard key={group.G_ID} group={group} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* QnA Section */}
      {option === "QnA" && (
        <div className="-mt-8">
          <DiscussionForum
            questions={ownedQuestions}
            status={questionsStatus}
          />
        </div>
      )}

      {/* Notes Section */}
      {option === "Notes" && (
        <div className="mt-17">
          <NotesSection
            notes={ownedNotes}
            status={notesStatus}
            error={notesError}
          />
        </div>
      )}
    </section>
  );
};

export default ActivitySection;
