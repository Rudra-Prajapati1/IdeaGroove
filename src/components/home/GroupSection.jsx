import React, { useEffect } from "react";
import GroupCard from "../groups/GroupCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatRooms,
  selectChatRoomError,
  selectChatRoomStatus,
  selectRandomGroupChatRooms,
} from "../../redux/slice/chatRoomsSlice";
import FilledTitle from "../FilledTitle";
import ShowMoreButton from "../ShowMoreButton";
import Loading from "../Loading";

const GroupSection = () => {
  const dispatch = useDispatch();

  const randomGroups = useSelector(selectRandomGroupChatRooms);
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

      {status === "loading" && <Loading text="loading groups" />}
      {status === "failed" && <p>Error: {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
        {status === "succeeded" &&
          randomGroups.map((group) => (
            <GroupCard key={group.Room_ID} group={group} />
          ))}
      </div>

      <ShowMoreButton text="View More Groups" path="/groups" />
    </section>
  );
};

export default GroupSection;
