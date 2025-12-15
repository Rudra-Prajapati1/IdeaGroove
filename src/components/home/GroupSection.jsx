import React, { useEffect } from "react";
import GroupCard from "../groups/GroupCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatRooms,
  selectChatRoomError,
  selectChatRoomStatus,
  selectGroupChatRooms,
} from "../../redux/slice/chatRoomsSlice";
import FilledTitle from "../FilledTitle";
import ShowMoreButton from "../ShowMoreButton";

const GroupSection = () => {
  const dispatch = useDispatch();

  const chatRooms = useSelector(selectGroupChatRooms);
  const status = useSelector(selectChatRoomStatus);
  const error = useSelector(selectChatRoomError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchChatRooms());
    }
  }, [status, dispatch]);

  return (
    <section className="flex flex-col px-10 py-8 items-center">
      <FilledTitle text="Groups" />

      {status === "loading" && <p>Loading chat rooms...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        {status === "succeeded" &&
          chatRooms
            .slice(0, 3)
            .map((group) => <GroupCard key={group.Room_ID} group={group} />)}
      </div>

      <ShowMoreButton text="View More Groups" path="/groups" />
    </section>
  );
};

export default GroupSection;
