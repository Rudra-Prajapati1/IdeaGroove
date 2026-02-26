import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import {
  fetchGroups,
  selectAllGroups,
  selectGroupsStatus,
  selectGroupsError,
  selectGroupsPagination,
} from "../redux/slice/chatRoomsSlice";

import GroupCard from "../components/cards/GroupCard";
import AddGroupOverlay from "../components/groups/AddGroup";
import Controls from "../components/common/Controls";
import { selectIsAuthenticated } from "../redux/slice/authSlice";
import PageHeader from "../components/common/PageHeader";
import ActionButton from "../components/common/ActionButton";
import Loading from "../components/common/Loading";
import { LucideGroup } from "lucide-react";

const Groups = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuthenticated);

  const groups = useSelector(selectAllGroups);
  const groupsStatus = useSelector(selectGroupsStatus);
  const groupsError = useSelector(selectGroupsError);
  const { totalPages } = useSelector(selectGroupsPagination);

  const [currentPage, setCurrentPage] = useState(1);
  const [addGroup, setAddGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
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

  useEffect(() => {
    dispatch(
      fetchGroups({
        page: currentPage,
        limit: 9,
        search: debouncedSearch,
        filter,
      }),
    );
  }, [dispatch, currentPage, debouncedSearch, filter]);

  useEffect(() => {
    if (groupsStatus === "succeeded") setHasLoadedOnce(true);
  }, [groupsStatus]);

  const doRefetch = () =>
    dispatch(
      fetchGroups({
        page: currentPage,
        limit: 9,
        search: debouncedSearch,
        filter,
      }),
    );

  const showFullPageLoader = groupsStatus === "loading" && !hasLoadedOnce;
  const isRefetching = groupsStatus === "loading" && hasLoadedOnce;

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <PageHeader title="Groups" />

      {isRefetching && (
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="h-1 bg-green-200">
            <div className="h-1 bg-[#1A3C20] animate-pulse w-2/3" />
          </div>
        </div>
      )}

      {(addGroup || editingGroup) && (
        <AddGroupOverlay
          onClose={() => {
            setAddGroup(false);
            setEditingGroup(null);
          }}
          initialData={editingGroup}
          onSuccess={doRefetch}
        />
      )}

      <div className="mx-auto px-6 relative z-40 mt-35">
        <div className="max-w-6xl mx-auto px-4 -mt-25 flex justify-between items-center">
          <Controls
            search={search}
            setSearch={handleSearchChange}
            filter={filter}
            setFilter={handleFilterChange}
            searchPlaceholder="Search by name or hobby..."
            filterOptions={{
              All: "all",
              "Newest to Oldest": "newest_to_oldest",
              "Oldest to Newest": "oldest_to_newest",
            }}
          />

          <ActionButton
            label="Create Group"
            icon={LucideGroup}
            disabled={!isAuth}
            disabledMessage="Please login to create a group"
            onClick={() => setAddGroup(true)}
          />
        </div>

        <div className="max-w-7xl m-auto mt-12 px-12 py-12 rounded-2xl">
          {showFullPageLoader && <Loading text="Loading groups..." />}

          {groupsStatus === "failed" && (
            <p className="text-red-500 text-center">{groupsError}</p>
          )}

          {(groupsStatus === "succeeded" || isRefetching) && (
            <>
              <div
                className={`transition-opacity duration-200 ${
                  isRefetching
                    ? "opacity-50 pointer-events-none"
                    : "opacity-100"
                }`}
              >
                {groups.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <p className="text-2xl font-semibold">No Groups Found</p>
                    <p>
                      {search
                        ? "Try adjusting your search"
                        : "Be the first to create a group!"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groups.map((group) => (
                      <GroupCard
                        key={group.Room_ID}
                        group={group}
                        onEdit={() => setEditingGroup(group)}
                        onDeleteSuccess={doRefetch}
                      />
                    ))}
                  </div>
                )}
              </div>

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
    </div>
  );
};

export default Groups;
