import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import {
  fetchQnA,
  selectAllQnA,
  selectQnAStatus,
  selectQnAError,
  selectQnAPagination,
} from "../redux/slice/qnaSlice";

import DiscussionForum from "../components/dashboard/DiscussionForum";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading";

const QnA = () => {
  const dispatch = useDispatch();

  const qnaData = useSelector(selectAllQnA);
  const status = useSelector(selectQnAStatus);
  const error = useSelector(selectQnAError);
  const { totalPages } = useSelector(selectQnAPagination);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ✅ Track whether we've ever loaded successfully at least once
  // so we never unmount DiscussionForum after the first load
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
      fetchQnA({
        page: currentPage,
        limit: 10,
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

  // Mark first successful load so we stop showing the full-page spinner
  useEffect(() => {
    if (status === "succeeded") {
      setHasLoadedOnce(true);
    }
  }, [status]);

  const doRefetch = () =>
    dispatch(
      fetchQnA({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        filter,
        degree: selectedDegree,
        subject: selectedSubject,
      }),
    );

  // ✅ Only show full-page spinner on the very first load
  const showFullPageLoader = status === "loading" && !hasLoadedOnce;

  // ✅ After first load, show a subtle top bar while refetching
  const isRefetching = status === "loading" && hasLoadedOnce;

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <PageHeader title="QnA" />

      {/* ✅ Thin progress bar at top — visible during search/filter refetches */}
      {isRefetching && (
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="h-1 bg-green-200">
            <div className="h-1 bg-[#1A3C20] animate-[loading-bar_1s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      <div className="mx-auto px-6 relative z-30 mt-10">
        {/* Full page spinner — only on very first load */}
        {showFullPageLoader && <Loading text="Loading discussions..." />}

        {status === "failed" && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {/* ✅ DiscussionForum stays mounted once hasLoadedOnce is true
            so search input never loses focus during refetches */}
        {(status === "succeeded" || isRefetching) && (
          <>
            <DiscussionForum
              discussions={qnaData}
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

export default QnA;
