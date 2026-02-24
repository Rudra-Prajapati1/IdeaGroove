import React, { useEffect, useState } from "react";
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
  selectUserGroups,
  selectUserGroupsStatus,
} from "../../redux/slice/chatRoomsSlice";
import {
  selectUserQuestions,
  selectUserQuestionsStatus,
} from "../../redux/slice/qnaSlice";
import {
  selectUserNotes,
  selectUserNotesStatus,
  selectUserNotesError,
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
import { selectIsAuthenticated } from "../../redux/slice/authSlice";
import Controls from "../common/Controls";
import AddEventOverlay from "../events/AddEvent";
import AddGroupOverlay from "../groups/AddGroup";

const ActivitySection = ({ isPublic }) => {
  const dispatch = useDispatch();

  const optionList = [
    { key: 1, label: "Events", icon: CalendarDays },
    { key: 2, label: "Groups", icon: Users },
    { key: 3, label: "QnA", icon: MessageSquare },
    { key: 4, label: "Notes", icon: NotebookPen },
  ];

  const [option, setOption] = useState("Events");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [addEvent, setAddEvent] = useState(false);
  const [addGroup, setAddGroup] = useState(false);

  const isAuth = useSelector(selectIsAuthenticated);

  /* ================= EVENTS ================= */

  const userEvents = useSelector(selectUserEvents);
  const eventsStatus = useSelector(selectUserEventsStatus);
  const userEventsError = useSelector(selectUserEventsError);

  const filteredEvents = userEvents.filter((event) => {
    const eventDate = new Date(event.Event_Date);
    const today = new Date();

    const matchesSearch =
      event?.Description?.toLowerCase().includes(search.toLowerCase()) ?? false;

    if (filter === "upcoming" && eventDate < today) return false;
    if (filter === "past" && eventDate >= today) return false;

    return matchesSearch;
  });

  useEffect(() => {
    console.log(eventsStatus);
    // dispatch(fetchUserEvents());
    console.log(userEvents);
  }, [eventsStatus]);
  /* ================= GROUPS ================= */

  const userGroups = useSelector(selectUserGroups);
  const groupsStatus = useSelector(selectUserGroupsStatus);

  const filteredGroups = userGroups
    .filter((group) => {
      return (
        group?.Room_Name?.toLowerCase().includes(search.toLowerCase()) ?? false
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.Created_On);
      const dateB = new Date(b.Created_On);

      if (filter === "newest_to_oldest") return dateB - dateA;
      if (filter === "oldest_to_newest") return dateA - dateB;

      return 0;
    });

  /* ================= QUESTIONS ================= */

  const userQuestions = useSelector(selectUserQuestions);
  const qnaStatus = useSelector(selectUserQuestionsStatus);

  /* ================= NOTES ================= */

  const userNotes = useSelector(selectUserNotes);
  const notesStatus = useSelector(selectUserNotesStatus);
  const notesError = useSelector(selectUserNotesError);

  return (
    <section>
      {/* TOP OPTIONS */}
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

      {/* ================= EVENTS ================= */}
      {option === "Events" && (
        <div className="mt-16 w-10/12 m-auto bg-[#fffbeb] px-12 py-12 rounded-2xl">
          {eventsStatus === "loading" && <p>Loading Events...</p>}
          {eventsStatus === "failed" && (
            <p>Error loading Events: {userEventsError}</p>
          )}
          {(eventsStatus === "succeeded" || eventsStatus === "idle") && (
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
                    <EventCard key={event.E_ID} event={event} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ================= GROUPS ================= */}
      {option === "Groups" && (
        <div className="mt-16 w-10/12 m-auto bg-[#fffbeb] px-12 py-12 rounded-2xl">
          {groupsStatus === "loading" && <p>Loading Groups...</p>}
          {groupsStatus === "failed" && <p>Error loading Groups</p>}
          {(groupsStatus === "succeeded" || groupsStatus === "idle") && (
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
                    <GroupCard key={group.Room_ID} group={group} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ================= QnA ================= */}
      {option === "QnA" && (
        <div className="mt-8">
          <DiscussionForum />
        </div>
      )}

      {/* ================= NOTES ================= */}
      {option === "Notes" && (
        <div className="mt-8">
          <NotesSection
            notes={userNotes}
            status={notesStatus}
            error={notesError}
          />
        </div>
      )}
    </section>
  );
};

export default ActivitySection;
