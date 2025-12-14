import React, { useEffect } from "react";
import Title from "../Title";
import GroupCard from "../groups/GroupCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatRooms,
  selectChatRoomError,
  selectChatRoomStatus,
  selectGroupChatRooms,
} from "../../redux/slice/chatRoomsSlice";

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
      <Title text="Groups" />

      {status === "loading" && <p>Loading chat rooms...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      <div className="flex gap-5">
        {status === "succeeded" &&
          chatRooms
            .slice(0, 3)
            .map((group) => <GroupCard key={group.Room_ID} group={group} />)}
      </div>
    </section>
  );
};

export default GroupSection;
