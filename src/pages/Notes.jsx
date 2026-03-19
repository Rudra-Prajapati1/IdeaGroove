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
import PaginationControls from "../components/common/PaginationControls";

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

  const handleClearAllFilters = () => {
    updateDebouncedSearch.cancel();
    setSearch("");
    setDebouncedSearch("");
    setFilter("all");
    setSelectedDegree("");
    setSelectedSubject("");
    setCurrentPage(1);
  };

  useEffect(() => {
    return () => updateDebouncedSearch.cancel();
  }, [updateDebouncedSearch]);

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
              onClearFilters={handleClearAllFilters}
              isRefetching={isRefetching}
              onRefetch={doRefetch}
            />

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Notes;
