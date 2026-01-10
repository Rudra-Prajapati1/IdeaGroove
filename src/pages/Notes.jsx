import React, { useEffect } from "react";
import DiscussionForum from "../components/dashboard/DiscussionForum";
import FilledTitle from "../components/FilledTitle";
import NotesSection from "../components/dashboard/NotesSection";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotes,
  selectAllNotes,
  selectNotesError,
  selectNotesStatus,
} from "../redux/slice/notesSlice";

const Notes = () => {
  const dispatch = useDispatch();
  const notes = useSelector(selectAllNotes);
  const notesStatus = useSelector(selectNotesStatus);
  const notesError = useSelector(selectNotesError);

  useEffect(() => {
    if (notesStatus === "idle") {
      dispatch(fetchNotes());
    }
  }, [notesStatus, dispatch]);

  return (
    <section className="flex flex-col px-10 py-8 items-center mt-20">
      <FilledTitle text="Notes" />

      <NotesSection notes={notes} status={notesStatus} error={notesError} />
    </section>
  );
};

export default Notes;
