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
import { CalendarDays, MessageSquare, NotebookPen, Users } from "lucide-react";
import DiscussionForum from "./DiscussionForum";
import NotesSection from "./NotesSection";

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

  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);
  const eventsStatus = useSelector(selectEventsStatus); // optional: for loading/error states

  useEffect(() => {
    if (eventsStatus === "idle") {
      dispatch(fetchEvents());
    }
  }, [eventsStatus, dispatch]);

  const groups = useSelector(selectAllChatRooms);
  const groupsStatus = useSelector(selectChatRoomStatus);
  const groupsError = useSelector(selectChatRoomError);

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
          <h1 className="text-4xl font-bold text-primary mb-8">Events</h1>
          <div>
            {eventsStatus === "loading" && <p>Loading Events...</p>}
            {eventsStatus === "failed" && <p>Error loading Events</p>}
            {eventsStatus === "succeeded" && (
              <>
                {events.length === 0 ? (
                  <p className="text-center py-8 text-teal-200">
                    No Events Found
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
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
          <h1 className="text-4xl font-bold text-primary mb-8">Groups</h1>
          <div>
            {groupsStatus === "loading" && <p>Loading Groups...</p>}
            {groupsStatus === "failed" && <p>Error: {groupsError}</p>}
            {groupsStatus === "succeeded" && (
              <>
                {groups.length === 0 ? (
                  <p className="text-center py-8 text-teal-200">
                    No Groups Found
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groups.map((group) => (
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
        <div className="w-full min-h-screen">
          <DiscussionForum questions={questions} status={questionsStatus} />
        </div>
      )}

      {/* Notes Section */}
      {option === "Notes" && (
        <NotesSection notes={notes} status={notesStatus} error={notesError} />
      )}
    </section>
  );
};

export default ActivitySection;
