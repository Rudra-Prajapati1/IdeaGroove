import React, { useEffect } from "react";
import NotesCard from "../notes/NotesCard";
import FilledTitle from "../FilledTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotes,
  selectAllNotes,
  selectNotesError,
  selectNotesStatus,
} from "../../redux/slice/notesSlice";
import ShowMoreButton from "../ShowMoreButton";
import Loading from "../Loading";

const NotesSection = () => {
  const dispatch = useDispatch();

  const notes = useSelector(selectAllNotes);
  const status = useSelector(selectNotesStatus);
  const error = useSelector(selectNotesError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNotes());
    }
  }, [status, dispatch]);

  return (
    <section className="flex flex-col px-6 sm:px-10 py-8 items-center">
      <FilledTitle text="Notes" />

      {status === "loading" && <Loading text="loading notes" />}
      {status === "failed" && <p>Error: {error}</p>}
      <div className="flex flex-col gap-5 w-full md:w-[50%] mt-10">
        {status === "succeeded" &&
          notes
            .slice(0, 3)
            .map((notes) => <NotesCard key={notes.N_ID} notes={notes} />)}
      </div>

      <ShowMoreButton text="View More Notes" path="/notes" />
    </section>
  );
};

export default NotesSection;
