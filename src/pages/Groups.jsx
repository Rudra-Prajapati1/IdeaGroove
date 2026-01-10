import React, { useEffect } from "react";
import FilledTitle from "../components/FilledTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatRooms,
  selectAllChatRooms,
  selectChatRoomError,
  selectChatRoomStatus,
} from "../redux/slice/chatRoomsSlice";
import GroupCard from "../components/groups/GroupCard";

const Groups = () => {
  const dispatch = useDispatch();
  const groups = useSelector(selectAllChatRooms);
  const groupsStatus = useSelector(selectChatRoomStatus);
  const groupsError = useSelector(selectChatRoomError);

  useEffect(() => {
    if (groupsStatus === "idle") {
      dispatch(fetchChatRooms());
    }
  }, [groupsStatus, dispatch]);
  return (
    <section className="flex flex-col px-10 py-8 items-center mt-20">
      <FilledTitle text="Groups" />
      <div className="w-10/12 m-auto bg-white px-12 py-12 rounded-2xl">
        <h1 className="text-4xl font-bold text-primary mb-8">Groups</h1>
        <div>
          {groupsStatus === "loading" && <p>Loading Groups...</p>}
          {groupsStatus === "failed" && <p>Error: {groupsError}</p>}
          {groupsStatus === "succeeded" && (
            <>
              {groups.length === 0 ? (
                <p className="text-center py-8 text-teal-200">
                  No Groups Found
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {groups.map((group) => (
                    <GroupCard key={group.G_ID} group={group} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Groups;
