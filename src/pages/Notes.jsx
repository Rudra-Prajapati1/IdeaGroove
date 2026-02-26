import React, { useCallback, useEffect, useState } from "react";
import NotesSection from "../components/dashboard/NotesSection";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const updateDebouncedSearch = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
      setCurrentPage(1);
    }, 300),
    [],
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    updateDebouncedSearch(value);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleDegreeChange = (value) => {
    setSelectedDegree(value);
    setSelectedSubject("");
    setCurrentPage(1);
  };

  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    dispatch(
      fetchNotes({
        page: currentPage,
        limit: 9,
        search: debouncedSearch,
        filter,
        degree: selectedDegree,
        subject: selectedSubject,
      }),
    );
  }, [
    dispatch,
    currentPage,
    debouncedSearch,
    filter,
    selectedDegree,
    selectedSubject,
  ]);

  useEffect(() => {
    if (notesStatus === "succeeded") setHasLoadedOnce(true);
  }, [notesStatus]);

  const doRefetch = () =>
    dispatch(
      fetchNotes({
        page: currentPage,
        limit: 9,
        search: debouncedSearch,
        filter,
        degree: selectedDegree,
        subject: selectedSubject,
      }),
    );

  const showFullPageLoader = notesStatus === "loading" && !hasLoadedOnce;
  const isRefetching = notesStatus === "loading" && hasLoadedOnce;

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <PageHeader title="Notes" />

      {isRefetching && (
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="h-1 bg-green-200">
            <div className="h-1 bg-[#1A3C20] animate-pulse w-2/3" />
          </div>
        </div>
      )}

      <div className="mx-auto px-6 relative z-30 mt-10">
        {showFullPageLoader && <Loading text="Loading notes..." />}

        {notesStatus === "failed" && (
          <p className="text-red-500 text-center">{notesError}</p>
        )}

        {(notesStatus === "succeeded" || isRefetching) && (
          <>
            <NotesSection
              notes={notes}
              search={search}
              filter={filter}
              selectedDegree={selectedDegree}
              selectedSubject={selectedSubject}
              onSearchChange={handleSearchChange}
              onFilterChange={handleFilterChange}
              onDegreeChange={handleDegreeChange}
              onSubjectChange={handleSubjectChange}
              isRefetching={isRefetching}
              onRefetch={doRefetch}
            />

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
