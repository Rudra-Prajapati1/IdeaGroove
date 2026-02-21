import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroups,
  selectAllGroups,
  selectGroupsStatus,
  selectGroupsError,
  selectGroupsPagination,
} from "../redux/slice/chatRoomsSlice";

import GroupCard from "@/components/cards/GroupCard";
import AddGroupOverlay from "../components/groups/AddGroup";
import Controls from "../components/common/Controls";
import { selectIsAuthenticated } from "../redux/slice/authSlice";
import PageHeader from "../components/common/PageHeader";
import ActionButton from "../components/common/ActionButton";
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

  /* ===== FETCH ON PAGE CHANGE ===== */
  useEffect(() => {
    dispatch(fetchGroups({ page: currentPage, limit: 9 }));
  }, [dispatch, currentPage]);

  const filteredGroups = groups
    .filter((group) =>
      group?.Room_Name?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const dateA = new Date(a.Created_On);
      const dateB = new Date(b.Created_On);

      if (filter === "newest_to_oldest") return dateB - dateA;
      if (filter === "oldest_to_newest") return dateA - dateB;
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <PageHeader title="Groups" />

      {(addGroup || editingGroup) && (
        <AddGroupOverlay
          onClose={() => {
            setAddGroup(false);
            setEditingGroup(null);
          }}
          initialData={editingGroup}
        />
      )}

      <div className="mx-auto px-6 relative z-40 mt-35">
        <div className="max-w-6xl mx-auto px-4 -mt-25 flex justify-between items-center">
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

          <ActionButton
            label="Create Group"
            icon={LucideGroup}
            disabled={!isAuth}
            disabledMessage="Please login to create a group"
            onClick={() => setAddGroup(true)}
          />
        </div>

        <div className="max-w-7xl m-auto mt-12 px-12 py-12 rounded-2xl">
          {groupsStatus === "loading" && <p>Loading Groups...</p>}
          {groupsStatus === "failed" && <p>Error: {groupsError}</p>}

          {groupsStatus === "succeeded" && (
            <>
              {filteredGroups.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-2xl font-semibold">No Groups Found</p>
                  <p>Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredGroups.map((group) => (
                    <GroupCard
                      key={group.Room_ID}
                      group={group}
                      onEdit={() => setEditingGroup(group)}
                    />
                  ))}
                </div>
              )}

              {/* PAGINATION */}
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
