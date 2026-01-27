import React, { useEffect, useState } from "react";
import FilledTitle from "../components/FilledTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatRooms,
  selectAllChatRooms,
  selectChatRoomError,
  selectChatRoomStatus,
} from "../redux/slice/chatRoomsSlice";
import GroupCard from "../components/groups/GroupCard";
import AddGroupOverlay from "../components/groups/AddGroup";
import { ArrowLeft, LucideGroup } from "lucide-react";
import Controls from "../components/Controls";
import { selectIsAuthenticated } from "../redux/slice/authSlice";
import PageHeader from "../components/PageHeader";

const Groups = () => {
  const isAuth = useSelector(selectIsAuthenticated);

  const [addGroup, setAddGroup] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const dispatch = useDispatch();
  const groups = useSelector(selectAllChatRooms);
  const groupsStatus = useSelector(selectChatRoomStatus);
  const groupsError = useSelector(selectChatRoomError);

  const filteredGroups = groups.filter((group) => {
    const groupDate = new Date(group.Created_On);
    const today = new Date();

    const matchesSearch =
      group?.Room_Name.toLowerCase().includes(search.toLowerCase()) ?? false;

    if (filter === "upcoming" && groupDate < today) return false;
    if (filter === "past" && groupDate >= today) return false;

    return matchesSearch;
  });

  useEffect(() => {
    if (groupsStatus === "idle") {
      dispatch(fetchChatRooms());
    }
  }, [groupsStatus, dispatch]);
  return (
    <div className="min-h-screen bg-[#FFFBEB] font-poppins pb-20">
      <PageHeader title="Groups" />

      {addGroup && <AddGroupOverlay onClose={() => setAddGroup(false)} />}
      <div className="mx-auto px-6 relative z-30 mt-35 ">
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
          <button
            disabled={!isAuth}
            onClick={() => setAddGroup(!addGroup)}
            className={`${!isAuth ? "cursor-not-allowed" : "cursor-pointer"} flex items-center gap-2 bg-green-600 text-white shadow-md px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm`}
          >
            <LucideGroup className="w-4 h-4" />
            Create Group
          </button>
        </div>
        <div className="max-w-7xl m-auto mt-12 bg-white px-12 py-12 rounded-2xl">
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
                      <GroupCard key={group.G_ID} group={group} />
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
