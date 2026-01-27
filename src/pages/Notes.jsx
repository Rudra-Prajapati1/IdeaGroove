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
import { ArrowLeft } from "lucide-react";
import PageHeader from "../components/PageHeader";

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
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <PageHeader title="Notes" />

      <div className="mx-auto px-6 relative z-30 mt-35">
        <NotesSection notes={notes} status={notesStatus} error={notesError} />
      </div>
    </div>
  );
};

export default Notes;
