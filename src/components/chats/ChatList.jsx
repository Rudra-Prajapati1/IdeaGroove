import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatRoomMembers,
  selectChatRoomMemberStatus,
  selectRoomIdsForStudent,
} from "../../redux/slice/chatRoomMembersSlice";
import {
  fetchChatRooms,
  selectAllChatRooms,
  selectChatRoomError,
  selectChatRoomStatus,
} from "../../redux/slice/chatRoomsSlice";
import Loading from "../common/Loading";

const LOGGED_IN_STUDENT_ID = 101;

const ChatList = ({ search, filter, onSelectRoom, activeRoom }) => {
  const dispatch = useDispatch();

  const rooms = useSelector(selectAllChatRooms);
  const roomStatus = useSelector(selectChatRoomStatus);
  const roomError = useSelector(selectChatRoomError);
  const memberStatus = useSelector(selectChatRoomMemberStatus);

  const roomIdsSelector = useMemo(
    () => selectRoomIdsForStudent(LOGGED_IN_STUDENT_ID),
    [LOGGED_IN_STUDENT_ID],
  );
  const myRoomIds = useSelector(roomIdsSelector);

  useEffect(() => {
    if (roomStatus === "idle") {
      dispatch(fetchChatRooms());
    }
    if (memberStatus === "idle") {
      dispatch(fetchChatRoomMembers());
    }
  }, [roomStatus, memberStatus, dispatch]);

  const visibleRooms = rooms.filter(
    (room) => myRoomIds.includes(room.Room_ID) && room.Is_Active === true,
  );

  const filteredByType = visibleRooms.filter((room) => {
    if (filter === "groups") return room.Room_Type === "group";
    if (filter === "individuals") return room.Room_Type === "direct";
    return true;
  });

  const filteredRooms = filteredByType.filter((room) => {
    if (!search.trim()) return true;

    const name = room.Room_Type === "group" ? room.Room_Name : "Direct Chat";

    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4">
      {roomStatus === "loading" && (
        <div className="flex justify-center">
          <Loading text="loading chats" />
        </div>
      )}
      {roomStatus === "failed" && <p>Error: {roomError}</p>}
      {roomStatus === "succeeded" && filteredRooms.length === 0 && (
        <div className="my-20 flex flex-col items-center gap-3 text-primary">
          <p className="text-xl font-semibold font-poppins">No Chats Found</p>
          <p className="text-md opacity-70 font-inter">
            Try adjusting your search or filters
          </p>
        </div>
      )}
      {roomStatus === "succeeded" &&
        filteredRooms.length > 0 &&
        filteredRooms.map((room) => (
          <div
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelectRoom(room)}
            key={room.Room_ID}
            onClick={() =>
              activeRoom?.Room_ID !== room.Room_ID && onSelectRoom(room)
            }
            className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer border-primary transition ${
              activeRoom?.Room_ID === room.Room_ID
                ? "bg-primary text-white"
                : "hover:bg-primary/10"
            }`}
          >
            <div className="h-10 w-10 rounded-full border flex items-center justify-center font-semibold">
              {room.Room_Type === "group" ? room.Room_Name?.[0] || "G" : "D"}
            </div>

            <div className="flex-1">
              <h4 className="font-semibold font-inter">
                {room.Room_Type === "group" ? room.Room_Name : "Student"}
              </h4>
              <p className="text-sm text-gray-400 truncate">
                {room.Room_Type === "group" ? "Group chat" : "Direct message"}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ChatList;
