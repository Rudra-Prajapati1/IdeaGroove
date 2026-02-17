import React, { useEffect, useState } from "react";
import FilledTitle from "../components/common/FilledTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatRooms,
  selectChatRoomError,
  selectChatRoomStatus,
  selectGroupChatRooms,
} from "../redux/slice/chatRoomsSlice";
import GroupCard from "@/components/cards/GroupCard";
import AddGroupOverlay from "../components/groups/AddGroup";
import { ArrowLeft, LucideGroup } from "lucide-react";
import Controls from "../components/common/Controls";
import { selectIsAuthenticated } from "../redux/slice/authSlice";
import PageHeader from "../components/common/PageHeader";
import ActionButton from "../components/common/ActionButton";

const Groups = () => {
  const isAuth = useSelector(selectIsAuthenticated);

  const [addGroup, setAddGroup] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const dispatch = useDispatch();
  const groups = useSelector(selectGroupChatRooms);
  const groupsStatus = useSelector(selectChatRoomStatus);
  const groupsError = useSelector(selectChatRoomError);
  const [editingGroup, setEditingGroup] = useState(null);

  const filteredGroups = groups
    .filter((group) => {
      return group?.Room_Name?.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const dateA = new Date(a.Created_On);
      const dateB = new Date(b.Created_On);

      if (filter === "newest_to_oldest") {
        return dateB - dateA;
      }

      if (filter === "oldest_to_newest") {
        return dateA - dateB;
      }

      return 0; // "all"
    });

  useEffect(() => {
    if (groupsStatus === "idle") {
      dispatch(fetchChatRooms());
    }
  }, [groupsStatus, dispatch]);
  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <PageHeader title="Groups" />

      {(addGroup || editingGroup) && (
        <AddGroupOverlay
          onClose={() => {
            setAddGroup(false);
            setEditingGroup(null);
          }}
          initialData={editingGroup} // This will be null if addGroup is true
        />
      )}
      <div className="mx-auto px-6 relative z-40 mt-35 ">
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
          <div>
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
                        key={group.G_ID}
                        group={group}
                        onEdit={() => setEditingGroup(group)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
