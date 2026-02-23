import React, { useEffect, useState } from "react";
import NotesSection from "../components/dashboard/NotesSection";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotes,
  selectAllNotes,
  selectNotesError,
  selectNotesStatus,
  selectNotesPagination,
} from "../redux/slice/notesSlice";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading";

const Notes = () => {
  const dispatch = useDispatch();

  const notes = useSelector(selectAllNotes);
  const notesStatus = useSelector(selectNotesStatus);
  const notesError = useSelector(selectNotesError);
  const { totalPages } = useSelector(selectNotesPagination);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchNotes({ page: currentPage, limit: 9 }));
  }, [dispatch, currentPage]);

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <PageHeader title="Notes" />

      <div className="mx-auto px-6 relative z-30 mt-10">
        {notesStatus === "loading" && <Loading text="Loading notes..." />}

        {notesStatus === "failed" && (
          <p className="text-red-500 text-center">{notesError}</p>
        )}

        {notesStatus === "succeeded" && (
          <>
            <NotesSection notes={notes} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="font-semibold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notes;
